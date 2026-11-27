/* ==========================================================================
   npm run qa -- --base http://127.0.0.1:3000 [--routes /,/book] [--widths 390,1440] [--no-shots]
   (--base defaults to QA_BASE, then http://127.0.0.1:3000, where `npm run start` serves.)

   Visits every route at 390, 768, 1280 and 1440 px and records, per visit:
   - horizontal overflow (documentElement.scrollWidth > innerWidth), checked
     at several scroll positions with motion running
   - console errors, page errors and failed requests
   - axe violations (serious + critical, WCAG 2.x A/AA), run after switching
     to reduced motion so every element is in its settled, visible state
   Screenshots go to .qa/shots/, the report to .qa/qa-report.json.
   Exits 1 when anything fails.
   ========================================================================== */

import fs from "node:fs";
import path from "node:path";
import { chromium, type Browser, type Page } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";
import { SERVICES } from "../src/content/services";

const ROOT = path.resolve(import.meta.dirname, "..");
const QA_DIR = path.join(ROOT, ".qa");
const SHOTS = path.join(QA_DIR, "shots");

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return undefined;
  const value = process.argv[i + 1];
  return value && !value.startsWith("--") ? value : "";
}

const BASE = (arg("base") ?? process.env.QA_BASE ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const WIDTHS = (arg("widths") ?? "390,768,1280,1440").split(",").map(Number);
const TAKE_SHOTS = arg("no-shots") === undefined;

/** Every route in the site. A route with `status` is expected to answer with it. */
const DEFAULT_ROUTES: Array<{ path: string; status?: number }> = [
  { path: "/" },
  { path: "/services" },
  ...SERVICES.map((s) => ({ path: `/services/${s.slug}` })),
  { path: "/new-patients" },
  { path: "/team" },
  { path: "/book" },
  { path: "/contact" },
  { path: "/brand-guide" },
  { path: "/no-such-page", status: 404 },
];

const ROUTES = arg("routes")
  ? arg("routes")!
      .split(",")
      .filter(Boolean)
      .map((p) => {
        const routePath = p.startsWith("/") ? p : `/${p}`;
        return { path: routePath, status: DEFAULT_ROUTES.find((r) => r.path === routePath)?.status };
      })
  : DEFAULT_ROUTES;

// Requests that may fail without it being the site's fault.
const IGNORED_REQUESTS = [/\/_next\/webpack-hmr/, /\/__nextjs/, /favicon\.ico$/, /google/];
// Console noise from the dev server itself.
const IGNORED_CONSOLE = [/Download the React DevTools/, /\[HMR\]/, /\[Fast Refresh\]/];

interface VisitResult {
  route: string;
  width: number;
  status: number | null;
  overflow: { at: number; scrollWidth: number; innerWidth: number }[];
  consoleErrors: string[];
  pageErrors: string[];
  failedRequests: string[];
  axe: Array<{ id: string; impact: string | null | undefined; help: string; nodes: number; targets: string[] }>;
  screenshot?: string;
  ok: boolean;
}

function slugify(route: string): string {
  return route === "/" ? "home" : route.replace(/^\//, "").replace(/[^a-z0-9]+/gi, "-");
}

async function scrollThrough(page: Page): Promise<number[]> {
  // Stepwise scroll so the timeline, lazy images and sticky panels all run.
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const vh = await page.evaluate(() => window.innerHeight);
  const stops: number[] = [];
  for (let y = 0; y < height; y += Math.round(vh * 0.6)) {
    await page.mouse.wheel(0, Math.round(vh * 0.6));
    await page.waitForTimeout(90);
    stops.push(y);
  }
  await page.waitForTimeout(800);
  return stops;
}

async function visit(browser: Browser, route: { path: string; status?: number }, width: number): Promise<VisitResult> {
  const context = await browser.newContext({
    viewport: { width, height: width < 600 ? 844 : 900 },
    deviceScaleFactor: 1,
    isMobile: width < 600,
    hasTouch: width < 1024,
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  const result: VisitResult = {
    route: route.path,
    width,
    status: null,
    overflow: [],
    consoleErrors: [],
    pageErrors: [],
    failedRequests: [],
    axe: [],
    ok: true,
  };
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    if (IGNORED_CONSOLE.some((r) => r.test(text))) return;
    // The expected 404 document itself logs a resource error.
    if (route.status === 404 && /status of 404/.test(text)) return;
    result.consoleErrors.push(text);
  });
  page.on("pageerror", (err) => result.pageErrors.push(String(err.message ?? err)));
  page.on("requestfailed", (req) => {
    const url = req.url();
    if (IGNORED_REQUESTS.some((r) => r.test(url))) return;
    const failure = req.failure()?.errorText ?? "failed";
    if (/ERR_ABORTED/.test(failure)) return; // navigations/prefetches cancelled on purpose
    result.failedRequests.push(`${failure} ${url}`);
  });
  page.on("response", (res) => {
    const url = res.url();
    if (res.status() >= 400 && url !== `${BASE}${route.path}` && !IGNORED_REQUESTS.some((r) => r.test(url))) {
      result.failedRequests.push(`${res.status()} ${url}`);
    }
  });

  try {
    const response = await page.goto(`${BASE}${route.path}`, { waitUntil: "networkidle", timeout: 60_000 });
    result.status = response?.status() ?? null;
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1500);

    const checkOverflow = async () => {
      const o = await page.evaluate(() => ({
        at: Math.round(window.scrollY),
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      }));
      if (o.scrollWidth > o.innerWidth) result.overflow.push(o);
    };
    await checkOverflow();
    await scrollThrough(page);
    await checkOverflow();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);

    // Settle everything for the accessibility pass.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForTimeout(700);
    await checkOverflow();

    // @axe-core/playwright types a slightly older Page; the runtime API is the same.
    const axe = await new AxeBuilder({ page: page as never })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    result.axe = axe.violations
      .filter((v) => v.impact === "serious" || v.impact === "critical")
      .map((v) => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        nodes: v.nodes.length,
        targets: v.nodes.slice(0, 5).map((n) => n.target.join(" ")),
      }));

    if (TAKE_SHOTS) {
      fs.mkdirSync(SHOTS, { recursive: true });
      const file = path.join(SHOTS, `${slugify(route.path)}-${width}.png`);
      await page.screenshot({ path: file, fullPage: true });
      result.screenshot = path.relative(ROOT, file);
    }
  } catch (err) {
    result.pageErrors.push(`QA navigation failed: ${(err as Error).message}`);
  } finally {
    await context.close();
  }

  const expected = route.status ?? 200;
  result.ok =
    result.status === expected &&
    result.overflow.length === 0 &&
    result.consoleErrors.length === 0 &&
    result.pageErrors.length === 0 &&
    result.failedRequests.length === 0 &&
    result.axe.length === 0;
  return result;
}

async function main() {
  fs.mkdirSync(QA_DIR, { recursive: true });
  const browser = await chromium.launch(
    fs.existsSync("/opt/pw-browsers/chromium") ? { executablePath: "/opt/pw-browsers/chromium" } : {},
  );
  const results: VisitResult[] = [];
  try {
    for (const route of ROUTES) {
      for (const width of WIDTHS) {
        const r = await visit(browser, route, width);
        results.push(r);
        const issues = [
          r.status !== (route.status ?? 200) && `status ${r.status}`,
          r.overflow.length && `overflow x${r.overflow.length}`,
          r.consoleErrors.length && `console x${r.consoleErrors.length}`,
          r.pageErrors.length && `pageerror x${r.pageErrors.length}`,
          r.failedRequests.length && `failed requests x${r.failedRequests.length}`,
          r.axe.length && `axe: ${r.axe.map((a) => a.id).join(", ")}`,
        ].filter(Boolean);
        console.log(`${r.ok ? "PASS" : "FAIL"}  ${route.path.padEnd(28)} ${String(width).padStart(4)}px  ${issues.join(", ")}`);
      }
    }
  } finally {
    await browser.close();
  }

  const failed = results.filter((r) => !r.ok);
  const report = {
    base: BASE,
    generatedAt: new Date().toISOString(),
    widths: WIDTHS,
    summary: { visits: results.length, passed: results.length - failed.length, failed: failed.length },
    results,
  };
  fs.writeFileSync(path.join(QA_DIR, "qa-report.json"), `${JSON.stringify(report, null, 2)}\n`);
  console.log(`\n${report.summary.passed}/${report.summary.visits} visits passed. Report: .qa/qa-report.json`);
  if (failed.length) {
    for (const r of failed.slice(0, 20)) {
      console.log(`\n${r.route} @ ${r.width}px`);
      r.consoleErrors.slice(0, 3).forEach((e) => console.log(`  console: ${e}`));
      r.pageErrors.slice(0, 3).forEach((e) => console.log(`  page:    ${e}`));
      r.failedRequests.slice(0, 3).forEach((e) => console.log(`  request: ${e}`));
      r.overflow.slice(0, 2).forEach((o) => console.log(`  overflow at y=${o.at}: ${o.scrollWidth} > ${o.innerWidth}`));
      r.axe.forEach((a) => console.log(`  axe ${a.impact} ${a.id}: ${a.help} (${a.targets.join(" | ")})`));
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

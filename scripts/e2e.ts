/* ==========================================================================
   npm run e2e -- --base http://127.0.0.1:3000

   End-to-end flows in a real browser against a running build:
   1. Booking: a link from the hero card preselects the day and time; choose
      a service, fill the form, send, see the confirmation and get a .ics file.
   2. Booking validation: an empty submit lists every problem at the top and
      focuses the summary; fixing a field clears its message.
   3. Booking with "I'm flexible": no time needed.
   4. Contact form: errors, then a sent message.
   5. Phone menu: opens, Escape closes it and focus returns to the toggle.
   6. Reduced motion: every reveal target is visible with nothing animating.
   Exits 1 when a flow fails.
   ========================================================================== */

import { chromium, type Browser, type BrowserContext, type Page } from "playwright";

const i = process.argv.indexOf("--base");
const BASE = (i > -1 ? process.argv[i + 1] : process.env.E2E_BASE ?? "http://127.0.0.1:3000")!.replace(/\/$/, "");

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function ready(page: Page, path: string) {
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
}

const pick = (page: Page, name: string, value?: string) =>
  page.locator(`label:has(input[name="${name}"]${value ? `[value="${value}"]` : ""})`).first().click();

async function bookingHappyPath(context: BrowserContext) {
  const page = await context.newPage();
  await ready(page, "/");
  const slot = page.locator('a[href^="/book?date="]').first();
  await slot.waitFor();
  const href = (await slot.getAttribute("href"))!;
  const params = new URL(href, BASE).searchParams;
  await slot.click();
  await page.waitForURL(/\/book\?date=/);
  await page.locator(`input[name="time"][value="${params.get("time")}"]`).waitFor({ state: "attached" });
  assert(await page.locator(`input[name="day"][value="${params.get("date")}"]`).isChecked(), "Day from the hero card is preselected");
  assert(await page.locator(`input[name="time"][value="${params.get("time")}"]`).isChecked(), "Time from the hero card is preselected");

  await pick(page, "service", "crowns");
  await page.fill("#field-first-name", "Jordan");
  await page.fill("#field-last-name", "Avery");
  await page.fill("#field-phone", "555 010 4321");
  await page.fill("#field-email", "jordan@example.com");
  await pick(page, "patient", "new");
  await pick(page, "coverage", "insurance");
  const summary = page.locator('aside[aria-label="Your request"]');
  if (await summary.isVisible()) {
    assert((await summary.textContent())?.includes("Crowns"), "Summary shows the chosen service");
  }
  await page.getByRole("button", { name: "Send request" }).click();
  await page.getByRole("heading", { name: "Request sent. Thanks, Jordan." }).waitFor();
  const [download] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: "Add to calendar" }).click()]);
  assert(download.suggestedFilename() === "hushwell-visit.ics", "Calendar file is offered");
  await page.close();
}

async function bookingValidation(context: BrowserContext) {
  const page = await context.newPage();
  await ready(page, "/book");
  await page.locator('input[name="day"]').first().waitFor({ state: "attached" });
  await page.getByRole("button", { name: "Send request" }).click();
  const alert = page.locator('[role="alert"]:has(h2)');
  await alert.waitFor();
  const text = (await alert.textContent()) ?? "";
  for (const part of ["What the visit is for", "Day and time", "First name", "Phone", "Email", "How you'll pay"]) {
    assert(text.includes(part), `Error summary lists "${part}"`);
  }
  assert(await alert.evaluate((el) => el === document.activeElement), "Error summary receives focus");
  await page.fill("#field-first-name", "Sam");
  await page.waitForFunction(() => !document.querySelector("#field-first-name-error"));
  assert(!(await alert.textContent())?.includes("First name"), "Fixed field drops out of the summary");
  await page.close();
}

async function bookingFlexible(context: BrowserContext) {
  const page = await context.newPage();
  await ready(page, "/book?service=emergency-care");
  await page.locator('input[name="day"]').first().waitFor({ state: "attached" });
  assert(await page.locator('input[name="service"][value="emergency-care"]').isChecked(), "Service from the link is preselected");
  assert(await page.getByText("In pain right now? Calling is fastest.").isVisible(), "Emergency note appears");
  await page.getByText("I'm flexible", { exact: true }).click();
  await page.fill("#field-first-name", "Tom");
  await page.fill("#field-last-name", "Hale");
  await page.fill("#field-phone", "(555) 010-2222");
  await page.fill("#field-email", "tom@example.com");
  await pick(page, "patient", "returning");
  await pick(page, "coverage", "self-pay");
  await page.getByRole("button", { name: "Send request" }).click();
  await page.getByRole("heading", { name: "Request sent. Thanks, Tom." }).waitFor();
  assert(await page.getByText("The first opening that fits").isVisible(), "Flexible request confirmed");
  await page.close();
}

async function contactForm(context: BrowserContext) {
  const page = await context.newPage();
  await ready(page, "/contact");
  await page.getByRole("button", { name: "Send message" }).click();
  await page.locator("#contact-name-error").waitFor();
  assert(await page.locator("#contact-name").evaluate((el) => el === document.activeElement), "First invalid field is focused");
  await page.fill("#contact-name", "Maya Kim");
  await page.fill("#contact-email", "maya@example.com");
  await page.fill("#contact-message", "Do you have early appointments on Saturdays?");
  await page.getByRole("button", { name: "Send message" }).click();
  await page.getByText("Message sent. Thanks, Maya.").waitFor();
  await page.close();
}

async function mobileMenu(browser: Browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await ready(page, "/");
  const toggle = page.getByRole("button", { name: "Open menu" });
  await toggle.click();
  const menu = page.getByRole("dialog", { name: "Menu" });
  await menu.waitFor();
  assert(await menu.getByRole("link", { name: "New patients" }).isVisible(), "Menu shows the pages");
  await page.keyboard.press("Escape");
  await menu.waitFor({ state: "hidden" });
  assert(
    await page.getByRole("button", { name: "Open menu" }).evaluate((el) => el === document.activeElement),
    "Focus returns to the menu button",
  );
  await context.close();
}

async function reducedMotion(browser: Browser) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  for (const path of ["/", "/services/crowns", "/team"]) {
    await ready(page, path);
    const hidden = await page.evaluate(() =>
      Array.from(document.querySelectorAll("[data-reveal], .enter, .words-enter .w > span")).filter((el) => {
        const s = getComputedStyle(el);
        return Number(s.opacity) < 1 || (s.transform !== "none" && !(el as HTMLElement).dataset.parallax);
      }).length,
    );
    assert(hidden === 0, `${path}: ${hidden} elements not settled under reduced motion`);
    assert(!(await page.evaluate(() => document.documentElement.classList.contains("motion-ok"))), "No motion class under reduced motion");
  }
  await context.close();
}

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
  const flows: Array<[string, () => Promise<void>]> = [
    ["Booking from the hero card", () => bookingHappyPath(context)],
    ["Booking validation", () => bookingValidation(context)],
    ["Booking when flexible", () => bookingFlexible(context)],
    ["Contact form", () => contactForm(context)],
    ["Phone menu", () => mobileMenu(browser)],
    ["Reduced motion", () => reducedMotion(browser)],
  ];
  let failed = 0;
  for (const [name, run] of flows) {
    try {
      await run();
      console.log(`PASS  ${name}`);
    } catch (err) {
      failed++;
      console.log(`FAIL  ${name}: ${(err as Error).message.split("\n")[0]}`);
    }
  }
  await browser.close();
  console.log(`\n${flows.length - failed}/${flows.length} flows passed.`);
  if (failed) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

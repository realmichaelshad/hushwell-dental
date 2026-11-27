import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/* ==========================================================================
   WCAG contrast for every text and control pair the site uses, read
   straight from the tokens in globals.css, so a palette change that breaks
   AA fails the suite.
   ========================================================================== */

const css = fs.readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8");

function token(name: string): string {
  const m = new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`).exec(css);
  if (!m) throw new Error(`No colour token --color-${name}`);
  return m[1]!;
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

const TEXT: Array<[string, string]> = [
  ["ink", "mist"],
  ["ink", "white"],
  ["ink", "seaglass"],
  ["ink-soft", "white"],
  ["ink-soft", "mist"],
  ["ink-soft", "seaglass"],
  ["ink-soft", "foam"],
  ["ink", "sand"],
  ["ink-soft", "sand"],
  ["tide", "sand"],
  ["ink-faint", "white"],
  ["ink-faint", "mist"],
  ["tide", "white"],
  ["tide", "mist"],
  ["tide", "foam"],
  ["white", "tide"],
  ["white", "tide-deep"],
  ["white", "ink"],
  ["tide-light", "ink"],
  ["error", "white"],
  ["error", "error-soft"],
];

const CONTROLS: Array<[string, string]> = [
  ["line-strong", "white"],
  ["tide", "seaglass"],
];

describe("contrast", () => {
  it.each(TEXT)("%s on %s meets AA for text (4.5:1)", (fg, bg) => {
    expect(ratio(token(fg), token(bg))).toBeGreaterThanOrEqual(4.5);
  });
  it.each(CONTROLS)("%s on %s meets 3:1 for controls", (fg, bg) => {
    expect(ratio(token(fg), token(bg))).toBeGreaterThanOrEqual(3);
  });
});

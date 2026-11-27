import localFont from "next/font/local";

// Two OFL families, self-hosted (Latin subsets from @fontsource-variable):
// - Atkinson Hyperlegible Next, designed by the Braille Institute for low-vision readers, carries all reading text
//   and interface labels (weight axis 200-800).
// - Albert Sans, a calm geometric sans, sets headlines and display figures (prices, minutes), where Atkinson's
//   slashed zero would read as code (weight axis 100-900).

export const atkinson = localFont({
  src: [
    { path: "../fonts/atkinson-next.woff2", style: "normal", weight: "200 800" },
    { path: "../fonts/atkinson-next-italic.woff2", style: "italic", weight: "200 800" },
  ],
  variable: "--font-atkinson",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const albert = localFont({
  src: [{ path: "../fonts/albert-sans.woff2", style: "normal", weight: "100 900" }],
  variable: "--font-albert",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const fontVariables = `${atkinson.variable} ${albert.variable}`;

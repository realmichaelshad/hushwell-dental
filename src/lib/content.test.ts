import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { PHOTOS, PHOTO_SLOTS } from "@/content/photos";
import { GROUPS, SERVICES, formatPrice, relatedServices } from "@/content/services";
import { HOURS } from "@/content/site";
import { FIRST_VISIT } from "@/content/visit";
import { openingHoursSpec, to24 } from "./hours";

describe("services", () => {
  it("have unique slugs and belong to a group", () => {
    const slugs = SERVICES.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of SERVICES) expect(GROUPS.some((g) => g.id === s.group)).toBe(true);
    for (const g of GROUPS) expect(SERVICES.some((s) => s.group === g.id)).toBe(true);
  });

  it("each have a price, steps, a comfort answer and questions", () => {
    for (const s of SERVICES) {
      expect(s.priceFrom).toBeGreaterThan(0);
      expect(s.steps.length).toBeGreaterThanOrEqual(3);
      expect(s.comfort.length).toBeGreaterThan(20);
      expect(s.faqs.length).toBeGreaterThanOrEqual(2);
      if (s.photo) expect(PHOTO_SLOTS).toContain(s.photo);
    }
  });

  it("formats prices with thousands separators", () => {
    expect(formatPrice(1150)).toBe("$1,150");
    expect(formatPrice(95)).toBe("$95");
  });

  it("suggest related care from the same group first", () => {
    const related = relatedServices("fillings");
    expect(related).toHaveLength(3);
    expect(related[0]!.group).toBe("repairs");
    expect(related.map((r) => r.slug)).not.toContain("fillings");
  });
});

describe("copy rules", () => {
  const SOURCE = path.join(process.cwd(), "src");
  const files = fs
    .readdirSync(SOURCE, { recursive: true, withFileTypes: true })
    .filter((f) => f.isFile() && /\.(tsx?|css)$/.test(f.name) && !f.name.endsWith(".test.ts"))
    .map((f) => path.join(f.parentPath, f.name));

  it("uses no em dashes, middle dots or arrow glyphs in the site", () => {
    for (const file of files) {
      const text = fs.readFileSync(file, "utf8");
      expect(text, file).not.toMatch(/[—·←→]/);
    }
  });
});

describe("photos", () => {
  it("every slot has a spec", () => {
    for (const slot of PHOTO_SLOTS) expect(PHOTOS[slot].slot).toBe(slot);
  });
});

describe("hours", () => {
  it("converts to 24-hour time", () => {
    expect(to24("8:00 am")).toBe("08:00");
    expect(to24("12:30 pm")).toBe("12:30");
    expect(to24("12:00 am")).toBe("00:00");
    expect(to24("7:00 pm")).toBe("19:00");
    expect(() => to24("noon")).toThrow();
  });

  it("writes schema.org opening hours, skipping Sunday", () => {
    const spec = openingHoursSpec(HOURS);
    expect(spec[0]).toBe("Mo 08:00-19:00");
    expect(spec).toHaveLength(6);
    expect(spec.some((s) => s.startsWith("Su"))).toBe(false);
  });

  it("first visit runs in order and fits in an hour", () => {
    const minutes = FIRST_VISIT.map((s) => s.minute);
    expect([...minutes].sort((a, b) => a - b)).toEqual(minutes);
    expect(minutes.at(-1)).toBe(60);
  });
});

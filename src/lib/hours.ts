import type { DayHours } from "@/content/site";

/** "8:00 am" becomes "08:00", "7:00 pm" becomes "19:00", "12:30 pm" becomes "12:30". */
export function to24(time: string): string {
  const match = /^(\d{1,2}):(\d{2})\s*(am|pm)$/i.exec(time.trim());
  if (!match) throw new Error(`Unrecognized time: ${time}`);
  const [, h, m, period] = match as unknown as [string, string, string, string];
  let hour = Number(h) % 12;
  if (period.toLowerCase() === "pm") hour += 12;
  return `${String(hour).padStart(2, "0")}:${m}`;
}

/** schema.org openingHours strings, e.g. "Mo 08:00-19:00". Closed days are left out. */
export function openingHoursSpec(hours: DayHours[]): string[] {
  return hours.filter((d) => d.open && d.close).map((d) => `${d.short.slice(0, 2)} ${to24(d.open!)}-${to24(d.close!)}`);
}

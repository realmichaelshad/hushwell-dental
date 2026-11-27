import { HOURS, type DayHours } from "@/content/site";
import { to24 } from "./hours";

/* ==========================================================================
   Appointment availability for the concept practice. There is no booking
   system behind the site, so open slots are generated deterministically
   from the opening hours and the date: the same day always shows the same
   free times, which keeps screenshots and tests stable.

   Dates are local calendar dates written as "YYYY-MM-DD"; times are 24-hour
   "HH:MM" strings.
   ========================================================================== */

export const SLOT_MINUTES = 30;
/** The last appointment starts this long before closing. */
const LAST_START_BEFORE_CLOSE = 60;
/** Roughly this share of slots shows as already booked. */
const BOOKED_SHARE = 0.62;
const MIN_FREE_PER_DAY = 3;

export interface Slot {
  date: string;
  time: string;
}

export function isoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Parses "YYYY-MM-DD" as a local date (not UTC). */
export function fromIso(date: string): Date {
  const [y, m, d] = date.split("-").map(Number) as [number, number, number];
  return new Date(y, m - 1, d);
}

export function addDays(d: Date, days: number): Date {
  const next = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  next.setDate(next.getDate() + days);
  return next;
}

/** HOURS is Monday first; Date#getDay is Sunday first. */
export function hoursFor(d: Date): DayHours {
  return HOURS[(d.getDay() + 6) % 7]!;
}

export function isOpenDay(d: Date): boolean {
  return hoursFor(d).open !== null;
}

function minutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number) as [number, number];
  return h * 60 + m;
}

function hhmm(total: number): string {
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

/** FNV-1a, enough to scatter booked slots evenly and repeatably. */
function hash(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Every appointment start time on that day, booked or not. */
export function allSlotTimes(d: Date): string[] {
  const day = hoursFor(d);
  if (!day.open || !day.close) return [];
  const start = minutes(to24(day.open));
  const lastStart = minutes(to24(day.close)) - LAST_START_BEFORE_CLOSE;
  const times: string[] = [];
  for (let t = start; t <= lastStart; t += SLOT_MINUTES) times.push(hhmm(t));
  return times;
}

/** The free start times on that day (at least MIN_FREE_PER_DAY when the day is open). */
export function freeSlotTimes(d: Date): string[] {
  const all = allSlotTimes(d);
  if (all.length === 0) return [];
  const date = isoDate(d);
  const free = all.filter((t) => hash(`${date}T${t}`) % 1000 >= BOOKED_SHARE * 1000);
  if (free.length >= MIN_FREE_PER_DAY) return free;
  // Too busy: free up the evenly spaced slots so every open day offers a choice.
  const step = Math.max(1, Math.floor(all.length / MIN_FREE_PER_DAY));
  const extra = all.filter((_, i) => i % step === 0);
  return Array.from(new Set([...free, ...extra])).sort().slice(0, Math.max(MIN_FREE_PER_DAY, free.length));
}

/** The next `count` open days, starting with `from` itself when it is open. */
export function upcomingOpenDays(from: Date, count: number): Date[] {
  const days: Date[] = [];
  for (let i = 0; days.length < count && i < count * 3; i++) {
    const d = addDays(from, i);
    if (isOpenDay(d)) days.push(d);
  }
  return days;
}

/** Free slots for one day, minus anything that starts within `leadMinutes` of `now`. */
export function bookableTimes(d: Date, now: Date, leadMinutes = 120): string[] {
  const free = freeSlotTimes(d);
  if (isoDate(d) !== isoDate(now)) return isoDate(d) < isoDate(now) ? [] : free;
  const cutoff = now.getHours() * 60 + now.getMinutes() + leadMinutes;
  return free.filter((t) => minutes(t) >= cutoff);
}

/** The first `count` bookable slots from `now` on. */
export function nextOpenings(now: Date, count = 3, leadMinutes = 120): Slot[] {
  const slots: Slot[] = [];
  for (const d of upcomingOpenDays(now, 14)) {
    for (const time of bookableTimes(d, now, leadMinutes)) {
      slots.push({ date: isoDate(d), time });
      if (slots.length === count) return slots;
    }
  }
  return slots;
}

/** "09:30" becomes "9:30 am", "19:00" becomes "7 pm", "12:00" becomes "12 pm". */
export function formatTime(time: string): string {
  const total = minutes(time);
  const h = Math.floor(total / 60);
  const m = total % 60;
  const period = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${h12} ${period}` : `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

const WEEKDAY = new Intl.DateTimeFormat("en-US", { weekday: "short" });
const WEEKDAY_LONG = new Intl.DateTimeFormat("en-US", { weekday: "long" });
const MONTH_DAY = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

/** "Today", "Tomorrow" or "Tue, Oct 28". */
export function formatDay(date: string, now: Date): string {
  if (date === isoDate(now)) return "Today";
  if (date === isoDate(addDays(now, 1))) return "Tomorrow";
  const d = fromIso(date);
  return `${WEEKDAY.format(d)}, ${MONTH_DAY.format(d)}`;
}

/** "Tuesday, Oct 28" */
export function formatLongDay(date: string): string {
  const d = fromIso(date);
  return `${WEEKDAY_LONG.format(d)}, ${MONTH_DAY.format(d)}`;
}

export function weekdayShort(d: Date): string {
  return WEEKDAY.format(d);
}

export interface OpenStatus {
  open: boolean;
  label: string;
}

/** "Open now until 7 pm", or after hours "Opens tomorrow at 8 am". */
export function openStatus(now: Date): OpenStatus {
  const today = hoursFor(now);
  const nowMin = now.getHours() * 60 + now.getMinutes();
  if (today.open && today.close) {
    const open = minutes(to24(today.open));
    const close = minutes(to24(today.close));
    if (nowMin >= open && nowMin < close) {
      return { open: true, label: `Open now until ${formatTime(to24(today.close))}` };
    }
    if (nowMin < open) {
      return { open: false, label: `Opens today at ${formatTime(to24(today.open))}` };
    }
  }
  for (let i = 1; i <= 7; i++) {
    const d = addDays(now, i);
    const h = hoursFor(d);
    if (h.open) {
      const when = i === 1 ? "tomorrow" : WEEKDAY_LONG.format(d);
      return { open: false, label: `Opens ${when} at ${formatTime(to24(h.open))}` };
    }
  }
  return { open: false, label: "Closed this week" };
}

import { describe, expect, it } from "vitest";
import {
  allSlotTimes,
  bookableTimes,
  formatDay,
  formatTime,
  freeSlotTimes,
  fromIso,
  isOpenDay,
  isoDate,
  nextOpenings,
  openStatus,
  upcomingOpenDays,
} from "./availability";

// 2026-10-26 is a Monday.
const MONDAY = new Date(2026, 9, 26, 7, 0);

describe("calendar helpers", () => {
  it("round-trips local dates", () => {
    expect(isoDate(fromIso("2026-03-08"))).toBe("2026-03-08");
    expect(isoDate(new Date(2026, 0, 5, 23, 59))).toBe("2026-01-05");
  });

  it("knows Sunday is closed", () => {
    expect(isOpenDay(new Date(2026, 10, 1))).toBe(false); // Sunday
    expect(isOpenDay(new Date(2026, 9, 31))).toBe(true); // Saturday
  });

  it("lists upcoming open days and skips Sundays", () => {
    const days = upcomingOpenDays(new Date(2026, 9, 31), 3).map(isoDate);
    expect(days).toEqual(["2026-10-31", "2026-11-02", "2026-11-03"]);
  });
});

describe("slots", () => {
  it("runs every 30 minutes from opening to an hour before close", () => {
    const times = allSlotTimes(MONDAY);
    expect(times[0]).toBe("08:00");
    expect(times.at(-1)).toBe("18:00");
    expect(times).toHaveLength(21);
    expect(allSlotTimes(new Date(2026, 9, 31))).toEqual(["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00"]);
  });

  it("is deterministic and always leaves a choice", () => {
    for (let i = 0; i < 60; i++) {
      const d = new Date(2026, 9, 26 + i);
      const free = freeSlotTimes(d);
      expect(free).toEqual(freeSlotTimes(d));
      if (isOpenDay(d)) expect(free.length).toBeGreaterThanOrEqual(3);
      else expect(free).toEqual([]);
      expect(free.every((t) => allSlotTimes(d).includes(t))).toBe(true);
    }
  });

  it("never offers a time in the next two hours, or on a past day", () => {
    const now = new Date(2026, 9, 26, 13, 10);
    expect(bookableTimes(now, now).every((t) => t >= "15:10")).toBe(true);
    expect(bookableTimes(new Date(2026, 9, 23), now)).toEqual([]);
  });

  it("finds the next openings in order", () => {
    const slots = nextOpenings(MONDAY, 5);
    expect(slots).toHaveLength(5);
    const keys = slots.map((s) => `${s.date}T${s.time}`);
    expect([...keys].sort()).toEqual(keys);
    expect(keys[0]! >= "2026-10-26T09:00").toBe(true);
  });
});

describe("formatting", () => {
  it("formats times the way people say them", () => {
    expect(formatTime("09:30")).toBe("9:30 am");
    expect(formatTime("19:00")).toBe("7 pm");
    expect(formatTime("12:00")).toBe("12 pm");
    expect(formatTime("00:15")).toBe("12:15 am");
  });

  it("says today and tomorrow", () => {
    expect(formatDay("2026-10-26", MONDAY)).toBe("Today");
    expect(formatDay("2026-10-27", MONDAY)).toBe("Tomorrow");
    expect(formatDay("2026-10-29", MONDAY)).toBe("Thu, Oct 29");
  });
});

describe("open status", () => {
  it("is open during hours", () => {
    expect(openStatus(new Date(2026, 9, 26, 10, 0))).toEqual({ open: true, label: "Open now until 7 pm" });
    expect(openStatus(new Date(2026, 9, 30, 15, 59)).label).toBe("Open now until 4 pm");
  });

  it("points to the next opening when closed", () => {
    expect(openStatus(new Date(2026, 9, 26, 6, 30)).label).toBe("Opens today at 8 am");
    expect(openStatus(new Date(2026, 9, 26, 19, 0)).label).toBe("Opens tomorrow at 8 am");
    expect(openStatus(new Date(2026, 9, 31, 15, 0)).label).toBe("Opens Monday at 8 am");
    expect(openStatus(new Date(2026, 10, 1, 12, 0)).label).toBe("Opens tomorrow at 8 am");
  });
});

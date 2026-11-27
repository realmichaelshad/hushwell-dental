import { describe, expect, it } from "vitest";
import { bookingIcs, validateBooking } from "./booking";
import { isUsPhone } from "./forms";

const VALID = {
  service: "checkup-and-cleaning",
  flexible: false,
  date: "2026-10-27",
  time: "09:30",
  firstName: "Jordan",
  lastName: "Avery",
  phone: "(555) 010-4321",
  email: "jordan@example.com",
  patient: "new",
  coverage: "insurance",
  reminders: true,
};

describe("booking request validation", () => {
  it("accepts a complete request", () => {
    const r = validateBooking(VALID);
    expect(r.ok).toBe(true);
  });

  it("trims names and keeps the chosen time", () => {
    const r = validateBooking({ ...VALID, firstName: "  Jordan  " });
    expect(r.ok && r.data.firstName).toBe("Jordan");
  });

  it("lists every problem at once, including the missing time", () => {
    const r = validateBooking({ flexible: false, firstName: "", lastName: "", phone: "", email: "", reminders: false });
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(Object.keys(r.errors).sort()).toEqual(
      ["coverage", "email", "firstName", "lastName", "patient", "phone", "service", "time"].sort(),
    );
  });

  it("allows no time when the patient is flexible", () => {
    const r = validateBooking({ ...VALID, flexible: true, date: undefined, time: undefined });
    expect(r.ok).toBe(true);
  });

  it("needs both a day and a time otherwise", () => {
    const r = validateBooking({ ...VALID, time: undefined });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.time).toMatch(/day and a time/);
  });

  it("rejects unknown services and long notes", () => {
    const r = validateBooking({ ...VALID, service: "brain-surgery", notes: "x".repeat(501) });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors.service).toBeDefined();
      expect(r.errors.notes).toMatch(/500/);
    }
  });

  it("explains a bad email", () => {
    const r = validateBooking({ ...VALID, email: "jordan@example" });
    expect(!r.ok && r.errors.email).toMatch(/missing @ or dot/);
  });
});

describe("phone numbers", () => {
  it.each(["5550104321", "(555) 010-4321", "555.010.4321", "+1 555 010 4321", "1-555-010-4321"])("accepts %s", (v) => {
    expect(isUsPhone(v)).toBe(true);
  });
  it.each(["555-0104", "555 010 43210", "call me", "2-555-010-4321"])("rejects %s", (v) => {
    expect(isUsPhone(v)).toBe(false);
  });
});

describe("calendar file", () => {
  it("writes a tentative event with the right start and end", () => {
    const ics = bookingIcs({
      date: "2026-10-27",
      time: "09:30",
      minutes: 60,
      title: "Checkup and cleaning at Hushwell Dental",
      location: "214 Linden Street, Suite 2, Brookmere",
      now: new Date(Date.UTC(2026, 9, 25, 12, 0, 0)),
    });
    expect(ics).toContain("DTSTART:20261027T093000");
    expect(ics).toContain("DTEND:20261027T103000");
    expect(ics).toContain("DTSTAMP:20261025T120000Z");
    expect(ics).toContain("STATUS:TENTATIVE");
    expect(ics).toContain("LOCATION:214 Linden Street\\, Suite 2\\, Brookmere");
    expect(ics.split("\r\n")[0]).toBe("BEGIN:VCALENDAR");
  });
});

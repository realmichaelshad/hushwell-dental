import * as z from "zod/mini";
import { SERVICES } from "@/content/services";
import { emailField, phoneField, requiredText, validate } from "./forms";

/* ==========================================================================
   The booking request: what the visit is for, when, and who it's for.
   A request, not a booking: the practice calls back to confirm.
   ========================================================================== */

export const NOT_SURE = "not-sure";
export const SERVICE_CHOICES: [string, ...string[]] = [NOT_SURE, ...SERVICES.map((s) => s.slug)];

export const PATIENT_TYPES = ["new", "returning"] as const;
export const COVERAGE = ["insurance", "self-pay", "membership"] as const;
export const NOTES_MAX = 500;

export const COVERAGE_SHORT: Record<(typeof COVERAGE)[number], string> = {
  insurance: "Dental insurance",
  "self-pay": "Self-pay",
  membership: "Hushwell Membership",
};

export const COVERAGE_LABELS: Record<(typeof COVERAGE)[number], string> = {
  insurance: "Insurance",
  "self-pay": "Self-pay",
  membership: "Membership",
};

export const COVERAGE_HINTS: Record<(typeof COVERAGE)[number], string> = {
  insurance: "We'll check your plan first",
  "self-pay": "Prices are posted",
  membership: "$29 a month, no insurance needed",
};

export const bookingSchema = z
  .object({
    service: z.enum(SERVICE_CHOICES, { error: "Choose what the visit is for. If you're not sure, pick \"Not sure yet\"." }),
    flexible: z.boolean(),
    date: z.optional(z.string()),
    time: z.optional(z.string()),
    firstName: requiredText("Enter your first name.", 60),
    lastName: requiredText("Enter your last name.", 60),
    phone: phoneField,
    email: emailField,
    patient: z.enum(PATIENT_TYPES, { error: "Tell us whether you've been to Hushwell before." }),
    coverage: z.enum(COVERAGE, { error: "Tell us how you'd like to pay, so we can check costs before your visit." }),
    notes: z.optional(z.string().check(z.maxLength(NOTES_MAX, "Keep notes under 500 characters. We can talk about the rest on the phone."))),
    reminders: z.boolean(),
  })
  .check(
    z.refine((v) => v.flexible || (Boolean(v.date) && Boolean(v.time)), {
      error: "Pick a day and a time, or choose \"I'm flexible\".",
      path: ["time"],
    }),
    // (validateBooking repeats this rule so it also shows while other fields are invalid.)
  );

export type BookingInput = z.infer<typeof bookingSchema>;
export type BookingField = keyof BookingInput & string;

/** Field order on the page, used to focus the first problem and order the error summary. */
export const BOOKING_FIELDS: BookingField[] = [
  "service",
  "time",
  "firstName",
  "lastName",
  "phone",
  "email",
  "patient",
  "coverage",
  "notes",
];

const TIME_MESSAGE = "Pick a day and a time, or choose \"I'm flexible\".";

/**
 * Validates the whole request. zod skips object-level checks while any field is invalid, so the
 * day-and-time rule is added here too: every problem shows up on the first submit.
 */
export function validateBooking(values: unknown) {
  const result = validate(bookingSchema, values);
  if (result.ok) return result;
  const v = (values ?? {}) as Partial<BookingInput>;
  if (!v.flexible && !(v.date && v.time) && !result.errors.time) result.errors.time = TIME_MESSAGE;
  return result;
}

/** A calendar file for the requested time (a tentative event, since the practice confirms by phone). */
export function bookingIcs({
  date,
  time,
  minutes,
  title,
  location,
  now = new Date(),
}: {
  date: string;
  time: string;
  minutes: number;
  title: string;
  location: string;
  now?: Date;
}): string {
  const [y, m, d] = date.split("-");
  const [hh, mm] = time.split(":");
  const start = `${y}${m}${d}T${hh}${mm}00`;
  const endTotal = Number(hh) * 60 + Number(mm) + minutes;
  const end = `${y}${m}${d}T${String(Math.floor(endTotal / 60)).padStart(2, "0")}${String(endTotal % 60).padStart(2, "0")}00`;
  const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const escape = (s: string) => s.replace(/[\\;,]/g, (c) => `\\${c}`);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Hushwell Dental//Visit request//EN",
    "BEGIN:VEVENT",
    `UID:${start}-${Math.abs(hashCode(title + location))}@hushwell.example.com`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escape(title)}`,
    `LOCATION:${escape(location)}`,
    "STATUS:TENTATIVE",
    "DESCRIPTION:Requested time. Hushwell will call to confirm.",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function hashCode(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (Math.imul(31, h) + text.charCodeAt(i)) | 0;
  return h;
}

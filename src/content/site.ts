/* ==========================================================================
   Practice details. Hushwell Dental is a fictional practice: every contact
   detail here is a placeholder (555 numbers, example.com addresses).
   Anything rendered from `contact` is wrapped in [data-contact] so
   screenshots can hide it.
   ========================================================================== */

export const SITE = {
  name: "Hushwell Dental",
  shortName: "Hushwell",
  url: "https://hushwell.example.com",
  description:
    "A calm neighborhood dental practice in Brookmere for adults and kids. Gentle checkups, posted prices and a first visit explained minute by minute.",
  tagline: "Gentle dentistry, explained before it happens.",
} as const;

export const CONTACT = {
  phone: "(555) 010-0000",
  phoneHref: "tel:+15550100000",
  email: "hello@example.com",
  street: "214 Linden Street, Suite 2",
  town: "Brookmere",
} as const;

export interface DayHours {
  day: string;
  short: string;
  /** null = closed */
  open: string | null;
  close: string | null;
}

/** Monday first. Sunday closed. */
export const HOURS: DayHours[] = [
  { day: "Monday", short: "Mon", open: "8:00 am", close: "7:00 pm" },
  { day: "Tuesday", short: "Tue", open: "8:00 am", close: "7:00 pm" },
  { day: "Wednesday", short: "Wed", open: "8:00 am", close: "7:00 pm" },
  { day: "Thursday", short: "Thu", open: "8:00 am", close: "7:00 pm" },
  { day: "Friday", short: "Fri", open: "8:00 am", close: "4:00 pm" },
  { day: "Saturday", short: "Sat", open: "9:00 am", close: "2:00 pm" },
  { day: "Sunday", short: "Sun", open: null, close: null },
];

export const NAV = [
  { href: "/services", label: "Services" },
  { href: "/new-patients", label: "New patients" },
  { href: "/team", label: "Our team" },
  { href: "/contact", label: "Contact" },
] as const;

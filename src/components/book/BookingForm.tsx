"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent, type ReactNode, type RefObject } from "react";
import { buttonClass } from "@/components/ui/Button";
import { Checkbox, ChoiceGroup, FieldError, TextArea, TextField, type Choice } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { SERVICES, formatPrice, getService } from "@/content/services";
import { CONTACT } from "@/content/site";
import {
  bookableTimes,
  formatLongDay,
  formatTime,
  fromIso,
  isOpenDay,
  isoDate,
  upcomingOpenDays,
  weekdayShort,
} from "@/lib/availability";
import {
  BOOKING_FIELDS,
  COVERAGE,
  COVERAGE_HINTS,
  COVERAGE_LABELS,
  COVERAGE_SHORT,
  NOTES_MAX,
  NOT_SURE,
  bookingIcs,
  validateBooking,
  type BookingField,
  type BookingInput,
} from "@/lib/booking";
import { cn } from "@/lib/cn";
import { fakeLatency } from "@/lib/forms";

/* ==========================================================================
   The visit request form. Three parts on one page (what, when, who) with a
   running summary beside it. Checks on submit, then re-checks as you fix
   things; problems are listed at the top with links to each field. Nothing
   leaves the browser: a short pause stands in for sending.
   ========================================================================== */

type Values = {
  service?: string;
  flexible: boolean;
  date?: string;
  time?: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  patient?: string;
  coverage?: string;
  notes: string;
  reminders: boolean;
};

type Errors = Partial<Record<BookingField, string>>;

const EMPTY: Values = {
  flexible: false,
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  notes: "",
  reminders: true,
};

const DAYS_SHOWN = 10;

/** Where the error summary links to, per field. */
const FIELD_IDS: Record<BookingField, string> = {
  service: "field-service",
  flexible: "field-time",
  date: "field-day",
  time: "field-time",
  firstName: "field-first-name",
  lastName: "field-last-name",
  phone: "field-phone",
  email: "field-email",
  patient: "field-patient",
  coverage: "field-coverage",
  notes: "field-notes",
  reminders: "field-reminders",
};

const FIELD_NAMES: Partial<Record<BookingField, string>> = {
  service: "What the visit is for",
  time: "Day and time",
  firstName: "First name",
  lastName: "Last name",
  phone: "Phone",
  email: "Email",
  patient: "New or returning",
  coverage: "How you'll pay",
  notes: "Notes",
};

function serviceName(slug?: string) {
  if (!slug) return undefined;
  if (slug === NOT_SURE) return "Not sure yet";
  return getService(slug)?.name;
}

function part(time: string) {
  const h = Number(time.slice(0, 2));
  return h < 12 ? "Morning" : h < 17 ? "Afternoon" : "Evening";
}

function toInput(values: Values) {
  return { ...values, notes: values.notes || undefined };
}

export function BookingForm() {
  const params = useSearchParams();
  const [now, setNow] = useState<Date | null>(null);
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [sent, setSent] = useState<BookingInput | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);

  // Read the link's choices (service, day, time, plan) once the visitor's clock is known.
  useEffect(() => {
    const today = new Date();
    setNow(today);
    const next: Partial<Values> = {};
    const service = params.get("service");
    if (service && (service === NOT_SURE || getService(service))) next.service = service;
    const date = params.get("date");
    if (date && /^\d{4}-\d{2}-\d{2}$/.test(date) && date >= isoDate(today) && isOpenDay(fromIso(date))) {
      next.date = date;
      const time = params.get("time");
      if (time && bookableTimes(fromIso(date), today).includes(time)) next.time = time;
    }
    const coverage = params.get("coverage");
    if (coverage && (COVERAGE as readonly string[]).includes(coverage)) next.coverage = coverage;
    setValues((v) => ({ ...v, ...next }));
  }, [params]);

  const days = useMemo(() => (now ? upcomingOpenDays(now, DAYS_SHOWN + 1) : []), [now]);
  // Today drops off once it has no bookable times left.
  const visibleDays = useMemo(
    () => (now ? days.filter((d) => bookableTimes(d, now).length > 0).slice(0, DAYS_SHOWN) : []),
    [days, now],
  );
  const times = useMemo(
    () => (now && values.date ? bookableTimes(fromIso(values.date), now) : []),
    [now, values.date],
  );

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "date") next.time = undefined;
      if (key === "flexible" && value) {
        next.date = undefined;
        next.time = undefined;
      }
      return next;
    });
  }

  // After the first submit, re-check as the visitor fixes things.
  useEffect(() => {
    if (!attempted) return;
    const result = validateBooking(toInput(values));
    setErrors(result.ok ? {} : (result.errors as Errors));
  }, [values, attempted]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setAttempted(true);
    const result = validateBooking(toInput(values));
    if (!result.ok) {
      setErrors(result.errors as Errors);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setErrors({});
    setStatus("sending");
    await fakeLatency();
    setSent(result.data);
    setStatus("sent");
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    requestAnimationFrame(() => doneRef.current?.focus());
  }

  const problems = BOOKING_FIELDS.filter((f) => errors[f]);
  const chosen = values.service && values.service !== NOT_SURE ? getService(values.service) : undefined;

  if (status === "sent" && sent) {
    return <Confirmation data={sent} headingRef={doneRef} />;
  }

  const serviceChoices: Choice[] = [
    ...SERVICES.map((s) => ({
      value: s.slug,
      label: s.slug === "emergency-care" ? "Emergency care" : s.name,
      description: (
        <>
          From <span className="font-bold text-ink">{formatPrice(s.priceFrom)}</span>
        </>
      ),
      icon: <Icon name={s.icon} size={20} />,
    })),
    {
      value: NOT_SURE,
      label: "Not sure yet",
      description: "We'll help you choose when we call.",
      icon: <Icon name="chat" size={20} />,
    },
  ];

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <form noValidate onSubmit={onSubmit} aria-describedby="form-note" className="min-w-0">
        {problems.length > 0 && (
          <div
            ref={summaryRef}
            tabIndex={-1}
            role="alert"
            className="mb-10 rounded-panel border-2 border-error bg-error-soft p-6 focus:outline-none"
          >
            <h2 className="flex items-center gap-2 font-display text-[1.25rem] font-semibold text-error">
              <Icon name="alert" size={22} />
              {problems.length === 1 ? "One thing to fix" : `${problems.length} things to fix`}
            </h2>
            <ul className="mt-3 space-y-1.5">
              {problems.map((f) => (
                <li key={f}>
                  <a href={`#${FIELD_IDS[f]}`} className="font-bold text-error underline underline-offset-4">
                    {FIELD_NAMES[f]}
                  </a>
                  <span className="text-ink">: {errors[f]}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 1. What */}
        <section aria-labelledby="step-what" className="rounded-pebble bg-white p-6 shadow-soft sm:p-9">
          <StepHeading id="step-what" n={1}>
            What&apos;s the visit for?
          </StepHeading>
          <ChoiceGroup
            id="field-service"
            name="service"
            legend="Choose one"
            legendClassName="sr-only"
            choices={serviceChoices}
            value={values.service}
            onChange={(v) => set("service", v)}
            error={errors.service}
            className="mt-6"
          />
          {values.service === "emergency-care" && (
            <div className="mt-6 flex gap-4 rounded-card bg-seaglass p-5">
              <Icon name="phone" size={22} className="mt-0.5 shrink-0 text-tide" />
              <p>
                <span className="font-bold">In pain right now? Calling is fastest.</span> We hold same-day slots for
                emergencies:{" "}
                <a href={CONTACT.phoneHref} className="font-display font-semibold text-tide underline underline-offset-4" data-contact>
                  {CONTACT.phone}
                </a>
              </p>
            </div>
          )}
        </section>

        {/* 2. When */}
        <section aria-labelledby="step-when" className="mt-6 rounded-pebble bg-white p-6 shadow-soft sm:p-9">
          <StepHeading id="step-when" n={2}>
            When works for you?
          </StepHeading>
          <p className="mt-2 text-ink-soft">These times are open right now. We&apos;ll confirm yours by phone.</p>

          <div className={cn("transition-opacity duration-300", values.flexible && "pointer-events-none opacity-40")} aria-disabled={values.flexible || undefined}>
            <fieldset id="field-day" className="mt-7" disabled={values.flexible}>
              <legend className="font-display text-[1.0625rem] font-semibold">Day</legend>
              {now ? (
                <div className="-mx-1 mt-3 flex snap-x gap-2.5 overflow-x-auto px-1 pb-2 sm:grid sm:grid-cols-5 sm:overflow-visible">
                  {visibleDays.map((d) => {
                    const iso = isoDate(d);
                    const selected = values.date === iso;
                    const isToday = iso === isoDate(now);
                    return (
                      <label
                        key={iso}
                        data-ripple
                        className={cn(
                          "flex min-w-[4.75rem] shrink-0 cursor-pointer snap-start flex-col items-center rounded-card border-2 px-2 py-3 text-center transition-[border-color,background-color,color] duration-200 has-[:focus-visible]:shadow-[0_0_0_4px_rgb(27_106_100/0.22)]",
                          selected ? "border-tide bg-tide text-white" : "border-line bg-white hover:border-ink-faint",
                        )}
                      >
                        <input
                          type="radio"
                          name="day"
                          value={iso}
                          checked={selected}
                          onChange={() => set("date", iso)}
                          className="sr-only"
                        />
                        <span className={cn("text-tiny font-bold transition-colors duration-200", selected ? "text-white/85" : "text-ink-soft")}>
                          {isToday ? "Today" : weekdayShort(d)}
                        </span>
                        <span className="font-display text-[1.5rem] leading-tight font-semibold">{d.getDate()}</span>
                        <span className={cn("text-tiny transition-colors duration-200", selected ? "text-white/85" : "text-ink-faint")}>
                          {d.toLocaleDateString("en-US", { month: "short" })}
                        </span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <div aria-hidden="true" className="mt-3 grid grid-cols-5 gap-2.5">
                  {Array.from({ length: DAYS_SHOWN }, (_, i) => (
                    <span key={i} className="h-[5.25rem] rounded-card bg-foam" />
                  ))}
                </div>
              )}
            </fieldset>

            <fieldset id="field-time" className="mt-7" disabled={values.flexible} aria-describedby={errors.time ? "field-time-error" : undefined}>
              <legend className="font-display text-[1.0625rem] font-semibold">
                Time{values.date && <span className="font-normal text-ink-soft"> on {formatLongDay(values.date)}</span>}
              </legend>
              {!values.date ? (
                <p className="mt-3 rounded-card border-2 border-dashed border-line px-5 py-4 text-ink-soft">
                  Choose a day to see the open times.
                </p>
              ) : (
                <div className="mt-3 space-y-4">
                  {(["Morning", "Afternoon", "Evening"] as const).map((p) => {
                    const slots = times.filter((t) => part(t) === p);
                    if (slots.length === 0) return null;
                    return (
                      <div key={p}>
                        <p className="text-small text-ink-faint">{p}</p>
                        <div className="mt-2 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
                          {slots.map((t) => {
                            const selected = values.time === t;
                            return (
                              <label
                                key={t}
                                data-ripple
                                className={cn(
                                  "inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full border-2 px-2 font-display whitespace-nowrap max-sm:text-[1rem] sm:min-w-[6.25rem] sm:px-4 text-[1.0625rem] font-semibold transition-[border-color,background-color,color] duration-200 has-[:focus-visible]:shadow-[0_0_0_4px_rgb(27_106_100/0.22)]",
                                  selected ? "border-tide bg-tide text-white" : "border-line bg-white hover:border-ink-faint",
                                )}
                              >
                                <input
                                  type="radio"
                                  name="time"
                                  value={t}
                                  checked={selected}
                                  onChange={() => set("time", t)}
                                  className="sr-only"
                                />
                                {formatTime(t)}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </fieldset>
          </div>

          <Checkbox
            className="mt-7 rounded-card bg-mist p-4"
            label="I'm flexible"
            description="Call me with the first opening that fits."
            checked={values.flexible}
            onChange={(v) => set("flexible", v)}
          />
          {errors.time && <FieldError id="field-time-error" message={errors.time} />}
        </section>

        {/* 3. Who */}
        <section aria-labelledby="step-who" className="mt-6 rounded-pebble bg-white p-6 shadow-soft sm:p-9">
          <StepHeading id="step-who" n={3}>
            About you
          </StepHeading>
          <div className="mt-7 grid gap-6 sm:grid-cols-2">
            <TextField
              id="field-first-name"
              label="First name"
              autoComplete="given-name"
              value={values.firstName}
              onChange={(e) => set("firstName", e.target.value)}
              error={errors.firstName}
            />
            <TextField
              id="field-last-name"
              label="Last name"
              autoComplete="family-name"
              value={values.lastName}
              onChange={(e) => set("lastName", e.target.value)}
              error={errors.lastName}
            />
            <TextField
              id="field-phone"
              label="Phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              hint="We'll call this number to confirm."
              value={values.phone}
              onChange={(e) => set("phone", e.target.value)}
              error={errors.phone}
            />
            <TextField
              id="field-email"
              label="Email"
              type="email"
              autoComplete="email"
              hint="For your forms and a reminder."
              value={values.email}
              onChange={(e) => set("email", e.target.value)}
              error={errors.email}
            />
          </div>

          <ChoiceGroup
            id="field-patient"
            name="patient"
            legend="Have you been to Hushwell before?"
            variant="pill"
            choices={[
              { value: "new", label: "No, I'm new" },
              { value: "returning", label: "Yes, I've been before" },
            ]}
            value={values.patient}
            onChange={(v) => set("patient", v)}
            error={errors.patient}
            className="mt-8"
          />

          <ChoiceGroup
            id="field-coverage"
            name="coverage"
            legend="How would you like to pay?"
            hint="So we can tell you the cost before your visit."
            columns="grid-cols-1"
            choices={COVERAGE.map((c) => ({
              value: c,
              label: COVERAGE_LABELS[c],
              description: COVERAGE_HINTS[c],
              icon: <Icon name={c === "insurance" ? "shield" : c === "self-pay" ? "card" : "sparkle"} size={20} />,
            }))}
            value={values.coverage}
            onChange={(v) => set("coverage", v)}
            error={errors.coverage}
            className="mt-8"
          />

          <TextArea
            id="field-notes"
            label="Anything we should know?"
            optional
            hint="Worries, a tooth that's bothering you, or what's helped at other visits."
            rows={4}
            value={values.notes}
            onChange={(e) => set("notes", e.target.value)}
            count={{ value: values.notes.length, max: NOTES_MAX }}
            error={errors.notes}
            className="mt-8"
          />

          <Checkbox
            className="mt-6"
            label="Text me a reminder the day before"
            checked={values.reminders}
            onChange={(v) => set("reminders", v)}
          />
        </section>

        <div className="mt-6 lg:hidden">
          <Summary values={values} />
        </div>

        <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
          <button type="submit" className={buttonClass("primary", "min-w-52 text-[1.125rem]")} disabled={status === "sending"} aria-live="polite">
            {status === "sending" ? (
              <>
                <span className="size-5 animate-spin rounded-full border-[3px] border-white/40 border-t-white" aria-hidden="true" />
                Sending
              </>
            ) : (
              "Send request"
            )}
          </button>
          <p id="form-note" className="max-w-[28rem] text-small text-ink-soft">
            Nothing is booked until we talk. We call within one business hour to confirm.
          </p>
        </div>
        {chosen && <span className="sr-only" aria-live="polite">{`${chosen.name} selected, from ${formatPrice(chosen.priceFrom)}.`}</span>}
      </form>

      <aside aria-label="Your request" className="hidden lg:block">
        <div className="sticky top-28">
          <Summary values={values} />
        </div>
      </aside>
    </div>
  );
}

function StepHeading({ id, n, children }: { id: string; n: number; children: ReactNode }) {
  return (
    <h2 id={id} className="flex items-center gap-3.5 text-h3">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-seaglass font-display text-[1.0625rem] font-semibold text-tide">
        {n}
      </span>
      {children}
    </h2>
  );
}

function Summary({ values }: { values: Values }) {
  const service = values.service && values.service !== NOT_SURE ? getService(values.service) : undefined;
  const name = serviceName(values.service);
  const when = values.flexible
    ? "First opening that fits"
    : values.date && values.time
      ? `${formatLongDay(values.date)}, ${formatTime(values.time)}`
      : values.date
        ? `${formatLongDay(values.date)}: pick a time`
        : undefined;
  const who = [values.firstName, values.lastName].filter(Boolean).join(" ");
  const rows: Array<{ label: string; value?: string; strong?: boolean }> = [
    { label: "Visit", value: name },
    { label: "When", value: when },
    { label: "How long it takes", value: service?.duration },
    { label: "For", value: who || undefined },
  ];
  return (
    <div className="rounded-pebble bg-white p-7 shadow-soft">
      <p className="font-display text-[1.25rem] font-semibold">Your request</p>
      <dl className="mt-5 divide-y divide-line">
        {rows.map((r) => (
          <div key={r.label} className="py-3">
            <dt className="text-small text-ink-soft">{r.label}</dt>
            <dd
              key={r.value ?? "none"}
              className={cn("-mx-2 mt-0.5 rounded-md px-2 py-0.5", r.value ? "flash font-display text-[1.0625rem] font-semibold" : "text-ink-faint")}
            >
              {r.value ?? "Not chosen yet"}
            </dd>
          </div>
        ))}
      </dl>
      {service && (
        <div className="mt-4 rounded-card bg-foam p-4">
          <p className="flex items-baseline justify-between gap-4">
            <span className="text-small text-ink-soft">Self-pay from</span>
            <span className="font-display text-[1.5rem] font-semibold">{formatPrice(service.priceFrom)}</span>
          </p>
          <p className="mt-1 text-tiny text-ink-soft">{service.insurance}</p>
        </div>
      )}
      <ul className="mt-6 space-y-3 border-t border-line pt-6 text-small text-ink-soft">
        <li className="flex gap-2.5">
          <Icon name="phone" size={18} className="mt-0.5 shrink-0 text-tide" />
          We call to confirm within one business hour.
        </li>
        <li className="flex gap-2.5">
          <Icon name="file" size={18} className="mt-0.5 shrink-0 text-tide" />
          Your forms arrive by text, no clipboard.
        </li>
        <li className="flex gap-2.5">
          <Icon name="hand" size={18} className="mt-0.5 shrink-0 text-tide" />
          Change your mind anytime, no charge.
        </li>
      </ul>
    </div>
  );
}

function Confirmation({ data, headingRef }: { data: BookingInput; headingRef: RefObject<HTMLHeadingElement | null> }) {
  const service = data.service !== NOT_SURE ? getService(data.service) : undefined;
  const when =
    data.flexible || !data.date || !data.time ? "The first opening that fits" : `${formatLongDay(data.date)} at ${formatTime(data.time)}`;

  function downloadIcs() {
    if (!data.date || !data.time) return;
    const ics = bookingIcs({
      date: data.date,
      time: data.time,
      minutes: service?.minutes ?? 60,
      title: `${service?.name ?? "Dental visit"} at Hushwell Dental`,
      location: `${CONTACT.street}, ${CONTACT.town}`,
    });
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "hushwell-visit.ics";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className="mx-auto max-w-[44rem]">
      <div className="rounded-pebble bg-white p-8 text-center shadow-lift sm:p-12">
        <div className="relative mx-auto size-20">
          <span aria-hidden="true" className="rings absolute -inset-10">
            {[0, 1, 2].map((n) => (
              <span key={n} className="absolute inset-0 rounded-full border-2 border-tide/25" style={{ "--n": n } as CSSProperties} />
            ))}
          </span>
        <svg viewBox="0 0 64 64" className="relative size-20" aria-hidden="true">
          <circle cx="32" cy="32" r="30" className="fill-seaglass" />
          <path d="M20 33.5l8 8 16-17" fill="none" stroke="var(--color-tide)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" className="check-draw" />
        </svg>
        </div>
        <h2 ref={headingRef} tabIndex={-1} className="mt-6 text-h2 focus:outline-none">
          Request sent. Thanks, {data.firstName}.
        </h2>
        <p className="mx-auto mt-4 max-w-[34rem] text-lead text-ink-soft">
          Sam will call you within one business hour to confirm. Nothing is booked until you&apos;ve talked.
        </p>
        <dl className="mx-auto mt-8 max-w-[30rem] divide-y divide-line rounded-card border border-line text-left">
          <div className="flex justify-between gap-4 px-5 py-3.5">
            <dt className="text-ink-soft">Visit</dt>
            <dd className="text-right font-bold">{serviceName(data.service)}</dd>
          </div>
          <div className="flex justify-between gap-4 px-5 py-3.5">
            <dt className="text-ink-soft">Requested time</dt>
            <dd className="text-right font-bold">{when}</dd>
          </div>
          <div className="flex justify-between gap-4 px-5 py-3.5">
            <dt className="text-ink-soft">Paying with</dt>
            <dd className="text-right font-bold">{COVERAGE_SHORT[data.coverage]}</dd>
          </div>
        </dl>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          {data.date && data.time && !data.flexible && (
            <button type="button" onClick={downloadIcs} className={buttonClass("primary")}>
              <Icon name="calendar" size={20} />
              Add to calendar
            </button>
          )}
          <Link href="/" className={buttonClass("secondary")}>
            Back to home
          </Link>
        </div>
      </div>
      <ol className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { title: "We call you", body: "To confirm the time and answer any questions." },
          { title: "Forms by text", body: "A short link, so there's nothing to fill in when you arrive." },
          { title: "Come in and relax", body: "Headphones, a blanket and a stop signal are waiting." },
        ].map((s, i) => (
          <li key={s.title} className="rounded-panel border border-line bg-white p-6">
            <span className="font-display text-[1.75rem] leading-none font-semibold text-tide">{i + 1}</span>
            <p className="mt-3 font-bold">{s.title}</p>
            <p className="mt-1 text-small text-ink-soft">{s.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

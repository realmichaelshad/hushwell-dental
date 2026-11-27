"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import * as z from "zod/mini";
import { buttonClass } from "@/components/ui/Button";
import { TextArea, TextField } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { emailField, fakeLatency, requiredText, validate } from "@/lib/forms";

/* ==========================================================================
   A short message form for anything that isn't a booking. Same rules as the
   booking form: check on submit, re-check while fixing, nothing is sent.
   ========================================================================== */

const MESSAGE_MAX = 800;

export const contactSchema = z.object({
  name: requiredText("Enter your name, so we know who to reply to.", 80),
  email: emailField,
  message: z
    .string()
    .check(
      z.trim(),
      z.minLength(1, "Write a short message. A sentence is plenty."),
      z.maxLength(MESSAGE_MAX, "Keep the message under 800 characters."),
    ),
});

type Values = { name: string; email: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;

export function ContactForm() {
  const [values, setValues] = useState<Values>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const doneRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!attempted) return;
    const r = validate(contactSchema, values);
    setErrors(r.ok ? {} : r.errors);
  }, [values, attempted]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAttempted(true);
    const r = validate(contactSchema, values);
    if (!r.ok) {
      setErrors(r.errors);
      const first = (["name", "email", "message"] as const).find((k) => r.errors[k]);
      if (first) document.getElementById(`contact-${first}`)?.focus();
      return;
    }
    setStatus("sending");
    await fakeLatency(700);
    setStatus("sent");
    requestAnimationFrame(() => doneRef.current?.focus());
  }

  if (status === "sent") {
    return (
      <div className="rounded-pebble bg-white p-8 shadow-soft sm:p-10">
        <span className="grid size-14 place-items-center rounded-full bg-seaglass text-tide">
          <Icon name="check" size={28} strokeWidth={2.5} />
        </span>
        <p ref={doneRef} tabIndex={-1} className="mt-5 font-display text-h3 font-semibold focus:outline-none">
          Message sent. Thanks, {values.name.trim().split(" ")[0]}.
        </p>
        <p className="mt-2 text-ink-soft">We reply within one business day, usually much sooner.</p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="rounded-pebble bg-white p-7 shadow-soft sm:p-10">
      <h2 className="text-h3">Send us a message</h2>
      <p className="mt-2 text-ink-soft">For questions that aren&apos;t urgent. For pain or swelling, please call.</p>
      <div className="mt-7 space-y-6">
        <TextField
          id="contact-name"
          label="Name"
          autoComplete="name"
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          error={errors.name}
        />
        <TextField
          id="contact-email"
          label="Email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          error={errors.email}
        />
        <TextArea
          id="contact-message"
          label="Message"
          rows={5}
          value={values.message}
          onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
          count={{ value: values.message.length, max: MESSAGE_MAX }}
          error={errors.message}
        />
      </div>
      <button type="submit" className={buttonClass("primary", "mt-8")} disabled={status === "sending"}>
        {status === "sending" ? (
          <>
            <span className="size-5 animate-spin rounded-full border-[3px] border-white/40 border-t-white" aria-hidden="true" />
            Sending
          </>
        ) : (
          "Send message"
        )}
      </button>
    </form>
  );
}

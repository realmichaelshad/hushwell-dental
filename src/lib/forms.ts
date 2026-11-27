import * as z from "zod/mini";

/* ==========================================================================
   Shared form validation on zod/mini (the tree-shakable build). Messages
   are written for people: say what's wrong and how to fix it. Forms check
   on submit, then re-check a field as it changes once it has shown an
   error. Nothing is ever sent over the network in this concept.
   ========================================================================== */

const EMAIL = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)*\.[A-Za-z]{2,}$/;

/** A required, trimmed string with a friendly empty-field message. */
export function requiredText(message: string, max = 120) {
  return z.string().check(z.trim(), z.minLength(1, message), z.maxLength(max, `Keep it under ${max} characters.`));
}

export const emailField = z
  .string()
  .check(
    z.trim(),
    z.minLength(1, "Enter your email address."),
    z.maxLength(254, "That email address is too long."),
    z.regex(EMAIL, "That doesn't look like an email address. Check for a missing @ or dot."),
  );

/** US numbers: 10 digits, or 11 starting with 1. Spaces, dashes, dots and brackets are fine. */
export function isUsPhone(value: string): boolean {
  if (!/^\+?[\d\s().-]+$/.test(value)) return false;
  const digits = value.replace(/\D/g, "");
  return digits.length === 10 || (digits.length === 11 && digits.startsWith("1"));
}

export const phoneField = z
  .string()
  .check(
    z.trim(),
    z.minLength(1, "Enter a phone number so we can confirm your time."),
    z.refine(isUsPhone, "Enter a 10-digit phone number, like 555 010 0000."),
  );

export type FieldErrors<T> = Partial<Record<keyof T & string, string>>;

/** Validates `data`; returns the parsed value or the first message per field. */
export function validate<S extends z.ZodMiniType>(
  schema: S,
  data: unknown,
): { ok: true; data: z.infer<S> } | { ok: false; errors: FieldErrors<z.infer<S>> } {
  const result = schema.safeParse(data);
  if (result.success) return { ok: true, data: result.data as z.infer<S> };
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!errors[key]) errors[key] = issue.message;
  }
  return { ok: false, errors: errors as FieldErrors<z.infer<S>> };
}

/** Resolves after `ms`, so a local submit feels considered (there is no network). */
export function fakeLatency(ms = 900): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

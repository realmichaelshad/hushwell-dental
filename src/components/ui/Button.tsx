import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

/* ==========================================================================
   Buttons. One primary action per view (tide), a quiet outline for the
   secondary, and a plain text style. Pill-shaped, 48px tall, so every
   target is comfortably tappable.
   ========================================================================== */

export type ButtonVariant = "primary" | "secondary" | "quiet" | "light";

const BASE =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-[1.0625rem] font-bold leading-none transition-[background-color,color,box-shadow,border-color] duration-200 ease-[var(--ease-calm)] disabled:cursor-not-allowed disabled:opacity-60";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-tide text-white shadow-soft hover:bg-tide-deep",
  secondary: "border-2 border-tide/30 bg-white text-tide hover:border-tide hover:bg-foam",
  quiet: "px-2 text-tide underline decoration-tide/30 decoration-2 underline-offset-[0.3em] hover:decoration-tide",
  light: "bg-white text-ink hover:bg-seaglass",
};

export function buttonClass(variant: ButtonVariant = "primary", className?: string) {
  return cn(BASE, VARIANTS[variant], className);
}

interface ButtonLinkProps extends Omit<ComponentProps<typeof Link>, "className"> {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
}

export function ButtonLink({ variant = "primary", className, children, ...rest }: ButtonLinkProps) {
  return (
    <Link className={buttonClass(variant, className)} data-ripple {...rest}>
      {children}
    </Link>
  );
}

interface ButtonProps extends ComponentProps<"button"> {
  variant?: ButtonVariant;
}

export function Button({ variant = "primary", className, type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={buttonClass(variant, className)} data-ripple {...rest} />;
}

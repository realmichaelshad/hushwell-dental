import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Words } from "@/components/motion/Words";
import { cn } from "@/lib/cn";

/* ==========================================================================
   The top of every inner page: a breadcrumb trail, the h1 and one lead
   paragraph, with optional actions and an optional aside on the right.
   ========================================================================== */

export interface Crumb {
  href: string;
  label: string;
}

export function Breadcrumbs({ trail, current }: { trail: Crumb[]; current: string }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-small text-ink-soft">
        {trail.map((c) => (
          <li key={c.href} className="flex items-center gap-2">
            <Link href={c.href} className="underline decoration-line-strong/50 underline-offset-4 hover:text-tide hover:decoration-tide">
              {c.label}
            </Link>
            <span aria-hidden="true" className="text-line-strong">
              /
            </span>
          </li>
        ))}
        <li aria-current="page" className="font-bold text-ink">
          {current}
        </li>
      </ol>
    </nav>
  );
}

export function PageIntro({
  title,
  lead,
  trail = [{ href: "/", label: "Home" }],
  current,
  actions,
  aside,
  className,
}: {
  title: ReactNode;
  lead?: ReactNode;
  trail?: Crumb[];
  current: string;
  actions?: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("container-page pt-8 pb-14 lg:pt-12 lg:pb-20", className)}>
      <Breadcrumbs trail={trail} current={current} />
      <div className={cn("mt-8 grid gap-10", Boolean(aside) && "lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16")}>
        <div>
          <h1 className="words-enter max-w-[18ch] text-h1">{typeof title === "string" ? <Words text={title} /> : title}</h1>
          {lead && (
            <p className="enter mt-5 max-w-[40rem] text-lead text-ink-soft" style={{ "--delay": "250ms" } as CSSProperties}>
              {lead}
            </p>
          )}
          {actions && (
            <div className="enter mt-8 flex flex-wrap items-center gap-3" style={{ "--delay": "350ms" } as CSSProperties}>
              {actions}
            </div>
          )}
        </div>
        {aside && (
          <div className="card-enter" style={{ "--delay": "200ms" } as CSSProperties}>
            {aside}
          </div>
        )}
      </div>
    </section>
  );
}

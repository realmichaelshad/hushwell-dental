import type { ReactNode } from "react";
import { Words, rv } from "@/components/motion/Words";
import { cn } from "@/lib/cn";

/**
 * A section's h2 and its one-paragraph intro, left-aligned, with an optional action on the right.
 * A plain-string title rises in word by word as it scrolls into view; the intro and action follow.
 */
export function SectionHeader({
  id,
  title,
  intro,
  action,
  className,
}: {
  id?: string;
  title: ReactNode;
  intro?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-x-10 gap-y-6", className)}>
      <div className="max-w-[44rem]">
        <h2 id={id} className="text-h2" {...(typeof title === "string" ? rv("words") : {})}>
          {typeof title === "string" ? <Words text={title} /> : title}
        </h2>
        {intro && (
          <p className="mt-4 text-lead text-ink-soft" {...rv("up", 2)}>
            {intro}
          </p>
        )}
      </div>
      {action && <div {...rv("up", 3)}>{action}</div>}
    </div>
  );
}

/** An h2 that rises in word by word. */
export function RevealHeading({ id, text, className }: { id?: string; text: string; className?: string }) {
  return (
    <h2 id={id} className={cn("text-h2", className)} {...rv("words")}>
      <Words text={text} />
    </h2>
  );
}

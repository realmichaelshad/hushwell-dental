import type { CSSProperties } from "react";
import { Photo } from "@/components/photo/Photo";
import type { PhotoSlot } from "@/content/photos";
import { FIRST_VISIT } from "@/content/visit";

/* ==========================================================================
   The sticky stage beside the first-visit timeline: one photo per step,
   crossfading as the reader reaches each step, with a 60-minute dial that
   fills as the hour goes by. Driven by TimelineProgress through the parent
   [data-visit] section (data-active, --visit-progress, [data-visit-minute]).
   The section starts on data-active="0" in the markup, so without scripts
   the first photo shows.
   The class lists below are written out in full so Tailwind generates them.
   ========================================================================== */

export const STAGE_PHOTOS: PhotoSlot[] = [
  "welcome-desk",
  "hero-room",
  "first-visit",
  "comfort-kit",
  "scan-review",
  "treatment-room",
  "smile",
];

const SHOW = [
  "group-data-[active=0]/visit:opacity-100",
  "group-data-[active=1]/visit:opacity-100",
  "group-data-[active=2]/visit:opacity-100",
  "group-data-[active=3]/visit:opacity-100",
  "group-data-[active=4]/visit:opacity-100",
  "group-data-[active=5]/visit:opacity-100",
  "group-data-[active=6]/visit:opacity-100",
];

const R = 26;
const CIRCUMFERENCE = 2 * Math.PI * R;

export function VisitStage({ className }: { className?: string }) {
  return (
    <div className={`relative aspect-[4/5] max-h-[34rem] w-full overflow-hidden rounded-pebble bg-seaglass ${className ?? ""}`}>
      {STAGE_PHOTOS.map((slot, i) => (
        <div
          key={slot}
          aria-hidden={i > 0 || undefined}
          className={`absolute inset-0 opacity-0 transition-opacity duration-700 ease-[var(--ease-out-expo)] motion-reduce:transition-none ${SHOW[i]}`}
        >
          <Photo slot={slot} fill sizes="(min-width: 64rem) 30rem, 100vw" alt={i === 0 ? undefined : ""} />
        </div>
      ))}

      <div
        aria-hidden="true"
        className="absolute right-4 bottom-4 left-4 flex items-center gap-4 rounded-panel bg-white/95 p-3.5 pr-5 shadow-lift backdrop-blur"
      >
        <svg viewBox="0 0 64 64" className="size-16 shrink-0 -rotate-90" aria-hidden="true">
          <circle cx="32" cy="32" r={R} fill="none" stroke="var(--color-seaglass)" strokeWidth="7" />
          <circle
            cx="32"
            cy="32"
            r={R}
            fill="none"
            stroke="var(--color-tide)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            className="transition-[stroke-dashoffset] duration-700 ease-[var(--ease-out-expo)] motion-reduce:transition-none"
            style={{ strokeDashoffset: `calc(${CIRCUMFERENCE.toFixed(2)} * (1 - var(--visit-progress, 0)))` } as CSSProperties}
          />
        </svg>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[1.375rem] leading-none font-semibold">
            <span data-visit-minute>0</span>
            <span className="text-ink-soft"> of 60 min</span>
          </p>
          <div className="relative mt-1.5 h-6">
            {FIRST_VISIT.map((step, i) => (
              <p
                key={step.minute}
                aria-hidden="true"
                className={`absolute inset-0 truncate text-small font-bold text-ink-soft opacity-0 transition-opacity duration-500 motion-reduce:transition-none ${SHOW[i]}`}
              >
                {step.title}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

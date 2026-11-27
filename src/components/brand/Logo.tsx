import { useId } from "react";
import { cn } from "@/lib/cn";

/* ==========================================================================
   Hushwell logo: a tooth resting in still water. One gentle waterline runs
   across it; below the line the tooth takes a lighter tint. Set beside the
   wordmark in Albert Sans. Two filled shapes and one stroke, so it holds up
   at favicon size.
   ========================================================================== */

export const TOOTH_PATH =
  "M12 4C7 4 4.5 8 4.5 13c0 4 1.5 6.5 2.5 9.5s1.3 6.5 2 9.5c.6 3 1.8 5 3.6 5 2.4 0 2.9-3 3.4-6s1.4-5 4-5 3.5 2 4 5 1 6 3.4 6c1.8 0 3-2 3.6-5 .7-3 1-6.5 2-9.5s2.5-5.5 2.5-9.5c0-5-2.5-9-7.5-9-3 0-4.6 1.6-8 1.6S15 4 12 4Z";
/** The waterline, and the water below it (clipped to the tooth). */
export const WAVE_PATH = "M2 20.5c3-2 6-2 9 0s6 2 9 0 6-2 9 0 6 2 9 0";
export const WATER_PATH = "M2 20.5c3-2 6-2 9 0s6 2 9 0 6-2 9 0 6 2 9 0V40H2Z";

export function LogoMark({
  className,
  color = "var(--color-tide)",
  waterColor = "#5fa99d",
  waveColor = "var(--color-white)",
}: {
  className?: string;
  color?: string;
  waterColor?: string;
  waveColor?: string;
}) {
  const clip = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={`tooth-${clip}`}>
          <path d={TOOTH_PATH} />
        </clipPath>
      </defs>
      <path d={TOOTH_PATH} fill={color} />
      <g clipPath={`url(#tooth-${clip})`}>
        <g className="logo-water">
          <path d={WATER_PATH} fill={waterColor} />
          <path d={WAVE_PATH} fill="none" stroke={waveColor} strokeWidth={2.2} strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}

export function Logo({
  className,
  tone = "dark",
  showDental = true,
}: {
  className?: string;
  tone?: "dark" | "light";
  showDental?: boolean;
}) {
  const light = tone === "light";
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark
        className="h-[1.9em] w-auto shrink-0"
        color={light ? "var(--color-white)" : "var(--color-tide)"}
        waterColor={light ? "var(--color-tide-light)" : "#5fa99d"}
        waveColor={light ? "var(--color-ink)" : "var(--color-white)"}
      />
      <span className={cn("font-display leading-none tracking-[-0.03em] whitespace-nowrap", light ? "text-white" : "text-ink")}>
        <span className="font-bold">Hushwell</span>
        {showDental && (
          <>
            {" "}
            <span className={cn("font-normal", light ? "text-tide-light" : "text-ink-soft")}>Dental</span>
          </>
        )}
      </span>
    </span>
  );
}

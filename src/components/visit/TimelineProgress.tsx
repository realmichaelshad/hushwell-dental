"use client";

import { useEffect, useRef, type ReactNode } from "react";

/* ==========================================================================
   Follows the reader down the first-visit timeline:
   - fills the line (--progress) and marks each step reached;
   - tells the surrounding [data-visit] section which step is active
     (data-active), so the sticky photo stage beside it can crossfade, and
     sets the dial (--visit-progress, [data-visit-minute], [data-visit-title]).
   Without JavaScript or with reduced motion, the line is full, every step is
   reached and the stage keeps its first photo. Screenshots (showcase) show a
   finished line with the stage on a fixed, representative step.
   ========================================================================== */

const SHOWCASE_STEP = 2;

export function TimelineProgress({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const stage = root.closest<HTMLElement>("[data-visit]");
    const steps = Array.from(root.querySelectorAll<HTMLElement>("[data-step]"));
    const minuteEl = stage?.querySelector<HTMLElement>("[data-visit-minute]");

    const setStage = (index: number, progress: number) => {
      if (!stage) return;
      stage.dataset.active = String(index);
      stage.style.setProperty("--visit-progress", progress.toFixed(4));
      const minute = steps[index]?.dataset.minute ?? "0";
      if (minuteEl && minuteEl.textContent !== minute) minuteEl.textContent = minute;
    };

    if (document.documentElement.dataset.showcase) {
      const step = steps[SHOWCASE_STEP];
      setStage(SHOWCASE_STEP, Number(step?.dataset.minute ?? 0) / 60);
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      const reading = window.innerHeight * 0.62;
      const progress = Math.min(1, Math.max(0, (reading - rect.top) / rect.height));
      let active = 0;
      steps.forEach((step, i) => {
        const reached = step.getBoundingClientRect().top < reading;
        if (reached) active = i;
        if (!reduced) step.dataset.reached = reached ? "true" : "false";
      });
      if (!reduced) root.style.setProperty("--progress", progress.toFixed(4));
      setStage(active, Number(steps[active]?.dataset.minute ?? 0) / 60);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      root.style.removeProperty("--progress");
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      {children}
    </div>
  );
}

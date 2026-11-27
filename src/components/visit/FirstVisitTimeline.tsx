import { FIRST_VISIT } from "@/content/visit";
import { TimelineProgress } from "./TimelineProgress";

/* ==========================================================================
   The hour of a first visit, as an ordered list. A real sequence, so it is
   numbered by the minute it starts.
   ========================================================================== */

export function FirstVisitTimeline() {
  return (
    <TimelineProgress>
      <div aria-hidden="true" className="absolute top-3 bottom-3 left-[1.6875rem] w-[3px] rounded-full bg-line" />
      <div
        aria-hidden="true"
        className="timeline-fill absolute top-3 bottom-3 left-[1.6875rem] w-[3px] rounded-full bg-tide"
      />
      <ol className="relative space-y-2">
        {FIRST_VISIT.map((step) => (
          <li key={step.minute} data-step data-minute={step.minute} className="group/step grid grid-cols-[3.5rem_1fr] gap-5 py-3 sm:gap-7">
            <span className="step-dot relative z-10 grid size-14 place-items-center rounded-full border-[3px] border-tide bg-white text-center leading-none font-bold text-tide transition-colors duration-500 group-data-[reached=false]/step:border-line group-data-[reached=false]/step:text-ink-faint">
              <span className="font-display">
                <span className="block text-[1.125rem] font-semibold">{step.minute}</span>
                <span className="block text-[0.6875rem] font-semibold">min</span>
              </span>
            </span>
            <div className="step-body pt-2 pb-4">
              <h3 className="text-h3">{step.title}</h3>
              <p className="mt-2 max-w-[44ch] text-ink-soft">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </TimelineProgress>
  );
}

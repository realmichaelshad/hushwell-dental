import type { Faq } from "@/content/services";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

/* ==========================================================================
   FAQ list built on <details>/<summary>: keyboard and screen-reader
   friendly with no JavaScript, and each answer can be opened on its own.
   ========================================================================== */

export function Accordion({ items, className }: { items: Faq[]; className?: string }) {
  return (
    <div className={cn("divide-y divide-line rounded-panel border border-line bg-white", className)}>
      {items.map((item) => (
        <details key={item.q} className="group">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 px-5 py-4 text-left font-display text-[1.1875rem] font-semibold sm:px-7 [&::-webkit-details-marker]:hidden">
            <span>{item.q}</span>
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-foam text-tide transition-transform duration-300 group-open:rotate-180">
              <Icon name="chevron" size={20} />
            </span>
          </summary>
          <p className="max-w-[62ch] px-5 pb-6 text-ink-soft sm:px-7">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

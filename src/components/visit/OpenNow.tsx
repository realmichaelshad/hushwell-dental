"use client";

import { useEffect, useState } from "react";
import { openStatus, type OpenStatus } from "@/lib/availability";
import { cn } from "@/lib/cn";

/* ==========================================================================
   "Open now until 7 pm", worked out from the visitor's clock. Rendered after
   mount (the server can't know the time where the visitor is) and refreshed
   every minute. The dot breathes once on open, then stays still.
   ========================================================================== */

export function OpenNow({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const [status, setStatus] = useState<OpenStatus | null>(null);

  useEffect(() => {
    const tick = () => setStatus(openStatus(new Date()));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className={cn("inline-flex min-h-6 items-center gap-2", className)} aria-live="polite">
      {status && (
        <>
          <span
            aria-hidden="true"
            className={cn(
              "relative inline-block size-2.5 rounded-full",
              status.open ? "bg-[#2f9e6e]" : tone === "light" ? "bg-white/50" : "bg-ink-faint",
            )}
          >
            {status.open && <span className="open-pulse absolute inset-0 rounded-full bg-[#2f9e6e]" />}
          </span>
          <span>{status.label}</span>
        </>
      )}
    </span>
  );
}

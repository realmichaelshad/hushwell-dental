"use client";

import { useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";

/** Shows a motion sample and replays it on demand by remounting its contents (the CSS animations start over). */
export function Replay({ label, children }: { label: string; children: ReactNode }) {
  const [run, setRun] = useState(0);
  return (
    <div className="flex h-full flex-col">
      <div key={run} className="flex-1">
        {children}
      </div>
      <button
        type="button"
        onClick={() => setRun((n) => n + 1)}
        className="mt-5 inline-flex min-h-11 items-center gap-2 self-start rounded-full border-2 border-tide/30 bg-white px-4 text-small font-bold text-tide hover:border-tide"
        data-ripple
      >
        <Icon name="sparkle" size={17} />
        Replay {label}
      </button>
    </div>
  );
}

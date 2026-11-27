"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import {
  addDays,
  bookableTimes,
  formatDay,
  formatLongDay,
  formatTime,
  isoDate,
  upcomingOpenDays,
} from "@/lib/availability";

/* ==========================================================================
   The hero's booking card: the soonest day with open times, its first three
   times as chips (each opens the request form with that day and time
   chosen), and how many more times are open this week. Worked out on the
   visitor's clock after mount; until then quiet placeholders hold the size.
   ========================================================================== */

interface Openings {
  date: string;
  dayLabel: string;
  dateLabel: string;
  times: string[];
  moreThisWeek: number;
}

function findOpenings(now: Date): Openings | null {
  const days = upcomingOpenDays(now, 14);
  const first = days.find((d) => bookableTimes(d, now).length >= 3) ?? days.find((d) => bookableTimes(d, now).length > 0);
  if (!first) return null;
  const date = isoDate(first);
  const times = bookableTimes(first, now).slice(0, 3);
  const weekEnd = isoDate(addDays(now, 7));
  const total = days.filter((d) => isoDate(d) < weekEnd).reduce((sum, d) => sum + bookableTimes(d, now).length, 0);
  const label = formatDay(date, now);
  const long = formatLongDay(date);
  const relative = label === "Today" || label === "Tomorrow";
  return {
    date,
    dayLabel: relative ? label : long.split(",")[0]!,
    dateLabel: relative ? long : long.split(", ")[1]!,
    times,
    moreThisWeek: Math.max(0, total - times.length),
  };
}

export function NextOpenings() {
  const [openings, setOpenings] = useState<Openings | null | undefined>(undefined);

  useEffect(() => {
    setOpenings(findOpenings(new Date()));
  }, []);

  return (
    <div className="rounded-panel bg-white p-5 shadow-lift sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <p className="font-display text-[1.125rem] font-semibold">Next openings</p>
        <span className="inline-flex items-center gap-2 text-tiny font-bold text-ink-soft">
          <span aria-hidden="true" className="relative inline-block size-2 rounded-full bg-[#2f9e6e]">
            <span className="open-pulse absolute inset-0 rounded-full bg-[#2f9e6e]" />
          </span>
          Live times
        </span>
      </div>

      {openings ? (
        <>
          <p className="mt-4">
            <span className="font-display text-[1.0625rem] font-semibold">{openings.dayLabel}</span>
            <span className="text-small text-ink-soft"> {openings.dateLabel}</span>
          </p>
          <ul className="mt-2.5 grid grid-cols-3 gap-2">
            {openings.times.map((time, i) => (
              <li key={time} className="enter" style={{ "--delay": `${i * 60}ms` } as CSSProperties}>
                <Link
                  href={`/book?date=${openings.date}&time=${time}`}
                  data-ripple
                  aria-label={`${openings.dayLabel} at ${formatTime(time)}`}
                  className="flex min-h-12 items-center justify-center rounded-full border-2 border-line font-display text-[1.0625rem] font-semibold text-ink transition-[border-color,background-color,color] duration-200 hover:border-tide hover:bg-tide hover:text-white"
                >
                  {formatTime(time)}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4 text-small">
            <span className="text-ink-soft">
              {openings.moreThisWeek > 0 ? `${openings.moreThisWeek} more times this week` : "More times next week"}
            </span>
            <Link
              href="/book"
              className="font-bold text-tide underline decoration-tide/30 decoration-2 underline-offset-4 hover:decoration-tide"
            >
              See all times
            </Link>
          </div>
        </>
      ) : (
        <div aria-hidden="true">
          <span className="mt-4 block h-4 w-40 rounded-full bg-foam" />
          <span className="mt-3 grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-12 rounded-full bg-foam" />
            ))}
          </span>
          <span className="mt-4 block h-px bg-line" />
          <span className="mt-4 block h-4 w-48 rounded-full bg-foam" />
        </div>
      )}
    </div>
  );
}

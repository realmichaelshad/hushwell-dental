"use client";

import { useEffect, useState } from "react";
import { HOURS } from "@/content/site";
import { cn } from "@/lib/cn";

/** Opening hours, with today's row tinted once the visitor's day is known. */
export function HoursTable({ className }: { className?: string }) {
  const [today, setToday] = useState<number | null>(null);
  useEffect(() => setToday((new Date().getDay() + 6) % 7), []);
  return (
    <table className={cn("w-full text-left", className)}>
      <caption className="sr-only">Opening hours</caption>
      <tbody>
        {HOURS.map((d, i) => {
          const isToday = i === today;
          return (
            <tr key={d.day} className={cn("transition-colors duration-500", isToday ? "bg-foam" : "border-t border-line first:border-t-0")}>
              <th scope="row" className={cn("py-2.5 pl-3 font-normal", isToday ? "rounded-l-md font-bold text-ink" : "text-ink-soft")}>
                {d.day}
                {isToday && <span className="ml-2 text-tiny font-bold text-tide">Today</span>}
              </th>
              <td className={cn("py-2.5 pr-3 text-right font-bold", isToday && "rounded-r-md")}>
                {d.open ? `${d.open} to ${d.close}` : "Closed"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

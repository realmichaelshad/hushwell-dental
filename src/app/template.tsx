"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

/* ==========================================================================
   Re-mounts on every navigation. After the first page, each new page eases
   up into place (.page-in). The first page load is left alone so nothing
   delays the first paint.
   ========================================================================== */

let firstMount = true;

export default function Template({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (firstMount) {
      firstMount = false;
      return;
    }
    ref.current?.classList.add("page-in");
  }, []);
  return <div ref={ref}>{children}</div>;
}

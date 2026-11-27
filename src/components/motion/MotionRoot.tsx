"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/* ==========================================================================
   The site's motion engine, rendered once in the root layout. Everything is
   declared in markup and driven by CSS (globals.css, "Motion"); this file
   only decides when:

   - [data-reveal]   gets data-in once it scrolls into view (words, up,
                     fade, clip, scale). Siblings stagger through --i.
   - [data-count]    counts up to its value as it enters ("$1,150").
   - [data-parallax] drifts against the scroll by its factor.
   - [data-tilt]     leans toward the pointer, with a light sheen.
   - [data-ripple]   sends a ripple out from where it was pressed.
   - smooth scroll   (Lenis) starts once the page has loaded and gone idle.

   html.motion-ok is set before first paint by the inline script in the
   layout (MOTION_BOOT in src/lib/motion-boot.ts) unless the visitor prefers reduced motion; then none
   of this runs and every element is simply shown. If this component never
   mounts, the boot script removes motion-ok after a few seconds, so content
   can't stay hidden.
   ========================================================================== */


const EASE_OUT = (t: number) => 1 - Math.pow(1 - t, 4);

function formatCount(value: number, template: string): string {
  const prefix = template.match(/^[^\d]*/)?.[0] ?? "";
  return `${prefix}${Math.round(value).toLocaleString("en-US")}`;
}

function countUp(el: HTMLElement) {
  // A counter can be reached twice (its own observer and its revealed section): run it once.
  if (el.dataset.counted) return;
  el.dataset.counted = "true";
  const target = Number(el.dataset.count);
  const final = el.textContent ?? "";
  if (!Number.isFinite(target)) return;
  const duration = Math.min(1600, 700 + Math.log10(Math.max(target, 10)) * 220);
  const start = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    el.textContent = t < 1 ? formatCount(target * EASE_OUT(t), final) : final;
    if (t < 1) requestAnimationFrame(step);
  };
  el.textContent = formatCount(0, final);
  requestAnimationFrame(step);
}

export function MotionRoot() {
  const pathname = usePathname();

  // Smooth scroll, once per visit.
  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("motion-ok") || html.dataset.showcase) return;
    let lenis: { destroy(): void; scrollTo(target: number | HTMLElement, opts?: object): void } | null = null;
    let cancelled = false;
    const start = () =>
      import("lenis").then(({ default: Lenis }) => {
        if (cancelled) return;
        lenis = new Lenis({ autoRaf: true, lerp: 0.12, wheelMultiplier: 1, anchors: { offset: -96 } });
      });
    const idle = (cb: () => void) => {
      if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(cb, { timeout: 2000 });
      else setTimeout(cb, 600);
    };
    const onLoad = () => idle(start);
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", onLoad);
      lenis?.destroy();
    };
  }, []);

  // Reveals, counters, parallax, tilt and ripples for the current page.
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("motion-ready");
    if (!html.classList.contains("motion-ok")) return;
    const showcase = Boolean(html.dataset.showcase);

    // Reveal on enter.
    const reveal = (el: Element) => {
      (el as HTMLElement).dataset.in = "true";
      el.querySelectorAll<HTMLElement>("[data-count]").forEach((c) => !showcase && countUp(c));
      if ((el as HTMLElement).dataset.count !== undefined && !showcase) countUp(el as HTMLElement);
    };
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-in]), [data-count]:not([data-reveal])"));
    let io: IntersectionObserver | null = null;
    if (showcase) {
      targets.forEach(reveal);
    } else {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            reveal(entry.target);
            io?.unobserve(entry.target);
          }
        },
        { rootMargin: "0px 0px -4% 0px", threshold: 0 },
      );
      targets.forEach((t) => io!.observe(t));
    }

    // Parallax.
    const drifting = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    let frame = 0;
    const drift = () => {
      frame = 0;
      const vh = window.innerHeight;
      for (const el of drifting) {
        const box = el.parentElement?.getBoundingClientRect();
        if (!box || box.bottom < -vh * 0.2 || box.top > vh * 1.2) continue;
        const factor = Number(el.dataset.parallax) || 0.1;
        const offset = (box.top + box.height / 2 - vh / 2) * -factor;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0) scale(1.12)`;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(drift);
    };
    if (drifting.length && !showcase) {
      drift();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
    }

    // Tilt toward the pointer (fine pointers only).
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const tilters = fine ? Array.from(document.querySelectorAll<HTMLElement>("[data-tilt]")) : [];
    const onTiltMove = (e: PointerEvent) => {
      const el = e.currentTarget as HTMLElement;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      el.style.setProperty("--rx", `${((0.5 - y) * 6).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${((x - 0.5) * 8).toFixed(2)}deg`);
      el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
      el.dataset.tilting = "true";
    };
    const onTiltLeave = (e: PointerEvent) => {
      const el = e.currentTarget as HTMLElement;
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
      delete el.dataset.tilting;
    };
    tilters.forEach((el) => {
      el.addEventListener("pointermove", onTiltMove);
      el.addEventListener("pointerleave", onTiltLeave);
    });

    // Ripples from the press point.
    const onPress = (e: PointerEvent) => {
      const host = (e.target as Element | null)?.closest<HTMLElement>("[data-ripple]");
      if (!host) return;
      const r = host.getBoundingClientRect();
      const size = Math.max(r.width, r.height) * 2.2;
      const dot = document.createElement("span");
      dot.className = "ripple";
      dot.style.width = dot.style.height = `${size}px`;
      dot.style.left = `${e.clientX - r.left - size / 2}px`;
      dot.style.top = `${e.clientY - r.top - size / 2}px`;
      host.appendChild(dot);
      dot.addEventListener("animationend", () => dot.remove(), { once: true });
    };
    document.addEventListener("pointerdown", onPress);

    return () => {
      io?.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      tilters.forEach((el) => {
        el.removeEventListener("pointermove", onTiltMove);
        el.removeEventListener("pointerleave", onTiltLeave);
      });
      document.removeEventListener("pointerdown", onPress);
    };
  }, [pathname]);

  return null;
}

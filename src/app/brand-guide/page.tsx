import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Logo, LogoMark } from "@/components/brand/Logo";
import { Replay } from "@/components/brand/Replay";
import { Words, rv } from "@/components/motion/Words";
import { Photo } from "@/components/photo/Photo";
import { Icon } from "@/components/ui/Icon";
import { RevealHeading } from "@/components/ui/SectionHeader";

/* ==========================================================================
   Brand guide. The first block is a one-screen sheet, laid out to fit a
   1280 × 769 screenshot; below it the full guide: logo use, type scale,
   photography, voice and motion (with live samples). Reachable at
   /brand-guide, kept out of search and navigation.
   ========================================================================== */

export const metadata: Metadata = {
  title: "Brand guide",
  robots: { index: false, follow: false },
};

const PALETTE = [
  { name: "Spruce ink", hex: "#12302F", role: "Text, dark surfaces", fg: "#ffffff" },
  { name: "Tide", hex: "#1B6A64", role: "The one action color", fg: "#ffffff" },
  { name: "Sea glass", hex: "#DCEBE6", role: "Soft surfaces", fg: "#12302f" },
  { name: "Sand", hex: "#EFE8DE", role: "Warm surfaces", fg: "#12302f" },
  { name: "Foam", hex: "#EAF3F0", role: "Hover, selected", fg: "#12302f" },
  { name: "Mist", hex: "#F6F9F8", role: "Page background", fg: "#12302f" },
];

const SCALE = [
  { name: "Display", sample: "Gentle dentistry", spec: "Albert Sans 650, 71 px", cls: "font-display text-[clamp(2.4rem,4.4vw,4.45rem)] leading-none font-semibold tracking-[-0.03em]" },
  { name: "Heading 2", sample: "Your first visit", spec: "Albert Sans 650, 42 px", cls: "font-display text-h2 font-semibold" },
  { name: "Heading 3", sample: "A gentle cleaning", spec: "Albert Sans 650, 24 px", cls: "font-display text-h3 font-semibold" },
  { name: "Lead", sample: "You'll always know what's next, how long it takes and what it costs.", spec: "Atkinson 400, 21 px", cls: "text-lead text-ink-soft" },
  { name: "Body", sample: "Raise your hand and everything pauses. We check in with you every few minutes.", spec: "Atkinson 400, 18 px", cls: "text-body" },
];

const VOICE = [
  { do: "You'll get a written price before anything happens.", dont: "Affordable pricing options available!" },
  { do: "Raise your hand and we stop.", dont: "Pain-free dentistry, guaranteed." },
  { do: "Most people tell us it was easier than they expected.", dont: "World-class, state-of-the-art care." },
];

const PHOTOS = [
  { slot: "hero-room" as const, title: "Daylight, never clinical", body: "Big windows, plants, light oak. No blue light, no tools pointed at the camera." },
  { slot: "first-visit" as const, title: "People talking, not posing", body: "Eye level, mid-conversation, faces visible. Calm, never staged smiles." },
  { slot: "comfort-kit" as const, title: "Small comforts up close", body: "Soft textures and quiet details that say someone thought about this." },
];

export default function BrandGuidePage() {
  return (
    <>
      <div data-sheet="brand-guide" className="container-page py-10 lg:py-12">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr_1fr] lg:grid-rows-[auto_auto]">
          <section className="flex flex-col justify-between rounded-pebble bg-white p-8 shadow-soft lg:row-span-2">
            <div>
              <p className="text-small text-ink-faint">Hushwell Dental brand guide</p>
              <h1 className="mt-2 font-display text-[2.25rem] leading-tight font-semibold tracking-tight">Calm, clear, kind.</h1>
            </div>
            <div className="my-10 grid place-items-center text-[clamp(1.8rem,5vw,2.6rem)]">
              <Logo />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="grid aspect-square place-items-center rounded-card bg-tide">
                <LogoMark className="h-14 w-auto" color="#ffffff" waterColor="#8fc7bd" waveColor="#1b6a64" />
              </div>
              <div className="grid aspect-square place-items-center rounded-card bg-seaglass">
                <LogoMark className="h-14 w-auto" />
              </div>
              <div className="grid aspect-square place-items-center rounded-card bg-ink">
                <LogoMark className="h-14 w-auto" color="#ffffff" waterColor="#8fc7bd" waveColor="#12302f" />
              </div>
            </div>
            <p className="mt-5 text-small text-ink-soft">A tooth resting in still water: the practice is the calm part of your day.</p>
          </section>

          <section className="rounded-pebble bg-white p-7 shadow-soft lg:col-span-2">
            <h2 className="font-display text-[1.25rem] font-semibold">Color</h2>
            <ul className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-6">
              {PALETTE.map((c) => (
                <li key={c.hex}>
                  <div
                    className="flex aspect-[4/5] flex-col justify-end rounded-card p-3 ring-1 ring-line ring-inset"
                    style={{ background: c.hex, color: c.fg }}
                  >
                    <span className="font-display text-[0.95rem] font-semibold">{c.hex}</span>
                  </div>
                  <p className="mt-2 font-display text-small leading-tight font-semibold">{c.name}</p>
                  <p className="text-tiny text-ink-faint">{c.role}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-pebble bg-white p-7 shadow-soft">
            <h2 className="font-display text-[1.25rem] font-semibold">Type</h2>
            <p className="mt-4 font-display text-[3.25rem] leading-none font-semibold tracking-[-0.03em]">Aa 149</p>
            <p className="mt-2 text-small">
              <span className="font-display font-semibold">Albert Sans</span> <span className="text-ink-soft">for headlines and figures</span>
            </p>
            <p className="mt-5 text-[1.75rem] leading-none">Aa Bb Rr</p>
            <p className="mt-2 text-small">
              <span className="font-display font-semibold">Atkinson Hyperlegible Next</span>{" "}
              <span className="text-ink-soft">for reading, made for low-vision readers</span>
            </p>
          </section>

          <section className="rounded-pebble bg-seaglass p-7">
            <h2 className="font-display text-[1.25rem] font-semibold">Interface</h2>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <span className="inline-flex min-h-11 items-center rounded-full bg-tide px-5 font-display font-semibold text-white shadow-soft">
                Request a visit
              </span>
              <span className="inline-flex min-h-11 items-center rounded-full border-2 border-tide/30 bg-white px-5 font-display font-semibold text-tide">
                Our team
              </span>
            </div>
            <div className="mt-4 rounded-card bg-white p-4 shadow-soft">
              <p className="flex items-center justify-between font-display font-semibold">
                Next openings
                <Icon name="calendar" size={18} className="text-tide" />
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {["9 am", "10:30 am", "2 pm"].map((t, i) => (
                  <span
                    key={t}
                    className={`inline-flex min-h-10 items-center justify-center rounded-full border-2 px-1 font-display text-small font-semibold whitespace-nowrap sm:text-body ${
                      i === 1 ? "border-tide bg-tide text-white" : "border-line bg-white"
                    }`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Logo use */}
      <section aria-labelledby="logo-title" className="container-page py-16 lg:py-20">
        <RevealHeading id="logo-title" text="Using the logo" />
        <div className="mt-10 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
          <div className="relative grid place-items-center overflow-hidden rounded-pebble bg-white p-12 shadow-soft" {...rv("up", 1)}>
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-60"
              style={{
                backgroundImage:
                  "linear-gradient(var(--color-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-line) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <div className="relative rounded-md border-2 border-dashed border-tide/40 p-[1.2em] text-[2.4rem]">
              <Logo />
            </div>
            <p className="relative mt-6 max-w-[34rem] text-center text-small text-ink-soft">
              Clear space on every side equals the height of the mark&apos;s crown. Never smaller than 24 px tall on screen.
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-5">
            {[
              { label: "Don't stretch it", style: { transform: "scaleX(1.5)" } as CSSProperties },
              { label: "Don't add effects", style: { filter: "drop-shadow(0 6px 6px rgb(0 0 0 / 0.45))" } as CSSProperties },
              { label: "Don't change its colors", style: { filter: "hue-rotate(150deg) saturate(2)" } as CSSProperties },
              { label: "Don't tilt it", style: { transform: "rotate(-18deg)" } as CSSProperties },
            ].map((d, i) => (
              <li key={d.label} className="relative rounded-panel bg-white p-6 shadow-soft" {...rv("up", 2 + i)}>
                <div aria-hidden="true" className="grid h-24 place-items-center">
                  <span style={d.style} className="grid place-items-center">
                    <LogoMark className="h-16 w-auto" />
                  </span>
                </div>
                <p className="mt-3 flex items-center gap-2 text-small font-bold text-error">
                  <Icon name="close" size={16} strokeWidth={2.5} />
                  {d.label}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Type scale */}
      <section aria-labelledby="scale-title" className="bg-white py-16 lg:py-20">
        <div className="container-page">
          <RevealHeading id="scale-title" text="Type scale" />
          <ul className="mt-10 divide-y divide-line border-y border-line">
            {SCALE.map((t, i) => (
              <li key={t.name} className="grid gap-3 py-6 md:grid-cols-[12rem_1fr] md:items-baseline md:gap-10" {...rv("up", i)}>
                <div>
                  <p className="font-display font-semibold">{t.name}</p>
                  <p className="text-small text-ink-faint">{t.spec}</p>
                </div>
                <p className={t.cls}>{t.sample}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-[65ch] text-small text-ink-soft">
            Atkinson&apos;s slashed zero reads as code in prices, so every digit on the site comes from Albert Sans.
            Labels are sentence case; no all-caps, no em dashes, no arrows.
          </p>
        </div>
      </section>

      {/* Photography */}
      <section aria-labelledby="photo-title" className="container-page py-16 lg:py-20">
        <RevealHeading id="photo-title" text="Photography" />
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {PHOTOS.map((p, i) => (
            <li key={p.slot} className="zoom" {...rv("up", i)}>
              <Photo slot={p.slot} aspect="4:5" sizes="(min-width: 48rem) 24rem, 100vw" className="rounded-pebble" alt="" />
              <p className="mt-4 font-display text-[1.125rem] font-semibold">{p.title}</p>
              <p className="mt-1 text-small text-ink-soft">{p.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Voice */}
      <section aria-labelledby="voice-title" className="bg-sand py-16 lg:py-20">
        <div className="container-page">
          <RevealHeading id="voice-title" text="How we sound" />
          <p className="mt-4 max-w-[44rem] text-lead text-ink-soft" {...rv("up", 1)}>
            Plain, warm and specific. Say what happens and what it costs. No pressure, no jargon, no exclamation marks.
          </p>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {VOICE.map((v, i) => (
              <li key={v.do} className="rounded-panel bg-white p-6 shadow-soft" {...rv("up", 2 + i)}>
                <p className="flex items-center gap-2 text-small font-bold text-tide">
                  <Icon name="check" size={16} strokeWidth={2.5} />
                  Say
                </p>
                <p className="mt-2 font-display text-[1.1875rem] leading-snug font-semibold">&ldquo;{v.do}&rdquo;</p>
                <p className="mt-5 flex items-center gap-2 border-t border-line pt-4 text-small font-bold text-error">
                  <Icon name="close" size={16} strokeWidth={2.5} />
                  Not
                </p>
                <p className="mt-2 text-ink-soft line-through decoration-error/40">&ldquo;{v.dont}&rdquo;</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Motion */}
      <section aria-labelledby="motion-title" className="container-page py-16 lg:py-20">
        <RevealHeading id="motion-title" text="Motion, like still water" />
        <p className="mt-4 max-w-[44rem] text-lead text-ink-soft" {...rv("up", 1)}>
          Things rise and settle on one long ease-out. Nothing bounces, nothing waits more than a quarter second, and all
          of it switches off for people who prefer reduced motion.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-panel bg-white p-6 shadow-soft" {...rv("up", 2)}>
            <Replay label="words">
              <p className="text-small text-ink-faint">Headlines rise word by word</p>
              <p className="words-enter mt-4 font-display text-[1.9rem] leading-tight font-semibold">
                <Words text="Explained before it happens." />
              </p>
            </Replay>
          </div>
          <div className="rounded-panel bg-white p-6 shadow-soft" {...rv("up", 3)}>
            <Replay label="photo">
              <p className="text-small text-ink-faint">Photos open from a rounded window</p>
              <Photo slot="smile" aspect="3:2" sizes="20rem" className="enter-photo mt-4 rounded-card" alt="" />
            </Replay>
          </div>
          <div className="rounded-panel bg-white p-6 shadow-soft" {...rv("up", 4)}>
            <Replay label="logo">
              <p className="text-small text-ink-faint">The water rises into the mark</p>
              <div className="mt-4 grid h-28 place-items-center rounded-card bg-seaglass">
                <LogoMark className="h-20 w-auto" />
              </div>
            </Replay>
          </div>
          <div className="rounded-panel bg-white p-6 shadow-soft" {...rv("up", 5)}>
            <p className="text-small text-ink-faint">Buttons ripple where you press</p>
            <div className="mt-4 grid h-28 place-items-center rounded-card bg-foam">
              <button type="button" className="inline-flex min-h-12 items-center rounded-full bg-tide px-6 font-display font-semibold text-white" data-ripple>
                Press me
              </button>
            </div>
            <p className="mt-5 text-small text-ink-soft">Ease: cubic-bezier(0.16, 1, 0.3, 1). Reveals 0.7 s, stagger 70 ms.</p>
          </div>
        </div>
      </section>
    </>
  );
}

import type { CSSProperties } from "react";
import { NextOpenings } from "@/components/home/NextOpenings";
import { Words } from "@/components/motion/Words";
import { Photo } from "@/components/photo/Photo";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";

/* ==========================================================================
   Home hero. Text on the content grid; the photo runs to the right edge of
   the window, with the live "Next openings" card resting on it. On phones
   the photo follows the text and the card sits below the photo.
   Entrance (CSS only): the headline rises word by word, the photo opens
   from a rounded window and settles, the card lifts in last. On scroll the
   photo drifts gently against the page.
   ========================================================================== */

const FACTS: Array<{ icon: IconName; text: string }> = [
  { icon: "clock", text: "Open until 7 pm, Monday to Thursday" },
  { icon: "shield", text: "Most PPO plans accepted" },
  { icon: "tag", text: "A posted price for every service" },
];

/** Entrance delay in ms (see .enter in globals.css): words from 60, lead 250, buttons 350, card 450, facts 500. */
const d = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="hero-grid pt-8 pb-20 lg:pt-10 lg:pb-28">
      <div className="hero-text flex flex-col justify-end lg:pt-10 lg:pr-16 lg:pb-11">
        <p className="enter inline-flex items-center gap-2.5 self-start rounded-full bg-white py-1.5 pr-4 pl-2 text-small font-bold text-ink shadow-soft">
          <span className="relative grid size-6 place-items-center rounded-full bg-seaglass text-tide">
            <Icon name="check" size={15} strokeWidth={2.5} />
          </span>
          Accepting new patients this week
        </p>
        <h1 id="hero-title" className="words-enter mt-7 max-w-[15ch] text-display">
          <Words text="Gentle dentistry, explained before it happens." />
        </h1>
        <p className="enter mt-6 max-w-[34rem] text-lead text-ink-soft" style={d(250)}>
          A neighborhood practice in Brookmere for adults and kids, including anyone who&apos;s been putting it off.
          You&apos;ll always know what&apos;s next, how long it takes and what it costs.
        </p>
        <div className="enter mt-9 flex flex-wrap gap-3" style={d(350)}>
          <ButtonLink href="/book">Request a visit</ButtonLink>
          <ButtonLink href="/#first-visit" variant="secondary">
            See your first visit
          </ButtonLink>
        </div>
      </div>

      <div className="hero-media relative mt-12 lg:mt-0">
        <div className="relative aspect-[16/11] overflow-hidden rounded-pebble lg:aspect-auto lg:h-full lg:min-h-[44rem] lg:rounded-r-none">
          <Photo
            slot="hero-room"
            fill
            priority
            sizes="(min-width: 64rem) 52vw, 100vw"
            className="enter-photo max-lg:[&_img]:![object-position:68%_72%]"
            parallax={0.08}
          />
        </div>
        <div
          className="card-enter relative z-10 mx-4 -mt-12 sm:mx-auto sm:max-w-[22rem] lg:absolute lg:bottom-12 lg:-left-10 lg:mx-0 lg:mt-0 lg:w-[21rem]"
          style={d(450)}
        >
          <NextOpenings />
        </div>
      </div>

      <ul className="hero-facts mt-10 grid gap-x-6 gap-y-3 border-t border-line pt-7 sm:grid-cols-3 lg:mt-0 lg:pr-16">
        {FACTS.map((f, i) => (
          <li key={f.text} className="enter flex items-start gap-2.5 text-small text-ink-soft" style={d(500 + i * 50)}>
            <Icon name={f.icon} size={20} className="mt-0.5 shrink-0 text-tide" />
            <span>{f.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

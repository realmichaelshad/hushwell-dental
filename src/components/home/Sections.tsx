import Link from "next/link";
import type { CSSProperties } from "react";
import { Words, rv } from "@/components/motion/Words";
import { Photo } from "@/components/photo/Photo";
import { PriceList } from "@/components/services/PriceList";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, Stars } from "@/components/ui/Icon";
import { RevealHeading, SectionHeader } from "@/components/ui/SectionHeader";
import { FirstVisitTimeline } from "@/components/visit/FirstVisitTimeline";
import { MembershipCard } from "@/components/visit/MembershipCard";
import { VisitStage } from "@/components/visit/VisitStage";
import { HoursTable } from "@/components/visit/HoursTable";
import { OpenNow } from "@/components/visit/OpenNow";
import { REVIEWS, TEAM, type Review } from "@/content/people";
import { CONTACT } from "@/content/site";
import { COMFORT } from "@/content/visit";

/* ==========================================================================
   Home page sections, top to bottom after the hero. Motion is declared in
   markup (rv, Words, Photo reveal/parallax) and run by MotionRoot.
   ========================================================================== */

export function FirstVisitSection() {
  return (
    <section
      id="first-visit"
      aria-labelledby="first-visit-title"
      className="group/visit bg-white py-20 lg:py-28"
      data-visit
      data-active="0"
    >
      <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <RevealHeading id="first-visit-title" text="Your first visit, minute by minute" />
          <p className="mt-4 max-w-[34rem] text-lead text-ink-soft" {...rv("up", 2)}>
            No surprises. This is the whole hour, start to finish, and you can pause it at any point.
          </p>
          <div className="mt-8 hidden lg:block" {...rv("clip", 2)}>
            <VisitStage />
          </div>
          <div className="mt-8" {...rv("up", 3)}>
            <ButtonLink href="/book">Request a visit</ButtonLink>
          </div>
        </div>
        <FirstVisitTimeline />
      </div>
    </section>
  );
}

export function ServicesSection() {
  return (
    <section aria-labelledby="services-title" className="py-20 lg:py-28">
      <div className="container-page">
        <SectionHeader
          id="services-title"
          title="What we do, and what it costs"
          intro="Self-pay prices, posted up front. With insurance you'll usually pay less, and we'll tell you exactly how much before we start."
          action={
            <ButtonLink href="/services" variant="secondary">
              All services
            </ButtonLink>
          }
        />
        <PriceList className="mt-12" />
      </div>
    </section>
  );
}

export function ComfortSection() {
  return (
    <section aria-labelledby="comfort-title" className="pb-20 lg:pb-28">
      <div className="container-page">
        <div className="grid overflow-hidden rounded-pebble bg-sand lg:grid-cols-[0.85fr_1.15fr]" {...rv("scale")}>
          <div className="relative aspect-square overflow-hidden lg:aspect-auto">
            <Photo slot="comfort-kit" fill sizes="(min-width: 64rem) 34vw, 100vw" parallax={0.07} />
          </div>
          <div className="p-8 sm:p-12 lg:p-16">
            <RevealHeading id="comfort-title" text="Nervous? You're in good company." />
            <p className="mt-4 max-w-[36rem] text-lead text-ink-soft" {...rv("up", 2)}>
              About half our patients tell us they dread the dentist. So we built the visit around feeling in control.
            </p>
            <ul className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {COMFORT.map((item, i) => (
                <li key={item.title} className="group flex gap-4" {...rv("up", 3 + i)}>
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-tide transition-[transform,background-color,color] duration-500 ease-[var(--ease-out-expo)] group-hover:-rotate-6 group-hover:bg-tide group-hover:text-white">
                    <Icon name={item.icon} size={24} />
                  </span>
                  <span>
                    <span className="block font-display text-[1.125rem] font-semibold">{item.title}</span>
                    <span className="block text-small text-ink-soft">{item.body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TeamSection() {
  return (
    <section aria-labelledby="team-title" className="bg-white py-20 lg:py-28">
      <div className="container-page">
        <SectionHeader
          id="team-title"
          title="The people you'll meet"
          intro="A small team, so you see the same faces every time."
          action={
            <ButtonLink href="/team" variant="secondary">
              Meet the team
            </ButtonLink>
          }
        />
        <ul className="mt-12 grid grid-cols-2 gap-x-5 gap-y-9 lg:grid-cols-4 lg:gap-x-7">
          {TEAM.map((person, i) => (
            <li key={person.name} className="zoom" {...rv("up", i)}>
              <Link href="/team" className="group block">
                <Photo slot={person.photo} sizes="(min-width: 64rem) 18rem, 45vw" className="rounded-panel" alt="" />
                <p className="mt-4 font-display text-[1.125rem] font-semibold group-hover:text-tide">
                  {person.name}
                  {person.credentials && <span className="font-normal text-ink-soft">, {person.credentials}</span>}
                </p>
                <p className="text-small text-ink-soft">{person.role}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ReviewCard({ review, className }: { review: Review; className?: string }) {
  return (
    <figure className={`flex h-full flex-col rounded-panel bg-white p-7 shadow-soft ${className ?? ""}`}>
      <Stars />
      <blockquote className="mt-4 flex-1 text-[1.1875rem] leading-relaxed">
        <p>&ldquo;{review.quote}&rdquo;</p>
      </blockquote>
      <figcaption className="mt-6 border-t border-line pt-4 text-small">
        <span className="font-bold">{review.name}</span>
        <span className="text-ink-soft">, {review.visit.toLowerCase()}</span>
      </figcaption>
    </figure>
  );
}

/** Two rows of reviews drifting in opposite directions. Each row is doubled so the loop is seamless. */
function ReviewsMarquee() {
  const rows = [REVIEWS.slice(0, 3), REVIEWS.slice(3, 6)];
  return (
    <div className="marquee mt-12 space-y-6" {...rv("fade", 2)}>
      {rows.map((row, r) => (
        <div
          key={r}
          className="marquee-track"
          data-reverse={r === 1 ? "" : undefined}
          style={{ "--marquee-speed": r === 0 ? "64s" : "76s" } as CSSProperties}
        >
          {[0, 1, 2, 3].map((copy) => (
            <ul key={copy} className="flex shrink-0 gap-6 pr-6" aria-hidden={copy > 0 || undefined}>
              {row.map((review) => (
                <li key={review.name} className="w-[21rem] shrink-0 sm:w-[26rem]">
                  <ReviewCard review={review} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      ))}
    </div>
  );
}

export function ReviewsSection({ count = 3 }: { count?: number }) {
  return (
    <section aria-labelledby="reviews-title" className="overflow-hidden py-20 lg:py-28">
      <div className="container-page">
        <SectionHeader
          id="reviews-title"
          title="What patients say"
          intro="From people who used to dread the dentist."
          action={
            <div className="flex items-center gap-4">
              <span className="font-display text-[4rem] leading-none font-semibold tracking-[-0.04em]">4.9</span>
              <span>
                <Stars size={20} />
                <span className="mt-1 block text-small text-ink-soft">
                  out of 5, from <span data-count={380}>380</span> reviews
                </span>
              </span>
            </div>
          }
        />
        <ul className="reviews-static mt-12 grid gap-6 md:grid-cols-3">
          {REVIEWS.slice(0, count).map((review) => (
            <li key={review.name}>
              <ReviewCard review={review} />
            </li>
          ))}
        </ul>
      </div>
      <ReviewsMarquee />
    </section>
  );
}

export function InsuranceSection() {
  return (
    <section aria-labelledby="insurance-title" className="bg-white py-20 lg:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
        <div>
          <RevealHeading id="insurance-title" text="Insurance, sorted before you arrive" />
          <p className="mt-4 text-lead text-ink-soft" {...rv("up", 2)}>
            Add your plan when you request a visit. Sam checks your coverage and tells you what you&apos;ll owe before
            you sit down.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              "In network with most PPO dental plans",
              "State children's dental programs accepted",
              "We file the claim, you pay only your share",
              "Payment plans for treatment over $500, no interest",
            ].map((line, i) => (
              <li key={line} className="flex items-start gap-3" {...rv("left", 3 + i)}>
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-seaglass text-tide">
                  <Icon name="check" size={16} strokeWidth={2.5} />
                </span>
                {line}
              </li>
            ))}
          </ul>
          <div {...rv("up", 7)}>
            <Link
              href="/new-patients#insurance"
              className="mt-8 inline-block font-bold text-tide underline decoration-tide/30 decoration-2 underline-offset-4 hover:decoration-tide"
            >
              Read the insurance questions
            </Link>
          </div>
        </div>
        <div {...rv("scale", 2)}>
          <MembershipCard />
        </div>
      </div>
    </section>
  );
}

export function VisitSection() {
  return (
    <section aria-labelledby="visit-title" className="relative pb-20 lg:pb-0">
      <div className="relative h-[20rem] overflow-hidden sm:h-[28rem] lg:absolute lg:inset-0 lg:h-auto" {...rv("fade")}>
        <Photo slot="exterior" fill sizes="100vw" parallax={0.1} />
      </div>
      <div className="container-page relative lg:flex lg:min-h-[48rem] lg:items-center lg:py-24">
        <div className="relative z-10 -mt-20 rounded-pebble bg-white p-7 shadow-lift sm:p-10 lg:mt-0 lg:w-[31rem]" {...rv("up", 1)}>
          <RevealHeading id="visit-title" text="Find us on Linden Street" />
          <p className="mt-3 text-ink-soft" {...rv("up", 2)}>
            Free parking behind the building, a step-free entrance and an elevator to Suite 2.
          </p>
          <address className="mt-6 flex items-start gap-3 not-italic" data-contact {...rv("up", 3)}>
            <Icon name="pin" size={22} className="mt-0.5 shrink-0 text-tide" />
            <span className="font-bold">
              {CONTACT.street}, {CONTACT.town}
            </span>
          </address>
          <div {...rv("up", 4)}>
            <OpenNow className="mt-5 font-bold" />
            <HoursTable className="mt-3" />
            <Link
              href="/contact"
              className="mt-5 inline-block font-bold text-tide underline decoration-tide/30 decoration-2 underline-offset-4 hover:decoration-tide"
            >
              Map and directions
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Ripples spreading from a point, like a drop in still water (decorative). */
export function Rings({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`rings pointer-events-none absolute ${className ?? ""}`}>
      {[0, 1, 2].map((n) => (
        <span
          key={n}
          className="absolute inset-0 rounded-full border-2 border-white/25"
          style={{ "--n": n } as CSSProperties}
        />
      ))}
    </span>
  );
}

export function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="py-20 lg:py-28">
      <div className="container-page">
        <div className="on-dark relative grid overflow-hidden rounded-pebble bg-tide text-white lg:grid-cols-[1.15fr_0.85fr]" {...rv("scale")}>
          <div className="relative overflow-hidden px-8 py-14 sm:px-14 lg:px-16 lg:py-20">
            <Rings className="-bottom-[27rem] -left-[20rem] size-[40rem]" />
            <h2 id="cta-title" className="relative max-w-[16ch] text-h1" {...rv("words", 2)}>
              <Words text="Ready when you are." />
            </h2>
            <p className="relative mt-5 max-w-[34rem] text-lead text-white/85" {...rv("up", 3)}>
              Request a visit online in about two minutes. We&apos;ll call to confirm a time that suits you.
            </p>
            <div className="relative mt-9 flex flex-wrap items-center gap-x-6 gap-y-4" {...rv("up", 4)}>
              <ButtonLink href="/book" variant="light">
                Request a visit
              </ButtonLink>
              <a href={CONTACT.phoneHref} className="inline-flex items-center gap-2 font-display font-semibold text-white hover:underline" data-contact>
                <Icon name="phone" size={20} />
                Or call {CONTACT.phone}
              </a>
            </div>
          </div>
          <div className="relative min-h-[18rem] overflow-hidden sm:min-h-[22rem]">
            <Photo slot="smile" fill sizes="(min-width: 64rem) 34rem, 100vw" parallax={0.06} />
          </div>
        </div>
      </div>
    </section>
  );
}

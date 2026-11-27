import type { Metadata } from "next";
import Link from "next/link";
import { ComfortSection, FinalCta } from "@/components/home/Sections";
import { MembershipCard } from "@/components/visit/MembershipCard";
import { PageIntro } from "@/components/layout/PageIntro";
import { Photo } from "@/components/photo/Photo";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { FirstVisitTimeline } from "@/components/visit/FirstVisitTimeline";
import { VisitStage } from "@/components/visit/VisitStage";
import { INSURANCE_FAQS } from "@/content/visit";
import { rv } from "@/components/motion/Words";
import { RevealHeading } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "New patients",
  description:
    "What to expect at your first visit, minute by minute, plus insurance, payment and what to bring. Hushwell Dental welcomes new patients every week.",
  alternates: { canonical: "/new-patients" },
};

const BEFORE = [
  { title: "Request a time", body: "Online in about two minutes, or call us. We confirm by phone." },
  { title: "Fill in your forms", body: "We text you a link, so there's no clipboard when you arrive." },
  { title: "Bring two things", body: "Your insurance card, if you have one, and a photo ID." },
  { title: "Arrive five minutes early", body: "Enough time for a tea and a look around. Parking is free." },
];

export default function NewPatientsPage() {
  return (
    <>
      <PageIntro
        current="New patients"
        title="Your first visit"
        lead="Everything you need to know before you come in. Most people tell us it was easier than they expected."
        actions={<ButtonLink href="/book">Request a visit</ButtonLink>}
        aside={<Photo slot="welcome-desk" priority sizes="(min-width: 64rem) 36rem, 100vw" className="rounded-pebble" />}
      />

      <section aria-labelledby="before-title" className="container-page pb-20 lg:pb-28">
        <RevealHeading id="before-title" text="Before you come" />
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BEFORE.map((step, i) => (
            <li key={step.title} className="lift rounded-panel border border-line bg-white p-7" {...rv("up", i + 1)}>
              <span className="font-display text-[2.5rem] leading-none font-semibold text-tide">{i + 1}</span>
              <h3 className="mt-4 text-[1.25rem]">{step.title}</h3>
              <p className="mt-2 text-ink-soft">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="hour-title" className="group/visit bg-white py-20 lg:py-28" data-visit data-active="0">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <RevealHeading id="hour-title" text="The hour, minute by minute" />
            <p className="mt-4 max-w-[32rem] text-lead text-ink-soft" {...rv("up", 2)}>
              Here&apos;s exactly what happens, and you can pause at any point.
            </p>
            <div className="mt-8 hidden lg:block" {...rv("clip", 2)}>
              <VisitStage />
            </div>
          </div>
          <FirstVisitTimeline />
        </div>
      </section>

      <div id="comfort" className="pt-20 lg:pt-28">
        <ComfortSection />
      </div>

      <section id="insurance" aria-labelledby="insurance-title" className="bg-white py-20 lg:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div>
            <RevealHeading id="insurance-title" text="Insurance and payment" />
            <p className="mt-4 max-w-[40rem] text-lead text-ink-soft" {...rv("up", 2)}>
              Straight answers to the questions everyone asks. You&apos;ll always know the cost before treatment.
            </p>
            <div {...rv("up", 3)}>
              <Accordion items={INSURANCE_FAQS} className="mt-10" />
            </div>
          </div>
          <div className="lg:sticky lg:top-28 lg:self-start" {...rv("scale", 2)}>
            <MembershipCard />
          </div>
        </div>
      </section>

      <section aria-labelledby="kids-title" className="container-page py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Photo slot="kids-visit" sizes="(min-width: 64rem) 36rem, 100vw" className="rounded-pebble" reveal parallax={0.06} />
          <div>
            <RevealHeading id="kids-title" text="Bringing your kids" />
            <p className="mt-4 text-lead text-ink-soft" {...rv("up", 2)}>
              First visits are short and playful: a ride in the chair, a tooth count and a prize at the end. You can
              stay in the room the whole time.
            </p>
            <Link
              href="/services/kids-visits"
              className="mt-6 inline-block font-bold text-tide underline decoration-tide/30 decoration-2 underline-offset-4 hover:decoration-tide"
            >
              About kids&apos; visits
            </Link>
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}

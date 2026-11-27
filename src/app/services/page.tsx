import type { Metadata } from "next";
import { FinalCta } from "@/components/home/Sections";
import { PageIntro } from "@/components/layout/PageIntro";
import { Photo } from "@/components/photo/Photo";
import { PriceList } from "@/components/services/PriceList";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { rv } from "@/components/motion/Words";

export const metadata: Metadata = {
  title: "Services and prices",
  description:
    "Checkups, kids' visits, fillings, root canals, crowns, whitening, clear aligners and same-day emergency care, each with its self-pay price posted.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageIntro
        current="Services"
        title="Services and prices"
        lead="Everything we do, with the self-pay price posted. With insurance you'll usually pay less, and you'll always get a written estimate before any treatment."
        aside={<Photo slot="scan-review" priority sizes="(min-width: 64rem) 34rem, 100vw" className="rounded-pebble" parallax={0.05} />}
      />
      <section aria-label="All services" className="container-page pb-16">
        <PriceList headingLevel={2} />
      </section>
      <section aria-labelledby="unsure-title" className="container-page pb-20 lg:pb-28">
        <div
          className="grid gap-8 rounded-pebble border border-line bg-white p-8 sm:p-12 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-12"
          {...rv("scale")}
        >
          <span className="grid size-16 place-items-center rounded-full bg-seaglass text-tide">
            <Icon name="chat" size={30} />
          </span>
          <div>
            <h2 id="unsure-title" className="text-h3">
              Not sure what you need?
            </h2>
            <p className="mt-2 max-w-[44rem] text-ink-soft">
              Start with a checkup. We&apos;ll look, explain what we see and give you options with prices. Nothing
              happens unless you say yes.
            </p>
          </div>
          <ButtonLink href="/book?service=checkup-and-cleaning">Request a checkup</ButtonLink>
        </div>
      </section>
      <FinalCta />
    </>
  );
}

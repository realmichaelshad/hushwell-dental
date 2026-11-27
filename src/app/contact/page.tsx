import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { PageIntro } from "@/components/layout/PageIntro";
import { Photo } from "@/components/photo/Photo";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { MapArt } from "@/components/visit/MapArt";
import { HoursTable } from "@/components/visit/HoursTable";
import { OpenNow } from "@/components/visit/OpenNow";
import { CONTACT } from "@/content/site";
import { rv } from "@/components/motion/Words";
import { RevealHeading } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Contact and hours",
  description: "Hushwell Dental on Linden Street, Brookmere. Opening hours, parking, the bus stop, and how to reach us.",
  alternates: { canonical: "/contact" },
};

const GETTING_HERE: Array<{ icon: IconName; title: string; body: string }> = [
  { icon: "pin", title: "Parking", body: "Free parking behind the building, with two wider spaces by the door." },
  { icon: "bus", title: "By bus", body: "Route 12 stops at Linden and Third, a two-minute walk away." },
  { icon: "access", title: "Step-free", body: "A level entrance and an elevator to Suite 2. Wheelchairs fit every room." },
];

export default function ContactPage() {
  return (
    <>
      <PageIntro
        current="Contact"
        title="Contact and hours"
        lead="Call, write or just drop by. We're on Linden Street, across from Alder Park."
        actions={
          <>
            <ButtonLink href="/book">Request a visit</ButtonLink>
            <OpenNow className="ml-2 font-bold" />
          </>
        }
      />

      <section aria-label="How to reach us" className="container-page grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="overflow-hidden rounded-pebble" {...rv("clip")}>
          <MapArt className="aspect-[4/3] w-full lg:aspect-auto lg:h-full lg:min-h-[32rem]" />
        </div>
        <div className="rounded-pebble bg-white p-7 shadow-soft sm:p-9" {...rv("up", 2)}>
          <ul className="space-y-6" data-contact>
            <li className="flex gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-seaglass text-tide">
                <Icon name="pin" size={21} />
              </span>
              <address className="not-italic">
                <span className="block text-small text-ink-soft">Address</span>
                <span className="font-bold">
                  {CONTACT.street}
                  <br />
                  {CONTACT.town}
                </span>
              </address>
            </li>
            <li className="flex gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-seaglass text-tide">
                <Icon name="phone" size={21} />
              </span>
              <span>
                <span className="block text-small text-ink-soft">Phone</span>
                <a href={CONTACT.phoneHref} className="font-display text-[1.25rem] font-semibold hover:text-tide">
                  {CONTACT.phone}
                </a>
              </span>
            </li>
            <li className="flex gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-seaglass text-tide">
                <Icon name="mail" size={21} />
              </span>
              <span>
                <span className="block text-small text-ink-soft">Email</span>
                <a href={`mailto:${CONTACT.email}`} className="font-bold hover:text-tide">
                  {CONTACT.email}
                </a>
              </span>
            </li>
          </ul>
          <HoursTable className="mt-8 border-t border-line pt-2" />
        </div>
      </section>

      <section aria-labelledby="getting-title" className="container-page py-20 lg:py-24">
        <RevealHeading id="getting-title" text="Getting here" />
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {GETTING_HERE.map((g, i) => (
            <li key={g.title} className="lift rounded-panel border border-line bg-white p-7" {...rv("up", i + 1)}>
              <span className="grid size-12 place-items-center rounded-full bg-seaglass text-tide">
                <Icon name={g.icon} size={23} />
              </span>
              <h3 className="mt-5 text-[1.25rem]">{g.title}</h3>
              <p className="mt-2 text-ink-soft">{g.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Write to us" className="container-page grid gap-10 pb-20 lg:grid-cols-2 lg:gap-16 lg:pb-28">
        <div className="relative aspect-[3/2] overflow-hidden rounded-pebble lg:aspect-auto lg:h-full" {...rv("clip")}>
          <Photo slot="exterior" fill sizes="(min-width: 64rem) 36rem, 100vw" parallax={0.06} />
        </div>
        <div {...rv("up", 2)}>
          <ContactForm />
        </div>
      </section>
    </>
  );
}

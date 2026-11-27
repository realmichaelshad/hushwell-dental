import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/PageIntro";
import { Photo } from "@/components/photo/Photo";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink, buttonClass } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { GROUPS, SERVICES, formatPrice, getService, relatedServices } from "@/content/services";
import { CONTACT } from "@/content/site";
import { PHOTOS, type PhotoAspect } from "@/content/photos";
import type { CSSProperties } from "react";
import { Words, rv } from "@/components/motion/Words";
import { Rings } from "@/components/home/Sections";
import { RevealHeading } from "@/components/ui/SectionHeader";

export const dynamicParams = false;

/** Hero frame per photo shape: landscape photos get a gentle 5:4, never a tall crop that loses the subject. */
function heroAspect(aspect: PhotoAspect): number {
  return aspect === "3:2" ? 5 / 4 : aspect === "1:1" ? 1 : 4 / 5;
}

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.name,
    description: `${service.summary} From ${formatPrice(service.priceFrom)} self-pay. ${service.insurance}`,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const group = GROUPS.find((g) => g.id === service.group)!;
  const related = relatedServices(service.slug);
  const bookHref = `/book?service=${service.slug}`;
  const urgent = service.group === "urgent";

  const facts: Array<{ icon: IconName; label: string; value: string }> = [
    { icon: "tag", label: "Self-pay price", value: `From ${formatPrice(service.priceFrom)}` },
    { icon: "clock", label: "How long it takes", value: service.duration },
    { icon: "calendar", label: "Visits", value: service.visits },
    { icon: "shield", label: "Insurance", value: service.insurance },
  ];

  return (
    <>
      <section className="container-page pt-8 pb-14 lg:pt-12 lg:pb-20">
        <Breadcrumbs
          trail={[
            { href: "/", label: "Home" },
            { href: "/services", label: "Services" },
          ]}
          current={service.name}
        />
        <div className="mt-8 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          <div>
            <p className="enter inline-flex items-center gap-2.5 rounded-full bg-white py-1.5 pr-4 pl-1.5 text-small font-bold text-ink shadow-soft">
              <span className="grid size-7 place-items-center rounded-full bg-seaglass text-tide">
                <Icon name={service.icon} size={16} />
              </span>
              {group.label}
            </p>
            <h1 className="words-enter mt-6 max-w-[16ch] text-h1">
              <Words text={service.name} offset={1} />
            </h1>
            <p className="enter mt-5 max-w-[38rem] text-lead text-ink-soft" style={{ "--delay": "250ms" } as CSSProperties}>
              {service.intro}
            </p>
            <div className="enter mt-8 flex flex-wrap items-center gap-3" style={{ "--delay": "350ms" } as CSSProperties}>
              {urgent ? (
                <>
                  <a href={CONTACT.phoneHref} className={buttonClass("primary")} data-ripple data-contact>
                    <Icon name="phone" size={20} />
                    Call {CONTACT.phone}
                  </a>
                  <ButtonLink href={bookHref} variant="secondary">
                    Request a visit
                  </ButtonLink>
                </>
              ) : (
                <>
                  <ButtonLink href={bookHref}>Request a visit</ButtonLink>
                  <a
                    href={CONTACT.phoneHref}
                    className="inline-flex min-h-12 items-center gap-2 px-3 font-display font-semibold text-tide hover:underline"
                    data-contact
                  >
                    <Icon name="phone" size={19} />
                    {CONTACT.phone}
                  </a>
                </>
              )}
            </div>
            {urgent && (
              <p className="enter mt-5 inline-flex items-center gap-2 text-small font-bold text-ink-soft" style={{ "--delay": "450ms" } as CSSProperties}>
                <Icon name="clock" size={18} className="text-tide" />
                Same-day slots held every day we&apos;re open. Call before noon.
              </p>
            )}
          </div>
          {service.photo && (
            <Photo
              slot={service.photo}
              aspect={heroAspect(PHOTOS[service.photo].aspect)}
              priority
              sizes="(min-width: 80rem) 36rem, (min-width: 64rem) 46vw, 100vw"
              className="enter-photo w-full rounded-pebble"
              parallax={0.06}
            />
          )}
        </div>
      </section>

      <section aria-label="At a glance" className="container-page">
        <dl className="grid gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-2 lg:grid-cols-4" {...rv("up")}>
          {facts.map((f, i) => (
            <div key={f.label} className="relative bg-white py-6 pr-6 pl-[5.25rem] lg:py-7 lg:pr-7">
              <dt className="text-small text-ink-soft">
                <span className="absolute top-6 left-6 grid size-11 place-items-center rounded-full bg-seaglass text-tide lg:top-7">
                  <Icon name={f.icon} size={21} />
                </span>
                {f.label}
              </dt>
              <dd className={i === 0 ? "mt-0.5 font-display text-[1.5rem] leading-tight font-semibold" : "mt-0.5 font-bold"}>
                {i === 0 ? (
                  <>
                    From {formatPrice(service.priceFrom)}
                  </>
                ) : (
                  f.value
                )}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 max-w-[65ch] text-small text-ink-faint">{service.priceNote}</p>
      </section>

      <section aria-labelledby="steps-title" className="container-page py-20 lg:py-24">
        <RevealHeading id="steps-title" text="What happens" />
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {service.steps.map((step, i) => (
            <li key={step.title} className="lift relative rounded-panel bg-white p-7 shadow-soft" {...rv("up", i + 1)}>
              <span className="grid size-11 place-items-center rounded-full bg-tide font-display text-[1.125rem] font-semibold text-white">
                {i + 1}
              </span>
              <h3 className="mt-5 text-[1.25rem]">{step.title}</h3>
              <p className="mt-2 text-ink-soft">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="comfort-title" className="container-page">
        <div className="grid gap-8 rounded-pebble bg-seaglass p-8 sm:p-12 lg:grid-cols-[auto_1fr] lg:gap-12 lg:p-14" {...rv("scale")}>
          <span className="grid size-16 place-items-center rounded-full bg-white text-tide">
            <Icon name="hand" size={30} />
          </span>
          <div>
            <h2 id="comfort-title" className="text-h2">
              Does it hurt?
            </h2>
            <p className="mt-4 max-w-[46rem] text-lead">{service.comfort}</p>
            <Link
              href="/new-patients#comfort"
              className="mt-6 inline-block font-bold text-tide underline decoration-tide/30 decoration-2 underline-offset-4 hover:decoration-tide"
            >
              How we keep you comfortable
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="faq-title" className="container-page grid gap-10 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:py-24">
        <div>
          <RevealHeading id="faq-title" text="Questions people ask" />
          <p className="mt-4 text-lead text-ink-soft" {...rv("up", 2)}>
            Something else on your mind? Add it to your request and we&apos;ll answer when we call.
          </p>
        </div>
        <div {...rv("up", 2)}>
          <Accordion items={service.faqs} />
        </div>
      </section>

      <section aria-labelledby="related-title" className="bg-white py-20 lg:py-24">
        <div className="container-page">
          <RevealHeading id="related-title" text="Related care" />
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {related.map((r, i) => (
              <li key={r.slug} {...rv("up", i + 1)}>
                <Link
                  href={`/services/${r.slug}`}
                  className="lift group flex h-full flex-col rounded-panel border border-line bg-mist p-7 hover:border-tide hover:bg-foam"
                >
                  <span className="grid size-12 place-items-center rounded-full bg-white text-tide">
                    <Icon name={r.icon} size={24} />
                  </span>
                  <span className="mt-5 block text-[1.25rem] font-display font-semibold group-hover:text-tide">{r.name}</span>
                  <span className="mt-2 block flex-1 text-ink-soft">{r.summary}</span>
                  <span className="mt-5 block text-small text-ink-faint">
                    From <span className="font-display text-[1.0625rem] font-semibold text-ink">{formatPrice(r.priceFrom)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="book-title" className="container-page py-20 lg:py-24">
        <div
          className="on-dark relative flex flex-col items-start gap-6 overflow-hidden rounded-pebble bg-tide px-8 py-12 text-white sm:px-12 lg:flex-row lg:items-center lg:justify-between lg:px-16"
          {...rv("scale")}
        >
          <Rings className="-top-48 -right-24 size-[34rem]" />
          <div className="relative">
            <h2 id="book-title" className="relative text-h2">
              Ready to book?
            </h2>
            <p className="mt-3 max-w-[36rem] text-lead text-white/85">
              Pick a time online. We&apos;ll call to confirm and answer any questions first.
            </p>
          </div>
          <ButtonLink href={bookHref} variant="light" className="relative shrink-0">
            Request a visit
          </ButtonLink>
        </div>
      </section>
    </>
  );
}

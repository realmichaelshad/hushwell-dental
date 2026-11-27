import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Words, rv } from "@/components/motion/Words";
import { Icon } from "@/components/ui/Icon";
import { SERVICES } from "@/content/services";
import { CONTACT, HOURS } from "@/content/site";

/* ==========================================================================
   Footer: where we are, when we're open, how to reach us, every page. The
   last line says plainly that this is a concept practice.
   ========================================================================== */

export function Footer() {
  return (
    <footer className="on-dark bg-ink text-white">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:py-20">
        <div className="max-w-sm">
          <Link href="/" aria-label="Hushwell Dental, home" className="inline-block text-[1.35rem]">
            <Logo tone="light" />
          </Link>
          <p className="mt-5 text-white/80">
            A calm neighborhood dental practice for adults and kids. Gentle care, prices posted, nothing done without
            asking.
          </p>
        </div>

        <div>
          <h2 className="text-small font-bold text-tide-light">Visit</h2>
          <address className="mt-4 not-italic text-white/85" data-contact>
            {CONTACT.street}
            <br />
            {CONTACT.town}
          </address>
          <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-small text-white/80">
            <dt>Mon to Thu</dt>
            <dd className="tabular-nums">
              {HOURS[0]?.open} to {HOURS[0]?.close}
            </dd>
            <dt>Friday</dt>
            <dd className="tabular-nums">
              {HOURS[4]?.open} to {HOURS[4]?.close}
            </dd>
            <dt>Saturday</dt>
            <dd className="tabular-nums">
              {HOURS[5]?.open} to {HOURS[5]?.close}
            </dd>
          </dl>
        </div>

        <div>
          <h2 className="text-small font-bold text-tide-light">Services</h2>
          <ul className="mt-4 space-y-2">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="text-white/85 hover:text-white hover:underline">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-small font-bold text-tide-light">Practice</h2>
          <ul className="mt-4 space-y-2">
            {[
              { href: "/new-patients", label: "New patients" },
              { href: "/team", label: "Our team" },
              { href: "/book", label: "Request a visit" },
              { href: "/contact", label: "Contact and hours" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-white/85 hover:text-white hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="mt-6 space-y-2 text-small" data-contact>
            <li>
              <a href={CONTACT.phoneHref} className="inline-flex items-center gap-2 text-white/85 hover:text-white">
                <Icon name="phone" size={17} />
                {CONTACT.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2 text-white/85 hover:text-white">
                <Icon name="mail" size={17} />
                {CONTACT.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-page overflow-hidden" aria-hidden="true">
        <p
          className="-mb-[0.18em] font-display text-[clamp(5rem,21vw,19rem)] leading-[0.9] font-semibold tracking-[-0.055em] whitespace-nowrap text-white/[0.07] select-none"
          {...rv("words")}
        >
          <Words text="Hushwell" decorative />
        </p>
      </div>
      <div className="border-t border-white/10">
        <p className="container-page py-6 text-tiny text-white/65">
          A concept website. Hushwell Dental, its team and its reviews are fictional.
        </p>
      </div>
    </footer>
  );
}

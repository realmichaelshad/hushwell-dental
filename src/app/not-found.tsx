import Link from "next/link";
import { LogoMark } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { SERVICES } from "@/content/services";

export default function NotFound() {
  return (
    <section className="container-page grid min-h-[60vh] place-items-center py-24 text-center">
      <div className="max-w-[36rem]">
        <LogoMark className="mx-auto h-16 w-auto" />
        <h1 className="mt-8 text-h1">We couldn&apos;t find that page</h1>
        <p className="mt-4 text-lead text-ink-soft">
          The link may be old, or the address may have a typo. These are the pages people usually look for.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/">Go to the home page</ButtonLink>
          <ButtonLink href="/book" variant="secondary">
            Request a visit
          </ButtonLink>
        </div>
        <ul className="mt-10 flex flex-wrap justify-center gap-x-5 gap-y-2 text-small">
          {SERVICES.filter((s) => ["checkup-and-cleaning", "emergency-care", "whitening"].includes(s.slug)).map((s) => (
            <li key={s.slug}>
              <Link href={`/services/${s.slug}`} className="font-bold text-tide underline decoration-tide/30 underline-offset-4 hover:decoration-tide">
                {s.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

import Link from "next/link";
import { rv } from "@/components/motion/Words";
import { Icon } from "@/components/ui/Icon";
import { GROUPS, formatPrice, servicesInGroup, type ServiceGroup } from "@/content/services";
import { cn } from "@/lib/cn";

/* ==========================================================================
   Every service with its self-pay starting price, grouped by what you need.
   Each row is one link to the service page. Used on the home page and the
   services index.
   Wide screens balance the groups by length: everyday care and urgent care
   stack beside repairs (three rows each side), then "Your smile" runs full
   width with its two services side by side.
   ========================================================================== */

type Heading = "h2" | "h3";

function Group({ id, heading: H, index, wide = false }: { id: ServiceGroup; heading: Heading; index: number; wide?: boolean }) {
  const group = GROUPS.find((g) => g.id === id)!;
  return (
    <section aria-labelledby={`group-${group.id}`} className="rounded-panel border border-line bg-white p-2" {...rv("up", index)}>
      <div className="px-4 pt-4 pb-2 sm:px-5">
        <H id={`group-${group.id}`} className="text-[1.25rem]">
          {group.label}
        </H>
        <p className="text-small text-ink-faint">{group.blurb}</p>
      </div>
      <ul className={cn(wide && "lg:grid lg:grid-cols-2")}>
        {servicesInGroup(group.id).map((service) => (
          <li key={service.slug}>
            <Link
              href={`/services/${service.slug}`}
              data-ripple
              className="group flex items-start gap-4 rounded-card px-4 py-4 text-tide transition-colors duration-300 hover:bg-foam sm:px-5"
            >
              <span className="mt-0.5 grid size-11 shrink-0 place-items-center rounded-full bg-seaglass text-tide transition-[background-color,color,transform] duration-500 ease-[var(--ease-out-expo)] group-hover:scale-110 group-hover:bg-tide group-hover:text-white">
                <Icon name={service.icon} size={22} />
              </span>
              <span className="min-w-0 flex-1 text-ink transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1">
                <span className="block font-display text-[1.125rem] leading-snug font-semibold group-hover:text-tide">
                  {service.name}
                </span>
                <span className="mt-0.5 block text-small text-ink-soft">{service.summary}</span>
              </span>
              <span className="shrink-0 text-right text-ink">
                <span className="block text-tiny text-ink-faint">from</span>
                <span className="block font-display text-[1.1875rem] leading-tight font-semibold">{formatPrice(service.priceFrom)}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function PriceList({ className, headingLevel = 3 }: { className?: string; headingLevel?: 2 | 3 }) {
  const heading: Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <div className={cn("grid gap-6 lg:grid-cols-2", className)}>
      <div className="grid content-start gap-6">
        <Group id="everyday" heading={heading} index={0} />
        <Group id="urgent" heading={heading} index={1} />
      </div>
      <Group id="repairs" heading={heading} index={1} />
      <div className="lg:col-span-2">
        <Group id="smile" heading={heading} index={2} wide />
      </div>
    </div>
  );
}

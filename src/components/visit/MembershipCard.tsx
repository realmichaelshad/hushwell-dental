import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { MEMBERSHIP } from "@/content/visit";

/** The no-insurance plan: one dark card, the price large, what's included, one action. */
export function MembershipCard() {
  return (
    <div className="on-dark relative rounded-pebble bg-ink p-8 text-white sm:p-12" data-tilt>
      <p className="font-bold text-tide-light">No insurance?</p>
      <h3 className="mt-2 text-h2">{MEMBERSHIP.name}</h3>
      <p className="mt-5 flex items-baseline gap-2">
        <span className="font-display text-[4rem] leading-none font-semibold tracking-[-0.04em]">${MEMBERSHIP.price}</span>
        <span className="text-white/80">a month</span>
      </p>
      <p className="mt-2 text-small text-white/75">Kids ${MEMBERSHIP.kidsPrice} a month</p>
      <ul className="mt-8 space-y-3 border-t border-white/15 pt-8">
        {MEMBERSHIP.includes.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <Icon name="check" size={20} strokeWidth={2.25} className="mt-0.5 shrink-0 text-tide-light" />
            {item}
          </li>
        ))}
      </ul>
      <p className="mt-6 text-small text-white/75">{MEMBERSHIP.note}</p>
      <ButtonLink href="/book?coverage=membership" variant="light" className="mt-8">
        Request a visit
      </ButtonLink>
    </div>
  );
}

import type { IconName } from "@/components/ui/Icon";
import type { Faq } from "./services";

/* ==========================================================================
   New-patient content: the first visit minute by minute, the comfort menu,
   insurance answers and the membership plan.
   ========================================================================== */

export interface TimelineStep {
  minute: number;
  title: string;
  body: string;
}

export const FIRST_VISIT: TimelineStep[] = [
  {
    minute: 0,
    title: "Arrive and settle in",
    body: "Your forms are already done online, so there's no clipboard. Grab a tea and a blanket if you like.",
  },
  {
    minute: 5,
    title: "A short tour",
    body: "Your hygienist shows you the room, the chair and the stop signal. Raise your hand and everything pauses.",
  },
  {
    minute: 10,
    title: "Talk before anything else",
    body: "What's bothering you, what worries you, what's helped before. We write it down so nobody asks twice.",
  },
  {
    minute: 20,
    title: "A gentle cleaning",
    body: "Noise-cancelling headphones are on the tray. We check in with you every few minutes.",
  },
  {
    minute: 40,
    title: "A careful look",
    body: "Your dentist checks each tooth and your gums, and shows you anything worth seeing on the screen.",
  },
  {
    minute: 50,
    title: "Your plan, in writing",
    body: "What's healthy, what to watch and any treatment with its price. You don't have to decide anything today.",
  },
  {
    minute: 60,
    title: "That's it",
    body: "Book your next visit at the desk, or later online. Either is fine.",
  },
];

export interface ComfortItem {
  icon: IconName;
  title: string;
  body: string;
}

export const COMFORT: ComfortItem[] = [
  { icon: "hand", title: "A stop signal", body: "Raise your hand and we pause, no questions asked." },
  { icon: "headphones", title: "Headphones", body: "Noise-cancelling, with your own music or ours." },
  { icon: "blanket", title: "A warm blanket", body: "Weighted or light, whichever you prefer." },
  { icon: "chat", title: "As much detail as you want", body: "Tell me everything, or tell me nothing. Your call." },
];

export const INSURANCE_FAQS: Faq[] = [
  {
    q: "Do you take my insurance?",
    a: "We're in network with most PPO dental plans and accept state children's dental programs. Add your plan when you request a visit and we'll check your coverage before you come in.",
  },
  {
    q: "Will you bill my insurance for me?",
    a: "Yes. We send the claim, and you only pay your share at the visit.",
  },
  {
    q: "How will I know what I'll pay?",
    a: "Before any treatment you get a written estimate that shows what your plan covers and what you'll owe.",
  },
  {
    q: "I don't have insurance. Can I still come?",
    a: "Of course. Every service has its price posted, and the Hushwell Membership covers your preventive care for a monthly fee.",
  },
  {
    q: "Do you offer payment plans?",
    a: "Yes. For treatment over $500 you can spread the cost over 6 to 12 months with no interest.",
  },
  {
    q: "What should I bring?",
    a: "Your insurance card, a photo ID and a list of any medicines you take. If you've had X-rays in the last year, we can ask your old dentist for them.",
  },
];

export const MEMBERSHIP = {
  name: "Hushwell Membership",
  price: 29,
  kidsPrice: 19,
  includes: [
    "Two checkups and cleanings a year",
    "All routine X-rays",
    "One emergency exam a year",
    "15 percent off all other treatment",
  ],
  note: "No waiting periods, no yearly maximum, cancel anytime.",
} as const;

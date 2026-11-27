import type { IconName } from "@/components/ui/Icon";
import type { PhotoSlot } from "./photos";

/* ==========================================================================
   Services. Prices are self-pay "from" prices for a fictional practice.
   Each service has its own page at /services/<slug>.
   ========================================================================== */

export type ServiceGroup = "everyday" | "repairs" | "smile" | "urgent";

export const GROUPS: Array<{ id: ServiceGroup; label: string; blurb: string }> = [
  { id: "everyday", label: "Everyday care", blurb: "Checkups, cleanings and kids' visits." },
  { id: "repairs", label: "Repairs", blurb: "Fixing what hurts or what's broken." },
  { id: "smile", label: "Your smile", blurb: "Whiter, straighter, when you want it." },
  { id: "urgent", label: "Urgent care", blurb: "Same-day help when something hurts." },
];

export interface Step {
  title: string;
  body: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface Service {
  slug: string;
  name: string;
  group: ServiceGroup;
  icon: IconName;
  summary: string;
  intro: string;
  priceFrom: number;
  priceNote: string;
  duration: string;
  /** Typical chair time in minutes, for calendar entries. */
  minutes: number;
  visits: string;
  insurance: string;
  steps: Step[];
  comfort: string;
  faqs: Faq[];
  photo?: PhotoSlot;
}

export const SERVICES: Service[] = [
  {
    slug: "checkup-and-cleaning",
    name: "Checkup and cleaning",
    group: "everyday",
    icon: "sparkle",
    summary: "A gentle clean, a careful look and a plain-language report.",
    intro:
      "Most visits start here. Your hygienist cleans and polishes, your dentist checks every tooth and your gums, and you leave knowing exactly where things stand. If you've been away for years, that's fine. We start where you are.",
    priceFrom: 149,
    priceNote: "Self-pay price for an exam and cleaning. X-rays, if you need them, are $65.",
    duration: "About 60 minutes",
    minutes: 60,
    visits: "One visit, then every 6 months",
    insurance: "Most plans cover two a year in full.",
    steps: [
      {
        title: "We talk first",
        body: "Tell us what's bothering you and anything that makes visits hard. We note it on your chart so nobody asks twice.",
      },
      {
        title: "A gentle clean",
        body: "Your hygienist removes buildup with hand tools and a quiet ultrasonic scaler, and checks in with you as they go.",
      },
      {
        title: "The dentist's check",
        body: "We look at each tooth, your gums and your bite, and show you anything worth seeing on the screen.",
      },
      {
        title: "Your plan, in writing",
        body: "A short summary of what's healthy, what to watch and any treatment with its price. No decisions needed today.",
      },
    ],
    comfort:
      "Cleanings shouldn't hurt. If your gums are sensitive we use a numbing gel and slow down. Raise your hand anytime and we stop.",
    faqs: [
      {
        q: "I haven't been to a dentist in years. Will you lecture me?",
        a: "No. Lots of our patients come back after a long break. We'll clean, check and make a plan that fits your budget, with no judgment.",
      },
      {
        q: "Do I need X-rays every visit?",
        a: "No. We usually take a set once a year, or when something needs a closer look, and we'll always tell you why before we take them.",
      },
      {
        q: "How long does it take?",
        a: "About an hour for a first visit, and around 45 minutes after that.",
      },
    ],
    photo: "first-visit",
  },
  {
    slug: "kids-visits",
    name: "Kids' visits",
    group: "everyday",
    icon: "kid",
    summary: "Short, playful first visits that build trust before any treatment.",
    intro:
      "Children can start coming around their first birthday. Early visits are mostly about getting comfortable: riding the chair, counting teeth and learning to brush. We go at your child's pace, and you can stay in the room the whole time.",
    priceFrom: 89,
    priceNote: "Self-pay price for a kids' exam and cleaning.",
    duration: "About 30 minutes",
    minutes: 30,
    visits: "Every 6 months",
    insurance: "Covered by most plans and by state children's dental programs.",
    steps: [
      {
        title: "A ride in the chair",
        body: "Your child gets to explore the chair, the light and the tooth counter before anything else happens.",
      },
      {
        title: "Count and clean",
        body: "A quick count, a gentle polish and fluoride if it's right for them.",
      },
      {
        title: "Tips for home",
        body: "We show you both an easy brushing routine and answer questions about thumbs, pacifiers and snacks.",
      },
      {
        title: "A prize at the end",
        body: "Every visit ends with a sticker and a pick from the prize drawer.",
      },
    ],
    comfort:
      "We explain every tool in kid-friendly words and let them hold the mirror. If they're not ready, we stop and try again next time.",
    faqs: [
      {
        q: "When should my child first see a dentist?",
        a: "By their first birthday, or within six months of the first tooth coming in.",
      },
      {
        q: "Can I stay with my child?",
        a: "Yes, always. Younger kids often sit on a parent's lap for the first few visits.",
      },
      {
        q: "What are sealants?",
        a: "A thin protective coating for the back teeth. We usually suggest them around ages 6 and 12, when the adult molars come in.",
      },
    ],
    photo: "kids-visit",
  },
  {
    slug: "fillings",
    name: "Tooth-colored fillings",
    group: "repairs",
    icon: "tooth",
    summary: "Small repairs that match your tooth, usually done in one visit.",
    intro:
      "When a cavity is caught early, a filling is a quick fix. We remove the soft, damaged part of the tooth and rebuild it with a tooth-colored material that blends right in.",
    priceFrom: 165,
    priceNote: "Self-pay price for a one-surface filling. Larger fillings cost more, and you'll see the price before we start.",
    duration: "30 to 60 minutes",
    minutes: 60,
    visits: "One visit",
    insurance: "Most plans cover 70 to 80 percent.",
    steps: [
      {
        title: "Numbing you barely feel",
        body: "A numbing gel goes on first, then a slow, gentle injection. Most people tell us they didn't notice it.",
      },
      {
        title: "Clean out the cavity",
        body: "We remove only the damaged part, so as much healthy tooth stays as possible.",
      },
      {
        title: "Rebuild and shape",
        body: "The filling goes in layer by layer, is hardened with a blue light and shaped to your bite.",
      },
      {
        title: "Check your bite",
        body: "You bite on a thin paper so we can smooth any high spots before you leave.",
      },
    ],
    comfort:
      "You shouldn't feel pain, only pressure and vibration. If anything feels sharp, raise your hand and we'll stop and add more numbing.",
    faqs: [
      {
        q: "Can I eat after a filling?",
        a: "Yes. Tooth-colored fillings are hard right away. Wait until the numbness wears off so you don't bite your cheek.",
      },
      {
        q: "How long do fillings last?",
        a: "Usually 7 to 10 years or longer, depending on the size and how you care for them.",
      },
      {
        q: "Can you replace my old silver fillings?",
        a: "Yes, if they're worn or cracked. We don't replace healthy ones just for looks unless you ask us to.",
      },
    ],
    photo: "comfort-kit",
  },
  {
    slug: "root-canal",
    name: "Root canal treatment",
    group: "repairs",
    icon: "shield",
    summary: "Saves a badly hurting tooth. Feels much like a long filling.",
    intro:
      "A root canal clears infection from inside a tooth so you can keep it. It has a scary reputation, but with modern numbing most people say it felt like a long filling, and the toothache that brought them in goes away.",
    priceFrom: 950,
    priceNote: "Self-pay price for a front tooth. Molars start at $1,250. Most back teeth need a crown afterwards.",
    duration: "60 to 90 minutes",
    minutes: 90,
    visits: "One or two visits",
    insurance: "Most plans cover 50 to 80 percent.",
    steps: [
      {
        title: "Find the cause",
        body: "An X-ray and a few quick tests tell us which tooth is the problem and whether a root canal is the right fix.",
      },
      {
        title: "Numb it fully",
        body: "We make sure the tooth is completely numb before we begin, and check again during the visit.",
      },
      {
        title: "Clean and seal",
        body: "We clean out the infected pulp, disinfect the canals and seal them.",
      },
      {
        title: "Protect the tooth",
        body: "A temporary filling goes on, and most back teeth get a crown a couple of weeks later.",
      },
    ],
    comfort:
      "The treatment itself feels like a long filling. Expect some soreness for a day or two afterwards; over-the-counter pain relief usually handles it.",
    faqs: [
      {
        q: "Wouldn't it be easier to pull the tooth?",
        a: "Keeping your own tooth is almost always better for chewing and for the teeth around it. We'll talk through both options and their prices.",
      },
      {
        q: "Can I go back to work after?",
        a: "Most people do. You may stay numb for a few hours.",
      },
      {
        q: "Do I really need a crown afterwards?",
        a: "For back teeth, usually yes. A treated tooth is more brittle, and a crown keeps it from cracking.",
      },
    ],
    photo: "hero-room",
  },
  {
    slug: "crowns",
    name: "Crowns",
    group: "repairs",
    icon: "crown",
    summary: "A strong, natural-looking cap for a cracked or weak tooth.",
    intro:
      "A crown covers a tooth that's cracked, heavily filled or treated with a root canal, and makes it strong enough to chew on again. Ours are tooth-colored ceramic, shaded to match the teeth around it.",
    priceFrom: 1150,
    priceNote: "Self-pay price for a ceramic crown, including the temporary.",
    duration: "About 90 minutes, then 45",
    minutes: 90,
    visits: "Two visits, about two weeks apart",
    insurance: "Most plans cover around 50 percent.",
    steps: [
      {
        title: "Shape the tooth",
        body: "After numbing, we gently shape the tooth so the crown can fit over it.",
      },
      {
        title: "A digital scan",
        body: "No goopy impressions. A small wand scans your teeth in about two minutes.",
      },
      {
        title: "Wear a temporary",
        body: "You leave with a temporary crown while the lab makes yours.",
      },
      {
        title: "Fit the real one",
        body: "On your second visit we check the fit, color and bite, then bond it in place.",
      },
    ],
    comfort: "The first visit feels like a filling. The tooth may be a little sensitive to cold for a few days.",
    faqs: [
      {
        q: "How long does a crown last?",
        a: "Often 10 to 15 years or more with good care.",
      },
      {
        q: "Will it look fake?",
        a: "No. We match the shade to your own teeth and you'll see it before it's bonded.",
      },
      {
        q: "Can I eat normally with the temporary?",
        a: "Mostly. Skip sticky and very hard foods on that side until the real crown is in.",
      },
    ],
    photo: "scan-review",
  },
  {
    slug: "whitening",
    name: "Teeth whitening",
    group: "smile",
    icon: "sun",
    summary: "Brighter teeth, safely, with trays made for your smile.",
    intro:
      "Professional whitening works faster and more evenly than store-bought strips, and it's gentler on sensitive teeth. Most people choose take-home trays. If you have an event coming up, the in-office option works in one visit.",
    priceFrom: 295,
    priceNote: "Self-pay price for custom take-home trays and gel. In-office whitening is $450.",
    duration: "Take-home: about 2 weeks",
    minutes: 60,
    visits: "One or two visits",
    insurance: "Cosmetic, so not covered by insurance.",
    steps: [
      {
        title: "Check first",
        body: "We make sure there are no cavities or gum problems that whitening could irritate.",
      },
      {
        title: "Make your trays",
        body: "We scan your teeth and make thin, comfortable trays that fit only you.",
      },
      {
        title: "Whiten at home",
        body: "Wear them for 30 to 60 minutes a day for about two weeks.",
      },
      {
        title: "See the change",
        body: "We compare against your starting shade so you can see the difference.",
      },
    ],
    comfort: "Some people feel brief sensitivity. We include a soothing gel, and you can whiten every other day instead.",
    faqs: [
      {
        q: "How white will my teeth get?",
        a: "Most people go several shades lighter. Fillings and crowns don't change color, so we'll mention it if you have some at the front.",
      },
      {
        q: "How long does it last?",
        a: "One to three years. A short touch-up with your trays keeps it bright.",
      },
      {
        q: "Is it safe?",
        a: "Yes, when it's supervised. We check your teeth first and use a gel strength that suits you.",
      },
    ],
    photo: "smile",
  },
  {
    slug: "clear-aligners",
    name: "Clear aligners",
    group: "smile",
    icon: "aligner",
    summary: "Straighter teeth with nearly invisible, removable aligners.",
    intro:
      "Clear aligners gently move your teeth with a series of thin, removable trays. They're nearly invisible, you take them out to eat, and you'll see your projected result before you commit to anything.",
    priceFrom: 3900,
    priceNote: "Self-pay price for a full treatment, including refinements and your first retainers. Monthly payments available.",
    duration: "Usually 6 to 18 months",
    minutes: 45,
    visits: "A short check every 8 to 10 weeks",
    insurance: "Some plans include orthodontic benefits. We'll check yours for you.",
    steps: [
      {
        title: "A free consult",
        body: "We scan your teeth and talk about what you'd like to change.",
      },
      {
        title: "See your result",
        body: "A 3D preview shows how your teeth would move, with the full price, before you decide.",
      },
      {
        title: "Wear your aligners",
        body: "Wear each set about 22 hours a day and switch to the next one every week or two.",
      },
      {
        title: "Keep it",
        body: "When you're done, retainers hold your new smile in place.",
      },
    ],
    comfort: "Each new set feels snug for a day or two. That pressure means they're working.",
    faqs: [
      {
        q: "Am I a good candidate?",
        a: "Aligners work well for most crowding and spacing. Your free consult will tell you for sure.",
      },
      {
        q: "Can I take them out?",
        a: "Yes, for eating, drinking anything but water, and brushing. Just keep them in for about 22 hours a day.",
      },
      {
        q: "Do I have to wear retainers forever?",
        a: "At night, yes, to keep teeth from drifting back. It's a small habit that protects the result.",
      },
    ],
    photo: "aligners",
  },
  {
    slug: "emergency-care",
    name: "Same-day emergency care",
    group: "urgent",
    icon: "alert",
    summary: "Toothache, swelling or a broken tooth? We keep slots open every day.",
    intro:
      "Dental pain doesn't wait for a convenient time. We hold a few appointments open every day for emergencies, so if you call before noon, we can usually see you the same day.",
    priceFrom: 95,
    priceNote: "Self-pay price for an emergency exam and X-ray. Any treatment is quoted before we start.",
    duration: "About 30 minutes for the exam",
    minutes: 30,
    visits: "Same day when you call before noon",
    insurance: "Most plans cover emergency exams.",
    steps: [
      {
        title: "Call us",
        body: "Tell us what happened. We'll ask a few questions and find you the first open time.",
      },
      {
        title: "Find the cause",
        body: "A focused exam and an X-ray show us what's going on.",
      },
      {
        title: "Get out of pain",
        body: "Relief comes first. Sometimes that's the full fix, sometimes a temporary one.",
      },
      {
        title: "Plan the rest",
        body: "If you need more treatment, we explain the options and their prices, with no pressure to decide today.",
      },
    ],
    comfort: "We numb before we do anything, and relief usually starts the same day.",
    faqs: [
      {
        q: "What counts as a dental emergency?",
        a: "Severe toothache, swelling in your face or gums, a knocked-out or broken tooth, or a lost filling or crown that hurts.",
      },
      {
        q: "What if it's after hours?",
        a: "Call our main number and choose the after-hours option. If swelling affects your breathing or swallowing, go to the emergency room.",
      },
      {
        q: "A tooth got knocked out. What do I do?",
        a: "Pick it up by the top, not the root, rinse it gently and keep it in milk. Call us right away; the first hour matters most.",
      },
    ],
    photo: "treatment-room",
  },
];

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export function servicesInGroup(group: ServiceGroup): Service[] {
  return SERVICES.filter((s) => s.group === group);
}

/** "$1,150" */
export function formatPrice(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}

/** Up to `count` other services, same group first. */
export function relatedServices(slug: string, count = 3): Service[] {
  const current = getService(slug);
  if (!current) return [];
  const others = SERVICES.filter((s) => s.slug !== slug);
  const same = others.filter((s) => s.group === current.group);
  const rest = others.filter((s) => s.group !== current.group);
  return [...same, ...rest].slice(0, count);
}

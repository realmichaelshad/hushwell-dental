import type { PhotoSlot } from "./photos";

/* ==========================================================================
   The team and sample reviews. Every person here is invented for this
   concept practice.
   ========================================================================== */

export interface TeamMember {
  name: string;
  role: string;
  credentials?: string;
  photo: PhotoSlot;
  bio: string;
  outside: string;
}

export const TEAM: TeamMember[] = [
  {
    name: "Dr. Priya Raman",
    credentials: "DDS",
    role: "Dentist and practice owner",
    photo: "dr-raman",
    bio: "Priya opened Hushwell after years of hearing patients say they'd rather skip the dentist. She explains each step before she does it, and she put a stop signal at every chair.",
    outside: "Trail running and a stubborn sourdough starter.",
  },
  {
    name: "Dr. Marcus Okafor",
    credentials: "DMD",
    role: "Dentist, crowns and clear aligners",
    photo: "dr-okafor",
    bio: "Marcus does most of our crowns and aligner cases. Patients like that he shows them the scan first, gives them the price and lets them decide.",
    outside: "Coaching his daughter's soccer team.",
  },
  {
    name: "Lena Ortiz",
    credentials: "RDH",
    role: "Dental hygienist",
    photo: "lena",
    bio: "Lena has a reputation for the gentlest cleanings in Brookmere, and for remembering the names of everyone's kids.",
    outside: "Pottery, and very bad puns.",
  },
  {
    name: "Sam Whitlock",
    role: "Patient coordinator",
    photo: "sam",
    bio: "Sam handles scheduling and insurance, so you hear what a visit will cost before it happens, not after.",
    outside: "Plays bass in a wedding band.",
  },
];

export interface Review {
  name: string;
  visit: string;
  quote: string;
}

export const REVIEWS: Review[] = [
  {
    name: "Jordan M.",
    visit: "Checkup and cleaning",
    quote:
      "I hadn't been to a dentist in nine years because I was embarrassed. Nobody made me feel bad, and Lena talked me through the whole cleaning.",
  },
  {
    name: "Alicia R.",
    visit: "Crown",
    quote:
      "They told me the price of my crown before anything happened. No surprise bill, which has never happened to me at a dentist before.",
  },
  {
    name: "Dev P.",
    visit: "Kids' visit",
    quote: "My son asked when he can go back. That's a sentence I never expected to hear.",
  },
  {
    name: "Tom H.",
    visit: "Emergency care",
    quote: "Called at 9 with a cracked tooth, was seen by 11 and out of pain by lunch.",
  },
  {
    name: "Maya K.",
    visit: "Filling",
    quote: "The headphones and the stop signal sound like small things, but they made a huge difference for my anxiety.",
  },
  {
    name: "Chris L.",
    visit: "Clear aligners",
    quote: "Dr. Okafor showed me the preview and the full cost on the first visit. It made the decision easy.",
  },
];

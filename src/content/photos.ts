/* ==========================================================================
   Photography manifest
   Every photo on the site has a named slot. Drop a file named
   public/photos/<slot>.webp|.jpg|.jpeg|.png and the next build uses it.
   Until then <Photo slot="..."> renders a drawn fallback in the brand
   palette (src/components/photo/PhotoFallback.tsx).
   `focus` is the subject's position, used as the default crop.
   ========================================================================== */

export const PHOTO_SLOTS = [
  "hero-room",
  "treatment-room",
  "first-visit",
  "comfort-kit",
  "welcome-desk",
  "kids-visit",
  "smile",
  "aligners",
  "exterior",
  "scan-review",
  "dr-raman",
  "dr-okafor",
  "lena",
  "sam",
] as const;

export type PhotoSlot = (typeof PHOTO_SLOTS)[number];
export type PhotoAspect = "3:2" | "2:3" | "1:1" | "4:5";
/** Which drawn fallback a slot uses until its photo arrives. */
export type FallbackKind = "room" | "people" | "detail" | "portrait" | "street";

export interface PhotoSpec {
  slot: PhotoSlot;
  aspect: PhotoAspect;
  focus: string;
  alt: string;
  /** Background tone shown while the image loads. */
  tone: string;
  kind: FallbackKind;
  /** Initials for portrait fallbacks. */
  initials?: string;
}

export const PHOTOS: Record<PhotoSlot, PhotoSpec> = {
  "hero-room": {
    slot: "hero-room",
    aspect: "2:3",
    focus: "52% 60%",
    alt: "A bright treatment room: a sea-glass green dental chair with a knit blanket, a tall fig tree and a wall of windows onto green trees",
    tone: "#dcebe6",
    kind: "room",
  },
  "treatment-room": {
    slot: "treatment-room",
    aspect: "2:3",
    focus: "62% 66%",
    alt: "A sunlit treatment room with a sea-glass green dental chair, a knit blanket and a tall plant by the window",
    tone: "#dcebe6",
    kind: "room",
  },
  "first-visit": {
    slot: "first-visit",
    aspect: "3:2",
    focus: "50% 30%",
    alt: "A hygienist sitting at eye level, talking with a relaxed patient before a cleaning",
    tone: "#d6e8f1",
    kind: "people",
  },
  "comfort-kit": {
    slot: "comfort-kit",
    aspect: "1:1",
    focus: "58% 55%",
    alt: "Noise-cancelling headphones and a folded knit blanket resting on a dental chair",
    tone: "#eaf3f0",
    kind: "detail",
  },
  "welcome-desk": {
    slot: "welcome-desk",
    aspect: "3:2",
    focus: "45% 55%",
    alt: "The waiting room: soft chairs, plants, light wood and a small tea station",
    tone: "#dcebe6",
    kind: "room",
  },
  "kids-visit": {
    slot: "kids-visit",
    aspect: "3:2",
    focus: "48% 40%",
    alt: "A child in the dental chair holding a hand mirror while the hygienist kneels beside them",
    tone: "#d6e8f1",
    kind: "people",
  },
  smile: {
    slot: "smile",
    aspect: "1:1",
    focus: "45% 35%",
    alt: "A woman laughing outdoors in soft daylight",
    tone: "#eaf3f0",
    kind: "people",
  },
  aligners: {
    slot: "aligners",
    aspect: "1:1",
    focus: "52% 62%",
    alt: "A pair of clear aligners in an open case on a bathroom shelf",
    tone: "#eaf3f0",
    kind: "detail",
  },
  exterior: {
    slot: "exterior",
    aspect: "3:2",
    focus: "56% 55%",
    alt: "The practice entrance on a quiet, tree-lined street",
    tone: "#dcebe6",
    kind: "street",
  },
  "scan-review": {
    slot: "scan-review",
    aspect: "3:2",
    focus: "55% 35%",
    alt: "A dentist showing a patient a 3D scan of her teeth on a screen",
    tone: "#d6e8f1",
    kind: "people",
  },
  "dr-raman": {
    slot: "dr-raman",
    aspect: "4:5",
    focus: "50% 30%",
    alt: "Dr. Priya Raman",
    tone: "#dcebe6",
    kind: "portrait",
    initials: "PR",
  },
  "dr-okafor": {
    slot: "dr-okafor",
    aspect: "4:5",
    focus: "50% 30%",
    alt: "Dr. Marcus Okafor",
    tone: "#d6e8f1",
    kind: "portrait",
    initials: "MO",
  },
  lena: {
    slot: "lena",
    aspect: "4:5",
    focus: "50% 30%",
    alt: "Lena Ortiz, dental hygienist",
    tone: "#eaf3f0",
    kind: "portrait",
    initials: "LO",
  },
  sam: {
    slot: "sam",
    aspect: "4:5",
    focus: "50% 28%",
    alt: "Sam Whitlock, patient coordinator",
    tone: "#dcebe6",
    kind: "portrait",
    initials: "SW",
  },
};

const RATIOS: Record<PhotoAspect, number> = { "3:2": 3 / 2, "2:3": 2 / 3, "1:1": 1, "4:5": 4 / 5 };

export function aspectRatio(aspect: PhotoAspect): number {
  return RATIOS[aspect];
}

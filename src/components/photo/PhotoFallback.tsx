import { PHOTOS, type PhotoSlot } from "@/content/photos";

/* ==========================================================================
   Drawn stand-ins for photo slots that don't have a file yet. Flat shapes
   in the brand palette on a 600 × 600 stage, centred and cropped to cover
   any aspect ratio, so a page without photos still looks finished.
   ========================================================================== */

const C = {
  tide: "#1b6a64",
  tideLight: "#8fc7bd",
  seaglass: "#dcebe6",
  sky: "#d6e8f1",
  line: "#d3e1dc",
  ink: "#12302f",
  white: "#ffffff",
};

function Room() {
  return (
    <>
      <rect x="0" y="440" width="600" height="160" fill={C.white} opacity="0.55" />
      <path d="M205 420V210a95 95 0 0 1 190 0v210Z" fill={C.white} />
      <path d="M300 118v302M205 280h190" stroke={C.line} strokeWidth="6" />
      <path d="M248 440h104l70 120H178Z" fill={C.white} opacity="0.7" />
      <rect x="118" y="372" width="64" height="70" rx="12" fill={C.ink} opacity="0.14" />
      <ellipse cx="132" cy="330" rx="22" ry="58" transform="rotate(-24 132 330)" fill={C.tide} opacity="0.85" />
      <ellipse cx="168" cy="318" rx="20" ry="62" transform="rotate(18 168 318)" fill={C.tideLight} />
      <ellipse cx="150" cy="300" rx="16" ry="66" fill={C.tide} opacity="0.65" />
      <path
        d="M378 446h132a22 22 0 0 0 22-22v-8H404l-38-64a18 18 0 0 0-31 18l35 60a24 24 0 0 0 8 16Z"
        fill={C.ink}
        opacity="0.16"
      />
      <path d="M446 446v38M420 484h52" stroke={C.ink} strokeOpacity="0.16" strokeWidth="10" strokeLinecap="round" />
    </>
  );
}

function People() {
  return (
    <>
      <circle cx="236" cy="262" r="58" fill={C.tideLight} />
      <path d="M118 560c0-112 66-178 118-178s118 66 118 178Z" fill={C.tide} opacity="0.9" />
      <circle cx="386" cy="296" r="52" fill={C.white} />
      <path d="M282 600c0-108 56-166 104-166s104 58 104 166Z" fill={C.white} />
      <circle cx="312" cy="196" r="22" fill={C.white} opacity="0.7" />
    </>
  );
}

function Detail({ slot }: { slot: PhotoSlot }) {
  return (
    <>
      <circle cx="300" cy="300" r="190" fill={C.white} />
      <g
        transform="translate(156 156) scale(12)"
        fill="none"
        stroke={C.tide}
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {slot === "aligners" ? (
          <>
            <path d="M3.5 7c0 7.2 3.8 12 8.5 12s8.5-4.8 8.5-12" />
            <path d="M7.5 7.5c.3 4.6 2 7.5 4.5 7.5s4.2-2.9 4.5-7.5" />
          </>
        ) : (
          <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
        )}
      </g>
    </>
  );
}

function Portrait({ initials }: { initials: string }) {
  return (
    <>
      <circle cx="300" cy="300" r="150" fill={C.white} />
      <text
        x="300"
        y="300"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="112"
        fontWeight="700"
        letterSpacing="-4"
        fill={C.tide}
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {initials}
      </text>
    </>
  );
}

function Street() {
  return (
    <>
      <rect x="0" y="470" width="600" height="130" fill={C.line} />
      <rect x="150" y="150" width="330" height="320" fill={C.white} />
      <rect x="150" y="150" width="330" height="22" fill={C.ink} opacity="0.1" />
      <rect x="182" y="210" width="80" height="70" rx="6" fill={C.sky} />
      <rect x="368" y="210" width="80" height="70" rx="6" fill={C.sky} />
      <rect x="196" y="304" width="238" height="22" rx="11" fill={C.tide} />
      <rect x="280" y="340" width="70" height="130" rx="6" fill={C.ink} opacity="0.75" />
      <circle cx="96" cy="310" r="64" fill={C.tide} opacity="0.85" />
      <circle cx="132" cy="262" r="48" fill={C.tideLight} />
      <rect x="90" y="360" width="12" height="112" rx="6" fill={C.ink} opacity="0.3" />
    </>
  );
}

export function PhotoFallback({ slot, label }: { slot: PhotoSlot; label: string }) {
  const spec = PHOTOS[slot];
  return (
    <svg
      viewBox="0 0 600 600"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 size-full"
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
    >
      <rect width="600" height="600" fill={spec.tone} />
      {spec.kind === "room" && <Room />}
      {spec.kind === "people" && <People />}
      {spec.kind === "detail" && <Detail slot={slot} />}
      {spec.kind === "portrait" && <Portrait initials={spec.initials ?? ""} />}
      {spec.kind === "street" && <Street />}
    </svg>
  );
}

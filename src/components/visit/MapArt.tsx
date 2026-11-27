import { cn } from "@/lib/cn";

/* ==========================================================================
   A drawn neighborhood map (not a real place): the creek, Alder Park, the
   streets around Linden Street, the bus stop and the practice pin. The pin
   and its label sit dead centre, so any crop keeps them in view. Decorative
   detail only: the address beside it carries the information.
   ========================================================================== */

const STREETS_V = [140, 320, 480, 660];
const STREETS_H = [150, 300, 450];

export function MapArt({ className }: { className?: string }) {
  const xs = [-40, ...STREETS_V, 840];
  const ys = [-40, ...STREETS_H, 640];
  const blocks: Array<{ x: number; y: number; w: number; h: number }> = [];
  for (let i = 0; i < xs.length - 1; i++) {
    for (let j = 0; j < ys.length - 1; j++) {
      blocks.push({ x: xs[i]! + 15, y: ys[j]! + 15, w: xs[i + 1]! - xs[i]! - 30, h: ys[j + 1]! - ys[j]! - 30 });
    }
  }
  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      className={cn("block bg-seaglass", className)}
      role="img"
      aria-label="Map: Hushwell Dental is on Linden Street, across from Alder Park, with parking behind the building"
    >
      <rect width="800" height="600" fill="#e3efeb" />
      <g fill="#f6faf8">
        {blocks.map((b) => (
          <rect key={`${b.x}-${b.y}`} x={b.x} y={b.y} width={b.w} height={b.h} rx="10" />
        ))}
      </g>
      {/* creek */}
      <path d="M-40 70c140 40 220 70 360 40s240-60 360-30 140 40 160 30" fill="none" stroke="#c9e2ef" strokeWidth="30" strokeLinecap="round" />
      {/* park */}
      <path d="M-20 330c60-20 150-10 200 30s60 120 20 180-120 90-190 80-60-90-60-150 0-120 30-140Z" fill="#cfe5dc" />
      <circle cx="70" cy="420" r="20" fill="#a9d3c6" />
      <circle cx="130" cy="390" r="26" fill="#a9d3c6" />
      <circle cx="150" cy="470" r="17" fill="#a9d3c6" />
      {/* streets */}
      <g stroke="#ffffff" strokeWidth="18" strokeLinecap="round">
        {STREETS_V.map((x) => (
          <path key={x} d={`M${x} -20v640`} />
        ))}
        {STREETS_H.map((y) => (
          <path key={y} d={`M-20 ${y}h840`} />
        ))}
      </g>
      {/* parking behind the practice */}
      <g transform="translate(400 222)">
        <rect x="-17" y="-17" width="34" height="34" rx="8" fill="#ffffff" stroke="#b6c9c4" strokeWidth="2" />
        <text x="0" y="7" textAnchor="middle" fontFamily="var(--font-display)" fontWeight="700" fontSize="20" fill="#3d5957">
          P
        </text>
      </g>
      {/* bus stop */}
      <circle cx="480" cy="450" r="14" fill="#12302f" />
      <path d="M474 445h12v9h-12z" fill="#ffffff" />
      <g fontFamily="var(--font-sans)" fontWeight="700" fontSize="19" fill="#3d5957">
        <text x="168" y="307">Linden St</text>
        <text x="125" y="532" textAnchor="middle" fill="#3d5957">
          Alder Park
        </text>
        <text x="502" y="457">Bus 12</text>
      </g>
      {/* practice pin and label, centred */}
      <g transform="translate(400 300)">
        <ellipse cx="0" cy="4" rx="20" ry="7" fill="#12302f" opacity="0.18" />
        <path d="M0 0c-14-18-34-30-34-52a34 34 0 0 1 68 0c0 22-20 34-34 52Z" fill="#1b6a64" />
        <circle cx="0" cy="-52" r="13" fill="#ffffff" />
        <rect x="-104" y="18" width="208" height="46" rx="23" fill="#12302f" />
        <text x="0" y="48" textAnchor="middle" fontFamily="var(--font-display)" fontWeight="600" fontSize="21" fill="#ffffff">
          Hushwell Dental
        </text>
      </g>
    </svg>
  );
}

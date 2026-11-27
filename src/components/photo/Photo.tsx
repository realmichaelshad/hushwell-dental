import Image from "next/image";
import type { CSSProperties } from "react";
import { PHOTOS, aspectRatio, type PhotoAspect, type PhotoSlot } from "@/content/photos";
import { findPhoto } from "@/lib/photos.server";
import { cn } from "@/lib/cn";
import { PhotoFallback } from "./PhotoFallback";

/* ==========================================================================
   <Photo slot="hero-room" sizes="(min-width: 64rem) 40vw, 100vw" />
   Server component. Renders public/photos/<slot>.* with next/image when the
   file exists at build time, otherwise the slot's drawn fallback. The box
   keeps the slot's aspect ratio either way, so nothing shifts when a photo
   arrives.
   - reveal: the frame opens from a smaller rounded window as it scrolls in,
     while the picture settles from a slight zoom (stagger with revealIndex).
   - parallax: the picture drifts against the scroll by this factor.
   ========================================================================== */

export interface PhotoProps {
  slot: PhotoSlot;
  sizes: string;
  className?: string;
  aspect?: PhotoAspect | number;
  /** Fill the positioned parent instead of keeping an aspect ratio. */
  fill?: boolean;
  priority?: boolean;
  position?: string;
  /** Alt override. Pass "" for a decorative photo. */
  alt?: string;
  style?: CSSProperties;
  mediaClassName?: string;
  reveal?: boolean;
  revealIndex?: number;
  parallax?: number;
}

export function Photo({
  slot,
  sizes,
  className,
  aspect,
  fill = false,
  priority = false,
  position,
  alt,
  style,
  mediaClassName,
  reveal = false,
  revealIndex = 0,
  parallax,
}: PhotoProps) {
  const spec = PHOTOS[slot];
  const src = findPhoto(slot);
  const ratio = typeof aspect === "number" ? aspect : aspectRatio(aspect ?? spec.aspect);
  const label = alt ?? spec.alt;
  return (
    <div
      className={cn("overflow-hidden", fill ? "absolute inset-0" : "relative", className)}
      style={{
        aspectRatio: fill ? undefined : String(ratio),
        backgroundColor: spec.tone,
        ...(reveal ? ({ "--i": revealIndex } as CSSProperties) : null),
        ...style,
      }}
      data-photo={slot}
      data-photo-source={src ? "file" : "fallback"}
      data-reveal={reveal ? "clip" : undefined}
    >
      <div className={cn("absolute inset-0", mediaClassName)} data-parallax={parallax}>
        {src ? (
          <Image
            src={src}
            alt={label}
            fill
            sizes={sizes}
            priority={priority}
            fetchPriority={priority ? "high" : undefined}
            quality={80}
            className="object-cover"
            style={{ objectPosition: position ?? spec.focus }}
          />
        ) : (
          <PhotoFallback slot={slot} label={label} />
        )}
      </div>
    </div>
  );
}

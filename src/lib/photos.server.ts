import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { PhotoSlot } from "@/content/photos";

/* ==========================================================================
   Build-time photo lookup. Pages are statically generated, so this runs
   during `next build` (and per request in dev): adding a file to
   public/photos and rebuilding is all it takes to swap a fallback out.
   ========================================================================== */

const EXTENSIONS = ["webp", "avif", "jpg", "jpeg", "png"] as const;
const PHOTO_DIR = path.join(process.cwd(), "public", "photos");

export function findPhoto(slot: PhotoSlot): string | null {
  for (const ext of EXTENSIONS) {
    if (fs.existsSync(path.join(PHOTO_DIR, `${slot}.${ext}`))) return `/photos/${slot}.${ext}`;
  }
  return null;
}

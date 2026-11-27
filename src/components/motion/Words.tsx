import type { CSSProperties } from "react";

/* ==========================================================================
   Splits a headline into words, each in its own mask, so the words can rise
   into place one after another (see [data-reveal="words"] and .words-enter
   in globals.css). The text stays one readable string for screen readers
   and copy-paste: the wrappers are plain inline spans. A decorative word
   (decorative) is drawn by CSS from data-text, so it is never read as text.
   ========================================================================== */

export function Words({ text, offset = 0, decorative = false }: { text: string; offset?: number; decorative?: boolean }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          <span className="w">
            {decorative ? (
              <span style={{ "--wi": i + offset } as CSSProperties} className="deco-word" data-text={word} />
            ) : (
              <span style={{ "--wi": i + offset } as CSSProperties}>{word}</span>
            )}
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}

/** Props for a revealed element: `{...rv("up", 2)}` (kind, stagger index). */
export function rv(kind: "up" | "fade" | "clip" | "scale" | "words" | "left", i = 0) {
  return { "data-reveal": kind, style: { "--i": i } as CSSProperties };
}

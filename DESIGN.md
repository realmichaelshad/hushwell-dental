# Hushwell design system

## The idea

Most people who put off the dentist are afraid of not knowing: what will happen, whether it will hurt, what it will
cost. Hushwell's whole site answers those before anyone asks. Its signature is **"explained before it happens"**: the
first visit minute by minute, a posted price on every service, "Does it hurt?" on every service page, and a live card
of real open times on the home page. Everything else stays quiet so those parts carry the page.

## Brand

- **Name:** Hushwell. A hush is calm; a well is still water.
- **Mark:** a tooth resting in still water. One waterline crosses it and the tooth takes a lighter tint below the
  line. Two filled shapes and one stroke, so it holds at favicon size (`src/components/brand/Logo.tsx`,
  `src/app/icon.svg`).
- **Voice:** plain, warm, specific. Say what happens and what it costs. No pressure, no jargon, no exclamation marks.

## Color

All tokens live in `src/app/globals.css`; `src/lib/contrast.test.ts` checks every text pair against WCAG AA.

| Token | Hex | Role |
|---|---|---|
| ink | #12302F | Text, dark surfaces (membership card, footer) |
| ink-soft | #3D5957 | Secondary text |
| ink-faint | #5B7472 | Captions (still AA on white and mist) |
| tide | #1B6A64 | The one action color: buttons, links, selected states |
| tide-light | #8FC7BD | Teal on dark surfaces |
| seaglass | #DCEBE6 | Soft panels, icon circles, the urgent-care bar |
| foam | #EAF3F0 | Hover and selected backgrounds |
| mist | #F6F9F8 | Page background |
| sky | #D6E8F1 | Illustration only |
| sun | #E9B949 | Review stars only |

## Type

- **Albert Sans** (headlines, prices, minutes, the wordmark): weights 600 to 700, tight tracking.
- **Atkinson Hyperlegible Next** (everything people read): designed by the Braille Institute for low-vision readers.
  18 px body, generous line height.
- Atkinson's zero carries a slash, which reads as code in prices and times, so the digits 0 to 9 everywhere come from
  Albert Sans through a `unicode-range` face ("Hushwell Figures").
- Labels are sentence case. No all-caps eyebrows, no middle dots, no em dashes, no arrow characters (enforced by
  `src/lib/content.test.ts`).

## Shape and layout

- Radius follows hierarchy: photos 2 rem ("pebble"), panels 1.375 rem, cards 1 rem, fields 0.75 rem, buttons fully
  round.
- Content sits on a 78 rem container; the home hero's photo breaks out to the right edge of the window.
- Every interactive target is at least 44 px tall.

## Motion

Calm, like still water: things rise and settle on a long ease-out (`cubic-bezier(0.16, 1, 0.3, 1)`), never bounce.

| Layer | What moves | How |
|---|---|---|
| First screen | Headline words rise, the hero photo opens from a rounded window and settles, the openings card lifts in, the logo's water rises | CSS only, so nothing waits on JavaScript |
| On scroll | Headings word by word, content rises, photos open and drift (parallax), the review count ticks up, the timeline fills and lights each step, reviews drift in two rows | `MotionRoot` sets `data-in`; CSS does the rest |
| On touch | Ripples from the press point, hover lifts, photo zoom, the membership card leans with a light sheen, pages ease in on navigation | CSS plus small handlers in `MotionRoot` |

Rules: content is never stuck hidden (without JavaScript nothing is hidden at all, and the boot script drops the
hidden start states if the engine hasn't started within 4 seconds); everything is shown, still, under
`prefers-reduced-motion`; nothing on the first screen depends on scripts, so it never delays the largest paint;
`?showcase=1` settles everything for screenshots.

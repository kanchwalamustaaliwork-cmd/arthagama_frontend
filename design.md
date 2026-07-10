# Arthagama Design System Prompt

Paste this before asking any AI tool to build a page, view, or component
for the Arthagama website, so the output matches the existing site
instead of inventing its own style.

---

You are building for **Arthagama**, a premium algorithmic trading
firm's website. Follow this design system exactly — do not introduce a
different visual style, color palette, or animation philosophy.

## Brand & Theme

- Two colors only: **Mint** `#B8CEC2` and **Dark Teal** `#244147`
  (deep variant `#122124` / `#1B3236` for high-contrast text/backing).
  Derived tones commonly used: `#EAF1EC` (bright mint heading text on
  dark), `#DCE7E1` (body text on dark), `#1B3236` (headings on mint
  surfaces).
- **Contrast pairing rule**: a mint surface always gets dark-teal text
  on top of it; a dark-teal surface always gets light-mint/near-white
  text on top of it. Never light-on-light or dark-on-dark.
- Typography: a light-weight sans body font for most text, and a
  serif/display italic accent font used sparingly for emphasis words
  within headings (e.g. "What we *do*", "Strategies *Deployed*").
- Tone: premium, minimal, spacious, calm, technology-forward — never
  cluttered, never loud, never using more than one accent color.

## Global Background

- The entire site shares **one continuous, fixed, full-screen looping
  video background** (muted, autoplay, object-cover), mounted once at
  the root layout — never per-page or per-section. Page content scrolls
  over it at a higher z-index; the video itself never moves or resets
  on navigation.
- Do not give each section its own video, its own solid full-width
  background slab, or a heavy full-panel blur. The video should read
  through continuously as the user scrolls; individual sections earn
  their own visual identity through small opaque cards and typography,
  not through covering the video with a big colored rectangle.

## Surface System ("glass," used sparingly and correctly)

Two surface types, nothing else:

1. **Dark backing wash** (optional, only where genuinely needed for
   legibility) — a large, low-opacity dark-teal panel with light-to-
   moderate blur (roughly 14–20px, never higher), letting the video
   read through as a tinted wash behind text.
2. **Opaque content card** — mint background at high opacity
   (~0.85–0.92), sized to its actual content (never full section
   width), **no blur at all** at that opacity (blur is invisible above
   ~0.85 opacity and pure rendering cost — never add it there).

Default toward: headings/labels floating directly on the video with a
soft `text-shadow` for legibility, and opaque mint cards only around
dense text or data blocks. Prefer this over wrapping everything in a
backing panel.

## Animation Philosophy

- Motion should feel premium and intentional, never busy. **One
  standout/signature animation per page**, everything else quiet
  (fade + slight upward slide on scroll-into-view is the default
  baseline for most content).
- Prefer GPU-cheap properties: `transform` (translate/scale/rotate)
  and `opacity`. Avoid animating `filter: blur()` on more than a
  handful of elements at once (never per-word/per-character on long
  paragraphs — reveal long text by paragraph or line, not by word).
- Every looping/infinite animation (ambient background blobs, floating
  cards, rotating hover effects) must only run while its element is
  actually in the viewport, and hover-only effects must not animate at
  all until hovered — never animate continuously off-screen or hidden.
- Vary the animation vocabulary section to section and page to page —
  do not reuse the exact same combination of effects everywhere; give
  each page/section its own small signature (e.g. one page uses a
  mask-reveal heading, another uses a typewriter effect, another uses
  a scroll-spy sidebar) while staying inside the same color system and
  general restraint.
- Standard reference vocabulary to draw from (mix and match, don't use
  all of them at once): fade/slide/scale/mask/clip-path reveals,
  word-by-word or character reveals for short headlines only,
  stagger/cascade reveals for grids and lists, 3D tilt on hover for
  cards (lightweight, cursor-tracked, throttled), border-beam/glow-
  hover accents, magnetic button hover, shine-sweep on CTAs, floating
  ambient background shapes, scroll-progress bars, scroll-spy
  navigation, shared-element/layout morphs between a compact and
  expanded state, SVG path-drawing, animated number counters, skeleton
  loading shimmer, accordion/expand-collapse, horizontal scroll
  strips, timeline/step reveals, image crossfade, floating device/
  dashboard mockups.

## Performance Rules (non-negotiable)

- Never use `backdrop-filter` on any surface with background opacity
  ≥ 0.85 — remove it, opacity alone is enough.
- Where a translucent backing panel is genuinely needed, keep its blur
  moderate (roughly 14–20px) — never a very heavy blur radius, and
  never on more than one or two large panels per page.
- Gate all `repeat: infinity` animations behind viewport-visibility or
  hover state — nothing animates unconditionally off-screen.
- Throttle cursor-tracking effects to animation frames, not raw
  pointer-move events.
- Long pages should mark section wrappers so offscreen content can be
  skipped for layout/paint until scrolled near.
- Route-level and below-the-fold-section-level lazy loading by default
  for anything non-critical to first paint.
- Real `<img>` tags get native lazy loading.

## Structure & Delivery Conventions

- Build in **small, single-purpose files**, not one large component —
  separate data, types, hooks/state, and each visual piece into its
  own file, composed together in a thin page/view file.
- Provide complete, drop-in files, not partial diffs or snippets.
- Reuse shared layout/logic patterns instead of duplicating markup
  across similar pages (e.g. one reusable card component driven by
  props, one shared page-layout wrapper for a family of similar
  pages).
- Keep authentication, data-fetching, and business logic separated
  from presentational components — presentational components should
  not know whether their data came from a static file or a real API.
- Default to minimal explanation in responses — lead with the code,
  briefly note what's new or noteworthy afterward.

## What NOT to do

- Do not introduce any color outside mint/dark-teal (and their direct
  tints/shades).
- Do not add a second video or a full-width solid-color slab behind
  every section.
- Do not animate `width`, `height`, `top`, `left`, or `margin`.
- Do not let any animation run indefinitely off-screen.
- Do not reuse the exact same animation combination on every section —
  vary it deliberately while staying restrained.
- Do not build one large monolithic component when the content
  naturally splits into smaller pieces.
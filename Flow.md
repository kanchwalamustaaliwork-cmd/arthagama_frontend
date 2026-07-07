How the whole visual system flows
Here's the mental model so you can add the 6th, 7th, service yourself without re-reading this thread.
data/services.ts                     types/services.ts
  SERVICES[] entry                     visual: 'compare' (a string key)
        │                                     │
        └──────────────┬──────────────────────┘
                        ▼
        components/services/ServiceContainer.tsx
        (renders text column + glass frame, one per service)
                        │
                        │  <ServiceVisual type={service.visual} />
                        ▼
        components/services/visuals/ServiceVisual.tsx
        (dispatcher — looks up `type` in VISUAL_MAP)
                        │
        ┌───────────────┼────────────────┬─────────────┬─────────────┐
        ▼               ▼                ▼             ▼             ▼
  TerminalVisual   BacktestVisual   ResearchVisual  ExecutionVisual  CompareVisual
   (log lines)      (equity curve)   (headline+bars)  (order rows)   (2-line chart)
The three moving parts inside every visual:

State source — either:

useLoop(array, ms) → cycles through a fixed array of pre-baked "snapshots" (used in Backtest, Research, Compare). Good when you want clean, controlled fake data instead of random noise.
Local useState + setInterval → builds up state incrementally (used in Terminal for scrolling logs, Execution for incoming order rows). Good when the animation is a sequence rather than a cycle.


Render — plain SVG/div markup styled with your theme colors (#B8CEC2, #9FD9B8, #E3A8A8 for red/green deltas). No canvas, no video — just DOM + CSS, so it's cheap.
Motion — pure CSS @keyframes scoped in a <style> tag inside each component (stroke-dashoffset draw-ins, translateY fade-ins, opacity blinks). React only swaps the data; CSS handles the animation, so re-renders don't restart transitions unnecessarily.

Why this shape scales well:

Adding a service = one data entry + one visual component + one map entry. Nothing else touches ServiceContainer.
Each visual is self-contained (own state, own styles) — no shared animation timeline to break.
Swapping fake data for real API data later is a single-point change: replace the PAIRS/SNAPSHOTS array with a fetch result, same rendering code stays.

One thing worth doing next: since useLoop and the glass frame are now used identically everywhere, you could pull the frame + min-h-64 container into one VisualFrame wrapper so each visual file only contains its content, not its box.
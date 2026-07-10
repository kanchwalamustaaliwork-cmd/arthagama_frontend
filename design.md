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



  <!-- DASHBOARD PLAN AND DESIGN -->

  # Arthagama Backend Dashboard API - Implementation Prompt

You are extending an existing FastAPI backend for Arthagama, an algorithmic trading platform.

The authentication system is already completed (JWT authentication, user registration, login, refresh tokens, protected routes, MongoDB integration).

Your task is to design and implement the complete backend architecture required to power the authenticated Member Dashboard using modern FastAPI best practices.

The solution must be production-ready, scalable, modular, and easy to maintain as the platform grows.

---

# Existing Project

Current backend structure:

```text
app
├── core
├── db
├── dependencies
├── models
├── routers
├── schemas
└── main.py
```

The existing authentication module must remain untouched unless absolutely necessary for integration.

---

# Objective

Build the backend APIs and architecture required for the Member Dashboard.

The dashboard should support:

* Dashboard Overview
* My Strategies
* Backtesting
* Compare Stocks
* Research Reports

The implementation should be future-proof so additional modules (Portfolio, Alerts, Brokers, Orders, AI, etc.) can be added without restructuring the project.

---

# Expected Project Structure

Restructure and extend the backend using a clean, feature-based architecture.

The project should include dedicated modules for:

* Dashboard
* Strategies
* Backtesting
* Stock Comparison
* Research Reports
* Common Utilities
* Shared Models
* Shared Schemas
* Shared Services
* Shared Dependencies

Each feature should contain its own router, service layer, schema layer, and model definitions where appropriate.

Business logic must never live inside routers.

Routers should only receive requests and return responses.

---

# Dashboard Module

Create APIs required for the Dashboard page.

The dashboard endpoint should aggregate information from multiple modules and return a single optimized response for the frontend.

The dashboard should expose data for:

## Welcome

* User information
* Greeting
* Current date
* Market status

---

## Portfolio Summary

* Portfolio value
* Today's profit/loss
* Total returns
* Active strategies
* Running backtests
* Watchlist count
* Notifications count

---

## Portfolio Performance

Return chart-ready data.

Support multiple ranges:

* 1 Day
* 1 Week
* 1 Month
* 3 Months
* 6 Months
* 1 Year
* All

---

## AI Insights

Return dashboard insights including:

* Strategy opportunities
* Risk observations
* Suggested stocks
* Market summary
* Daily insights
* Recommendation cards

For now, return mock/generated data with an architecture that allows AI integration later.

---

## Strategy Summary

Return:

* Total strategies
* Active strategies
* Paused strategies
* Best performing strategy
* Recent strategies

---

## Strategy Matches

Return stocks currently matching user strategies.

Each result should contain:

* Stock
* Match percentage
* Strategy
* Signal
* Confidence

---

## Research Summary

Return:

* Latest reports
* Featured reports
* Recommended reports

---

## Market Movers

Return:

* Top gainers
* Top losers
* Trending stocks
* Most active stocks

---

## Heatmap Data

Return sector performance data.

---

## Watchlist Summary

Return:

* Watchlist stocks
* Price
* Daily change
* Signal

---

## Notifications

Return latest notifications.

---

## Economic Calendar

Return upcoming market events.

---

## Recent Activity

Return user activity history.

---

# Strategy Module

Implement complete CRUD support for user strategies.

A strategy belongs to one authenticated user.

Users can:

* Create
* Edit
* Delete
* Clone
* Archive
* Activate
* Pause
* Retrieve
* List

Each strategy should support:

* Name
* Description
* Market
* Timeframe
* Entry Rules
* Exit Rules
* Risk Management
* Position Sizing
* Stop Loss
* Target
* Indicators
* Status
* Created Date
* Updated Date

Design the data model so that future visual strategy builders can use it without schema changes.

---

# Backtesting Module

Implement APIs that allow users to:

* Run a backtest
* Save a backtest
* View previous backtests
* Retrieve detailed backtest results

Each result should contain:

* Total trades
* Winning trades
* Losing trades
* Win rate
* CAGR
* Drawdown
* Profit factor
* Sharpe ratio
* Equity curve data
* Monthly returns
* Trade history

For now, mock calculations are acceptable if market execution is not yet implemented, but the API contracts should remain production-ready.

---

# Compare Stocks Module

Create APIs allowing comparison of multiple stocks.

Comparison should include:

* Company overview
* Fundamentals
* Financial ratios
* Valuation
* Growth
* Profitability
* Technical indicators
* Overall comparison summary

The architecture should allow future integration with real NSE/BSE market data providers.

---

# Research Reports Module

Implement APIs for research reports.

Support:

* List reports
* Report details
* Featured reports
* Categories
* Search
* Filters
* Save report
* Remove saved report

Each report should include:

* Title
* Author
* Category
* Published date
* Summary
* Recommendation
* Risk level
* Charts (metadata)
* Tags

---

# Authentication

Every dashboard endpoint must require authentication.

Every resource must only be accessible by its owner unless explicitly marked as public.

Authorization should always verify ownership before returning or modifying user-specific data.

---

# Database Design

Design MongoDB collections following best practices.

Collections should be normalized where appropriate and indexed for performance.

Include suitable indexes for:

* User lookups
* Strategy queries
* Dashboard queries
* Report searches
* Activity history

Models should be designed to accommodate future scaling without breaking changes.

---

# API Design

Use RESTful conventions.

Each module should expose clean, predictable endpoints.

Support:

* Filtering
* Sorting
* Searching
* Pagination

Responses should be consistent across all modules.

Use standardized success and error response structures.

---

# Validation

Use Pydantic models for all requests and responses.

Separate:

* Request schemas
* Response schemas
* Internal database models

Never expose database models directly through the API.

---

# Error Handling

Implement consistent error handling across the application.

Return meaningful HTTP status codes and structured error responses.

---

# Services

Business logic must live inside service classes/functions.

Services should remain independent from routers and reusable across multiple endpoints.

---

# Dependency Injection

Use FastAPI dependency injection throughout the application.

Keep dependencies centralized and reusable.

---

# Performance

Optimize the backend for:

* Async MongoDB operations
* Efficient queries
* Minimal database round-trips
* Pagination
* Index usage

Dashboard APIs should aggregate data efficiently and avoid unnecessary queries.

---

# API Documentation

Every endpoint should include:

* Clear summary
* Description
* Request schema
* Response schema
* Tags

Swagger documentation should be clean and organized by feature.

---

# Future Scalability

The architecture should allow future modules to be added easily, including:

* Portfolio Management
* Broker Integration
* Live Trading
* Paper Trading
* Order Management
* Notifications
* Alerts
* AI Recommendations
* Market Scanner
* Watchlists
* Subscription Plans
* Admin Dashboard
* Analytics
* Audit Logs
* Payment Gateway
* Role-Based Access Control (RBAC)

Adding new modules should not require restructuring the existing codebase.

---

# Expected Deliverables

Generate the complete production-ready backend implementation.

Include:

* Updated project structure
* All new folders and files
* MongoDB models
* Pydantic schemas
* Routers
* Service layer
* Dependencies
* Database utilities
* API endpoints
* Index creation
* Configuration updates
* Integration with the existing authentication module

Maintain consistent coding style across the project.

Follow modern FastAPI, Pydantic v2, Motor (MongoDB), and Python best practices throughout the implementation.

Do not skip files or provide placeholders. Generate the implementation module by module, ensuring each module is complete, fully functional, and ready to integrate into the existing codebase.

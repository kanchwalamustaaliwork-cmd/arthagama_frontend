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



API FLOW FORMAT 

User
 │
 ▼
app/page.tsx
 │
 ▼
views/HomePage.tsx
 │
 ▼
components/HomeSection.tsx
 │
 ▼
hooks/useHome.ts
 │
 ▼
services/homeApi.ts
 │
 ▼
api/axios.ts
 │
 ▼
 Backend
 │
 ▼
Database




I want you to perform a complete architectural review of my CMS and frontend caching system with scalability in mind.

Do not immediately change code.

First understand the complete request lifecycle, explain the current architecture, identify its strengths and limitations, and then propose an architecture suitable for future growth.

The objective is not to optimize for today, but to design an architecture that can efficiently support large-scale production traffic while maintaining fast cache invalidation and fresh CMS content.

Current Architecture

The project consists of:

Frontend

Next.js App Router
Deployed on Vercel

CMS

Payload CMS
Deployed separately on Vercel

Database

MongoDB Atlas
Current Request Flow

Currently the architecture behaves like this.

Initial Request
Browser
      │
      ▼
Next.js Frontend
      │
      ▼
fetchCMS()
      │
      ▼
Payload CMS Public API
      │
      ▼
MongoDB Atlas
      │
      ▼
Latest Content
      │
      ▼
Frontend Rendering
      │
      ▼
Browser

The frontend is responsible for fetching CMS content.

The CMS simply exposes public APIs.

Current Update Flow

When an administrator edits content:

Payload Admin

      │

Save Document

      │

MongoDB Updated

      │

Payload afterChange Hook

      │

Webhook

      │

POST /api/revalidate

      │

Next.js

      │

revalidateTag()

revalidatePath()

      │

Next Request

      │

Frontend fetches CMS again

      │

Latest data displayed
Current Caching Strategy

Currently:

The frontend owns the cache.

The CMS returns fresh responses.

The frontend cache is invalidated through

revalidateTag()
revalidatePath()

This means there is only one cache responsible for serving users.

The CMS is no longer responsible for caching public API responses.

Why This Architecture Was Chosen

Previously the CMS also cached responses using HTTP Cache-Control headers.

That created two independent caching layers.

Browser

↓

Next.js Cache

↓

CMS Edge CDN Cache

↓

MongoDB

Whenever the CMS updated content,

the frontend cache was invalidated,

but the CMS CDN cache still returned old API responses.

This caused stale content to appear even after successful revalidation.

To solve that problem,

CMS response caching was removed,

allowing the frontend to become the single caching layer.

Current Advantages

Explain the benefits of the current architecture.

Examples to analyze:

Single cache owner.
Easier cache invalidation.
No synchronization between frontend cache and CMS cache.
Simpler debugging.
Predictable request lifecycle.
Easier development.
Easier revalidation.

Explain why this architecture works well for small and medium production workloads.

Future Scalability Analysis

Now assume the application grows significantly.

Example scale:

10,000 daily users
50,000 daily users
100,000 daily users
Millions of page requests
Multiple frontend instances
Multiple CMS instances
Global traffic
Multi-region deployments

Analyze how the current architecture behaves under increasing traffic.

Specifically explain:

How many requests eventually reach Payload CMS.
How many requests reach MongoDB.
Which layer becomes the bottleneck.
Which components scale naturally.
Which components require architectural improvements.
Future Caching Strategy

Without implementing code,

design an ideal long-term caching architecture.

Discuss topics such as:

Frontend Data Cache
Full Route Cache
Browser Cache
CDN Cache
Edge Cache
Origin Cache
Database Load
Cache Invalidation
Cache Consistency
Cache Ownership

Explain where each cache should ideally exist.

Explain which cache should be considered the source of truth.

Explain how cache invalidation should propagate through the system.

CMS Architecture Review

Analyze whether the CMS should remain:

Frontend

↓

Payload CMS

↓

MongoDB

or whether future scaling would benefit from introducing additional layers such as:

Frontend

↓

API Gateway

↓

Distributed Cache

↓

Payload CMS

↓

MongoDB

or

Frontend

↓

Edge Cache

↓

Payload CMS

↓

MongoDB

Explain the advantages and trade-offs of each architecture.

Database Scalability

Analyze future MongoDB load.

Explain:

read-heavy workloads
write-heavy workloads
CMS editing frequency
page view frequency
cache hit ratios
database query reduction

Discuss whether MongoDB becomes the bottleneck or whether caching absorbs most traffic.

Revalidation Strategy

Review the current webhook-based revalidation.

Explain:

strengths
limitations
scaling behavior
reliability
failure scenarios
retry strategies
monitoring considerations

Discuss whether the current approach remains suitable as the project grows.

Future Architecture Roadmap

Design an evolution path for the architecture.

Instead of jumping directly to enterprise-scale infrastructure, explain how the system could evolve naturally.

Example progression:

Stage 1

Small Website

↓

Frontend Cache

↓

Payload

↓

MongoDB

↓

Stage 2

Growing Website

↓

Frontend Cache

↓

Payload

↓

MongoDB Replica

↓

Stage 3

High Traffic

↓

Global CDN

↓

Frontend

↓

Distributed Cache

↓

Payload

↓

MongoDB Cluster

↓

Stage 4

Enterprise Scale

↓

Global Edge

↓

Regional Frontends

↓

Distributed Cache

↓

API Layer

↓

Payload

↓

MongoDB Sharded Cluster

Explain the purpose of each stage, when it becomes necessary, and what problems it solves.

Expected Output

Produce a complete architectural review document containing:

Current request lifecycle.
Current caching flow.
Current strengths.
Current weaknesses.
Scalability analysis.
Future bottlenecks.
Long-term architecture recommendations.
Suggested evolution roadmap.
Trade-off analysis between simplicity, consistency, performance, and scalability.

Focus on explaining the architecture, request flow, caching layers, and future evolution. Do not immediately modify the code unless explicitly requested.
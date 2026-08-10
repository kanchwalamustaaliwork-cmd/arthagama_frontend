/**
 * chartTimeAxis.ts
 *
 * Pure utility for the CandleChart X-axis.
 * No React, no DOM, no Canvas, no API calls — only logic.
 *
 * Pipeline:
 *   bars + visibleRange + plotWidth + interval
 *       ↓
 *   actual visible timestamp range
 *       ↓
 *   LabelGranularity
 *       ↓
 *   AxisTick[]  (barIndex, label, isBoundary)
 *       ↓
 *   CandleChart renders them
 *
 * Timezone: All date formatting is pinned to CHART_TZ (Asia/Kolkata)
 * so that browser locale never changes the displayed trading date.
 */

import type { Bar } from './CandleChart'

// ─── Timezone ────────────────────────────────────────────────────────────────

/** Single source of truth for the market display timezone. */
export const CHART_TZ = 'Asia/Kolkata'

// ─── Interval types ──────────────────────────────────────────────────────────

/**
 * Supported interval strings — mirrors the application's Interval type but
 * kept as a superset so the axis utility is forward-compatible with new
 * intervals (3m, 30m, 2h, 4h, 1M, 3M, 1y) without requiring application
 * type changes first.
 *
 * The existing Interval values ('1m','5m','15m','1h','1d','1w') are a subset.
 */
export type ChartInterval =
  | '1m' | '3m' | '5m' | '15m' | '30m'   // intraday — sub-hour
  | '1h' | '2h' | '4h'                    // intraday — hourly
  | '1d' | '3d'                            // daily
  | '1w' | '3w'                            // weekly
  | '1M' | '3M'                            // monthly
  | '1y'                                   // yearly

// ─── Interval category ───────────────────────────────────────────────────────

type IntervalCategory = 'intraday' | 'daily' | 'weekly' | 'monthly' | 'yearly'

/**
 * Classify an interval into a calendar category.
 * This is the primary driver of granularity decisions — NOT intervalSeconds().
 */
function categorize(interval: ChartInterval): IntervalCategory {
  switch (interval) {
    case '1m': case '3m': case '5m': case '15m': case '30m':
    case '1h': case '2h': case '4h':
      return 'intraday'
    case '1d': case '3d':
      return 'daily'
    case '1w': case '3w':
      return 'weekly'
    case '1M': case '3M':
      return 'monthly'
    case '1y':
      return 'yearly'
  }
}

/**
 * Approximate interval duration in seconds.
 * Used ONLY for pixel-spacing estimates — not as calendar truth.
 * Monthly/yearly values are intentionally approximate.
 */
export function intervalSeconds(interval: ChartInterval): number {
  switch (interval) {
    case '1m': return 60
    case '3m': return 180
    case '5m': return 300
    case '15m': return 900
    case '30m': return 1800
    case '1h': return 3600
    case '2h': return 7200
    case '4h': return 14400
    case '1d': return 86400
    case '3d': return 86400 * 3
    case '1w': return 86400 * 7
    case '3w': return 86400 * 21
    case '1M': return 86400 * 30   // approximate only
    case '3M': return 86400 * 91   // approximate only
    case '1y': return 86400 * 365  // approximate only
  }
}

// ─── Granularity ─────────────────────────────────────────────────────────────

/**
 * Label granularity levels.
 *
 * TIME_ONLY      → "09:15"
 * TIME_WITH_DATE → "09:15" normally, "09:15\n08 Aug" at a day boundary
 * DAY            → "07 Aug"
 * MONTH          → "Aug 2025"
 * YEAR           → "2025"
 */
export type LabelGranularity =
  | 'TIME_ONLY'
  | 'TIME_WITH_DATE'
  | 'DAY'
  | 'MONTH'
  | 'YEAR'

/** Milliseconds in common calendar units (approximate — used for span comparison only). */
const MS = {
  DAY:   86_400_000,
  WEEK:  86_400_000 * 7,
  MONTH: 86_400_000 * 30,
  YEAR:  86_400_000 * 365,
}

/**
 * Choose granularity based on interval category and actual visible time span.
 *
 * Day-boundary detection (TIME_ONLY vs TIME_WITH_DATE) is NOT done here —
 * that is resolved inside pickAxisTicks() by comparing consecutive timestamps.
 *
 * @param category    - result of categorize(interval)
 * @param spanMs      - (lastVisibleTimestamp - firstVisibleTimestamp) in ms
 * @param _plotWidthPx - available canvas width (reserved for future density hints)
 */
function chooseLabelGranularity(
  category: IntervalCategory,
  spanMs: number,
  _plotWidthPx: number,
): LabelGranularity {
  switch (category) {
    case 'intraday':
      // TIME_ONLY vs TIME_WITH_DATE is resolved in pickAxisTicks
      return 'TIME_WITH_DATE'

    case 'daily':
      if (spanMs < MS.YEAR * 2) return 'DAY'
      return 'MONTH'

    case 'weekly':
      if (spanMs < MS.MONTH * 6) return 'DAY'
      if (spanMs < MS.YEAR * 2)  return 'MONTH'
      return 'YEAR'

    case 'monthly':
      if (spanMs < MS.YEAR * 4) return 'MONTH'
      return 'YEAR'

    case 'yearly':
      return 'YEAR'
  }
}

// ─── Axis tick ───────────────────────────────────────────────────────────────

/** A single rendered tick on the X-axis. */
export interface AxisTick {
  /** Index into the bars array. */
  barIndex: number
  /**
   * Formatted label string. May contain '\n' for two-line labels
   * (used when a day boundary appears on an intraday chart).
   * CandleChart splits on '\n' and draws two lines.
   */
  label: string
  /**
   * True when this tick represents a significant calendar boundary
   * (day change for intraday, month change for daily/weekly, year change
   * for monthly/yearly). CandleChart may draw a slightly brighter grid line.
   */
  isBoundary: boolean
}

// ─── Formatting ──────────────────────────────────────────────────────────────

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

/**
 * Extract IST-correct date/time parts from a unix-seconds timestamp.
 * Uses Intl.DateTimeFormat pinned to CHART_TZ.
 */
function tzParts(tSec: number): { year: number; month: number; day: number; hour: number; minute: number } {
  const date = new Date(tSec * 1000)
  const parts = new Intl.DateTimeFormat('en-IN', {
    timeZone: CHART_TZ,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(date)
  const get = (type: string) => parts.find(p => p.type === type)?.value ?? '00'
  return {
    year:   parseInt(get('year')),
    month:  parseInt(get('month')),
    day:    parseInt(get('day')),
    hour:   parseInt(get('hour')),
    minute: parseInt(get('minute')),
  }
}

/**
 * Format a unix-seconds timestamp as an axis label string.
 *
 * @param tSec        - unix seconds (candle timestamp)
 * @param granularity - chosen label granularity
 * @param prevTSec    - previous accepted tick's timestamp (for TIME_WITH_DATE boundary)
 */
export function formatAxisLabel(
  tSec: number,
  granularity: LabelGranularity,
  prevTSec?: number,
): string {
  const p   = tzParts(tSec)
  const hh  = String(p.hour).padStart(2, '0')
  const mm  = String(p.minute).padStart(2, '0')
  const dd  = String(p.day).padStart(2, '0')
  const mon = MONTH_NAMES[p.month - 1]
  const yyyy = String(p.year)

  switch (granularity) {
    case 'TIME_ONLY':
      return `${hh}:${mm}`

    case 'TIME_WITH_DATE': {
      const timeStr = `${hh}:${mm}`
      if (prevTSec === undefined) {
        // First label — always include the date for context
        return `${timeStr}\n${dd} ${mon}`
      }
      const prev     = tzParts(prevTSec)
      const dayChanged =
        p.day !== prev.day || p.month !== prev.month || p.year !== prev.year
      return dayChanged ? `${timeStr}\n${dd} ${mon}` : timeStr
    }

    case 'DAY':
      return `${dd} ${mon}`

    case 'MONTH':
      return `${mon} ${yyyy}`

    case 'YEAR':
      return yyyy
  }
}

/**
 * Full crosshair timestamp — always shows date + time in IST.
 * Used by CandleChart's OHLC legend tooltip regardless of granularity,
 * so the user always has precise context when hovering.
 */
export function formatCrosshairTime(tSec: number): string {
  const p   = tzParts(tSec)
  const hh  = String(p.hour).padStart(2, '0')
  const mm  = String(p.minute).padStart(2, '0')
  const dd  = String(p.day).padStart(2, '0')
  const mon = MONTH_NAMES[p.month - 1]
  return `${dd} ${mon} ${p.year}  ${hh}:${mm}`
}

// ─── Boundary detection ───────────────────────────────────────────────────────

/**
 * Returns true when the current tick represents a significant calendar
 * boundary relative to the previous tick, based on granularity level.
 *
 * Boundary semantics:
 *   TIME_ONLY / TIME_WITH_DATE → calendar day changes (IST)
 *   DAY                        → calendar month changes (IST)
 *   MONTH                      → calendar year changes (IST)
 *   YEAR                       → never
 */
function detectBoundary(
  tSec: number,
  prevTSec: number | undefined,
  granularity: LabelGranularity,
): boolean {
  if (prevTSec === undefined) return false
  const cur  = tzParts(tSec)
  const prev = tzParts(prevTSec)

  switch (granularity) {
    case 'TIME_ONLY':
    case 'TIME_WITH_DATE':
      return cur.day !== prev.day || cur.month !== prev.month || cur.year !== prev.year
    case 'DAY':
      return cur.month !== prev.month || cur.year !== prev.year
    case 'MONTH':
      return cur.year !== prev.year
    case 'YEAR':
      return false
  }
}

// ─── Main function ────────────────────────────────────────────────────────────

/** Minimum pixel gap between two axis tick labels (prevents overlap). */
const MIN_GAP_PX = 72

/**
 * The single function CandleChart calls to get X-axis ticks.
 *
 * Steps:
 *  1. Slice visible bars → extract actual first/last timestamps
 *  2. Compute calendar span (ms) from real timestamps
 *  3. Choose label granularity using interval category + actual span
 *  4. Resolve TIME_ONLY vs TIME_WITH_DATE from same-day check
 *  5. Walk visible bars, enforcing minimum pixel spacing
 *  6. Detect day/month/year boundaries from actual timestamps
 *  7. Format each label (with day-boundary date injection for intraday)
 *  8. Deduplicate identical consecutive labels
 *  9. Return AxisTick[]
 *
 * @param bars         - full sorted data array
 * @param visibleRange - [firstVisibleIndex, lastVisibleIndex]
 * @param plotWidthPx  - canvas plot area width in CSS pixels
 * @param interval     - the currently selected chart interval
 * @param xOf          - maps bar index to canvas X pixel position (provided by CandleChart)
 */
export function pickAxisTicks(
  bars: Bar[],
  visibleRange: [number, number],
  plotWidthPx: number,
  interval: ChartInterval,
  xOf: (i: number) => number,
): AxisTick[] {
  const [a, b] = visibleRange
  if (bars.length === 0 || a > b || a >= bars.length) return []

  const clampedA = Math.max(0, a)
  const clampedB = Math.min(bars.length - 1, b)

  // 1. Actual visible timestamp range (in unix seconds)
  const firstTs = bars[clampedA].time
  const lastTs  = bars[clampedB].time
  const spanMs  = Math.max(0, (lastTs - firstTs) * 1000)

  // 2. Interval category (drives granularity — NOT intervalSeconds)
  const category = categorize(interval)

  // 3. Initial granularity
  let granularity = chooseLabelGranularity(category, spanMs, plotWidthPx)

  // 4. For intraday: refine to TIME_ONLY when all visible bars are same calendar day
  if (granularity === 'TIME_WITH_DATE') {
    const fp = tzParts(firstTs)
    const lp = tzParts(lastTs)
    const sameDay =
      fp.day === lp.day && fp.month === lp.month && fp.year === lp.year
    if (sameDay) granularity = 'TIME_ONLY'
  }

  // 5–9. Walk bars and build ticks
  const ticks: AxisTick[]  = []
  let lastAcceptedX        = -Infinity
  let lastAcceptedTSec: number | undefined = undefined
  let lastLabel            = ''

  for (let i = clampedA; i <= clampedB; i++) {
    const bar = bars[i]
    if (!bar) continue

    const x = xOf(i)

    // 5. Enforce minimum pixel spacing
    if (x - lastAcceptedX < MIN_GAP_PX) continue

    // 7. Format label (handles day-boundary date injection internally)
    const label = formatAxisLabel(bar.time, granularity, lastAcceptedTSec)

    // 8. Deduplicate: skip when label is identical to the previous accepted one
    //    (e.g. YEAR granularity with many monthly candles in the same year)
    if (label === lastLabel) continue

    // 6. Detect calendar boundary
    const isBoundary = detectBoundary(bar.time, lastAcceptedTSec, granularity)

    ticks.push({ barIndex: i, label, isBoundary })

    lastAcceptedX    = x
    lastAcceptedTSec = bar.time
    lastLabel        = label
  }

  return ticks
}

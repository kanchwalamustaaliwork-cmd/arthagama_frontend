/** Single OHLCV candlestick */
export interface Candle {
    time: string   // ISO timestamp
    open: number
    high: number
    low: number
    close: number
    volume: number
}

// NOTE: Tick-count intervals have been removed.
// The minimum supported chart interval is 1 second ("1s").
// Range-bar intervals are also not exposed in the chart UI.
export type Interval =
    // SECONDS
    | '1s' | '5s' | '10s' | '15s' | '30s' | '45s'
    // MINUTES
    | '1m' | '2m' | '3m' | '5m' | '10m' | '15m' | '30m' | '45m'
    // HOURS
    | '1h' | '2h' | '3h' | '4h'
    // DAYS / MONTHS
    | '1d' | '1w' | '1M' | '3M' | '6M' | '12M'

export interface IntervalGroup {
    category: string
    options: { value: Interval; label: string }[]
}

export const INTERVAL_GROUPS: IntervalGroup[] = [
    {
        category: 'SECONDS',
        options: [
            { value: '1s', label: '1 Second' },
            { value: '5s', label: '5 Seconds' },
            { value: '10s', label: '10 Seconds' },
            { value: '15s', label: '15 Seconds' },
            { value: '30s', label: '30 Seconds' },
            { value: '45s', label: '45 Seconds' },
        ],
    },
    {
        category: 'MINUTES',
        options: [
            { value: '1m', label: '1 Minute' },
            { value: '2m', label: '2 Minutes' },
            { value: '3m', label: '3 Minutes' },
            { value: '5m', label: '5 Minutes' },
            { value: '10m', label: '10 Minutes' },
            { value: '15m', label: '15 Minutes' },
            { value: '30m', label: '30 Minutes' },
            { value: '45m', label: '45 Minutes' },
        ],
    },
    {
        category: 'HOURS',
        options: [
            { value: '1h', label: '1 Hour' },
            { value: '2h', label: '2 Hours' },
            { value: '3h', label: '3 Hours' },
            { value: '4h', label: '4 Hours' },
        ],
    },
    {
        category: 'DAYS & MONTHS',
        options: [
            { value: '1d', label: '1 Day' },
            { value: '1w', label: '1 Week' },
            { value: '1M', label: '1 Month' },
            { value: '3M', label: '3 Months' },
            { value: '6M', label: '6 Months' },
            { value: '12M', label: '12 Months' },
        ],
    },
]

export const INTERVALS: Interval[] = INTERVAL_GROUPS.flatMap((g) => g.options.map((o) => o.value))

export const INTERVAL_LABELS: Record<Interval, string> = Object.fromEntries(
    INTERVAL_GROUPS.flatMap((g) => g.options.map((o) => [o.value, o.label]))
) as Record<Interval, string>

/** Minimum supported chart interval — 1 second */
export const MIN_CHART_INTERVAL: Interval = '1s'

/** Default chart interval used when none is stored or when an invalid/tick interval is loaded */
export const DEFAULT_CHART_INTERVAL: Interval = '1d'

/**
 * Validate an interval string and return a safe chart interval.
 * Tick intervals ("1t", "10t", etc.) are mapped to the default interval.
 * Unknown intervals are also mapped to the default interval.
 */
export function toSafeInterval(raw: string | null | undefined): Interval {
    if (!raw) return DEFAULT_CHART_INTERVAL
    // If it looks like a tick interval, reject and return default
    if (/^\d+t$/i.test(raw.trim())) return DEFAULT_CHART_INTERVAL
    // If it is in the valid set, return it
    const valid = INTERVALS as readonly string[]
    if (valid.includes(raw.trim())) return raw.trim() as Interval
    return DEFAULT_CHART_INTERVAL
}

export interface OHLCVResponse {
    symbol: string
    exchange: string
    interval: Interval
    source: string
    candles: Candle[]
}

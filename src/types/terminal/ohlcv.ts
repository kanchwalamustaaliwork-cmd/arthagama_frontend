/** Single OHLCV candlestick */
export interface Candle {
    time: string   // ISO timestamp
    open: number
    high: number
    low: number
    close: number
    volume: number
}

export type Interval =
    // TICKS
    | '1t' | '10t' | '100t' | '1000t'
    // SECONDS
    | '1s' | '5s' | '10s' | '15s' | '30s' | '45s'
    // MINUTES
    | '1m' | '2m' | '3m' | '5m' | '10m' | '15m' | '30m' | '45m'
    // HOURS
    | '1h' | '2h' | '3h' | '4h'
    // DAYS / MONTHS
    | '1d' | '1w' | '1M' | '3M' | '6M' | '12M'
    // RANGES
    | '1r' | '10r' | '100r' | '1000r'

export interface IntervalGroup {
    category: string
    options: { value: Interval; label: string }[]
}

export const INTERVAL_GROUPS: IntervalGroup[] = [
    {
        category: 'TICKS',
        options: [
            { value: '1t', label: '1 Tick' },
            { value: '10t', label: '10 Ticks' },
            { value: '100t', label: '100 Ticks' },
            { value: '1000t', label: '1000 Ticks' },
        ],
    },
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
    {
        category: 'RANGES',
        options: [
            { value: '1r', label: '1 Range' },
            { value: '10r', label: '10 Ranges' },
            { value: '100r', label: '100 Ranges' },
            { value: '1000r', label: '1000 Ranges' },
        ],
    },
]

export const INTERVALS: Interval[] = INTERVAL_GROUPS.flatMap((g) => g.options.map((o) => o.value))

export const INTERVAL_LABELS: Record<Interval, string> = Object.fromEntries(
    INTERVAL_GROUPS.flatMap((g) => g.options.map((o) => [o.value, o.label]))
) as Record<Interval, string>

export interface OHLCVResponse {
    symbol: string
    exchange: string
    interval: Interval
    source: string
    candles: Candle[]
}

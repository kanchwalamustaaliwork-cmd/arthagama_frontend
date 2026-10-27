/**
 * src/types/indices/index-performance.types.ts
 *
 * Types for Index Performance metrics and Historical chart points.
 */

export type IndexPeriod = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'YTD' | 'MAX'

export interface IndexPerformanceSummary {
    indexId: number
    currentValue: number
    absoluteChange: number
    percentChange: number
    asOf: string
    return1dPct?: number | null
    return1wPct?: number | null
    return1mPct?: number | null
    return3mPct?: number | null
    return6mPct?: number | null
    return1yPct?: number | null
    returnYtdPct?: number | null
    baseValue: number
    baseDate: string
}

export interface IndexHistoryPoint {
    date: string
    value: number
}

export interface IndexHistoryResponse {
    indexId: number
    period: IndexPeriod
    points: IndexHistoryPoint[]
}

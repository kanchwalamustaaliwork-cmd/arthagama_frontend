/**
 * src/mocks/indices/index-performance.mock.ts
 *
 * Mock performance summaries and deterministic historical chart data.
 * All figures are illustrative mock figures clearly marked as simulated.
 */

import { IndexPerformanceSummary, IndexHistoryPoint, IndexPeriod } from '@/src/types/indices'

export const MOCK_PERFORMANCE_SUMMARIES: Record<number, IndexPerformanceSummary> = {
    1001: {
        indexId: 1001,
        currentValue: 1482.35,
        absoluteChange: 18.45,
        percentChange: 1.26,
        asOf: 'Mock Data: Today, 15:30 IST',
        return1dPct: 1.26,
        return1wPct: 2.84,
        return1mPct: 5.12,
        return3mPct: 12.45,
        return6mPct: 18.90,
        return1yPct: 28.60,
        returnYtdPct: 16.40,
        baseValue: 1000,
        baseDate: '2023-01-02',
    },
    1002: {
        indexId: 1002,
        currentValue: 1624.80,
        absoluteChange: -8.20,
        percentChange: -0.50,
        asOf: 'Mock Data: Today, 15:30 IST',
        return1dPct: -0.50,
        return1wPct: 1.15,
        return1mPct: 3.42,
        return3mPct: 8.70,
        return6mPct: 14.25,
        return1yPct: 22.10,
        returnYtdPct: 11.80,
        baseValue: 1000,
        baseDate: '2023-01-02',
    },
    1003: {
        indexId: 1003,
        currentValue: 1245.60,
        absoluteChange: 6.80,
        percentChange: 0.55,
        asOf: 'Mock Data: Today, 15:30 IST',
        return1dPct: 0.55,
        return1wPct: 0.85,
        return1mPct: 2.10,
        return3mPct: 4.60,
        return6mPct: 8.90,
        return1yPct: 14.50,
        returnYtdPct: 7.20,
        baseValue: 1000,
        baseDate: '2023-01-02',
    },
    1004: {
        indexId: 1004,
        currentValue: 1892.40,
        absoluteChange: 42.10,
        percentChange: 2.28,
        asOf: 'Mock Data: Today, 15:30 IST',
        return1dPct: 2.28,
        return1wPct: 4.60,
        return1mPct: 9.80,
        return3mPct: 22.40,
        return6mPct: 34.10,
        return1yPct: 54.80,
        returnYtdPct: 28.50,
        baseValue: 1000,
        baseDate: '2023-01-02',
    },
    1005: {
        indexId: 1005,
        currentValue: 1530.15,
        absoluteChange: 15.60,
        percentChange: 1.03,
        asOf: 'Mock Data: Today, 15:30 IST',
        return1dPct: 1.03,
        return1wPct: -0.45,
        return1mPct: 4.25,
        return3mPct: 11.80,
        return6mPct: 19.40,
        return1yPct: 31.20,
        returnYtdPct: 15.60,
        baseValue: 1000,
        baseDate: '2023-01-02',
    },
    1006: {
        indexId: 1006,
        currentValue: 1380.90,
        absoluteChange: -4.30,
        percentChange: -0.31,
        asOf: 'Mock Data: Today, 15:30 IST',
        return1dPct: -0.31,
        return1wPct: 1.45,
        return1mPct: 3.10,
        return3mPct: 9.20,
        return6mPct: 16.70,
        return1yPct: 26.40,
        returnYtdPct: 13.90,
        baseValue: 1000,
        baseDate: '2023-01-02',
    },
    1007: {
        indexId: 1007,
        currentValue: 1710.25,
        absoluteChange: 24.50,
        percentChange: 1.45,
        asOf: 'Mock Data: Today, 15:30 IST',
        return1dPct: 1.45,
        return1wPct: 3.20,
        return1mPct: 7.40,
        return3mPct: 16.80,
        return6mPct: 28.40,
        return1yPct: 44.50,
        returnYtdPct: 21.00,
        baseValue: 1000,
        baseDate: '2023-01-02',
    },
    1008: {
        indexId: 1008,
        currentValue: 1420.50,
        absoluteChange: 18.20,
        percentChange: 1.30,
        asOf: 'Mock Data: Today, 15:30 IST',
        return1dPct: 1.30,
        return1wPct: 2.10,
        return1mPct: 6.50,
        return3mPct: 14.10,
        return6mPct: 22.80,
        return1yPct: 36.20,
        returnYtdPct: 18.40,
        baseValue: 1000,
        baseDate: '2023-01-02',
    },
    1009: {
        indexId: 1009,
        currentValue: 1115.40,
        absoluteChange: -12.30,
        percentChange: -1.09,
        asOf: 'Mock Data: Inactive Snapshot',
        return1dPct: -1.09,
        return1wPct: -2.15,
        return1mPct: 1.20,
        return3mPct: 5.40,
        return6mPct: 8.90,
        return1yPct: 11.54,
        returnYtdPct: 6.20,
        baseValue: 1000,
        baseDate: '2024-01-02',
    },
}

export function getMockPerformanceSummary(indexId: number, baseValue = 1000, baseDate = '2023-01-02'): IndexPerformanceSummary {
    if (MOCK_PERFORMANCE_SUMMARIES[indexId]) {
        return MOCK_PERFORMANCE_SUMMARIES[indexId]
    }
    // Fallback for user-created index
    return {
        indexId,
        currentValue: baseValue,
        absoluteChange: 0,
        percentChange: 0,
        asOf: 'Mock Data: Just Created',
        return1dPct: 0,
        return1wPct: 0,
        return1mPct: 0,
        return3mPct: 0,
        return6mPct: 0,
        return1yPct: 0,
        returnYtdPct: 0,
        baseValue,
        baseDate,
    }
}

export function generateMockHistoryPoints(indexId: number, period: IndexPeriod, currentValue = 1500): IndexHistoryPoint[] {
    const pointCountMap: Record<IndexPeriod, number> = {
        '1D': 25,
        '1W': 30,
        '1M': 30,
        '3M': 45,
        '6M': 60,
        '1Y': 75,
        'YTD': 50,
        'MAX': 90,
    }

    const count = pointCountMap[period] || 30
    const points: IndexHistoryPoint[] = []
    const now = new Date('2026-10-27T15:30:00+05:30')

    // Deterministic seed variation based on indexId and period length
    const seed = indexId * 37 + period.charCodeAt(0)
    const totalTrend = (seed % 17) - 4 // e.g. upward drift
    const startValue = currentValue * (1 - totalTrend / 100)

    for (let i = 0; i < count; i++) {
        const progress = i / (count - 1)
        const date = new Date(now)

        if (period === '1D') {
            const minutesBack = Math.round((1 - progress) * 360)
            date.setMinutes(date.getMinutes() - minutesBack)
        } else {
            const daysMultiplier: Record<IndexPeriod, number> = {
                '1D': 1,
                '1W': 7,
                '1M': 30,
                '3M': 90,
                '6M': 180,
                '1Y': 365,
                'YTD': 300,
                'MAX': 1200,
            }
            const daysBack = Math.round((1 - progress) * (daysMultiplier[period] || 30))
            date.setDate(date.getDate() - daysBack)
        }

        // Noise wave
        const wave = Math.sin(progress * Math.PI * 4 + seed) * (currentValue * 0.02)
        const interpolated = startValue + (currentValue - startValue) * progress
        const value = Math.max(100, Math.round((interpolated + wave) * 100) / 100)

        const dateStr = period === '1D'
            ? date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })
            : date.toISOString().split('T')[0]

        points.push({ date: dateStr, value })
    }

    // Ensure final point matches current value closely
    if (points.length > 0) {
        points[points.length - 1].value = currentValue
    }

    return points
}

export function getSparklinePoints(indexId: number): number[] {
    const summary = MOCK_PERFORMANCE_SUMMARIES[indexId]
    const cur = summary ? summary.currentValue : 1200
    const change = summary ? summary.percentChange : 1.0
    const start = cur * (1 - change / 100)
    const points: number[] = []
    for (let i = 0; i < 12; i++) {
        const prog = i / 11
        const wave = Math.sin(prog * Math.PI * 2 + indexId) * (cur * 0.01)
        points.push(Math.round(start + (cur - start) * prog + wave))
    }
    return points
}

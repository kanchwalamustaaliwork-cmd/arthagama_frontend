/**
 * src/utils/metrics.ts
 *
 * Centralized formatting and styling utility functions for strategy metrics.
 * Ensures consistent rendering across all dashboard metric cards and sections.
 */

export type MetricValueType = 'currency' | 'percentage' | 'duration' | 'timestamp' | 'number'
export type MetricColorType = 'pnl' | 'ratio' | 'profit' | 'loss' | 'neutral'

/**
 * Formats monetary amounts into Indian Rupee format (e.g. ₹1,25,340.25 or -₹50.00).
 */
export function formatCurrency(val: number | null | undefined): string {
    if (val === null || val === undefined || isNaN(Number(val))) return '₹0.00'
    const num = Number(val)
    const absVal = Math.abs(num).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
    return num < 0 ? `-₹${absVal}` : `₹${absVal}`
}

/**
 * Formats percentages (e.g. 14.83%).
 */
export function formatPercentage(val: number | null | undefined, decimals: number = 2): string {
    if (val === null || val === undefined || isNaN(Number(val))) return '0.00%'
    const num = Number(val)
    return `${num.toFixed(decimals)}%`
}

/**
 * Formats duration in minutes (e.g. 125 mins or 125.5 mins).
 */
export function formatDays(val: number | null | undefined): string {
    if (val === null || val === undefined || isNaN(Number(val))) return '0 Days'
    const num = Number(val)
    const formatted = Number.isInteger(num) ? num.toString() : num.toFixed(1)
    return `${formatted} Days`
}

/**
 * Formats ISO timestamps into '25 Jul 2026 03:45 PM' format.
 */
export function formatTimestamp(isoStr: string | null | undefined): string {
    if (!isoStr) return 'No trades yet'
    try {
        const date = new Date(isoStr)
        if (isNaN(date.getTime())) return 'No trades yet'

        const day = date.toLocaleDateString('en-IN', { day: '2-digit' })
        const month = date.toLocaleDateString('en-IN', { month: 'short' })
        const year = date.toLocaleDateString('en-IN', { year: 'numeric' })
        const time = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })

        return `${day} ${month} ${year} ${time}`
    } catch {
        return 'No trades yet'
    }
}

/**
 * Formats raw numbers with thousand separators.
 */
export function formatNumber(val: number | null | undefined, decimals: number = 0): string {
    if (val === null || val === undefined || isNaN(Number(val))) return '0'
    const num = Number(val)
    return num.toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    })
}

/**
 * Returns true if value is non-negative.
 */
export function isProfit(val: number | null | undefined): boolean {
    if (val === null || val === undefined) return true
    return Number(val) >= 0
}

/**
 * Formats metric value based on declarative type.
 */
export function formatMetricValue(value: unknown, type: MetricValueType): string {
    if (value === null || value === undefined) return '--'
    if (type === 'currency') return formatCurrency(Number(value))
    if (type === 'percentage') return formatPercentage(Number(value))
    if (type === 'duration') return formatDays(Number(value))
    if (type === 'timestamp') return formatTimestamp(String(value))
    if (type === 'number') return formatNumber(Number(value))
    return String(value)
}

/**
 * Computes color variable string according to metric color type and value.
 */
export function getMetricColor(val: number | null | undefined, colorType: MetricColorType): string {
    if (colorType === 'profit') return 'var(--db-profit)'
    if (colorType === 'loss') return 'var(--db-loss)'
    if (colorType === 'neutral') return 'var(--db-text)'

    if (val === null || val === undefined) return 'var(--db-text)'
    const num = Number(val)

    if (colorType === 'pnl') {
        if (num > 0) return 'var(--db-profit)'
        if (num < 0) return 'var(--db-loss)'
        return 'var(--db-text)'
    }

    if (colorType === 'ratio') {
        if (num >= 1.5) return 'var(--db-profit)'
        if (num > 0) return 'var(--db-mint)'
        if (num < 0) return 'var(--db-loss)'
        return 'var(--db-text)'
    }

    return 'var(--db-text)'
}

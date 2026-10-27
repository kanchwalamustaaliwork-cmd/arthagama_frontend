/**
 * src/utils/indices/format-index-value.ts
 *
 * Formatting utilities for Arthagama index values, percentage returns, and timestamps.
 */

export function formatIndexValue(value: number | null | undefined, decimals = 2): string {
    if (value === null || value === undefined || isNaN(value)) return '—'
    return value.toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    })
}

export function formatIndexChange(change: number | null | undefined, decimals = 2): string {
    if (change === null || change === undefined || isNaN(change)) return '—'
    const sign = change > 0 ? '+' : ''
    return `${sign}${change.toFixed(decimals)}`
}

export function formatIndexPercent(percent: number | null | undefined, includeSign = true): string {
    if (percent === null || percent === undefined || isNaN(percent)) return '—'
    const sign = includeSign && percent > 0 ? '+' : ''
    return `${sign}${percent.toFixed(2)}%`
}

export function formatIndexDate(dateStr: string | null | undefined): string {
    if (!dateStr) return '—'
    try {
        const d = new Date(dateStr)
        if (isNaN(d.getTime())) return dateStr
        return d.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
    } catch {
        return dateStr
    }
}

export function formatIndexDateTime(dateStr: string | null | undefined): string {
    if (!dateStr) return '—'
    try {
        const d = new Date(dateStr)
        if (isNaN(d.getTime())) return dateStr
        return d.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        })
    } catch {
        return dateStr
    }
}

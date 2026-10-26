/**
 * src/utils/stockdashboard/formatters.ts
 *
 * Financial formatting utilities for Indian markets (Crores, Lakhs, Rupee values, etc.)
 */

export function formatStockPrice(price: number | null | undefined): string {
    if (price === null || price === undefined || isNaN(price)) return '₹0.00'
    return '₹' + price.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}

export function formatPriceChange(change: number | null | undefined): string {
    if (change === null || change === undefined || isNaN(change)) return '0.00'
    const sign = change > 0 ? '+' : ''
    return `${sign}${change.toFixed(2)}`
}

export function formatPercentChange(pct: number | null | undefined): string {
    if (pct === null || pct === undefined || isNaN(pct)) return '0.00%'
    const sign = pct > 0 ? '+' : ''
    return `${sign}${pct.toFixed(2)}%`
}

export function formatCrores(crores: number | null | undefined, includeUnit = true): string {
    if (crores === null || crores === undefined || isNaN(crores)) return '₹0 Cr'
    if (crores >= 100000) {
        const lakhCr = (crores / 100000).toFixed(2)
        return `₹${lakhCr} Lakh Cr`
    }
    const formatted = crores.toLocaleString('en-IN')
    return includeUnit ? `₹${formatted} Cr` : `₹${formatted}`
}

export function formatVolume(volume: number | null | undefined): string {
    if (!volume || isNaN(volume)) return '0'
    if (volume >= 10000000) {
        return `${(volume / 10000000).toFixed(2)} Cr`
    }
    if (volume >= 100000) {
        return `${(volume / 100000).toFixed(2)} L`
    }
    if (volume >= 1000) {
        return `${(volume / 1000).toFixed(1)} K`
    }
    return volume.toLocaleString('en-IN')
}

export function formatRatio(val: number | null | undefined, suffix = 'x'): string {
    if (val === null || val === undefined || isNaN(val)) return '—'
    return `${val.toFixed(2)}${suffix}`
}

export function getChangeColor(val: number | null | undefined): string {
    if (!val || val === 0) return 'var(--db-text-muted, #708482)'
    return val > 0 ? 'var(--db-profit, #38D996)' : 'var(--db-loss, #E35D6A)'
}

/**
 * src/lib/api/stockdashboard/screener.api.ts
 *
 * Typed API functions for running stock screeners and retrieving presets.
 */

import {
    ScreenerFilterFieldDefinition,
    ScreenerPreset,
    ScreenerStockResult,
    ScreenerFilterRule,
} from '@/src/types/stockdashboard'
import {
    SCREENER_FILTER_FIELDS,
    SCREENER_PRESETS,
    MOCK_SCREENER_RESULTS,
} from '@/src/mocks/stockdashboard/screener.mock'
import { evaluateFilterRule } from '@/src/utils/stockdashboard/screener-operators'

const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

export interface ScreenerRunRequest {
    rules: ScreenerFilterRule[]
    sector?: string
    exchange?: string
    sortBy?: keyof ScreenerStockResult
    sortDirection?: 'asc' | 'desc'
}

export async function getScreenerFilters(): Promise<ScreenerFilterFieldDefinition[]> {
    await delay(100)
    return SCREENER_FILTER_FIELDS
}

export async function getScreenerPresets(): Promise<ScreenerPreset[]> {
    await delay(100)
    return SCREENER_PRESETS
}

export async function getScreenerPresetById(presetId: string): Promise<ScreenerPreset | null> {
    await delay(80)
    return SCREENER_PRESETS.find(p => p.id === presetId) ?? null
}

export async function previewScreener(req: ScreenerRunRequest): Promise<{ count: number }> {
    const results = await runScreener(req)
    return { count: results.length }
}

export async function runScreener(req: ScreenerRunRequest): Promise<ScreenerStockResult[]> {
    await delay(220)
    let filtered = [...MOCK_SCREENER_RESULTS]

    if (req.exchange && req.exchange !== 'ALL') {
        filtered = filtered.filter(s => s.exchange === req.exchange)
    }

    if (req.sector && req.sector !== 'ALL') {
        filtered = filtered.filter(s => s.sector === req.sector)
    }

    if (req.rules && req.rules.length > 0) {
        filtered = filtered.filter(stock => {
            return req.rules.every(rule => evaluateFilterRule(stock, rule))
        })
    }

    if (req.sortBy) {
        const key = req.sortBy
        const dir = req.sortDirection === 'asc' ? 1 : -1
        filtered.sort((a, b) => {
            const valA = a[key] ?? 0
            const valB = b[key] ?? 0
            if (valA < valB) return -1 * dir
            if (valA > valB) return 1 * dir
            return 0
        })
    }

    return filtered
}

/**
 * src/lib/api/stockdashboard/stock-search.api.ts
 *
 * Typed API functions for stock search.
 * Uses mock instruments with realistic simulated async delays.
 */

import { StockIdentity, Exchange } from '@/src/types/stockdashboard'
import { MOCK_INSTRUMENTS } from '@/src/mocks/stockdashboard/instruments.mock'

// Helper for realistic async network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

export async function searchStocks(query: string, exchange?: Exchange | 'ALL'): Promise<StockIdentity[]> {
    await delay(120)
    const trimmed = query.trim().toLowerCase()
    if (!trimmed) return []

    return MOCK_INSTRUMENTS
        .filter(inst => {
            const matchesExchange = !exchange || exchange === 'ALL' || inst.exchange === exchange
            const matchesQuery =
                inst.symbol.toLowerCase().includes(trimmed) ||
                inst.name.toLowerCase().includes(trimmed) ||
                inst.sector.toLowerCase().includes(trimmed) ||
                (inst.isin && inst.isin.toLowerCase().includes(trimmed))
            return matchesExchange && matchesQuery
        })
        .map(inst => ({
            symbol: inst.symbol,
            name: inst.name,
            exchange: inst.exchange,
            isin: inst.isin,
            sector: inst.sector,
            industry: inst.industry,
            marketCapCategory: inst.marketCapCategory,
        }))
}

export async function getStockQuickInfo(exchange: string, symbol: string): Promise<StockIdentity | null> {
    await delay(80)
    const inst = MOCK_INSTRUMENTS.find(
        i => i.symbol.toUpperCase() === symbol.toUpperCase() &&
             (!exchange || i.exchange.toUpperCase() === exchange.toUpperCase())
    )
    if (!inst) return null
    return {
        symbol: inst.symbol,
        name: inst.name,
        exchange: inst.exchange,
        isin: inst.isin,
        sector: inst.sector,
        industry: inst.industry,
        marketCapCategory: inst.marketCapCategory,
    }
}

/**
 * src/lib/api/stockdashboard/watchlists.api.ts
 *
 * Typed API functions for managing Watchlists and Portfolio Holdings.
 */

import { WatchlistItem, PortfolioHolding, PortfolioSummary, Exchange } from '@/src/types/stockdashboard'
import {
    MOCK_WATCHLISTS,
    MOCK_PORTFOLIO_HOLDINGS,
    MOCK_PORTFOLIO_SUMMARY,
} from '@/src/mocks/stockdashboard/watchlists.mock'

const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

let watchlistsState = [...MOCK_WATCHLISTS]
let portfolioHoldingsState = [...MOCK_PORTFOLIO_HOLDINGS]

export async function getWatchlists(): Promise<WatchlistItem[]> {
    await delay(120)
    return [...watchlistsState]
}

export async function createWatchlist(name: string, description?: string): Promise<WatchlistItem> {
    await delay(150)
    const newWl: WatchlistItem = {
        id: `wl_${Date.now()}`,
        name: name.trim(),
        description: description?.trim(),
        createdAt: new Date().toISOString(),
        stockSymbols: [],
    }
    watchlistsState.push(newWl)
    return newWl
}

export async function getWatchlistById(id: string): Promise<WatchlistItem | null> {
    await delay(80)
    return watchlistsState.find(w => w.id === id) ?? null
}

export async function updateWatchlist(id: string, name: string): Promise<WatchlistItem | null> {
    await delay(120)
    const target = watchlistsState.find(w => w.id === id)
    if (!target) return null
    target.name = name.trim()
    return target
}

export async function deleteWatchlist(id: string): Promise<boolean> {
    await delay(120)
    const idx = watchlistsState.findIndex(w => w.id === id)
    if (idx === -1) return false
    watchlistsState.splice(idx, 1)
    return true
}

export async function addStockToWatchlist(id: string, symbol: string, exchange: Exchange = 'NSE'): Promise<WatchlistItem | null> {
    await delay(100)
    const target = watchlistsState.find(w => w.id === id)
    if (!target) return null
    const upperSym = symbol.toUpperCase()
    if (!target.stockSymbols.some(s => s.symbol === upperSym && s.exchange === exchange)) {
        target.stockSymbols.push({ symbol: upperSym, exchange })
    }
    return target
}

export async function removeStockFromWatchlist(id: string, exchange: string, symbol: string): Promise<WatchlistItem | null> {
    await delay(100)
    const target = watchlistsState.find(w => w.id === id)
    if (!target) return null
    target.stockSymbols = target.stockSymbols.filter(
        s => !(s.symbol.toUpperCase() === symbol.toUpperCase() && s.exchange.toUpperCase() === exchange.toUpperCase())
    )
    return target
}

export async function getPortfolioSummary(): Promise<PortfolioSummary> {
    await delay(140)
    return MOCK_PORTFOLIO_SUMMARY
}

export async function getPortfolioHoldings(): Promise<PortfolioHolding[]> {
    await delay(160)
    return [...portfolioHoldingsState]
}

export async function getPortfolioPerformance(): Promise<{ date: string; value: number }[]> {
    await delay(120)
    const now = new Date()
    const points = []
    let val = 1100000
    for (let i = 30; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 86400 * 1000)
        val = val * (1 + 0.0015 + (Math.sin(i) * 0.005))
        points.push({
            date: d.toISOString().slice(0, 10),
            value: Math.round(val),
        })
    }
    return points
}

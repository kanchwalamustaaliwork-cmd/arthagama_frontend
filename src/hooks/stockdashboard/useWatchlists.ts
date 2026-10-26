/**
 * src/hooks/stockdashboard/useWatchlists.ts
 *
 * Hook for managing Watchlists and Portfolio Holdings.
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import {
    WatchlistItem,
    PortfolioHolding,
    PortfolioSummary,
    StockQuote,
    Exchange,
} from '@/src/types/stockdashboard'
import {
    getWatchlists,
    createWatchlist,
    deleteWatchlist,
    addStockToWatchlist,
    removeStockFromWatchlist,
    getPortfolioSummary,
    getPortfolioHoldings,
} from '@/src/lib/api/stockdashboard/watchlists.api'
import { MOCK_INSTRUMENTS } from '@/src/mocks/stockdashboard/instruments.mock'

export function useWatchlists() {
    const [watchlists, setWatchlists] = useState<WatchlistItem[]>([])
    const [activeWatchlistId, setActiveWatchlistId] = useState<string>('')
    const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummary | null>(null)
    const [portfolioHoldings, setPortfolioHoldings] = useState<PortfolioHolding[]>([])
    const [loading, setLoading] = useState(true)

    const refreshData = useCallback(async () => {
        setLoading(true)
        try {
            const [wls, summary, holdings] = await Promise.all([
                getWatchlists(),
                getPortfolioSummary(),
                getPortfolioHoldings(),
            ])
            setWatchlists(wls)
            if (wls.length > 0 && !activeWatchlistId) {
                setActiveWatchlistId(wls[0].id)
            }
            setPortfolioSummary(summary)
            setPortfolioHoldings(holdings)
        } finally {
            setLoading(false)
        }
    }, [activeWatchlistId])

    useEffect(() => {
        refreshData()
    }, [refreshData])

    const activeWatchlist = watchlists.find(w => w.id === activeWatchlistId) || watchlists[0]

    // Resolve live mock quotes for the stocks in the active watchlist
    const watchlistQuotes: (StockQuote & { name: string; sector: string })[] = (
        activeWatchlist?.stockSymbols || []
    ).map(({ symbol, exchange }) => {
        const inst = MOCK_INSTRUMENTS.find(i => i.symbol === symbol)
        if (inst) {
            return {
                ...inst.quote,
                exchange,
                name: inst.name,
                sector: inst.sector,
            }
        }
        return {
            symbol,
            exchange,
            currentPrice: 1000,
            change: 0,
            percentChange: 0,
            dayHigh: 1020,
            dayLow: 990,
            openPrice: 1000,
            previousClose: 1000,
            volume: 100000,
            turnoverCr: 10,
            week52High: 1200,
            week52Low: 800,
            lastUpdated: 'Mock Data',
            name: symbol,
            sector: 'Equities',
        }
    })

    const handleCreateWatchlist = async (name: string, description?: string) => {
        const created = await createWatchlist(name, description)
        setWatchlists(prev => [...prev, created])
        setActiveWatchlistId(created.id)
    }

    const handleDeleteWatchlist = async (id: string) => {
        await deleteWatchlist(id)
        setWatchlists(prev => prev.filter(w => w.id !== id))
        if (activeWatchlistId === id) {
            const remaining = watchlists.filter(w => w.id !== id)
            if (remaining.length > 0) setActiveWatchlistId(remaining[0].id)
        }
    }

    const handleAddStock = async (symbol: string, exchange: Exchange = 'NSE') => {
        if (!activeWatchlistId) return
        const updated = await addStockToWatchlist(activeWatchlistId, symbol, exchange)
        if (updated) {
            setWatchlists(prev => prev.map(w => (w.id === updated.id ? updated : w)))
        }
    }

    const handleRemoveStock = async (exchange: string, symbol: string) => {
        if (!activeWatchlistId) return
        const updated = await removeStockFromWatchlist(activeWatchlistId, exchange, symbol)
        if (updated) {
            setWatchlists(prev => prev.map(w => (w.id === updated.id ? updated : w)))
        }
    }

    return {
        watchlists,
        activeWatchlist,
        activeWatchlistId,
        setActiveWatchlistId,
        watchlistQuotes,
        portfolioSummary,
        portfolioHoldings,
        loading,
        createWatchlist: handleCreateWatchlist,
        deleteWatchlist: handleDeleteWatchlist,
        addStock: handleAddStock,
        removeStock: handleRemoveStock,
        refresh: refreshData,
    }
}

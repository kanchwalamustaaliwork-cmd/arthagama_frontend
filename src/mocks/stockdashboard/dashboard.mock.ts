/**
 * src/mocks/stockdashboard/dashboard.mock.ts
 *
 * Mock data for the main Stock Dashboard landing view (/admin/stockdashboard/all).
 */

import { DashboardOverviewResponse, MarketIndex, TopMoverItem } from '@/src/types/stockdashboard'
import { MOCK_INSTRUMENTS } from './instruments.mock'

export const MOCK_MARKET_INDICES: MarketIndex[] = [
    {
        name: 'NIFTY 50',
        value: 24852.15,
        change: 148.60,
        percentChange: 0.60,
        high: 24915.40,
        low: 24730.10,
    },
    {
        name: 'SENSEX',
        value: 81420.35,
        change: 480.20,
        percentChange: 0.59,
        high: 81650.00,
        low: 81050.50,
    },
    {
        name: 'BANK NIFTY',
        value: 51240.80,
        change: 320.45,
        percentChange: 0.63,
        high: 51480.00,
        low: 50920.00,
    },
    {
        name: 'NIFTY IT',
        value: 39180.50,
        change: -115.30,
        percentChange: -0.29,
        high: 39420.00,
        low: 38990.10,
    },
]

export const MOCK_TOP_GAINERS: TopMoverItem[] = MOCK_INSTRUMENTS
    .filter(i => i.quote.percentChange > 0)
    .sort((a, b) => b.quote.percentChange - a.quote.percentChange)
    .slice(0, 5)
    .map(i => ({
        symbol: i.symbol,
        name: i.name,
        exchange: i.exchange,
        price: i.quote.currentPrice,
        change: i.quote.change,
        percentChange: i.quote.percentChange,
        volume: i.quote.volume,
        sector: i.sector,
    }))

export const MOCK_TOP_LOSERS: TopMoverItem[] = MOCK_INSTRUMENTS
    .filter(i => i.quote.percentChange < 0)
    .sort((a, b) => a.quote.percentChange - b.quote.percentChange)
    .slice(0, 5)
    .map(i => ({
        symbol: i.symbol,
        name: i.name,
        exchange: i.exchange,
        price: i.quote.currentPrice,
        change: i.quote.change,
        percentChange: i.quote.percentChange,
        volume: i.quote.volume,
        sector: i.sector,
    }))

export const MOCK_MOST_ACTIVE: TopMoverItem[] = [...MOCK_INSTRUMENTS]
    .sort((a, b) => b.quote.volume - a.quote.volume)
    .slice(0, 5)
    .map(i => ({
        symbol: i.symbol,
        name: i.name,
        exchange: i.exchange,
        price: i.quote.currentPrice,
        change: i.quote.change,
        percentChange: i.quote.percentChange,
        volume: i.quote.volume,
        sector: i.sector,
    }))

export const MOCK_DASHBOARD_OVERVIEW: DashboardOverviewResponse = {
    marketIndices: MOCK_MARKET_INDICES,
    topGainers: MOCK_TOP_GAINERS,
    topLosers: MOCK_TOP_LOSERS,
    mostActive: MOCK_MOST_ACTIVE,
    marketBreadth: {
        advances: 1420,
        declines: 980,
        unchanged: 84,
    },
    recentSearches: MOCK_INSTRUMENTS.slice(0, 4).map(i => ({
        symbol: i.symbol,
        name: i.name,
        exchange: i.exchange,
        sector: i.sector,
        marketCapCategory: i.marketCapCategory,
    })),
}

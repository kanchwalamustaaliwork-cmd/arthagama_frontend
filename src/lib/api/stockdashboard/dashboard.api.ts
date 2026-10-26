/**
 * src/lib/api/stockdashboard/dashboard.api.ts
 *
 * Typed API functions for the main dashboard view.
 */

import { DashboardOverviewResponse, MarketIndex, TopMoverItem, StockIdentity } from '@/src/types/stockdashboard'
import {
    MOCK_DASHBOARD_OVERVIEW,
    MOCK_MARKET_INDICES,
    MOCK_TOP_GAINERS,
    MOCK_TOP_LOSERS,
    MOCK_MOST_ACTIVE,
} from '@/src/mocks/stockdashboard/dashboard.mock'

const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

export async function getDashboardOverview(): Promise<DashboardOverviewResponse> {
    await delay(180)
    return MOCK_DASHBOARD_OVERVIEW
}

export async function getMarketSummary(): Promise<MarketIndex[]> {
    await delay(120)
    return MOCK_MARKET_INDICES
}

export async function getTopGainers(): Promise<TopMoverItem[]> {
    await delay(100)
    return MOCK_TOP_GAINERS
}

export async function getTopLosers(): Promise<TopMoverItem[]> {
    await delay(100)
    return MOCK_TOP_LOSERS
}

export async function getMostActive(): Promise<TopMoverItem[]> {
    await delay(100)
    return MOCK_MOST_ACTIVE
}

export async function getRecentlyViewed(): Promise<StockIdentity[]> {
    await delay(80)
    return MOCK_DASHBOARD_OVERVIEW.recentSearches
}

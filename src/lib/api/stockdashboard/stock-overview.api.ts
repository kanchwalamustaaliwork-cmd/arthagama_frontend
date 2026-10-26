/**
 * src/lib/api/stockdashboard/stock-overview.api.ts
 *
 * Typed API functions for individual stock profile, quote, chart, and key metrics.
 */

import { CompanyProfile, StockQuote, HistoricalCandle, KeyFinancialMetrics } from '@/src/types/stockdashboard'
import { getMockProfile, getMockHistoricalCandles } from '@/src/mocks/stockdashboard/stock-overview.mock'

const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

export async function getStockProfile(exchange: string, symbol: string): Promise<CompanyProfile> {
    await delay(160)
    return getMockProfile(symbol, exchange)
}

export async function getStockPrice(exchange: string, symbol: string): Promise<StockQuote> {
    await delay(100)
    const profile = getMockProfile(symbol, exchange)
    return profile.quote
}

export async function getStockChart(exchange: string, symbol: string, range = '1M'): Promise<HistoricalCandle[]> {
    await delay(180)
    return getMockHistoricalCandles(symbol, range)
}

export async function getStockKeyMetrics(exchange: string, symbol: string): Promise<KeyFinancialMetrics> {
    await delay(110)
    const profile = getMockProfile(symbol, exchange)
    return profile.metrics
}

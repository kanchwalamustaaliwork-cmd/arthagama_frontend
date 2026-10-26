/**
 * src/lib/api/stockdashboard/earnings.api.ts
 *
 * Typed API functions for quarterly/annual results, dividends, and corporate actions.
 */

import { EarningsData, QuarterlyResult, AnnualResult, DividendRecord, CorporateAction } from '@/src/types/stockdashboard'
import { getMockEarnings } from '@/src/mocks/stockdashboard/earnings.mock'

const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

export async function getEarnings(exchange: string, symbol: string): Promise<EarningsData> {
    await delay(180)
    return getMockEarnings(symbol, exchange)
}

export async function getQuarterlyResults(exchange: string, symbol: string): Promise<QuarterlyResult[]> {
    await delay(130)
    const data = getMockEarnings(symbol, exchange)
    return data.quarterlyResults
}

export async function getAnnualResults(exchange: string, symbol: string): Promise<AnnualResult[]> {
    await delay(130)
    const data = getMockEarnings(symbol, exchange)
    return data.annualResults
}

export async function getDividends(exchange: string, symbol: string): Promise<DividendRecord[]> {
    await delay(110)
    const data = getMockEarnings(symbol, exchange)
    return data.dividends
}

export async function getCorporateActions(exchange: string, symbol: string): Promise<CorporateAction[]> {
    await delay(110)
    const data = getMockEarnings(symbol, exchange)
    return data.corporateActions
}

/**
 * src/lib/api/stockdashboard/fundamentals.api.ts
 *
 * Typed API functions for financial statements, ratios, and shareholding patterns.
 */

import { FundamentalsData, FinancialStatementRow } from '@/src/types/stockdashboard'
import { getMockFundamentals } from '@/src/mocks/stockdashboard/fundamentals.mock'

const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

export async function getFundamentals(exchange: string, symbol: string): Promise<FundamentalsData> {
    await delay(200)
    return getMockFundamentals(symbol, exchange)
}

export async function getFinancials(exchange: string, symbol: string): Promise<{
    incomeStatement: FinancialStatementRow[]
    balanceSheet: FinancialStatementRow[]
    cashFlowStatement: FinancialStatementRow[]
}> {
    await delay(150)
    const data = getMockFundamentals(symbol, exchange)
    return {
        incomeStatement: data.incomeStatement,
        balanceSheet: data.balanceSheet,
        cashFlowStatement: data.cashFlowStatement,
    }
}

export async function getRatios(exchange: string, symbol: string): Promise<FinancialStatementRow[]> {
    await delay(120)
    const data = getMockFundamentals(symbol, exchange)
    return data.keyRatios
}

export async function getShareholding(exchange: string, symbol: string): Promise<FundamentalsData['shareholdingTrends']> {
    await delay(100)
    const data = getMockFundamentals(symbol, exchange)
    return data.shareholdingTrends
}

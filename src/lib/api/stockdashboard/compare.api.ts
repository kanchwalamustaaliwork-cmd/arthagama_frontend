/**
 * src/lib/api/stockdashboard/compare.api.ts
 *
 * Typed API functions for comparing multiple stocks side-by-side.
 */

import { StockComparisonData } from '@/src/types/stockdashboard'
import { getMockCompareData } from '@/src/mocks/stockdashboard/compare.mock'

const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

export async function compareStocks(symbols: string[]): Promise<StockComparisonData[]> {
    await delay(180)
    if (!symbols || symbols.length === 0) return []
    return symbols.map(sym => getMockCompareData(sym))
}

export async function getCompareMetrics(): Promise<{ category: string; key: keyof StockComparisonData; label: string; unit: string }[]> {
    await delay(80)
    return [
        // Valuation
        { category: 'Valuation', key: 'marketCapCr', label: 'Market Cap', unit: 'Cr' },
        { category: 'Valuation', key: 'peRatio', label: 'P/E Ratio', unit: 'x' },
        { category: 'Valuation', key: 'pbRatio', label: 'P/B Ratio', unit: 'x' },
        { category: 'Valuation', key: 'evEbitda', label: 'EV / EBITDA', unit: 'x' },
        { category: 'Valuation', key: 'dividendYield', label: 'Dividend Yield', unit: '%' },

        // Profitability
        { category: 'Profitability', key: 'roe', label: 'Return on Equity (ROE)', unit: '%' },
        { category: 'Profitability', key: 'roce', label: 'Return on Capital (ROCE)', unit: '%' },
        { category: 'Profitability', key: 'operatingMargin', label: 'Operating Margin', unit: '%' },

        // Growth & Solvency
        { category: 'Growth & Solvency', key: 'revenueGrowth', label: 'Revenue Growth YoY', unit: '%' },
        { category: 'Growth & Solvency', key: 'profitGrowth', label: 'Profit Growth YoY', unit: '%' },
        { category: 'Growth & Solvency', key: 'debtToEquity', label: 'Debt to Equity', unit: 'x' },

        // Technicals
        { category: 'Technicals', key: 'currentPrice', label: 'Current Price', unit: '₹' },
        { category: 'Technicals', key: 'percentChange', label: 'Day Change', unit: '%' },
        { category: 'Technicals', key: 'rsi14', label: 'RSI (14-Day)', unit: '' },
        { category: 'Technicals', key: 'beta', label: 'Beta', unit: '' },
        { category: 'Technicals', key: 'high52w', label: '52W High', unit: '₹' },
        { category: 'Technicals', key: 'low52w', label: '52W Low', unit: '₹' },
    ]
}

/**
 * src/mocks/stockdashboard/screener.mock.ts
 *
 * Mock screener filter field schema, presets, and screener stock datasets.
 */

import { ScreenerFilterFieldDefinition, ScreenerPreset, ScreenerStockResult } from '@/src/types/stockdashboard'
import { MOCK_INSTRUMENTS } from './instruments.mock'

export const SCREENER_FILTER_FIELDS: ScreenerFilterFieldDefinition[] = [
    { id: 'marketCapCr', label: 'Market Capitalization', category: 'Valuation', unit: 'Cr', min: 100, max: 2500000, step: 1000, defaultOperator: 'gte' },
    { id: 'peRatio', label: 'Price to Earnings (P/E)', category: 'Valuation', unit: 'x', min: 1, max: 150, step: 0.5, defaultOperator: 'lte' },
    { id: 'pbRatio', label: 'Price to Book (P/B)', category: 'Valuation', unit: 'x', min: 0.2, max: 30, step: 0.2, defaultOperator: 'lte' },
    { id: 'roe', label: 'Return on Equity (ROE)', category: 'Profitability', unit: '%', min: -50, max: 100, step: 1, defaultOperator: 'gte' },
    { id: 'roce', label: 'Return on Capital (ROCE)', category: 'Profitability', unit: '%', min: -50, max: 100, step: 1, defaultOperator: 'gte' },
    { id: 'debtToEquity', label: 'Debt to Equity', category: 'Solvency', unit: 'x', min: 0, max: 10, step: 0.1, defaultOperator: 'lte' },
    { id: 'revenueGrowthYoY', label: 'Revenue Growth (YoY)', category: 'Growth', unit: '%', min: -50, max: 200, step: 1, defaultOperator: 'gte' },
    { id: 'profitGrowthYoY', label: 'Profit Growth (YoY)', category: 'Growth', unit: '%', min: -50, max: 300, step: 1, defaultOperator: 'gte' },
    { id: 'rsi14', label: 'RSI (14-day)', category: 'Technical', unit: 'points', min: 0, max: 100, step: 1, defaultOperator: 'between' },
    { id: 'ma50DistancePct', label: 'Price vs 50-day MA', category: 'Technical', unit: '%', min: -50, max: 50, step: 0.5, defaultOperator: 'gte' },
]

export const SCREENER_PRESETS: ScreenerPreset[] = [
    {
        id: 'high-growth-tech',
        name: 'High Growth Blue Chips',
        description: 'Companies with ROE > 15%, Profit Growth > 10%, and P/E < 35',
        category: 'Growth',
        rules: [
            { id: 'r1', field: 'roe', operator: 'gte', value: 15 },
            { id: 'r2', field: 'profitGrowthYoY', operator: 'gte', value: 10 },
            { id: 'r3', field: 'peRatio', operator: 'lte', value: 35 },
        ],
    },
    {
        id: 'value-investing',
        name: 'Value & Low Debt',
        description: 'P/E < 25, Debt to Equity < 0.5, and positive ROCE > 12%',
        category: 'Value',
        rules: [
            { id: 'r1', field: 'peRatio', operator: 'lte', value: 25 },
            { id: 'r2', field: 'debtToEquity', operator: 'lte', value: 0.5 },
            { id: 'r3', field: 'roce', operator: 'gte', value: 12 },
        ],
    },
    {
        id: 'momentum-breakout',
        name: 'Technical Momentum',
        description: 'Trading above 50-day Moving Average with healthy RSI between 50 and 70',
        category: 'Technical',
        rules: [
            { id: 'r1', field: 'ma50DistancePct', operator: 'gte', value: 2 },
            { id: 'r2', field: 'rsi14', operator: 'gte', value: 50 },
            { id: 'r3', field: 'rsi14', operator: 'lte', value: 70 },
        ],
    },
    {
        id: 'mega-cap-quality',
        name: 'Mega Cap Quality Leaders',
        description: 'Market Cap > ₹5,00,000 Cr, ROE > 15%, and strong cash generation',
        category: 'Fundamental',
        rules: [
            { id: 'r1', field: 'marketCapCr', operator: 'gte', value: 500000 },
            { id: 'r2', field: 'roe', operator: 'gte', value: 15 },
        ],
    },
]

export const MOCK_SCREENER_RESULTS: ScreenerStockResult[] = MOCK_INSTRUMENTS.map(inst => ({
    symbol: inst.symbol,
    name: inst.name,
    exchange: inst.exchange,
    sector: inst.sector,
    marketCapCategory: inst.marketCapCategory,
    currentPrice: inst.quote.currentPrice,
    change: inst.quote.change,
    percentChange: inst.quote.percentChange,
    ...inst.screenerMetrics,
}))

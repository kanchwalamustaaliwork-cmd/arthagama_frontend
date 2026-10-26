/**
 * src/mocks/stockdashboard/stock-overview.mock.ts
 *
 * Mock stock profiles and historical chart fixtures.
 */

import { CompanyProfile, HistoricalCandle } from '@/src/types/stockdashboard'
import { MOCK_INSTRUMENTS } from './instruments.mock'

export const MOCK_COMPANY_PROFILES: Record<string, CompanyProfile> = {
    RELIANCE: {
        symbol: 'RELIANCE',
        name: 'Reliance Industries Ltd.',
        exchange: 'NSE',
        isin: 'INE002A01018',
        sector: 'Energy & Retail',
        industry: 'Oil & Gas Refining & Marketing',
        marketCapCategory: 'Large Cap',
        description: 'Reliance Industries Limited is an Indian multinational conglomerate headquartered in Mumbai. Its diverse businesses include energy, petrochemicals, natural gas, retail, telecommunications, mass media, and textiles.',
        ceo: 'Mukesh D. Ambani',
        foundedYear: 1958,
        headquarters: 'Mumbai, Maharashtra, India',
        website: 'https://www.ril.com',
        employees: 389414,
        quote: MOCK_INSTRUMENTS[0].quote,
        metrics: {
            marketCapCr: 1926800,
            peRatio: 28.4,
            sectorPE: 24.2,
            pbRatio: 2.82,
            dividendYield: 0.35,
            roe: 9.8,
            roce: 11.2,
            debtToEquity: 0.42,
            epsTTM: 100.26,
            bookValuePerShare: 1009.70,
            faceValue: 10,
            beta: 1.05,
            freeCashFlowCr: 34200,
            promoterHolding: 50.3,
            fiiHolding: 21.8,
            diiHolding: 16.4,
            publicHolding: 11.5,
        },
    },
    TCS: {
        symbol: 'TCS',
        name: 'Tata Consultancy Services Ltd.',
        exchange: 'NSE',
        isin: 'INE467B01029',
        sector: 'Information Technology',
        industry: 'IT Consulting & Software',
        marketCapCategory: 'Large Cap',
        description: 'Tata Consultancy Services is an Indian multinational information technology services and consulting company headquartered in Mumbai. It operates across 150 locations in 46 countries as a premier global technology transformation partner.',
        ceo: 'K. Krithivasan',
        foundedYear: 1968,
        headquarters: 'Mumbai, Maharashtra, India',
        website: 'https://www.tcs.com',
        employees: 601546,
        quote: MOCK_INSTRUMENTS[1].quote,
        metrics: {
            marketCapCr: 1382400,
            peRatio: 28.8,
            sectorPE: 30.1,
            pbRatio: 13.4,
            dividendYield: 1.25,
            roe: 47.2,
            roce: 52.4,
            debtToEquity: 0.04,
            epsTTM: 132.65,
            bookValuePerShare: 285.10,
            faceValue: 1,
            beta: 0.78,
            freeCashFlowCr: 42100,
            promoterHolding: 71.8,
            fiiHolding: 12.4,
            diiHolding: 10.2,
            publicHolding: 5.6,
        },
    },
    HDFCBANK: {
        symbol: 'HDFCBANK',
        name: 'HDFC Bank Ltd.',
        exchange: 'NSE',
        isin: 'INE040A01034',
        sector: 'Financial Services',
        industry: 'Private Sector Bank',
        marketCapCategory: 'Large Cap',
        description: 'HDFC Bank Limited is India’s largest private sector bank by assets and the world’s fourth-largest bank by market capitalization following its landmark merger with Housing Development Finance Corporation.',
        ceo: 'Sashidhar Jagdishan',
        foundedYear: 1994,
        headquarters: 'Mumbai, Maharashtra, India',
        website: 'https://www.hdfcbank.com',
        employees: 213527,
        quote: MOCK_INSTRUMENTS[2].quote,
        metrics: {
            marketCapCr: 1251600,
            peRatio: 19.2,
            sectorPE: 18.5,
            pbRatio: 3.1,
            dividendYield: 1.18,
            roe: 16.4,
            roce: 5.8,
            debtToEquity: 0.85,
            epsTTM: 85.56,
            bookValuePerShare: 529.90,
            faceValue: 1,
            beta: 1.12,
            freeCashFlowCr: 28500,
            promoterHolding: 0.0,
            fiiHolding: 47.8,
            diiHolding: 34.2,
            publicHolding: 18.0,
        },
    },
    INFY: {
        symbol: 'INFY',
        name: 'Infosys Ltd.',
        exchange: 'NSE',
        isin: 'INE009A01021',
        sector: 'Information Technology',
        industry: 'IT Consulting & Software',
        marketCapCategory: 'Large Cap',
        description: 'Infosys is a global leader in next-generation digital services and consulting. It enables clients in more than 56 countries to navigate their digital transformation powered by cloud and AI.',
        ceo: 'Salil Parekh',
        foundedYear: 1981,
        headquarters: 'Bengaluru, Karnataka, India',
        website: 'https://www.infosys.com',
        employees: 317240,
        quote: MOCK_INSTRUMENTS[3].quote,
        metrics: {
            marketCapCr: 642800,
            peRatio: 24.1,
            sectorPE: 30.1,
            pbRatio: 7.8,
            dividendYield: 2.32,
            roe: 32.1,
            roce: 38.4,
            debtToEquity: 0.02,
            epsTTM: 64.24,
            bookValuePerShare: 198.50,
            faceValue: 5,
            beta: 0.85,
            freeCashFlowCr: 21400,
            promoterHolding: 14.8,
            fiiHolding: 34.1,
            diiHolding: 35.6,
            publicHolding: 15.5,
        },
    },
}

/**
 * Returns or dynamically builds a fallback profile for other instruments in the master mock.
 */
export function getMockProfile(symbol: string, exchange = 'NSE'): CompanyProfile {
    const upperSym = symbol.toUpperCase()
    if (MOCK_COMPANY_PROFILES[upperSym]) {
        return MOCK_COMPANY_PROFILES[upperSym]
    }

    const inst = MOCK_INSTRUMENTS.find(i => i.symbol === upperSym) ?? MOCK_INSTRUMENTS[0]
    return {
        symbol: inst.symbol,
        name: inst.name,
        exchange: (exchange.toUpperCase() as any) || inst.exchange,
        isin: inst.isin,
        sector: inst.sector,
        industry: inst.industry,
        marketCapCategory: inst.marketCapCategory,
        description: `${inst.name} is a leading constituent of the Indian stock market traded on the ${exchange}. It represents established fundamentals within the ${inst.sector} sector.`,
        ceo: 'Executive Management',
        foundedYear: 1985,
        headquarters: 'Mumbai, India',
        website: 'https://www.nseindia.com',
        employees: 125000,
        quote: inst.quote,
        metrics: {
            marketCapCr: inst.screenerMetrics.marketCapCr,
            peRatio: inst.screenerMetrics.peRatio,
            sectorPE: 22.5,
            pbRatio: inst.screenerMetrics.pbRatio,
            dividendYield: 1.1,
            roe: inst.screenerMetrics.roe,
            roce: inst.screenerMetrics.roce,
            debtToEquity: inst.screenerMetrics.debtToEquity,
            epsTTM: Number((inst.quote.currentPrice / inst.screenerMetrics.peRatio).toFixed(2)),
            bookValuePerShare: Number((inst.quote.currentPrice / inst.screenerMetrics.pbRatio).toFixed(2)),
            faceValue: 10,
            beta: 1.0,
            freeCashFlowCr: 12000,
            promoterHolding: 52.0,
            fiiHolding: 22.0,
            diiHolding: 16.0,
            publicHolding: 10.0,
        },
    }
}

/**
 * Generates deterministic mock historical chart candles for any stock and period.
 */
export function getMockHistoricalCandles(symbol: string, range: string): HistoricalCandle[] {
    const inst = MOCK_INSTRUMENTS.find(i => i.symbol === symbol.toUpperCase()) ?? MOCK_INSTRUMENTS[0]
    const basePrice = inst.quote.currentPrice

    const countMap: Record<string, { count: number; intervalDays: number; volatility: number; trend: number }> = {
        '1D': { count: 30, intervalDays: 0.03, volatility: 0.003, trend: 0.0002 },
        '1W': { count: 35, intervalDays: 0.2, volatility: 0.006, trend: 0.0005 },
        '1M': { count: 30, intervalDays: 1, volatility: 0.012, trend: 0.001 },
        '3M': { count: 60, intervalDays: 1.5, volatility: 0.015, trend: 0.0012 },
        '1Y': { count: 52, intervalDays: 7, volatility: 0.02, trend: 0.002 },
        '5Y': { count: 60, intervalDays: 30, volatility: 0.035, trend: 0.004 },
        'ALL': { count: 80, intervalDays: 45, volatility: 0.04, trend: 0.005 },
    }

    const conf = countMap[range] ?? countMap['1M']
    const candles: HistoricalCandle[] = []

    // Start backwards from basePrice
    let price = basePrice * (1 - conf.trend * conf.count * 0.7)
    const now = new Date()

    for (let i = 0; i < conf.count; i++) {
        const d = new Date(now.getTime() - (conf.count - 1 - i) * conf.intervalDays * 86400 * 1000)
        // Deterministic pseudo-random variation using symbol char codes + index
        const seed = (symbol.charCodeAt(0) * 17 + i * 31) % 100
        const delta = ((seed - 48) / 100) * conf.volatility
        price = Math.max(10, price * (1 + conf.trend + delta))

        const high = price * (1 + Math.abs((seed % 10) / 1000) + 0.004)
        const low = price * (1 - Math.abs((seed % 11) / 1000) - 0.004)
        const open = (price + low) / 2
        const close = price

        candles.push({
            timestamp: d.toISOString(),
            date: d.toISOString().slice(0, 10),
            open: Number(open.toFixed(2)),
            high: Number(high.toFixed(2)),
            low: Number(low.toFixed(2)),
            close: Number(close.toFixed(2)),
            volume: Math.round(inst.quote.volume * (0.6 + (seed / 100) * 0.8)),
        })
    }

    return candles
}

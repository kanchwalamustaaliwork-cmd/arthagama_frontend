/**
 * src/mocks/stockdashboard/earnings.mock.ts
 *
 * Mock quarterly & annual earnings, dividend declarations, and corporate action histories.
 */

import { EarningsData } from '@/src/types/stockdashboard'

export const MOCK_EARNINGS: Record<string, EarningsData> = {
    RELIANCE: {
        symbol: 'RELIANCE',
        exchange: 'NSE',
        quarterlyResults: [
            { quarter: 'Q4 FY24', revenueCr: 240715, operatingProfitCr: 42516, operatingMarginPct: 17.7, netProfitCr: 21243, netMarginPct: 8.8, eps: 31.42, announcementDate: '2024-04-22' },
            { quarter: 'Q3 FY24', revenueCr: 228160, operatingProfitCr: 40656, operatingMarginPct: 17.8, netProfitCr: 19641, netMarginPct: 8.6, eps: 29.05, announcementDate: '2024-01-19' },
            { quarter: 'Q2 FY24', revenueCr: 234956, operatingProfitCr: 40968, operatingMarginPct: 17.4, netProfitCr: 19878, netMarginPct: 8.5, eps: 29.40, announcementDate: '2023-10-27' },
            { quarter: 'Q1 FY24', revenueCr: 210831, operatingProfitCr: 38093, operatingMarginPct: 18.1, netProfitCr: 18258, netMarginPct: 8.7, eps: 27.01, announcementDate: '2023-07-21' },
            { quarter: 'Q4 FY23', revenueCr: 219876, operatingProfitCr: 38440, operatingMarginPct: 17.5, netProfitCr: 19299, netMarginPct: 8.8, eps: 28.55, announcementDate: '2023-04-21' },
            { quarter: 'Q3 FY23', revenueCr: 220592, operatingProfitCr: 35247, operatingMarginPct: 16.0, netProfitCr: 15792, netMarginPct: 7.2, eps: 23.36, announcementDate: '2023-01-20' },
        ],
        annualResults: [
            { fiscalYear: 'FY24', revenueCr: 901064, operatingProfitCr: 162580, operatingMarginPct: 18.0, netProfitCr: 79020, netMarginPct: 8.8, eps: 100.26, dividendPerShare: 10.00 },
            { fiscalYear: 'FY23', revenueCr: 879468, operatingProfitCr: 142217, operatingMarginPct: 16.2, netProfitCr: 73670, netMarginPct: 8.4, eps: 97.80, dividendPerShare: 9.00 },
            { fiscalYear: 'FY22', revenueCr: 699962, operatingProfitCr: 110460, operatingMarginPct: 15.8, netProfitCr: 67845, netMarginPct: 9.7, eps: 90.20, dividendPerShare: 8.00 },
            { fiscalYear: 'FY21', revenueCr: 486492, operatingProfitCr: 80737, operatingMarginPct: 16.6, netProfitCr: 53739, netMarginPct: 11.0, eps: 79.40, dividendPerShare: 7.00 },
            { fiscalYear: 'FY20', revenueCr: 597535, operatingProfitCr: 88212, operatingMarginPct: 14.8, netProfitCr: 39880, netMarginPct: 6.7, eps: 63.00, dividendPerShare: 6.50 },
        ],
        dividends: [
            { recordDate: '2024-08-19', exDate: '2024-08-19', type: 'Final', amountPerShare: 10.00, percentage: 100 },
            { recordDate: '2023-08-21', exDate: '2023-08-21', type: 'Final', amountPerShare: 9.00, percentage: 90 },
            { recordDate: '2022-08-19', exDate: '2022-08-19', type: 'Final', amountPerShare: 8.00, percentage: 80 },
            { recordDate: '2021-06-14', exDate: '2021-06-11', type: 'Final', amountPerShare: 7.00, percentage: 70 },
        ],
        corporateActions: [
            { date: '2024-10-28', type: 'Bonus', details: 'Bonus Issue in ratio of 1:1 (Ex-Bonus date 28 Oct 2024)' },
            { date: '2024-08-29', type: 'AGM', details: '47th Annual General Meeting of Reliance Industries Limited' },
            { date: '2023-07-20', type: 'Stock Split', details: 'Demerger of Jio Financial Services (JFSL) in 1:1 ratio' },
            { date: '2020-05-14', type: 'Rights Issue', details: 'Rights issue of 42.26 crore shares at ₹1,257 per share' },
        ],
    },
    TCS: {
        symbol: 'TCS',
        exchange: 'NSE',
        quarterlyResults: [
            { quarter: 'Q1 FY25', revenueCr: 62613, operatingProfitCr: 15442, operatingMarginPct: 24.7, netProfitCr: 12040, netMarginPct: 19.2, eps: 33.25, announcementDate: '2024-07-11' },
            { quarter: 'Q4 FY24', revenueCr: 61237, operatingProfitCr: 15918, operatingMarginPct: 26.0, netProfitCr: 12434, netMarginPct: 20.3, eps: 34.34, announcementDate: '2024-04-12' },
            { quarter: 'Q3 FY24', revenueCr: 60583, operatingProfitCr: 15155, operatingMarginPct: 25.0, netProfitCr: 11058, netMarginPct: 18.3, eps: 30.54, announcementDate: '2024-01-11' },
            { quarter: 'Q2 FY24', revenueCr: 59692, operatingProfitCr: 14483, operatingMarginPct: 24.3, netProfitCr: 11342, netMarginPct: 19.0, eps: 31.32, announcementDate: '2023-10-11' },
        ],
        annualResults: [
            { fiscalYear: 'FY24', revenueCr: 240893, operatingProfitCr: 63580, operatingMarginPct: 26.4, netProfitCr: 46099, netMarginPct: 19.1, eps: 126.90, dividendPerShare: 73.00 },
            { fiscalYear: 'FY23', revenueCr: 225458, operatingProfitCr: 59258, operatingMarginPct: 26.3, netProfitCr: 42147, netMarginPct: 18.7, eps: 115.20, dividendPerShare: 115.00 },
            { fiscalYear: 'FY22', revenueCr: 191754, operatingProfitCr: 53057, operatingMarginPct: 27.7, netProfitCr: 38327, netMarginPct: 20.0, eps: 103.60, dividendPerShare: 43.00 },
        ],
        dividends: [
            { recordDate: '2024-07-20', exDate: '2024-07-19', type: 'Interim', amountPerShare: 10.00, percentage: 1000 },
            { recordDate: '2024-05-16', exDate: '2024-05-16', type: 'Final', amountPerShare: 28.00, percentage: 2800 },
            { recordDate: '2024-01-19', exDate: '2024-01-19', type: 'Special', amountPerShare: 18.00, percentage: 1800 },
            { recordDate: '2024-01-19', exDate: '2024-01-19', type: 'Interim', amountPerShare: 9.00, percentage: 900 },
        ],
        corporateActions: [
            { date: '2024-05-31', type: 'AGM', details: '29th Annual General Meeting of Tata Consultancy Services' },
            { date: '2023-11-25', type: 'Bonus', details: 'Share Buyback completed: 4.09 crore shares at ₹4,150 per share' },
        ],
    },
}

export function getMockEarnings(symbol: string, exchange = 'NSE'): EarningsData {
    const upper = symbol.toUpperCase()
    if (MOCK_EARNINGS[upper]) {
        return MOCK_EARNINGS[upper]
    }

    const base = MOCK_EARNINGS['RELIANCE']
    return {
        ...base,
        symbol: upper,
        exchange: exchange as any,
    }
}

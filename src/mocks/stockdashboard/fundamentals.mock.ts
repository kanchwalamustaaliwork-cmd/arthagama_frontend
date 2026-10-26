/**
 * src/mocks/stockdashboard/fundamentals.mock.ts
 *
 * Mock fundamentals datasets: multi-year Income Statement, Balance Sheet,
 * Cash Flow, Financial Ratios, and Shareholding distribution.
 */

import { FundamentalsData } from '@/src/types/stockdashboard'

export const MOCK_FUNDAMENTALS: Record<string, FundamentalsData> = {
    RELIANCE: {
        symbol: 'RELIANCE',
        exchange: 'NSE',
        currency: 'INR (₹ Crores)',
        periods: ['FY21', 'FY22', 'FY23', 'FY24', 'FY25 (E)'],
        incomeStatement: [
            { lineItem: 'Sales / Revenue from Operations', values: { FY21: 486492, FY22: 699962, FY23: 879468, FY24: 901064, 'FY25 (E)': 985200 }, isBold: true },
            { lineItem: 'Raw Material Costs', values: { FY21: 279183, FY22: 442654, FY23: 578920, FY24: 582450, 'FY25 (E)': 630100 } },
            { lineItem: 'Employee Benefit Expenses', values: { FY21: 14817, FY22: 18775, FY23: 24892, FY24: 26840, 'FY25 (E)': 29200 } },
            { lineItem: 'Operating Profit (EBITDA)', values: { FY21: 80737, FY22: 110460, FY23: 142217, FY24: 162580, 'FY25 (E)': 179400 }, isBold: true },
            { lineItem: 'OPM (%)', values: { FY21: 16.6, FY22: 15.8, FY23: 16.2, FY24: 18.0, 'FY25 (E)': 18.2 }, unit: '%' },
            { lineItem: 'Other Income', values: { FY21: 16327, FY22: 14947, FY23: 11848, FY24: 15420, 'FY25 (E)': 16800 } },
            { lineItem: 'Finance Costs (Interest)', values: { FY21: 21189, FY22: 14584, FY23: 19571, FY24: 23290, 'FY25 (E)': 21500 } },
            { lineItem: 'Depreciation & Amortization', values: { FY21: 26572, FY22: 29797, FY23: 40303, FY24: 50830, 'FY25 (E)': 54200 } },
            { lineItem: 'Profit Before Tax (PBT)', values: { FY21: 55461, FY22: 84142, FY23: 94191, FY24: 103880, 'FY25 (E)': 120500 }, isBold: true },
            { lineItem: 'Tax Expenses', values: { FY21: 1722, FY22: 16297, FY23: 20701, FY24: 24860, 'FY25 (E)': 28900 } },
            { lineItem: 'Net Profit after Tax', values: { FY21: 53739, FY22: 67845, FY23: 73670, FY24: 79020, 'FY25 (E)': 91600 }, isBold: true },
            { lineItem: 'EPS (₹)', values: { FY21: 79.4, FY22: 90.2, FY23: 97.8, FY24: 100.3, 'FY25 (E)': 116.2 }, unit: '₹' },
        ],
        balanceSheet: [
            { lineItem: 'Equity Share Capital', values: { FY21: 6445, FY22: 6765, FY23: 6766, FY24: 6766, 'FY25 (E)': 6766 }, isBold: true },
            { lineItem: 'Reserves and Surplus', values: { FY21: 693727, FY22: 772720, FY23: 814589, FY24: 878240, 'FY25 (E)': 954000 } },
            { lineItem: 'Net Worth / Shareholders Equity', values: { FY21: 700172, FY22: 779485, FY23: 821355, FY24: 885006, 'FY25 (E)': 960766 }, isBold: true },
            { lineItem: 'Total Borrowings (Debt)', values: { FY21: 251811, FY22: 266305, FY23: 314708, FY24: 312000, 'FY25 (E)': 298000 } },
            { lineItem: 'Other Liabilities', values: { FY21: 368037, FY22: 453982, FY23: 479420, FY24: 445200, 'FY25 (E)': 462000 } },
            { lineItem: 'Total Liabilities', values: { FY21: 1320020, FY22: 1499772, FY23: 1615483, FY24: 1642206, 'FY25 (E)': 1720766 }, isBold: true },
            { lineItem: 'Net Fixed Assets (PPE)', values: { FY21: 541258, FY22: 615784, FY23: 719870, FY24: 812400, 'FY25 (E)': 875000 } },
            { lineItem: 'Capital Work in Progress (CWIP)', values: { FY21: 125953, FY22: 179730, FY23: 290890, FY24: 215400, 'FY25 (E)': 180000 } },
            { lineItem: 'Non-Current Investments', values: { FY21: 364828, FY22: 394720, FY23: 284120, FY24: 295100, 'FY25 (E)': 310000 } },
            { lineItem: 'Current Assets & Inventory', values: { FY21: 287981, FY22: 309538, FY23: 320603, FY24: 319306, 'FY25 (E)': 355766 } },
            { lineItem: 'Total Assets', values: { FY21: 1320020, FY22: 1499772, FY23: 1615483, FY24: 1642206, 'FY25 (E)': 1720766 }, isBold: true },
        ],
        cashFlowStatement: [
            { lineItem: 'Cash Flow from Operating Activities (CFO)', values: { FY21: 26185, FY22: 110654, FY23: 115041, FY24: 128450, 'FY25 (E)': 142000 }, isBold: true },
            { lineItem: 'Capital Expenditure (Capex)', values: { FY21: -105828, FY22: -145410, FY23: -131750, FY24: -94250, 'FY25 (E)': -85000 } },
            { lineItem: 'Free Cash Flow (FCF)', values: { FY21: -79643, FY22: -34756, FY23: -16709, FY24: 34200, 'FY25 (E)': 57000 }, isBold: true },
            { lineItem: 'Cash Flow from Financing Activities', values: { FY21: 79708, FY22: 16454, FY23: -18420, FY24: -24800, 'FY25 (E)': -32000 } },
            { lineItem: 'Net Change in Cash', values: { FY21: 42, FY22: 18450, FY23: -35129, FY24: 9400, 'FY25 (E)': 25000 } },
        ],
        keyRatios: [
            { lineItem: 'Return on Equity (ROE %)', values: { FY21: 8.4, FY22: 9.2, FY23: 9.4, FY24: 9.8, 'FY25 (E)': 10.4 }, unit: '%' },
            { lineItem: 'Return on Capital Employed (ROCE %)', values: { FY21: 8.2, FY22: 9.9, FY23: 10.6, FY24: 11.2, 'FY25 (E)': 12.1 }, unit: '%' },
            { lineItem: 'Debt to Equity Ratio (x)', values: { FY21: 0.36, FY22: 0.34, FY23: 0.38, FY24: 0.35, 'FY25 (E)': 0.31 }, unit: 'x' },
            { lineItem: 'Interest Coverage Ratio (x)', values: { FY21: 3.6, FY22: 6.8, FY23: 5.8, FY24: 5.5, 'FY25 (E)': 6.6 }, unit: 'x' },
            { lineItem: 'Current Ratio (x)', values: { FY21: 1.12, FY22: 1.14, FY23: 1.16, FY24: 1.18, 'FY25 (E)': 1.22 }, unit: 'x' },
            { lineItem: 'Asset Turnover (x)', values: { FY21: 0.42, FY22: 0.54, FY23: 0.59, FY24: 0.58, 'FY25 (E)': 0.61 }, unit: 'x' },
        ],
        shareholdingTrends: [
            { quarter: "Q1 '24", promoter: 50.3, fii: 22.4, dii: 16.1, public: 11.2 },
            { quarter: "Q2 '24", promoter: 50.3, fii: 22.1, dii: 16.3, public: 11.3 },
            { quarter: "Q3 '24", promoter: 50.3, fii: 21.9, dii: 16.4, public: 11.4 },
            { quarter: "Q4 '24", promoter: 50.3, fii: 21.8, dii: 16.4, public: 11.5 },
        ],
    },
    TCS: {
        symbol: 'TCS',
        exchange: 'NSE',
        currency: 'INR (₹ Crores)',
        periods: ['FY21', 'FY22', 'FY23', 'FY24', 'FY25 (E)'],
        incomeStatement: [
            { lineItem: 'Sales / Revenue from Operations', values: { FY21: 164177, FY22: 191754, FY23: 225458, FY24: 240893, 'FY25 (E)': 262000 }, isBold: true },
            { lineItem: 'Employee Benefit Expenses', values: { FY21: 91814, FY22: 107554, FY23: 127522, FY24: 137800, 'FY25 (E)': 149500 } },
            { lineItem: 'Operating Profit (EBITDA)', values: { FY21: 46546, FY22: 53057, FY23: 59258, FY24: 63580, 'FY25 (E)': 69800 }, isBold: true },
            { lineItem: 'OPM (%)', values: { FY21: 28.4, FY22: 27.7, FY23: 26.3, FY24: 26.4, 'FY25 (E)': 26.6 }, unit: '%' },
            { lineItem: 'Other Income', values: { FY21: 3201, FY22: 4018, FY23: 3449, FY24: 4210, 'FY25 (E)': 4500 } },
            { lineItem: 'Finance Costs (Interest)', values: { FY21: 637, FY22: 784, FY23: 779, FY24: 820, 'FY25 (E)': 850 } },
            { lineItem: 'Depreciation & Amortization', values: { FY21: 4065, FY22: 4604, FY23: 5022, FY24: 5380, 'FY25 (E)': 5600 } },
            { lineItem: 'Profit Before Tax (PBT)', values: { FY21: 45045, FY22: 51687, FY23: 56906, FY24: 61590, 'FY25 (E)': 67850 }, isBold: true },
            { lineItem: 'Tax Expenses', values: { FY21: 11108, FY22: 13238, FY23: 14603, FY24: 15491, 'FY25 (E)': 17000 } },
            { lineItem: 'Net Profit after Tax', values: { FY21: 32430, FY22: 38327, FY23: 42147, FY24: 46099, 'FY25 (E)': 50850 }, isBold: true },
            { lineItem: 'EPS (₹)', values: { FY21: 86.8, FY22: 103.6, FY23: 115.2, FY24: 126.9, 'FY25 (E)': 140.2 }, unit: '₹' },
        ],
        balanceSheet: [
            { lineItem: 'Equity Share Capital', values: { FY21: 370, FY22: 366, FY23: 366, FY24: 362, 'FY25 (E)': 362 }, isBold: true },
            { lineItem: 'Reserves and Surplus', values: { FY21: 86063, FY22: 88773, FY23: 89956, FY24: 89800, 'FY25 (E)': 94500 } },
            { lineItem: 'Net Worth / Shareholders Equity', values: { FY21: 86433, FY22: 89139, FY23: 90322, FY24: 90162, 'FY25 (E)': 94862 }, isBold: true },
            { lineItem: 'Total Borrowings (Debt)', values: { FY21: 0, FY22: 0, FY23: 0, FY24: 0, 'FY25 (E)': 0 } },
            { lineItem: 'Other Liabilities', values: { FY21: 43634, FY22: 52382, FY23: 53670, FY24: 58258, 'FY25 (E)': 61000 } },
            { lineItem: 'Total Liabilities', values: { FY21: 130067, FY22: 141521, FY23: 143992, FY24: 148420, 'FY25 (E)': 155862 }, isBold: true },
            { lineItem: 'Net Fixed Assets (PPE)', values: { FY21: 21544, FY22: 21894, FY23: 20950, FY24: 21400, 'FY25 (E)': 22100 } },
            { lineItem: 'Investments & Cash Equivalents', values: { FY21: 44297, FY22: 45318, FY23: 49830, FY24: 54120, 'FY25 (E)': 58900 } },
            { lineItem: 'Current Assets & Receivables', values: { FY21: 64226, FY22: 74309, FY23: 73212, FY24: 72900, 'FY25 (E)': 74862 } },
            { lineItem: 'Total Assets', values: { FY21: 130067, FY22: 141521, FY23: 143992, FY24: 148420, 'FY25 (E)': 155862 }, isBold: true },
        ],
        cashFlowStatement: [
            { lineItem: 'Cash Flow from Operating Activities (CFO)', values: { FY21: 38802, FY22: 39949, FY23: 41965, FY24: 44340, 'FY25 (E)': 48200 }, isBold: true },
            { lineItem: 'Capital Expenditure (Capex)', values: { FY21: -3148, FY22: -2985, FY23: -3020, FY24: -3200, 'FY25 (E)': -3400 } },
            { lineItem: 'Free Cash Flow (FCF)', values: { FY21: 35654, FY22: 36964, FY23: 38945, FY24: 41140, 'FY25 (E)': 44800 }, isBold: true },
            { lineItem: 'Dividends & Buybacks Paid', values: { FY21: -33873, FY22: -38258, FY23: -45780, FY24: -46200, 'FY25 (E)': -49000 } },
            { lineItem: 'Net Change in Cash', values: { FY21: 1781, FY22: -1294, FY23: -6835, FY24: -5060, 'FY25 (E)': -4200 } },
        ],
        keyRatios: [
            { lineItem: 'Return on Equity (ROE %)', values: { FY21: 39.1, FY22: 43.6, FY23: 46.9, FY24: 51.1, 'FY25 (E)': 53.6 }, unit: '%' },
            { lineItem: 'Return on Capital Employed (ROCE %)', values: { FY21: 52.4, FY22: 56.8, FY23: 61.2, FY24: 65.4, 'FY25 (E)': 68.2 }, unit: '%' },
            { lineItem: 'Debt to Equity Ratio (x)', values: { FY21: 0.00, FY22: 0.00, FY23: 0.00, FY24: 0.00, 'FY25 (E)': 0.00 }, unit: 'x' },
            { lineItem: 'Current Ratio (x)', values: { FY21: 2.72, FY22: 2.58, FY23: 2.62, FY24: 2.84, 'FY25 (E)': 2.91 }, unit: 'x' },
            { lineItem: 'Dividend Payout Ratio (%)', values: { FY21: 95.2, FY22: 88.4, FY23: 102.5, FY24: 98.2, 'FY25 (E)': 96.0 }, unit: '%' },
        ],
        shareholdingTrends: [
            { quarter: "Q1 '24", promoter: 72.3, fii: 12.5, dii: 9.8, public: 5.4 },
            { quarter: "Q2 '24", promoter: 72.3, fii: 12.5, dii: 9.9, public: 5.3 },
            { quarter: "Q3 '24", promoter: 71.8, fii: 12.4, dii: 10.1, public: 5.7 },
            { quarter: "Q4 '24", promoter: 71.8, fii: 12.4, dii: 10.2, public: 5.6 },
        ],
    },
}

/**
 * Returns mock fundamentals data for any stock, falling back to a structured synthetic profile.
 */
export function getMockFundamentals(symbol: string, exchange = 'NSE'): FundamentalsData {
    const upper = symbol.toUpperCase()
    if (MOCK_FUNDAMENTALS[upper]) {
        return MOCK_FUNDAMENTALS[upper]
    }

    // Adapt from RELIANCE with scaled numbers
    const base = MOCK_FUNDAMENTALS['RELIANCE']
    return {
        ...base,
        symbol: upper,
        exchange: exchange as any,
    }
}

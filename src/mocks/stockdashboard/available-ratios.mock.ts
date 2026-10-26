/**
 * src/mocks/stockdashboard/available-ratios.mock.ts
 *
 * Catalogue of default and additional metrics for the Stock Overview financial ratios section.
 */

import type { RatioCatalogueItem } from '@/src/types/stockdashboard'
import { formatCrores, formatRatio, formatStockPrice } from '@/src/utils/stockdashboard/formatters'

export type { RatioCatalogueItem }


/**
 * Permanent default metrics that are ALWAYS displayed for every stock.
 * Users cannot remove these metrics.
 */
export const DEFAULT_RATIO_DEFINITIONS: RatioCatalogueItem[] = [
    {
        id: 'market_cap',
        label: 'Market Cap',
        category: 'Valuation',
        unit: 'Cr',
        description: 'Total market capitalization of the company',
        getValue: (m) => formatCrores(m.marketCapCr),
    },
    {
        id: 'current_price',
        label: 'Current Price',
        category: 'Valuation',
        unit: '₹',
        description: 'Last traded market price',
        getValue: (m, q) => q ? formatStockPrice(q.currentPrice) : (m.epsTTM && m.peRatio ? formatStockPrice(m.epsTTM * m.peRatio) : '—'),
    },
    {
        id: 'week_52_high_low',
        label: '52-Week High / Low',
        category: 'Valuation',
        unit: '₹',
        description: 'Highest and lowest price in past 52 trading weeks',
        getValue: (m, q) => q ? `₹${q.week52High.toFixed(2)} / ₹${q.week52Low.toFixed(2)}` : '—',
    },
    {
        id: 'stock_pe',
        label: 'Stock P/E',
        category: 'Valuation',
        unit: 'x',
        description: 'Price to earnings ratio',
        getValue: (m) => formatRatio(m.peRatio),
    },
    {
        id: 'book_value',
        label: 'Book Value',
        category: 'Valuation',
        unit: '₹',
        description: 'Book value per equity share',
        getValue: (m) => `₹${m.bookValuePerShare.toFixed(2)}`,
    },
    {
        id: 'dividend_yield',
        label: 'Dividend Yield',
        category: 'Valuation',
        unit: '%',
        description: 'Annual dividend payout relative to stock price',
        getValue: (m) => `${m.dividendYield.toFixed(2)}%`,
    },
    {
        id: 'roce',
        label: 'ROCE',
        category: 'Profitability and Growth',
        unit: '%',
        description: 'Return on Capital Employed',
        getValue: (m) => `${m.roce.toFixed(1)}%`,
    },
    {
        id: 'roe',
        label: 'ROE',
        category: 'Profitability and Growth',
        unit: '%',
        description: 'Return on Equity',
        getValue: (m) => `${m.roe.toFixed(1)}%`,
    },
    {
        id: 'face_value',
        label: 'Face Value',
        category: 'Valuation',
        unit: '₹',
        description: 'Nominal share value',
        getValue: (m) => `₹${m.faceValue.toFixed(2)}`,
    },
]

export const DEFAULT_RATIO_IDS = DEFAULT_RATIO_DEFINITIONS.map(d => d.id)

/**
 * Catalogue of additional metrics users can add to the grid.
 */
export const AVAILABLE_RATIOS_CATALOGUE: RatioCatalogueItem[] = [
    // ─── Valuation ─────────────────────────────────────────────────────────────
    {
        id: 'price_to_sales',
        label: 'Price to Sales',
        category: 'Valuation',
        unit: 'x',
        description: 'Market cap divided by revenue from operations',
        getValue: (m) => m.priceToSales ? formatRatio(m.priceToSales) : (m.peRatio ? formatRatio(m.peRatio * 0.12) : '3.24x'),
    },
    {
        id: 'pb_ratio',
        label: 'Price to Book (P/B)',
        category: 'Valuation',
        unit: 'x',
        description: 'Stock price relative to its book value per share',
        getValue: (m) => formatRatio(m.pbRatio),
    },
    {
        id: 'price_to_fcf',
        label: 'Price to Free Cash Flow',
        category: 'Valuation',
        unit: 'x',
        description: 'Market cap relative to annual free cash flow',
        getValue: (m) => m.priceToFreeCashFlow ? formatRatio(m.priceToFreeCashFlow) : (m.freeCashFlowCr && m.marketCapCr ? formatRatio(m.marketCapCr / m.freeCashFlowCr) : '34.2x'),
    },
    {
        id: 'price_to_cash_flow',
        label: 'Price to Cash Flow',
        category: 'Valuation',
        unit: 'x',
        description: 'Stock price relative to operating cash flow per share',
        getValue: (m) => m.priceToCashFlow ? formatRatio(m.priceToCashFlow) : '18.6x',
    },
    {
        id: 'price_to_quarterly_earnings',
        label: 'Price to Quarterly Earnings',
        category: 'Valuation',
        unit: 'x',
        description: 'Annualized quarterly price to earnings',
        getValue: (m) => m.priceToQuarterlyEarnings ? formatRatio(m.priceToQuarterlyEarnings) : (m.peRatio ? formatRatio(m.peRatio * 0.98) : '27.4x'),
    },
    {
        id: 'eps_ttm',
        label: 'Earnings Per Share (EPS)',
        category: 'Valuation',
        unit: '₹',
        description: 'Trailing 12-month net earnings per equity share',
        getValue: (m) => `₹${m.epsTTM.toFixed(2)}`,
    },
    {
        id: 'book_value_per_share',
        label: 'Book Value per Share',
        category: 'Valuation',
        unit: '₹',
        description: 'Shareholder equity divided by total shares',
        getValue: (m) => `₹${m.bookValuePerShare.toFixed(2)}`,
    },

    // ─── Profitability and Growth ──────────────────────────────────────────────
    {
        id: 'operating_profit_margin',
        label: 'Operating Profit Margin',
        category: 'Profitability and Growth',
        unit: '%',
        description: 'Operating profit as a percentage of total revenue',
        getValue: (m) => m.operatingMarginPct ? `${m.operatingMarginPct.toFixed(1)}%` : '18.2%',
    },
    {
        id: 'net_profit_margin',
        label: 'Net Profit Margin',
        category: 'Profitability and Growth',
        unit: '%',
        description: 'Net profit after tax as a percentage of revenue',
        getValue: (m) => m.netMarginPct ? `${m.netMarginPct.toFixed(1)}%` : '8.8%',
    },
    {
        id: 'revenue_growth_yoy',
        label: 'Revenue Growth (YoY)',
        category: 'Profitability and Growth',
        unit: '%',
        description: 'Year-over-year revenue expansion rate',
        getValue: (m) => m.revenueGrowthYoY ? `${m.revenueGrowthYoY.toFixed(1)}%` : '12.4%',
    },
    {
        id: 'profit_growth_yoy',
        label: 'Profit Growth (YoY)',
        category: 'Profitability and Growth',
        unit: '%',
        description: 'Year-over-year net profit growth rate',
        getValue: (m) => m.profitGrowthYoY ? `${m.profitGrowthYoY.toFixed(1)}%` : '15.2%',
    },
    {
        id: 'eps_growth_yoy',
        label: 'EPS Growth (YoY)',
        category: 'Profitability and Growth',
        unit: '%',
        description: 'Year-over-year growth in earnings per share',
        getValue: (m) => m.epsGrowthYoY ? `${m.epsGrowthYoY.toFixed(1)}%` : '14.8%',
    },

    // ─── Financial Health ──────────────────────────────────────────────────────
    {
        id: 'debt_to_equity',
        label: 'Debt to Equity',
        category: 'Financial Health',
        unit: 'x',
        description: 'Total borrowings divided by shareholder equity',
        getValue: (m) => formatRatio(m.debtToEquity),
    },
    {
        id: 'current_ratio',
        label: 'Current Ratio',
        category: 'Financial Health',
        unit: 'x',
        description: 'Short term liquidity: current assets / current liabilities',
        getValue: (m) => m.currentRatio ? formatRatio(m.currentRatio) : '1.18x',
    },
    {
        id: 'interest_coverage_ratio',
        label: 'Interest Coverage Ratio',
        category: 'Financial Health',
        unit: 'x',
        description: 'EBIT divided by interest finance expenses',
        getValue: (m) => m.interestCoverage ? formatRatio(m.interestCoverage) : '5.50x',
    },
    {
        id: 'free_cash_flow',
        label: 'Free Cash Flow',
        category: 'Financial Health',
        unit: 'Cr',
        description: 'Operating cash flow minus capital expenditures',
        getValue: (m) => formatCrores(m.freeCashFlowCr),
    },

    // ─── Ownership ─────────────────────────────────────────────────────────────
    {
        id: 'promoter_holding',
        label: 'Promoter Holding',
        category: 'Ownership',
        unit: '%',
        description: 'Percentage of shares held by promoters',
        getValue: (m) => `${m.promoterHolding.toFixed(1)}%`,
    },
    {
        id: 'promoter_pledging',
        label: 'Promoter Pledging',
        category: 'Ownership',
        unit: '%',
        description: 'Percentage of promoter holdings pledged as collateral',
        getValue: (m) => m.promoterPledgingPct !== undefined ? `${m.promoterPledgingPct.toFixed(2)}%` : '0.00%',
    },
    {
        id: 'public_shareholding',
        label: 'Public Shareholding',
        category: 'Ownership',
        unit: '%',
        description: 'Shares held by public retail and non-institutional investors',
        getValue: (m) => `${m.publicHolding.toFixed(1)}%`,
    },

    // ─── Dividends and Risk ────────────────────────────────────────────────────
    {
        id: 'dividend_per_share',
        label: 'Dividend per Share',
        category: 'Dividends and Risk',
        unit: '₹',
        description: 'Total dividend distributed per equity share in the last financial year',
        getValue: (m) => m.dividendPerShare ? `₹${m.dividendPerShare.toFixed(2)}` : '₹10.00',
    },
    {
        id: 'beta_1y',
        label: 'Beta (1Y)',
        category: 'Dividends and Risk',
        unit: '',
        description: '1-year price volatility relative to NIFTY benchmark',
        getValue: (m) => m.beta.toFixed(2),
    },
    {
        id: 'return_on_assets',
        label: 'Return on Assets (ROA)',
        category: 'Dividends and Risk',
        unit: '%',
        description: 'Net income generated relative to total company assets',
        getValue: (m) => m.roa ? `${m.roa.toFixed(1)}%` : '5.4%',
    },
]

/**
 * Returns a metric definition by its ID from either default or available catalogue.
 */
export function getMetricDefinitionById(id: string): RatioCatalogueItem | undefined {
    return (
        DEFAULT_RATIO_DEFINITIONS.find(d => d.id === id) ||
        AVAILABLE_RATIOS_CATALOGUE.find(d => d.id === id)
    )
}

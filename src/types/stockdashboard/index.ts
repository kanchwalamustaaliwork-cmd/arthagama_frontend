/**
 * src/types/stockdashboard/index.ts
 *
 * Domain types for Stock Dashboard & Screener module.
 */

export type Exchange = 'NSE' | 'BSE'
export type MarketCapCategory = 'Large Cap' | 'Mid Cap' | 'Small Cap' | 'Micro Cap'

export interface StockIdentity {
    symbol: string
    name: string
    exchange: Exchange
    isin?: string
    sector: string
    industry?: string
    marketCapCategory: MarketCapCategory
    logoUrl?: string
}

export interface StockQuote {
    symbol: string
    exchange: Exchange
    currentPrice: number
    change: number
    percentChange: number
    dayHigh: number
    dayLow: number
    openPrice: number
    previousClose: number
    volume: number
    turnoverCr: number
    week52High: number
    week52Low: number
    lastUpdated: string
}

export interface HistoricalCandle {
    timestamp: string
    date: string
    open: number
    high: number
    low: number
    close: number
    volume: number
}

// ─── Dashboard Overview ────────────────────────────────────────────────────────
export interface MarketIndex {
    name: string
    value: number
    change: number
    percentChange: number
    high: number
    low: number
}

export interface TopMoverItem {
    symbol: string
    name: string
    exchange: Exchange
    price: number
    change: number
    percentChange: number
    volume: number
    sector: string
}

export interface DashboardOverviewResponse {
    marketIndices: MarketIndex[]
    topGainers: TopMoverItem[]
    topLosers: TopMoverItem[]
    mostActive: TopMoverItem[]
    marketBreadth: {
        advances: number
        declines: number
        unchanged: number
    }
    recentSearches: StockIdentity[]
}

// ─── Stock Overview ────────────────────────────────────────────────────────────
export interface KeyFinancialMetrics {
    marketCapCr: number
    peRatio: number
    sectorPE: number
    pbRatio: number
    dividendYield: number
    roe: number
    roce: number
    debtToEquity: number
    epsTTM: number
    bookValuePerShare: number
    faceValue: number
    beta: number
    freeCashFlowCr: number
    promoterHolding: number
    fiiHolding: number
    diiHolding: number
    publicHolding: number

    // Extended Catalogue Metrics (Optional)
    priceToSales?: number
    priceToFreeCashFlow?: number
    priceToCashFlow?: number
    priceToQuarterlyEarnings?: number
    operatingMarginPct?: number
    netMarginPct?: number
    revenueGrowthYoY?: number
    profitGrowthYoY?: number
    epsGrowthYoY?: number
    currentRatio?: number
    interestCoverage?: number
    promoterPledgingPct?: number
    dividendPerShare?: number
    roa?: number
}

export interface RatioCatalogueItem {
    id: string
    label: string
    category: 'Valuation' | 'Profitability and Growth' | 'Financial Health' | 'Ownership' | 'Dividends and Risk'
    unit?: string
    description?: string
    getValue: (metrics: KeyFinancialMetrics, quote?: StockQuote, profile?: CompanyProfile) => string
}

export interface CompanyProfile extends StockIdentity {
    description: string
    ceo?: string
    foundedYear?: number
    headquarters?: string
    website?: string
    employees?: number
    quote: StockQuote
    metrics: KeyFinancialMetrics
}

// ─── Fundamentals ──────────────────────────────────────────────────────────────
export interface FinancialStatementRow {
    lineItem: string
    values: Record<string, number | null> // e.g. { 'FY21': 100, 'FY22': 120 }
    unit?: string
    isBold?: boolean
}

export interface FundamentalsData {
    symbol: string
    exchange: Exchange
    currency: string
    periods: string[] // e.g. ['FY21', 'FY22', 'FY23', 'FY24', 'FY25']
    incomeStatement: FinancialStatementRow[]
    balanceSheet: FinancialStatementRow[]
    cashFlowStatement: FinancialStatementRow[]
    keyRatios: FinancialStatementRow[]
    shareholdingTrends: {
        quarter: string
        promoter: number
        fii: number
        dii: number
        public: number
    }[]
}

// ─── Earnings & Results ────────────────────────────────────────────────────────
export interface QuarterlyResult {
    quarter: string
    revenueCr: number
    operatingProfitCr: number
    operatingMarginPct: number
    netProfitCr: number
    netMarginPct: number
    eps: number
    announcementDate: string
}

export interface AnnualResult {
    fiscalYear: string
    revenueCr: number
    operatingProfitCr: number
    operatingMarginPct: number
    netProfitCr: number
    netMarginPct: number
    eps: number
    dividendPerShare: number
}

export interface DividendRecord {
    recordDate: string
    exDate: string
    type: 'Interim' | 'Final' | 'Special'
    amountPerShare: number
    percentage: number
}

export interface CorporateAction {
    date: string
    type: 'Bonus' | 'Stock Split' | 'Rights Issue' | 'AGM' | 'Dividend'
    details: string
}

export interface EarningsData {
    symbol: string
    exchange: Exchange
    quarterlyResults: QuarterlyResult[]
    annualResults: AnnualResult[]
    dividends: DividendRecord[]
    corporateActions: CorporateAction[]
}

// ─── Screener ──────────────────────────────────────────────────────────────────
export type ScreenerOperator =
    | 'gt'
    | 'gte'
    | 'lt'
    | 'lte'
    | 'eq'
    | 'between'

export interface ScreenerFilterRule {
    id: string
    field: string
    operator: ScreenerOperator
    value: number | string
    secondaryValue?: number | string
}

export interface ScreenerFilterFieldDefinition {
    id: string
    label: string
    category: 'Valuation' | 'Profitability' | 'Growth' | 'Solvency' | 'Technical'
    unit: '₹' | '%' | 'x' | 'Cr' | 'points' | ''
    min?: number
    max?: number
    step?: number
    defaultOperator: ScreenerOperator
}

export interface ScreenerPreset {
    id: string
    name: string
    description: string
    category: string
    rules: ScreenerFilterRule[]
}

export interface ScreenerStockResult {
    symbol: string
    name: string
    exchange: Exchange
    sector: string
    marketCapCategory: MarketCapCategory
    currentPrice: number
    change: number
    percentChange: number
    marketCapCr: number
    peRatio: number
    pbRatio: number
    roe: number
    roce: number
    debtToEquity: number
    revenueGrowthYoY: number
    profitGrowthYoY: number
    rsi14: number
    ma50DistancePct: number
}

// ─── Compare ───────────────────────────────────────────────────────────────────
export interface StockComparisonData {
    symbol: string
    name: string
    exchange: Exchange
    sector: string
    currentPrice: number
    percentChange: number
    marketCapCr: number
    peRatio: number
    pbRatio: number
    roe: number
    roce: number
    evEbitda: number
    debtToEquity: number
    operatingMargin: number
    revenueGrowth: number
    profitGrowth: number
    dividendYield: number
    rsi14: number
    beta: number
    high52w: number
    low52w: number
}

// ─── Watchlists & Portfolio ───────────────────────────────────────────────────
export interface WatchlistItem {
    id: string
    name: string
    description?: string
    isDefault?: boolean
    createdAt: string
    stockSymbols: { symbol: string; exchange: Exchange }[]
}

export interface PortfolioHolding {
    id: string
    symbol: string
    name: string
    exchange: Exchange
    quantity: number
    averageBuyPrice: number
    currentPrice: number
    investedAmount: number
    currentValue: number
    pnl: number
    pnlPercentage: number
    dayPnl: number
    dayPnlPercentage: number
    weightPct: number
}

export interface PortfolioSummary {

    totalInvested: number
    currentValue: number
    totalPnl: number
    totalPnlPercentage: number
    dayPnl: number
    dayPnlPercentage: number
    totalHoldings: number
    cashBalance: number
}

// ─── Peer Comparison ──────────────────────────────────────────────────────────

export interface PeerCompanyMetricData {
    symbol: string
    name: string
    exchange: Exchange
    isCurrentStock?: boolean
    // Market & Valuation
    cmp: number
    marketCapCr: number
    pe: number | null
    pb: number | null
    bookValue: number | null
    divYieldPct: number | null
    // Profitability
    netProfitCr: number | null
    profitGrowthPct: number | null
    roePct: number | null
    rocePct: number | null
    opmPct: number | null
    npmPct: number | null
    // Revenue & Growth
    salesCr: number | null
    salesGrowthPct: number | null
    annualRevenueGrowthPct: number | null
    annualProfitGrowthPct: number | null
    epsGrowthPct: number | null
    // Financial Health
    debtToEquity: number | null
    currentRatio: number | null
    interestCoverage: number | null
    // Ownership
    promoterHoldingPct: number | null
    promoterPledgingPct: number | null
}

export interface PeerComparisonResponse {
    sector: string
    industry: string
    currentStock: PeerCompanyMetricData
    availablePeers: PeerCompanyMetricData[]
    initialPeerSymbols: string[]
}

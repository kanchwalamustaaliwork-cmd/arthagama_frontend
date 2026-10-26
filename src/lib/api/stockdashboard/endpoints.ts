/**
 * src/lib/api/stockdashboard/endpoints.ts
 *
 * Central constants for Stock Dashboard API endpoints without version prefixes.
 * Derived from API_ENDPOINTS_STOCK_DASHBOARD.md.
 */

export const STOCK_API_ENDPOINTS = {
    // 1. Dashboard
    DASHBOARD_OVERVIEW: '/api/stockdashboard/overview',
    MARKET_SUMMARY: '/api/stockdashboard/market-summary',
    TOP_GAINERS: '/api/stockdashboard/top-gainers',
    TOP_LOSERS: '/api/stockdashboard/top-losers',
    MOST_ACTIVE: '/api/stockdashboard/most-active',
    RECENTLY_VIEWED: '/api/stockdashboard/recently-viewed',

    // 2. Stock Search
    SEARCH_STOCKS: '/api/stocks/search',
    STOCK_QUICK_INFO: (exchange: string, symbol: string) => `/api/stocks/${exchange}/${symbol}/quick-info`,

    // 3. Stock Overview
    STOCK_PROFILE: (exchange: string, symbol: string) => `/api/stocks/${exchange}/${symbol}`,
    STOCK_PRICE: (exchange: string, symbol: string) => `/api/stocks/${exchange}/${symbol}/price`,
    STOCK_CHART: (exchange: string, symbol: string) => `/api/stocks/${exchange}/${symbol}/chart`,
    STOCK_KEY_METRICS: (exchange: string, symbol: string) => `/api/stocks/${exchange}/${symbol}/key-metrics`,

    // 4. Fundamentals
    STOCK_FUNDAMENTALS: (exchange: string, symbol: string) => `/api/stocks/${exchange}/${symbol}/fundamentals`,
    STOCK_FINANCIALS: (exchange: string, symbol: string) => `/api/stocks/${exchange}/${symbol}/financials`,
    STOCK_RATIOS: (exchange: string, symbol: string) => `/api/stocks/${exchange}/${symbol}/ratios`,
    STOCK_SHAREHOLDING: (exchange: string, symbol: string) => `/api/stocks/${exchange}/${symbol}/shareholding`,

    // 5. Earnings & Results
    STOCK_EARNINGS: (exchange: string, symbol: string) => `/api/stocks/${exchange}/${symbol}/earnings`,
    STOCK_QUARTERLY_RESULTS: (exchange: string, symbol: string) => `/api/stocks/${exchange}/${symbol}/quarterly-results`,
    STOCK_ANNUAL_RESULTS: (exchange: string, symbol: string) => `/api/stocks/${exchange}/${symbol}/annual-results`,
    STOCK_DIVIDENDS: (exchange: string, symbol: string) => `/api/stocks/${exchange}/${symbol}/dividends`,
    STOCK_CORPORATE_ACTIONS: (exchange: string, symbol: string) => `/api/stocks/${exchange}/${symbol}/corporate-actions`,

    // 6. Stock Screener
    SCREENER_FILTERS: '/api/screener/filters',
    SCREENER_PREVIEW: '/api/screener/preview',
    SCREENER_RUN: '/api/screener/run',
    SCREENER_PRESETS: '/api/screener/presets',
    SCREENER_PRESET_BY_ID: (id: string) => `/api/screener/presets/${id}`,

    // 7. Compare Stocks
    STOCKS_COMPARE: '/api/stocks/compare',
    STOCKS_COMPARE_METRICS: '/api/stocks/compare/metrics',

    // 8. Watchlists & Portfolio
    WATCHLISTS: '/api/watchlists',
    WATCHLIST_BY_ID: (id: string) => `/api/watchlists/${id}`,
    WATCHLIST_STOCKS: (id: string) => `/api/watchlists/${id}/stocks`,
    WATCHLIST_STOCK_DELETE: (id: string, exchange: string, symbol: string) => `/api/watchlists/${id}/stocks/${exchange}/${symbol}`,
    PORTFOLIO_SUMMARY: '/api/portfolio/summary',
    PORTFOLIO_HOLDINGS: '/api/portfolio/holdings',
    PORTFOLIO_PERFORMANCE: '/api/portfolio/performance',
} as const

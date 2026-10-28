// MTF API endpoints constants
export const MTF_BASE = '/api/mtf';

export const MTF_ENDPOINTS = {
  // Overview
  overviewSummary: `${MTF_BASE}/overview/summary`,
  overviewTotals: `${MTF_BASE}/overview/totals`,
  overviewFlow: `${MTF_BASE}/overview/flow`,
  overviewBreadth: `${MTF_BASE}/overview/breadth`,
  overviewComposition: `${MTF_BASE}/overview/composition`,
  overviewTradedValue: `${MTF_BASE}/overview/traded-value`,

  // Stocks
  stocks: `${MTF_BASE}/stocks`,
  stocksExport: `${MTF_BASE}/stocks/export.csv`,
  stock: (isin: string) => `${MTF_BASE}/stocks/${isin}`,
  stockHistory: (isin: string) => `${MTF_BASE}/stocks/${isin}/history`,

  // Brokers
  brokers: `${MTF_BASE}/brokers`,
  brokerHistory: (slug: string) => `${MTF_BASE}/brokers/${slug}/history`,

  // Funding
  fundingCpOutstanding: `${MTF_BASE}/funding/cp/outstanding`,
  fundingCpOutstandingSeries: `${MTF_BASE}/funding/cp/outstanding-series`,
  fundingCpMaturityWall: `${MTF_BASE}/funding/cp/maturity-wall`,
  fundingCpCostVsRepo: `${MTF_BASE}/funding/cp/cost-vs-repo`,
  fundingHolders: `${MTF_BASE}/funding/holders`,
  fundingAmcAllocation: `${MTF_BASE}/funding/amc-allocation`,

  // Events
  events: `${MTF_BASE}/events`,

  // Risk
  riskSurveillance: `${MTF_BASE}/risk/surveillance`,
  riskPledge: (isin: string) => `${MTF_BASE}/risk/pledge/${isin}`,

  // Free Float
  freefloatSeries: `${MTF_BASE}/freefloat/series`,
  freefloatMarketCap: `${MTF_BASE}/freefloat/market-cap`,

  // Reports
  report: (period: string, key: string) => `${MTF_BASE}/reports/${period}/${key}`,
  dayReport: (isoDate: string) => `${MTF_BASE}/reports/date/${isoDate}`,

  // Methodology
  methodologyCoverage: `${MTF_BASE}/methodology/coverage`,
  methodologyDatasets: `${MTF_BASE}/methodology/datasets`,

  // Ingestion (admin)
  ingestionRuns: `${MTF_BASE}/ingestion/runs`,
  ingestionRun: (dataset: string) => `${MTF_BASE}/ingestion/run/${dataset}`,
} as const;


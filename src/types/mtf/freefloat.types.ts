// MTF Types — Free Float sub-feature
export interface MtfDematHolding {
  month: string; // YYYY-MM-01
  investor_category: string;
  total_equity_cr: number | null;
  promoter_proxy_cr: number | null;
  free_float_cr: number | null;
  free_float_pct: number | null;
}

export interface MtfMarketCapHistory {
  trade_date: string;
  total_mcap_cr: number | null;
  free_float_mcap_cr: number | null;
}

export interface BookVsFreeFloatPoint {
  trade_date: string;
  book_cr: number | null;
  free_float_mcap_cr: number | null;
  leverage_vs_ff_pct: number | null;
}


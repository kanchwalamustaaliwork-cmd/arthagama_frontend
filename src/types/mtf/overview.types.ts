// MTF Types — Overview sub-feature
export interface MtfSummary {
  as_of: string;
  source: string;
  nse_book_cr: number | null;
  bse_book_cr: number | null;
  combined_book_cr: number | null;
  day_change_cr: number | null;
  day_change_pct: number | null;
}

export interface MtfDailyTotal {
  trade_date: string;
  exchange: 'NSE' | 'BSE' | 'COMBINED';
  outstanding_cr: number | null;
  fresh_cr: number | null;
  liquidated_cr: number | null;
  securities_count: number | null;
}

export interface MtfDailyFlow {
  trade_date: string;
  fresh_cr: number | null;
  liquidated_cr: number | null;
  net_flow_cr: number | null;
}

export interface MtfDailyBreadth {
  trade_date: string;
  stocks_above_0_cr: number | null;
  stocks_funded_count: number | null;
  total_stocks_count: number | null;
}

export interface MtfBookComposition {
  trade_date: string;
  asset_class: 'FNO' | 'NON_FNO' | 'ETF';
  book_cr: number | null;
}

export interface MtfTradedValue {
  trade_date: string;
  cash_cr: number | null;
  fno_cr: number | null;
  total_cr: number | null;
  book_turnover_ratio?: number | null;
}

export interface MtfOverviewResponse<T> {
  data: T[];
  as_of: string;
  source: string;
}


// MTF Types — Overview sub-feature
// Aligned to backend Pydantic schemas in overview/schemas.py

export interface MtfSummary {
  as_of?: string | null;
  source?: string;
  // Backend field names from OverviewSummary pydantic model
  nse_outstanding_cr?: string | number | null;
  bse_outstanding_cr?: string | number | null;
  total_outstanding_cr?: string | number | null;
  net_flow_cr?: string | number | null;
}

export interface MtfDailyTotal {
  trade_date: string;
  exchange: string; // 'NSE' | 'BSE'
  outstanding_cr?: string | number | null;
  fresh_cr?: string | number | null;
  liquidated_cr?: string | number | null;
  securities_count?: number | null;
}

export interface MtfDailyFlow {
  trade_date: string;
  fresh_cr?: string | number | null;
  liquidated_cr?: string | number | null;
  net_flow_cr?: string | number | null;
}

export interface MtfDailyBreadth {
  trade_date: string;
  stocks_above_0_cr?: number | null;
  stocks_funded_count?: number | null;
  total_stocks_count?: number | null;
}

export interface MtfBookComposition {
  trade_date: string;
  asset_class: string; // 'FNO' | 'NON_FNO' | 'ETF'
  book_cr?: string | number | null;
}

export interface MtfTradedValue {
  trade_date: string;
  cash_cr?: string | number | null;
  fno_cr?: string | number | null;
  total_cr?: string | number | null;
  book_turnover_ratio?: number | null;
}

/** Generic paginated response wrapper — backend returns `items`, not `data` */
export interface MtfOverviewResponse<T> {
  items: T[];        // ← backend key is `items`
  as_of?: string | null;
  source?: string;
}

// MTF Types — Stocks sub-feature
export interface MtfStockSnapshot {
  snapshot_date: string;
  isin: string;
  exchange: 'NSE' | 'BSE' | string;
  symbol: string | null;
  book_cr: number | string | null;
  mcap_cr: number | string | null;
  free_float_mcap_cr: number | string | null;
  leverage_pct: number | string | null;
  change_30d_pct: number | string | null;
  asset_class: 'FNO' | 'NON_FNO' | 'ETF' | string | null;
}

export interface StockHistoryResponse {
  isin: string;
  items: MtfStockSnapshot[];
  as_of?: string | null;
  history_since?: string | null;
  source?: string;
  note?: string;
}

export interface MtfStockDetail extends MtfStockSnapshot {
  snapshot?: MtfStockSnapshot | null;
  surveillance_flags?: MtfSurveillanceFlags;
  pledge_history?: MtfPromoterPledge[];
  history_since?: string; // date of first stored snapshot
  as_of?: string;
  source?: string;
  note?: string;
}

export interface MtfSurveillanceFlags {
  snapshot_date: string;
  isin: string;
  asm: boolean | null;
  gsm: boolean | null;
  esm: boolean | null;
  ibc: boolean | null;
  ban: boolean | null;
  severity: string | null;
  risk_triggers: string[] | null;
}

export interface MtfPromoterPledge {
  isin: string;
  period: string;
  pledged_pct: number | string | null;
  pledged_shares: number | string | null;
  total_shares: number | string | null;
}

export interface MtfStocksPage {
  items: MtfStockSnapshot[];
  total: number;
  page: number;
  size: number;
  pages: number;
  as_of: string;
  source: string;
}

export interface MtfStockFilters {
  q?: string;
  exchange?: 'NSE' | 'BSE';
  asset_class?: 'FNO' | 'NON_FNO' | 'ETF';
  min_book_cr?: number;
  max_book_cr?: number;
  min_leverage_pct?: number;
  max_leverage_pct?: number;
  min_mcap_cr?: number;
  sort_by?: string;
  sort_dir?: 'asc' | 'desc';
  page?: number;
  size?: number;
}

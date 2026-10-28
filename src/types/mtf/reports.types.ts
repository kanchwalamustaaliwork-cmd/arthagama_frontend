// MTF Types — Reports sub-feature
export type ReportPeriod = 'week' | 'month' | 'quarter' | 'year';

export interface MtfPeriodReport {
  period: ReportPeriod;
  period_key: string; // YYYY-WW, YYYY-MM, YYYY-Qn, YYYY
  start_date: string;
  end_date: string;
  avg_book_cr: number | null;
  seq_growth_pct: number | null;  // vs previous period
  yoy_growth_pct: number | null;
  adto_cr: number | null;         // average daily traded value
  net_flow_cr: number | null;
  avg_funded_stocks: number | null;
  top_stocks: MtfTopStock[];
  biggest_gainers: MtfMover[];
  biggest_losers: MtfMover[];
  as_of: string;
  source: string;
}

export interface MtfDayReport {
  trade_date: string;
  total_book_cr: number | null;
  nse_book_cr: number | null;
  bse_book_cr: number | null;
  fresh_cr: number | null;
  liquidated_cr: number | null;
  net_flow_cr: number | null;
  stocks_funded_count: number | null;
  top_funded: MtfTopStock[];
  biggest_movers: MtfMover[];
  concentration_top5_pct: number | null;
  concentration_top10_pct: number | null;
  as_of: string;
  source: string;
}

export interface MtfTopStock {
  rank: number;
  isin: string;
  symbol: string | null;
  book_cr: number | null;
}

export interface MtfMover {
  rank: number;
  direction: 'UP' | 'DOWN';
  isin: string;
  symbol: string | null;
  book_cr: number | null;
  change_cr: number | null;
  change_pct: number | null;
}


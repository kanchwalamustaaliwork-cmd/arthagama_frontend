// MTF Types — Reports sub-feature
export type ReportPeriod = 'week' | 'month' | 'quarter' | 'year';

export interface MtfPeriodReport {
  period: ReportPeriod | string;
  period_key?: string; // YYYY-WW, YYYY-MM, YYYY-Qn, YYYY
  key?: string;
  start_date?: string;
  end_date?: string;
  from_date?: string;
  to_date?: string;
  avg_book_cr?: number | string | null;
  seq_growth_pct?: number | null; // vs previous period
  yoy_growth_pct?: number | null;
  adto_cr?: number | string | null; // average daily traded value
  net_flow_cr?: number | string | null;
  avg_funded_stocks?: number | null;
  stocks_funded_avg?: number | null;
  top_stocks?: MtfTopStock[];
  biggest_gainers?: MtfMover[];
  biggest_losers?: MtfMover[];
  as_of?: string;
  source?: string;
}

export interface MtfDayReport {
  trade_date: string;
  headline_book_cr?: number | string | null;
  total_book_cr?: number | string | null;
  nse_book_cr?: number | string | null;
  bse_book_cr?: number | string | null;
  fresh_cr?: number | string | null;
  liquidated_cr?: number | string | null;
  net_flow_cr?: number | string | null;
  stocks_funded?: number | null;
  stocks_funded_count?: number | null;
  concentration?: any;
  concentration_top5_pct?: number | string | null;
  concentration_top10_pct?: number | string | null;
  top_funded?: MtfTopStock[];
  biggest_movers?: MtfMover[];
  as_of?: string;
  source?: string;
}

export interface MtfTopStock {
  rank: number;
  isin: string;
  symbol: string | null;
  book_cr: number | string | null;
}

export interface MtfMover {
  rank: number;
  direction: 'UP' | 'DOWN';
  isin: string;
  symbol: string | null;
  book_cr: number | string | null;
  change_cr: number | string | null;
  change_pct: number | string | null;
}

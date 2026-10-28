// MTF Types — Funding sub-feature
export interface MtfBrokerCp {
  cp_isin: string;
  broker_id: string | null;
  issue_date: string | null;
  maturity_date: string | null;
  tenor_days: number | null;
  amount_cr: number | null;
  coupon_pct: number | null;
  is_live: boolean | null;
}

export interface MtfBrokerCpSeries {
  series_name: string;
  as_of: string;
  broker_id: string | null;
  value_cr: number | null;
}

export interface MtfCpHolder {
  cadence: 'M' | 'F';
  as_of: string;
  cp_isin: string;
  amc: string;
  scheme: string;
  broker_id: string | null;
  amount_cr: number | null;
}

export interface MtfAmcAllocation {
  cadence: 'M' | 'F';
  as_of: string;
  amc: string;
  allocation_cr: number | null;
  house_aum_cr: number | null;
  cp_fund_aum_cr: number | null;
}

export interface MaturityWallBucket {
  bucket_label: string; // e.g. "< 30d", "30-90d", "90-180d", "> 180d"
  amount_cr: number;
  count: number;
}

export interface CostVsRepoPoint {
  as_of: string;
  broker_id: string | null;
  borrowing_cost_pct: number | null;
  repo_rate_pct: number | null;
  spread_pct: number | null;
}

export interface FundingPageDisclaimer {
  text: string; // "disclosed funding relationships" disclaimer
}


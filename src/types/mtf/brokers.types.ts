// MTF Types — Brokers sub-feature
export interface MtfBroker {
  id: string;
  name: string;
  slug: string;
}

export interface MtfBrokerRanking {
  rank: number;
  broker_id: string;
  broker_name: string;
  slug: string;
  book_cr: number | null;
  share_pct: number | null; // share of disclosed book only
  as_of: string;
  basis: string;
  source_type: string;
  source_ref: string | null;
}

export interface MtfBrokerHistory {
  as_of: string;
  book_cr: number | null;
  basis: string;
  source_type: string;
}

export interface MtfBrokerRankingResponse {
  items: MtfBrokerRanking[];
  as_of: string;
  source: string;
  /** Must always be shown in the UI */
  caveat: string;
}


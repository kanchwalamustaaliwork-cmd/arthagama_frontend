// MTF Types — Brokers sub-feature
// Aligned to backend Pydantic schemas in brokers/schemas.py

export interface BrokerItem {
  id: string;
  name: string;
  slug: string;
}

export interface BrokerBookItem {
  broker_id: string;
  as_of: string;
  basis: string;
  source_type: string;
  book_cr?: string | number | null;
  source_ref?: string | null;
  share_of_disclosed_pct?: number | null;
}

export interface BrokerRankingResponse {
  items: BrokerBookItem[];
  as_of?: string | null;
  caveat: string;
  source: string;
}

export interface BrokerHistoryResponse {
  broker_id: string;
  items: BrokerBookItem[];
  as_of?: string | null;
  caveat: string;
  source: string;
}

// Aliases for backwards compatibility
export type MtfBroker = BrokerItem;
export type MtfBrokerRanking = BrokerBookItem;
export type MtfBrokerHistory = BrokerBookItem;
export type MtfBrokerRankingResponse = BrokerRankingResponse;
export type MtfBrokerHistoryResponse = BrokerHistoryResponse;

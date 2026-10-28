// MTF Types — Events sub-feature
export type MtfEventType =
  | 'book_milestone'
  | 'book_ath'
  | 'flush'
  | 'surveillance'
  | 'pledge_book'
  | 'broker_ath';

export interface MtfEvent {
  event_id: string;
  event_type: MtfEventType;
  event_date: string | null;
  headline: string | null;
  detail_json: Record<string, unknown> | null;
}

export interface MtfEventsPage {
  items: MtfEvent[];
  total: number;
  page: number;
  size: number;
  pages: number;
  as_of: string;
  source: string;
}

export interface MtfFlushEvent {
  event_date: string;
  severity: string | null;
  context_label: string | null;
  book_before_cr: number | null;
  book_after_cr: number | null;
  drop_cr: number | null;
  drop_pct: number | null;
}


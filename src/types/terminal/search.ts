import { InstrumentType } from './instrument'

/** Wire shape returned by /api/terminal/market/search */
export interface SearchResultItem {
    symbol: string
    name: string
    exchange: string
    instrument_type: InstrumentType
    // options-specific
    strike?: number
    option_type?: 'CE' | 'PE'
    expiry?: string
    // futures-specific
    contract_expiry?: string
    lot_size?: number
    // instrument master fields (new — additive)
    token?: string
    segment?: string                // raw segment, e.g. "NFO" — for Definedge URL building
    has_equity?: boolean
    has_index?: boolean
    has_futures?: boolean
    has_options?: boolean
    equity_token?: string
    index_token?: string
    resolved?: boolean              // true = search narrowed to exactly one contract
}

export interface SearchResponse {
    results: SearchResultItem[]
}

// ── New multi-shape search response ─────────────────────────────────────────

/** Availability flags for one exchange in a symbol card result */
export interface ExchangeAvailability {
    has_equity: boolean
    has_index: boolean
    has_futures: boolean
    has_options: boolean
    equity_token?: string
    index_token?: string
}

/** Result shape 1 — symbol availability card */
export interface SymbolCardResult {
    result_type: 'symbol_card'
    symbol: string
    name: string
    NSE: ExchangeAvailability
    BSE: ExchangeAvailability
}

/** Result shape 2 — list of contracts matching a strike (and optional filter) */
export interface ContractPickerResult {
    result_type: 'contract_picker'
    symbol: string
    contracts: ContractItem[]
}

/** Result shape 3 — query resolved to exactly one contract */
export interface DirectResolutionResult {
    result_type: 'direct_resolution'
    resolved: true
    contract: ContractItem
}

/** Empty/no-match result */
export interface EmptyResult {
    result_type: 'empty'
    query?: string
    reason?: string
}

export interface ContractItem {
    token: string
    symbol: string
    trading_symbol: string
    segment: string
    display_exchange: string
    instrument_type: string
    expiry: string | null
    strike: number | null
    option_type: 'CE' | 'PE' | null
    lot_size: number
}

/** Item inside a search_list result group */
export interface SearchListItem {
    symbol: string
    name: string
    instrument_type: 'equity' | 'index' | 'futures' | 'options'
    exchange: string
    token?: string
    segment?: string
    // Futures-specific
    expiry?: string
    label?: string        // "Current" | "Next" | "Far"
    lot_size?: number
    // Family card flag — if true, compact card (no individual strikes)
    is_family?: boolean
    has_futures?: boolean
    has_options?: boolean
}

/** Group inside a search_list result */
export interface SearchListGroup {
    group: 'INDICES' | 'STOCKS' | 'FUTURES' | 'OPTIONS'
    items: SearchListItem[]
}

/** Result shape 4 — grouped search results for multi-family / broad queries */
export interface SearchListResult {
    result_type: 'search_list'
    groups: SearchListGroup[]
}

/** Union of all possible shapes from /market/search */
export type SearchQueryResponse =
    | SearchListResult
    | SymbolCardResult
    | ContractPickerResult
    | DirectResolutionResult
    | EmptyResult


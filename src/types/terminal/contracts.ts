/**
 * Contract types — for futures discovery and option-chain contract listing.
 * These are returned by the new master-data endpoints (not the legacy chain).
 */

/** One futures contract row */
export interface FutureContract {
    symbol: string
    exchange: string
    expiry: string       // ISO date
    token: string
    lot_size: number
    label: 'Current' | 'Next' | 'Far' | string   // position label
}

export interface FuturesResponse {
    symbol: string
    exchange: string
    futures: FutureContract[]
}

/** One option contract row from the instrument master */
export interface ContractRecord {
    strike: number
    option_type: 'CE' | 'PE'
    token: string
    lot_size: number
    trading_symbol?: string
    segment?: string
}

export interface ContractsResponse {
    symbol: string
    expiry: string
    exchange: string
    contracts: ContractRecord[]
}

export interface ExpiriesResponse {
    symbol: string
    exchange: string
    expiries: string[]
}

/** Full resolved instrument from /market/resolve-token/{token} */
export interface ResolvedTokenResponse {
    available: boolean
    token?: string
    segment?: string
    display_exchange?: string
    symbol?: string
    trading_symbol?: string
    instrument_type?: string
    expiry?: string | null
    strike?: number | null
    option_type?: 'CE' | 'PE' | null
    lot_size?: number
    tick_size?: number
    company?: string
}

/** Option Greeks */
export interface Greeks {
    delta: number
    gamma: number
    theta: number
    vega: number
    rho?: number
}

/** One option leg (call or put) in the chain */
export interface OptionLeg {
    ltp?: number | null
    bid?: number | null
    ask?: number | null
    iv?: number | null       // annualized %, e.g. 18.5
    oi?: number | null
    oi_chg?: number | null
    volume?: number | null
    delta?: number | null
    gamma?: number | null
    theta?: number | null
    vega?: number | null
}

/** One strike row in the option chain */
export interface ChainRow {
    strike: number
    ce?: OptionLeg | null
    pe?: OptionLeg | null
}

/** Full option chain response */
export interface OptionChain {
    symbol: string
    expiry: string
    expiries: string[]
    spot: number
    atm_strike: number
    step: number
    lot_size: number
    source: string       // "nse" | "synthetic"
    pcr?: number | null
    max_pain?: number | null
    total_ce_oi?: number
    total_pe_oi?: number
    rows: ChainRow[]
}

/** Payoff curve point */
export interface PayoffPoint {
    spot: number
    pnl: number
}

export interface PayoffResponse {
    symbol: string
    lot_size: number
    curve: PayoffPoint[]
    breakevens: number[]
    max_profit: number
    max_loss: number
    net_premium: number
}

// ── Live Option Chain (FYERS v3) Types ──────────────────────────────────────

export interface ExpiryItem {
    date: string
    expiry: string
}

export interface LiveOptionLeg {
    symbol?: string
    fy_token?: string
    ltp?: number | null
    ltpch?: number | null
    ltpchp?: number | null
    oi?: number | null
    oich?: number | null
    oichp?: number | null
    prev_oi?: number | null
    volume?: number | null
    bid?: number | null
    ask?: number | null
    delta?: number | null
    gamma?: number | null
    theta?: number | null
    vega?: number | null
    iv?: number | null
    greeks_source?: 'fyers' | 'calculated' | null
    moneyness?: 'ITM' | 'ATM' | 'OTM'
}

export interface LiveOptionRow {
    strike: number
    is_atm?: boolean
    ce?: LiveOptionLeg | null
    pe?: LiveOptionLeg | null
}

export interface LiveOptionChainResponse {
    success: boolean
    configured?: boolean
    error?: string
    symbol: string
    exchange: string
    underlying_price?: number | null
    vix?: number | null
    underlying_change?: number | null
    underlying_change_pct?: number | null
    atm_strike?: number | null
    lot_size?: number
    expiries: ExpiryItem[]
    active_expiry?: string | null
    total_ce_oi?: number
    total_pe_oi?: number
    total_ce_volume?: number
    total_pe_volume?: number
    pcr?: number | null
    source?: string
    rows: LiveOptionRow[]
}

/** Strategy builder leg */
export interface StrategyLeg {
    opt_type: 'CE' | 'PE' | 'FUT'
    strike: number
    qty: number          // positive = long, negative = short lots
    premium: number
    iv?: number
}

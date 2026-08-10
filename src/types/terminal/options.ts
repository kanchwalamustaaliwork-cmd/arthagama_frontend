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

/** Strategy builder leg */
export interface StrategyLeg {
    opt_type: 'CE' | 'PE' | 'FUT'
    strike: number
    qty: number          // positive = long, negative = short lots
    premium: number
    iv?: number
}

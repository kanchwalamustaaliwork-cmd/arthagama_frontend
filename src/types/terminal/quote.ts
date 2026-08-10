/** Live quote snapshot */
export interface Quote {
    symbol: string
    exchange: string
    name?: string | null
    last?: number | null
    prev_close?: number | null
    change?: number | null
    change_pct?: number | null
    open?: number | null
    high?: number | null
    low?: number | null
    volume?: number | null
    vwap?: number | null
    source: string
}

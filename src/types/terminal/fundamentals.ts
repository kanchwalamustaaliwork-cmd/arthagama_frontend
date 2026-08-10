export interface CompanyFundamentals {
    symbol: string
    name?: string | null
    sector?: string | null
    industry?: string | null
    market_cap?: number | null
    pe?: number | null
    pb?: number | null
    eps?: number | null
    dividend_yield?: number | null
    roe?: number | null
    beta?: number | null
    week52_high?: number | null
    week52_low?: number | null
    description?: string | null
    source: string
}

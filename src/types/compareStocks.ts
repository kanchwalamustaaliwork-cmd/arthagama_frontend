export interface StockPerformancePoint {
    month: string
    value: number // normalized % change from period start
}

export interface StockMetrics {
    cagr: number
    volatility: number
    sharpe: number
    maxDrawdown: number
    beta: number
}

export interface Stock {
    symbol: string
    name: string
    sector: string
    color: string // used for chart line + chip accent
    performance: StockPerformancePoint[]
    metrics: StockMetrics
}

export interface StockSearchPickerProps {
    selected: Stock[]
    availableResults: Stock[]
    query: string
    onQueryChange: (v: string) => void
    onAdd: (symbol: string) => void
    onRemove: (symbol: string) => void
    canAddMore: boolean
    maxSelected: number
}
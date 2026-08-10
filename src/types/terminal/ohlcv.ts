/** Single OHLCV candlestick */
export interface Candle {
    time: string   // ISO timestamp
    open: number
    high: number
    low: number
    close: number
    volume: number
}

export type Interval = '1m' | '5m' | '15m' | '1h' | '1d' | '1w'

export const INTERVALS: Interval[] = ['1m', '5m', '15m', '1h', '1d', '1w']

export const INTERVAL_LABELS: Record<Interval, string> = {
    '1m': '1m', '5m': '5m', '15m': '15m', '1h': '1H', '1d': '1D', '1w': '1W',
}

export interface OHLCVResponse {
    symbol: string
    exchange: string
    interval: Interval
    source: string
    candles: Candle[]
}

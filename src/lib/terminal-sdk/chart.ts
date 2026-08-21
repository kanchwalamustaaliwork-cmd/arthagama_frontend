import { apiGet } from '@/src/api/axios'
import { Candle, Instrument, Interval, OHLCVResponse } from '@/src/types/terminal'
import { Bar } from '@/src/lib/market-terminal/CandleChart'

/**
 * Fetch OHLCV candles from the backend.
 *
 * @param instrument - The target instrument.
 * @param interval   - Timeframe string ('1m', '5m', '1d', etc.).
 * @param limit      - Max candles to return (backend applies this after aggregation).
 * @param fromDt     - Optional range start. When provided, sent as ISO string.
 *                     Use this for left-side chart pagination (loading older bars).
 * @param toDt       - Optional range end. When provided, sent as ISO string.
 *                     Use this for right-side chart pagination (loading newer bars).
 *                     When both are omitted the backend uses its default lookback.
 */
export async function getCandles(
    instrument: Instrument,
    interval: Interval = '1d',
    limit = 500,
    fromDt?: Date,
    toDt?: Date,
): Promise<Bar[]> {
    const params: Record<string, any> = {
        symbol: instrument.symbol,
        exchange: instrument.exchange,
        interval,
        limit,
    }

    if (instrument.token) {
        params.token = instrument.token
    }

    // Chart pagination: pass explicit date boundaries as ISO strings so the
    // backend's coverage-aware router fetches only the requested window.
    if (fromDt) {
        params.from_dt = fromDt.toISOString()
    }
    if (toDt) {
        params.to_dt = toDt.toISOString()
    }

    const res = await apiGet<OHLCVResponse>('/terminal/market/ohlcv', { params })

    return (res.data.candles || []).map((c: Candle) => ({
        time: Math.floor(new Date(c.time).getTime() / 1000),
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
        volume: c.volume,
    }))
}

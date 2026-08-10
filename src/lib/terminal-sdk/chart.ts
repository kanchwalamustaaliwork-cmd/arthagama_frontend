import { apiGet } from '@/src/api/axios'
import { Candle, Instrument, Interval, OHLCVResponse } from '@/src/types/terminal'
import { Bar } from '@/src/lib/market-terminal/CandleChart'

export async function getCandles(
    instrument: Instrument,
    interval: Interval = '1d',
    limit = 500
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

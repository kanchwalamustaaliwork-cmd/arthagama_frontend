import { apiGet } from '@/src/api/axios'
import { Instrument, Quote, WatchlistResponse } from '@/src/types/terminal'

export async function getQuote(instrument: Instrument): Promise<Quote> {
    const params: Record<string, any> = {
        symbol: instrument.symbol,
        exchange: instrument.exchange,
    }
    if (instrument.token) {
        params.token = instrument.token
    }
    const res = await apiGet<Quote>('/terminal/market/quote', { params })
    return res.data
}

export async function getWatchlist(symbols?: string): Promise<WatchlistResponse> {
    const res = await apiGet<WatchlistResponse>('/terminal/market/watchlist', {
        params: symbols ? { symbols } : undefined,
    })
    return res.data
}


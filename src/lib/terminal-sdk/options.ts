import { apiGet, apiPost } from '@/src/api/axios'
import { Instrument, OptionChain, PayoffResponse, StrategyLeg } from '@/src/types/terminal'

export async function getExpiries(instrument: Instrument, count = 6): Promise<string[]> {
    const res = await apiGet<{ expiries: string[] }>('/terminal/options/expiries', {
        params: { symbol: instrument.symbol, count },
    })
    return res.data.expiries
}

export async function getOptionChain(
    instrument: Instrument,
    expiry?: string,
    depth = 12
): Promise<OptionChain> {
    const res = await apiGet<OptionChain>('/terminal/options/chain', {
        params: {
            symbol: instrument.symbol,
            expiry,
            exchange: instrument.exchange,
            depth,
        },
    })
    return res.data
}

export async function calculatePayoff(
    instrument: Instrument,
    spot: number,
    legs: StrategyLeg[]
): Promise<PayoffResponse> {
    const res = await apiPost<PayoffResponse>('/terminal/options/payoff', { legs }, {
        params: { symbol: instrument.symbol, spot },
    })
    return res.data
}

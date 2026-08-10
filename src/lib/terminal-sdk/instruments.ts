import { apiGet } from '@/src/api/axios'
import {
    FuturesResponse,
    ContractsResponse,
    ExpiriesResponse,
    ResolvedTokenResponse,
    FutureContract,
    ContractRecord,
} from '@/src/types/terminal'

/** GET /market/instruments/{symbol}/futures — Current / Next / Far */
export async function getFutures(
    symbol: string,
    exchange = 'NSE',
): Promise<FutureContract[]> {
    const res = await apiGet<FuturesResponse>(
        `/terminal/market/instruments/${symbol.toUpperCase()}/futures`,
        { params: { exchange } },
    )
    return res.data.futures
}

/** GET /options/{symbol}/expiries — option expiry dates from the master */
export async function getExpiries(
    symbol: string,
    exchange = 'NSE',
): Promise<string[]> {
    const res = await apiGet<ExpiriesResponse>(
        `/terminal/options/${symbol.toUpperCase()}/expiries`,
        { params: { exchange } },
    )
    return res.data.expiries
}

/** GET /options/{symbol}/contracts — flat CE/PE contract list for a given expiry */
export async function getContracts(
    symbol: string,
    expiry: string,
    exchange = 'NSE',
): Promise<ContractRecord[]> {
    const res = await apiGet<ContractsResponse>(
        `/terminal/options/${symbol.toUpperCase()}/contracts`,
        { params: { expiry, exchange } },
    )
    return res.data.contracts
}

/** GET /market/resolve-token/{token} — resolve a token to full instrument metadata */
export async function resolveToken(
    token: string,
): Promise<ResolvedTokenResponse> {
    const res = await apiGet<ResolvedTokenResponse>(
        `/terminal/market/resolve-token/${token}`,
    )
    return res.data
}

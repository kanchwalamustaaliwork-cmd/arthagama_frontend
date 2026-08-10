import { apiGet } from '@/src/api/axios'
import { SearchQueryResponse } from '@/src/types/terminal'

export async function search(
    query: string,
    options?: {
        limit?: number
        instrument_type?: string
        exchange?: string
    }
): Promise<SearchQueryResponse> {
    if (!query.trim()) return { result_type: 'empty', query }
    const res = await apiGet<SearchQueryResponse>('/terminal/market/search', {
        params: {
            q: query,
            limit: options?.limit ?? 20,
            instrument_type: options?.instrument_type,
            exchange: options?.exchange,
        },
    })
    return res.data
}

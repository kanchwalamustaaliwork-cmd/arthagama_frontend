import { apiGet } from '@/src/api/axios'
import { Instrument, NewsItem, NewsResponse } from '@/src/types/terminal'

export async function getMarketNews(limit = 30): Promise<NewsItem[]> {
    const res = await apiGet<NewsResponse>('/terminal/news/market', {
        params: { limit },
    })
    return res.data.items || []
}

export async function getCompanyNews(instrument: Instrument, limit = 20): Promise<NewsItem[]> {
    const res = await apiGet<NewsResponse>('/terminal/news/company', {
        params: {
            symbol: instrument.symbol,
            name: instrument.name,
            limit,
        },
    })
    return res.data.items || []
}

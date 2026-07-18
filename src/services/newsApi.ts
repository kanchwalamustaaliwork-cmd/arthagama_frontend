import { apiGet } from '@/src/api/axios'
import type { NewsArticle } from '@/src/types/news'

export interface NewsApiResponse {
    articles: NewsArticle[]
    last_updated?: string
    count?: number
}

/**
 * Fetches the latest live financial news from the backend.
 * Uses axios helper configured with base API URL.
 */
export async function fetchNewsApi(): Promise<NewsArticle[]> {
    const response = await apiGet<NewsApiResponse>('/news')
    return response.data?.articles || []
}

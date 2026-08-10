export interface NewsItem {
    title: string
    link: string
    source: string
    published?: string | null
    summary?: string | null
    sentiment?: number | null  // -1.0 to 1.0
}

export interface NewsResponse {
    symbol?: string
    items: NewsItem[]
}

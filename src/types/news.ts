export interface NewsArticle {
    title: string
    summary: string | null
    url: string
    image_url: string | null
    source: string
    published_at: string | null
    scraped_at: string
}

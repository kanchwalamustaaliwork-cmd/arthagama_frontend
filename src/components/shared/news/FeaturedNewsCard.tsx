import type { NewsArticle } from '@/src/types/news'
import { formatTime } from '@/src/utils/formatTime'

interface FeaturedNewsCardProps {
    article: NewsArticle
}


export default function FeaturedNewsCard({ article }: FeaturedNewsCardProps) {
    const displaySummary = article.summary || 'No summary available for this article.'
    const displayTime = formatTime(article.published_at, article.scraped_at)

    return (
        <div className="featured-news-card fade-in-element" key={article.url}>
            <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="featured-image-wrapper"
            >
                {article.image_url ? (
                    <img
                        src={article.image_url}
                        alt={article.title}
                        className="featured-image"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent && !parent.querySelector('.news-image-fallback')) {
                                const fallback = document.createElement('div');
                                fallback.className = 'news-image-fallback';
                                fallback.innerText = article.source || 'ARTHAGAMA';
                                parent.appendChild(fallback);
                            }
                        }}
                    />
                ) : (
                    <div className="news-image-fallback">
                        {article.source || 'ARTHAGAMA'}
                    </div>
                )}
            </a>

            <div className="featured-content">
                <div className="featured-meta">
                    <span className="news-badge">{article.source}</span>
                    <span>•</span>
                    <span>{displayTime}</span>
                </div>

                <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="featured-title"
                >
                    {article.title}
                </a>

                <p className="featured-summary">{displaySummary}</p>
            </div>
        </div>
    )
}

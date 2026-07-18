import type { NewsArticle } from '@/src/types/news'
import { formatTime } from '@/src/utils/formatTime'

interface NewsItemCardProps {
    article: NewsArticle
    isActive: boolean
    onClick: () => void
}

export default function NewsItemCard({ article, isActive, onClick }: NewsItemCardProps) {
    const displaySummary = article.summary || 'No summary available.'
    const displayTime = formatTime(article.published_at, article.scraped_at)

    return (
        <div
            className={`news-item-card ${isActive ? 'active' : ''}`}
            onClick={onClick}
        >
            <div className="news-item-thumbnail-wrapper">
                {article.image_url ? (
                    <img
                        src={article.image_url}
                        alt={article.title}
                        className="news-item-thumbnail"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent && !parent.querySelector('.news-image-fallback')) {
                                const fallback = document.createElement('div');
                                fallback.className = 'news-image-fallback';
                                fallback.style.fontSize = '8px';
                                fallback.innerText = article.source || 'NEWS';
                                parent.appendChild(fallback);
                            }
                        }}
                    />
                ) : (
                    <div className="news-image-fallback" style={{ fontSize: '8px' }}>
                        {article.source || 'NEWS'}
                    </div>
                )}
            </div>

            <div className="news-item-info">
                <div className="news-item-meta">
                    <span style={{ color: 'var(--db-mint)' }}>{article.source}</span>
                    <span>•</span>
                    <span>{displayTime}</span>
                </div>
                <h4 className="news-item-title">{article.title}</h4>
                <p className="news-item-summary">{displaySummary}</p>
            </div>
        </div>
    )
}

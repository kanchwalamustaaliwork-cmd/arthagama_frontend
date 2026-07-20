'use client'

import { useNews } from '@/src/hooks/useNews'
import { Newspaper, AlertTriangle, Loader2 } from 'lucide-react'
import EmptyState from '@/src/components/dashboard/ui/EmptyState'
import NewsMarqueeRow from './news/NewsMarqueeRow'
import LiveNewsSkeleton from './news/LiveNewsSkeleton'
import type { NewsArticle } from '@/src/types/news'

function splitArticles(articles: NewsArticle[]) {
    const row1: NewsArticle[] = []
    const row2: NewsArticle[] = []
    articles.forEach((article, i) => {
        if (i % 2 === 0) row1.push(article)
        else row2.push(article)
    })
    return { row1, row2 }
}

export default function LiveNews() {
    const { articles, status, retry } = useNews()

    if (status === 'loading') {
        return <LiveNewsSkeleton />
    }

    if (status === 'coldStart') {
        return (
            <div
                className="db-card"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '54px 24px',
                    textAlign: 'center',
                    gap: '16px',
                    border: '1px solid rgba(95, 175, 215, 0.2)',
                    background: 'rgba(95, 175, 215, 0.02)',
                }}
            >
                <div style={{ color: 'var(--db-info)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Loader2 size={24} style={{ animation: 'dbspin 1s linear infinite' }} />
                    <style>{`@keyframes dbspin { to { transform: rotate(360deg); } }`}</style>
                </div>
                <div style={{ maxWidth: '420px' }}>
                    <p style={{ fontSize: '15.5px', fontWeight: 600, color: 'var(--db-text)' }}>Initial Scraping In Progress</p>
                    <p style={{ fontSize: '13px', color: 'var(--db-text-muted)', marginTop: '6px', lineHeight: 1.5 }}>
                        Initial news scraping is in progress. The first update might take a few moments. Please check back shortly.
                    </p>
                </div>
                <button
                    className="db-btn db-btn-secondary db-btn-sm"
                    onClick={retry}
                    style={{ marginTop: '4px' }}
                >
                    Check for Updates
                </button>
            </div>
        )
    }

    if (status === 'error') {
        return (
            <div
                className="db-card"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '48px 24px',
                    textAlign: 'center',
                    gap: '14px',
                    border: '1px solid rgba(227, 93, 106, 0.2)',
                    background: 'rgba(227, 93, 106, 0.02)',
                }}
            >
                <div style={{ color: 'var(--db-loss)' }}>
                    <AlertTriangle size={32} />
                </div>
                <div>
                    <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--db-text)' }}>Failed to fetch live financial news</p>
                    <p style={{ fontSize: '13px', color: 'var(--db-text-muted)', marginTop: '4px' }}>
                        There was a problem communicating with the news service.
                    </p>
                </div>
                <button className="db-btn db-btn-secondary db-btn-sm" onClick={retry}>
                    Try Refreshing
                </button>
            </div>
        )
    }

    if (articles.length === 0) {
        return (
            <div className="db-card">
                <EmptyState
                    icon={Newspaper}
                    title="No Live News Available"
                    description="We couldn't find any financial news articles at this moment. Please check back later."
                    actionLabel="Refresh News"
                    onAction={retry}
                />
            </div>
        )
    }

    const { row1, row2 } = splitArticles(articles)

    return (
        <div className="live-news-container">
            <style>{`
                .live-news-container {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
               .news-marquee-row {
    overflow: hidden;
    position: relative;
    touch-action: pan-y;
    user-select: none;
    padding: 6px 0;
                }
                .news-marquee-track {
                    display: flex;
                    gap: 16px;
                    width: max-content;
                    align-items: stretch;
                    will-change: transform;
                }
.marquee-news-card {
    flex: 0 0 320px;
    width: 320px;
    height: 262px;              /* was 250 — small bump to fit image + meta + 2-line title + 1-line summary reliably */
    display: flex;
    flex-direction: column;
    border: 1px solid var(--db-border);
    border-radius: 12px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.02);
    text-decoration: none;
    color: inherit;
    transition: border-color 0.2s ease;
}
.marquee-news-card:hover {
    border-color: var(--db-info, rgba(95, 175, 215, 0.4));
}
.marquee-news-image-wrapper {
    width: 100%;
    height: 150px;
    flex: none;
    overflow: hidden;
    position: relative;
    background: rgba(255, 255, 255, 0.03);
}
.marquee-news-image {
    object-fit: cover;
}
.marquee-news-content {
    padding: 10px 14px 12px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    flex: 1;
    min-height: 0;
    overflow: hidden;
}
.marquee-news-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: var(--db-text-muted);
    flex: none;
}
.marquee-news-title {
    font-size: 13.5px;
    font-weight: 600;
    color: var(--db-text);
    line-height: 1.35;
    margin: 0;
    flex: none;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.marquee-news-summary {
    font-size: 12px;
    color: var(--db-text-muted);
    line-height: 1.4;
    height: 16.8px;             /* fixed = 12px * 1.4 line-height, one line, never shrinks to 0 */
    flex: none;                 /* was flex: 1 — no longer competes for leftover flex space */
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: help;
}

/* Radix tooltip content — portaled to document.body, unaffected by any parent overflow */
.news-tooltip-content {
    background: #14181f;
    border: 1px solid var(--db-border);
    color: var(--db-text);
    font-size: 12px;
    line-height: 1.45;
    padding: 10px 12px;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    z-index: 9999;
    animation: tooltipFadeIn 0.15s ease;
}
.news-tooltip-arrow {
    fill: #14181f;
}
@keyframes tooltipFadeIn {
    from { opacity: 0; transform: translateY(2px); }
    to { opacity: 1; transform: translateY(0); }
}
            `}</style>
            <NewsMarqueeRow articles={row1} direction="left" speed={35} />
            <NewsMarqueeRow articles={row2.length > 0 ? row2 : row1} direction="right" speed={35} />
        </div>
    )
}
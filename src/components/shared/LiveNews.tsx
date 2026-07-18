'use client'

import { useNews } from '@/src/hooks/useNews'
import { Newspaper, AlertTriangle, Loader2 } from 'lucide-react'
import EmptyState from '@/src/components/dashboard/ui/EmptyState'
import FeaturedNewsCard from './news/FeaturedNewsCard'
import NewsItemCard from './news/NewsItemCard'
import LiveNewsSkeleton from './news/LiveNewsSkeleton'

export default function LiveNews() {
    const { articles, activeArticle, setActiveArticle, status, retry } = useNews()

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

    if (articles.length === 0 || !activeArticle) {
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

    return (
        <div className="live-news-container">
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(4px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .fade-in-element {
                    animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>

            {/* Left Section (Featured News) */}
            <FeaturedNewsCard article={activeArticle} />

            {/* Right Section (News List) */}
            <div className="news-list-scroll">
                {articles.map((article) => {
                    const isActive = activeArticle.url === article.url
                    return (
                        <NewsItemCard
                            key={article.url}
                            article={article}
                            isActive={isActive}
                            onClick={() => setActiveArticle(article)}
                        />
                    )
                })}
            </div>
        </div>
    )
}

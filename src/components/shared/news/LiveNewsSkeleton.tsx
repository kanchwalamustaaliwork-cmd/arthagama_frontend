export default function LiveNewsSkeleton() {
    return (
        <div className="live-news-container">
            {/* Left Section (Featured News Skeleton) */}
            <div className="featured-news-card" style={{ pointerEvents: 'none' }}>
                <div className="featured-image-wrapper db-skeleton" style={{ height: '300px', flex: 'none' }} />
                <div className="featured-content" style={{ gap: '12px' }}>
                    <div className="db-skeleton" style={{ height: '14px', width: '35%' }} />
                    <div className="db-skeleton" style={{ height: '24px', width: '85%' }} />
                    <div className="db-skeleton" style={{ height: '14px', width: '100%' }} />
                    <div className="db-skeleton" style={{ height: '14px', width: '60%' }} />
                </div>
            </div>

            {/* Right Section (News List Skeleton) */}
            <div className="news-list-scroll" style={{ overflow: 'hidden' }}>
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="news-item-card" style={{ pointerEvents: 'none', border: '1px solid var(--db-border)' }}>
                        <div className="news-item-thumbnail-wrapper db-skeleton" style={{ width: '76px', height: '76px' }} />
                        <div className="news-item-info" style={{ gap: '10px' }}>
                            <div className="db-skeleton" style={{ height: '14px', width: '75%' }} />
                            <div className="db-skeleton" style={{ height: '11px', width: '90%' }} />
                            <div className="db-skeleton" style={{ height: '10px', width: '30%' }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function SkeletonRow() {
    return (
        <div className="news-marquee-row" style={{ pointerEvents: 'none' }}>
            <div className="news-marquee-track">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="marquee-news-card" style={{ border: '1px solid var(--db-border)' }}>
                        <div className="marquee-news-image-wrapper db-skeleton" />
                        <div className="marquee-news-content">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div className="db-skeleton" style={{ height: '16px', width: '70px', borderRadius: '4px' }} />
                                <div className="db-skeleton" style={{ height: '10px', width: '40px' }} />
                            </div>
                            <div className="db-skeleton" style={{ height: '14px', width: '95%' }} />
                            <div className="db-skeleton" style={{ height: '14px', width: '70%' }} />
                            <div className="db-skeleton" style={{ height: '11px', width: '100%', marginTop: '2px' }} />
                            <div className="db-skeleton" style={{ height: '11px', width: '55%' }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
/**
 * src/components/indices/skeletons/IndexCardSkeleton.tsx
 *
 * Skeleton component for Index Cards in the dashboard grid.
 */

export function IndexCardSkeleton() {
    return (
        <div
            className="db-card"
            style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                minHeight: '220px',
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '65%' }}>
                    <div className="db-skeleton" style={{ height: '18px', width: '85%' }} />
                    <div className="db-skeleton" style={{ height: '12px', width: '45%' }} />
                </div>
                <div className="db-skeleton" style={{ height: '22px', width: '50px', borderRadius: '12px' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginTop: '4px' }}>
                <div className="db-skeleton" style={{ height: '28px', width: '110px' }} />
                <div className="db-skeleton" style={{ height: '16px', width: '70px' }} />
            </div>

            <div style={{ height: '36px', width: '100%' }} className="db-skeleton" />

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--db-border)',
                }}
            >
                <div className="db-skeleton" style={{ height: '12px', width: '80px' }} />
                <div className="db-skeleton" style={{ height: '12px', width: '60px' }} />
            </div>
        </div>
    )
}

export function IndexGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '20px',
            }}
        >
            {Array.from({ length: count }).map((_, i) => (
                <IndexCardSkeleton key={i} />
            ))}
        </div>
    )
}

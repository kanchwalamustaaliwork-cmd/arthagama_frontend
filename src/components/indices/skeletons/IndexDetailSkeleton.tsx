/**
 * src/components/indices/skeletons/IndexDetailSkeleton.tsx
 *
 * Page skeleton for Index Details view.
 */

export function IndexDetailSkeleton() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header Skeleton */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '50%' }}>
                    <div className="db-skeleton" style={{ height: '28px', width: '70%' }} />
                    <div className="db-skeleton" style={{ height: '14px', width: '40%' }} />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div className="db-skeleton" style={{ height: '36px', width: '100px', borderRadius: '8px' }} />
                </div>
            </div>

            {/* Metrics Grid Skeleton */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                }}
            >
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="db-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div className="db-skeleton" style={{ height: '12px', width: '50%' }} />
                        <div className="db-skeleton" style={{ height: '24px', width: '80%' }} />
                    </div>
                ))}
            </div>

            {/* Chart Box Skeleton */}
            <div className="db-card" style={{ padding: '24px', height: '380px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className="db-skeleton" style={{ height: '16px', width: '140px' }} />
                    <div className="db-skeleton" style={{ height: '28px', width: '240px', borderRadius: '6px' }} />
                </div>
                <div className="db-skeleton" style={{ flex: 1, width: '100%' }} />
            </div>

            {/* Constituents Table Skeleton */}
            <div className="db-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="db-skeleton" style={{ height: '18px', width: '180px' }} />
                <div className="db-skeleton" style={{ height: '120px', width: '100%' }} />
            </div>
        </div>
    )
}

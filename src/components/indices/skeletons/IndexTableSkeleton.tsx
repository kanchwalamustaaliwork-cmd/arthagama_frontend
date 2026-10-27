/**
 * src/components/indices/skeletons/IndexTableSkeleton.tsx
 *
 * Skeleton component for tabular views (Admin list and Constituents table).
 */

export function IndexTableSkeleton({ rows = 6 }: { rows?: number }) {
    return (
        <div className="db-card" style={{ overflow: 'hidden' }}>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px 20px',
                    borderBottom: '1px solid var(--db-border)',
                    background: 'rgba(184, 206, 194, 0.03)',
                }}
            >
                <div className="db-skeleton" style={{ height: '14px', flex: 2 }} />
                <div className="db-skeleton" style={{ height: '14px', flex: 1.5 }} />
                <div className="db-skeleton" style={{ height: '14px', flex: 1 }} />
                <div className="db-skeleton" style={{ height: '14px', flex: 1 }} />
                <div className="db-skeleton" style={{ height: '14px', flex: 1 }} />
            </div>

            {Array.from({ length: rows }).map((_, i) => (
                <div
                    key={i}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '16px 20px',
                        borderBottom: i < rows - 1 ? '1px solid var(--db-border)' : 'none',
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 2 }}>
                        <div className="db-skeleton" style={{ height: '14px', width: '70%' }} />
                        <div className="db-skeleton" style={{ height: '10px', width: '35%' }} />
                    </div>
                    <div className="db-skeleton" style={{ height: '12px', flex: 1.5 }} />
                    <div className="db-skeleton" style={{ height: '12px', flex: 1 }} />
                    <div className="db-skeleton" style={{ height: '12px', flex: 1 }} />
                    <div className="db-skeleton" style={{ height: '24px', flex: 1, borderRadius: '6px' }} />
                </div>
            ))}
        </div>
    )
}

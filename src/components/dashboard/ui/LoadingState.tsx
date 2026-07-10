interface LoadingStateProps {
    variant?: 'spinner' | 'skeleton-card' | 'skeleton-table'
    count?: number
    message?: string
}

function Spinner({ message }: { message?: string }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '40px' }}>
            <div
                style={{
                    width: '32px', height: '32px',
                    border: '2px solid var(--db-border)',
                    borderTopColor: 'var(--db-mint)',
                    borderRadius: '50%',
                    animation: 'dbspin 0.75s linear infinite',
                }}
            />
            {message && <p style={{ fontSize: '13px', color: 'var(--db-text-muted)' }}>{message}</p>}
            <style>{`@keyframes dbspin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}

function SkeletonCard() {
    return (
        <div className="db-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="db-skeleton" style={{ height: '14px', width: '60%' }} />
            <div className="db-skeleton" style={{ height: '32px', width: '40%' }} />
            <div className="db-skeleton" style={{ height: '12px', width: '80%' }} />
        </div>
    )
}

function SkeletonTable() {
    return (
        <div className="db-card" style={{ overflow: 'hidden' }}>
            {Array.from({ length: 5 }).map((_, i) => (
                <div
                    key={i}
                    style={{
                        display: 'flex',
                        gap: '16px',
                        padding: '14px 16px',
                        borderBottom: i < 4 ? '1px solid var(--db-border)' : 'none',
                    }}
                >
                    <div className="db-skeleton" style={{ height: '12px', flex: 2 }} />
                    <div className="db-skeleton" style={{ height: '12px', flex: 1 }} />
                    <div className="db-skeleton" style={{ height: '12px', flex: 1 }} />
                    <div className="db-skeleton" style={{ height: '12px', flex: 1 }} />
                </div>
            ))}
        </div>
    )
}

export default function LoadingState({ variant = 'spinner', count = 3, message }: LoadingStateProps) {
    if (variant === 'spinner')        return <Spinner message={message} />
    if (variant === 'skeleton-table') return <SkeletonTable />
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
    )
}

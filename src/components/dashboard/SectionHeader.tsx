import Button from './ui/Button'

interface SectionHeaderProps {
    title: string
    subtitle?: string
    actionLabel?: string
    onAction?: () => void
    actionHref?: string
}

export default function SectionHeader({ title, subtitle, actionLabel, onAction, actionHref }: SectionHeaderProps) {
    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
            <div>
                <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--db-text)', letterSpacing: '0.01em' }}>
                    {title}
                </h2>
                {subtitle && (
                    <p style={{ fontSize: '12px', color: 'var(--db-text-muted)', marginTop: '3px' }}>{subtitle}</p>
                )}
            </div>
            {actionLabel && (
                actionHref ? (
                    <a
                        href={actionHref}
                        className="db-btn db-btn-ghost db-btn-sm"
                        style={{ color: 'var(--db-mint)', textDecoration: 'none', fontSize: '12px' }}
                    >
                        {actionLabel} →
                    </a>
                ) : (
                    <Button variant="ghost" size="sm" onClick={onAction}
                        style={{ color: 'var(--db-mint)', fontSize: '12px' } as React.CSSProperties}
                    >
                        {actionLabel} →
                    </Button>
                )
            )}
        </div>
    )
}

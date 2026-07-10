import type { LucideIcon } from 'lucide-react'
import { Inbox } from 'lucide-react'
import Button from './Button'

interface EmptyStateProps {
    icon?: LucideIcon
    title: string
    description?: string
    actionLabel?: string
    onAction?: () => void
}

export default function EmptyState({ icon: Icon = Inbox, title, description, actionLabel, onAction }: EmptyStateProps) {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '60px 24px',
                gap: '12px',
            }}
        >
            <div
                style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: 'var(--db-elevated)',
                    border: '1px solid var(--db-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '4px',
                }}
            >
                <Icon size={22} color="var(--db-text-muted)" />
            </div>
            <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--db-text)' }}>{title}</p>
            {description && (
                <p style={{ fontSize: '13px', color: 'var(--db-text-muted)', maxWidth: '320px', lineHeight: 1.6 }}>
                    {description}
                </p>
            )}
            {actionLabel && onAction && (
                <div style={{ marginTop: '8px' }}>
                    <Button variant="secondary" size="sm" onClick={onAction}>
                        {actionLabel}
                    </Button>
                </div>
            )}
        </div>
    )
}

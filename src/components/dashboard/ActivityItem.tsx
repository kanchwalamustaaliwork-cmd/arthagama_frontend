import { Plus, Edit, PlayCircle, Eye, Copy } from 'lucide-react'
import type { Activity, ActivityAction } from '@/src/types/dashboard'

const ACTION_CONFIG: Record<ActivityAction, { icon: typeof Plus; color: string; label: string }> = {
    created: { icon: Plus, color: 'var(--db-profit)', label: 'Created' },
    edited: { icon: Edit, color: 'var(--db-info)', label: 'Edited' },
    backtest: { icon: PlayCircle, color: 'var(--db-warning)', label: 'Backtest' },
    viewed: { icon: Eye, color: 'var(--db-text-muted)', label: 'Viewed' },
    cloned: { icon: Copy, color: 'var(--db-mint)', label: 'Cloned' },
}

export default function ActivityItem({ activity, last = false }: { activity: Activity; last?: boolean }) {
    const { icon: Icon, color, label } = ACTION_CONFIG[activity.action]

    return (
        <div style={{ display: 'flex', gap: '12px', paddingBottom: last ? 0 : '12px', position: 'relative' }}>
            {/* Timeline line */}
            {!last && (
                <div
                    style={{
                        position: 'absolute',
                        left: '16px', top: '32px', bottom: 0,
                        width: '1px',
                        background: 'var(--db-border)',
                    }}
                />
            )}

            {/* Icon dot */}
            <div
                style={{
                    width: '32px', height: '32px', flexShrink: 0,
                    borderRadius: '50%',
                    background: `${color}18`,
                    border: `1.5px solid ${color}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1,
                }}
            >
                <Icon size={13} color={color} />
            </div>

            {/* Content */}
            <div style={{ flex: 1, paddingTop: '6px', minWidth: 0 }}>
                <p style={{ fontSize: '13px', color: 'var(--db-text)', lineHeight: 1.4 }}>
                    <span style={{ color, fontWeight: 500 }}>{label}:</span>{' '}
                    <span style={{ fontWeight: 500 }}>{activity.subject}</span>
                    {activity.detail && (
                        <span style={{ color: 'var(--db-text-muted)' }}> · {activity.detail}</span>
                    )}
                </p>
                <span style={{ fontSize: '11px', color: 'var(--db-text-muted)', marginTop: '3px', display: 'block' }}>
                    {activity.timestamp}
                </span>
            </div>
        </div>
    )
}

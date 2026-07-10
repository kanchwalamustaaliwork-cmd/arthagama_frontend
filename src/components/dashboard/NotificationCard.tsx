import { Bell, LineChart, BookOpen, AlertTriangle, Settings } from 'lucide-react'

export type NotifType = 'strategy' | 'research' | 'alert' | 'system' | 'portfolio'

export interface Notification {
    id: string
    type: NotifType
    title: string
    description: string
    timestamp: string
    read: boolean
}

const TYPE_CONFIG: Record<NotifType, { icon: typeof Bell; color: string }> = {
    strategy:  { icon: LineChart,    color: 'var(--db-info)' },
    research:  { icon: BookOpen,     color: 'var(--db-mint)' },
    alert:     { icon: AlertTriangle, color: 'var(--db-warning)' },
    system:    { icon: Settings,     color: 'var(--db-text-muted)' },
    portfolio: { icon: Bell,         color: 'var(--db-profit)' },
}

export default function NotificationCard({ notif }: { notif: Notification }) {
    const { icon: Icon, color } = TYPE_CONFIG[notif.type]

    return (
        <div
            style={{
                display: 'flex',
                gap: '12px',
                padding: '12px 14px',
                borderBottom: '1px solid var(--db-border)',
                background: notif.read ? 'transparent' : 'rgba(184,206,194,0.03)',
                transition: 'background var(--db-transition)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--db-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = notif.read ? 'transparent' : 'rgba(184,206,194,0.03)')}
        >
            {/* Icon */}
            <div
                style={{
                    width: '34px', height: '34px', flexShrink: 0,
                    borderRadius: '9px',
                    background: `${color}18`,
                    border: `1px solid ${color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginTop: '1px',
                }}
            >
                <Icon size={15} color={color} />
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px' }}>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--db-text)', lineHeight: 1.35 }}>{notif.title}</p>
                    {!notif.read && (
                        <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--db-mint)', flexShrink: 0, marginTop: '4px' }} />
                    )}
                </div>
                <p style={{ fontSize: '12px', color: 'var(--db-text-muted)', marginTop: '3px', lineHeight: 1.5 }}>{notif.description}</p>
                <span style={{ fontSize: '11px', color: 'var(--db-text-muted)', marginTop: '4px', display: 'block' }}>{notif.timestamp}</span>
            </div>
        </div>
    )
}

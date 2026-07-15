import type { LucideIcon } from 'lucide-react'

interface PageHeaderProps {
    title: string
    subtitle?: string
    badge?: string
    icon?: LucideIcon
    children?: React.ReactNode  // action buttons slot
}

export default function PageHeader({ title, subtitle, badge, icon: Icon, children }: PageHeaderProps) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                {Icon && (
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(168,85,247,0.10)', border: '1px solid rgba(168,85,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={20} color="#a855f7" />
                    </div>
                )}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--db-text)', letterSpacing: '-0.01em' }}>{title}</h1>
                        {badge && (
                            <span style={{ padding: '2px 8px', borderRadius: '999px', background: 'var(--db-elevated)', border: '1px solid var(--db-border)', fontSize: '12px', color: 'var(--db-text-muted)', fontWeight: 500 }}>
                                {badge}
                            </span>
                        )}
                    </div>
                    {subtitle && <p style={{ fontSize: '13px', color: 'var(--db-text-muted)', marginTop: '4px' }}>{subtitle}</p>}
                </div>
            </div>
            {children && <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>{children}</div>}
        </div>
    )
}

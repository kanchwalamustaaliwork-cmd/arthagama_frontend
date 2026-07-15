import type { LucideIcon } from 'lucide-react'

interface AnalysisCardProps {
    label: string
    value: string | number
    sublabel?: string
    icon?: LucideIcon
    color?: string
    size?: 'sm' | 'md' | 'lg'
}

export default function AnalysisCard({ label, value, sublabel, icon: Icon, color, size = 'md' }: AnalysisCardProps) {
    const fontSize = size === 'lg' ? '28px' : size === 'sm' ? '18px' : '22px'

    return (
        <div className="db-card" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative', overflow: 'hidden' }}>
            {color && (
                <div style={{ position: 'absolute', top: 0, right: 0, width: '70px', height: '70px', background: `radial-gradient(circle at 100% 0%, ${color}15 0%, transparent 70%)`, pointerEvents: 'none' }} />
            )}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', color: 'var(--db-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>{label}</span>
                {Icon && (
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: color ? `${color}14` : 'var(--db-elevated)', border: '1px solid var(--db-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={13} color={color ?? 'var(--db-text-muted)'} />
                    </div>
                )}
            </div>
            <div style={{ fontSize, fontWeight: 700, color: color ?? 'var(--db-text)', letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
            {sublabel && <span style={{ fontSize: '11.5px', color: 'var(--db-text-muted)' }}>{sublabel}</span>}
        </div>
    )
}

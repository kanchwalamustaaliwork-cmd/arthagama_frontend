import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatCardProps {
    label: string
    value: string
    sublabel?: string
    trend?: 'up' | 'down' | 'neutral'
    trendLabel?: string
    icon?: LucideIcon
    accent?: string
}

export default function StatCard({ label, value, sublabel, trend, trendLabel, icon: Icon, accent }: StatCardProps) {
    const trendColor = trend === 'up' ? 'var(--db-profit)' : trend === 'down' ? 'var(--db-loss)' : 'var(--db-text-muted)'
    const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus

    return (
        <div
            className="db-card"
            style={{
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Subtle accent glow */}
            {accent && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0, right: 0,
                        width: '80px', height: '80px',
                        background: `radial-gradient(circle at 100% 0%, ${accent}18 0%, transparent 70%)`,
                        pointerEvents: 'none',
                    }}
                />
            )}

            {/* Top row: label + icon */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11.5px', color: 'var(--db-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>
                    {label}
                </span>
                {Icon && (
                    <div
                        style={{
                            width: '30px', height: '30px',
                            borderRadius: '8px',
                            background: accent ? `${accent}14` : 'var(--db-elevated)',
                            border: '1px solid var(--db-border)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                    >
                        <Icon size={14} color={accent ?? 'var(--db-text-muted)'} />
                    </div>
                )}
            </div>

            {/* Value */}
            <div style={{ fontSize: '26px', fontWeight: 700, color: accent ?? 'var(--db-text)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                {value}
            </div>

            {/* Trend + sublabel */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {trend && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: trendColor, fontSize: '12px', fontWeight: 500 }}>
                        <TrendIcon size={12} />
                        {trendLabel}
                    </span>
                )}
                {sublabel && (
                    <span style={{ fontSize: '11.5px', color: 'var(--db-text-muted)' }}>{sublabel}</span>
                )}
            </div>
        </div>
    )
}

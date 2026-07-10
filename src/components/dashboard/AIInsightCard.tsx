import Badge from './ui/Badge'
import { Zap, AlertTriangle, TrendingUp, Info } from 'lucide-react'

export type InsightType = 'opportunity' | 'risk' | 'recommendation' | 'alert'

export interface AIInsight {
    id: string
    type: InsightType
    title: string
    body: string
    confidence: number   // 0-100
    actionLabel?: string
    actionHref?: string
    timestamp: string
}

const TYPE_CONFIG: Record<InsightType, { variant: 'success' | 'error' | 'info' | 'warning'; icon: typeof Zap; label: string }> = {
    opportunity:    { variant: 'success', icon: TrendingUp, label: 'Opportunity' },
    risk:           { variant: 'error',   icon: AlertTriangle, label: 'Risk' },
    recommendation: { variant: 'info',    icon: Zap,  label: 'Recommendation' },
    alert:          { variant: 'warning', icon: Info, label: 'Alert' },
}

export default function AIInsightCard({ insight }: { insight: AIInsight }) {
    const { variant, icon: Icon, label } = TYPE_CONFIG[insight.type]
    const confColor = insight.confidence >= 75 ? 'var(--db-profit)' : insight.confidence >= 50 ? 'var(--db-warning)' : 'var(--db-loss)'

    return (
        <div
            className="db-card"
            style={{
                padding: '16px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                borderLeft: `2.5px solid var(--db-${insight.type === 'risk' ? 'loss' : insight.type === 'opportunity' ? 'profit' : insight.type === 'alert' ? 'warning' : 'info'})`,
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Badge variant={variant}>
                    <Icon size={10} style={{ display: 'inline', marginRight: '3px' }} />
                    {label}
                </Badge>
                <span style={{ fontSize: '11px', color: 'var(--db-text-muted)' }}>{insight.timestamp}</span>
            </div>
            <div>
                <p style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--db-text)', marginBottom: '5px', lineHeight: 1.35 }}>
                    {insight.title}
                </p>
                <p style={{ fontSize: '12.5px', color: 'var(--db-text-2)', lineHeight: 1.55 }}>{insight.body}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--db-border)' }}>
                {/* Confidence bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <span style={{ fontSize: '10.5px', color: 'var(--db-text-muted)' }}>Confidence</span>
                    <div style={{ width: '70px', height: '4px', borderRadius: '2px', background: 'var(--db-elevated)' }}>
                        <div style={{ width: `${insight.confidence}%`, height: '100%', borderRadius: '2px', background: confColor }} />
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: confColor }}>{insight.confidence}%</span>
                </div>
                {insight.actionLabel && (
                    <a href={insight.actionHref ?? '#'} style={{ fontSize: '11.5px', color: 'var(--db-mint)', textDecoration: 'none', fontWeight: 500 }}>
                        {insight.actionLabel} →
                    </a>
                )}
            </div>
        </div>
    )
}

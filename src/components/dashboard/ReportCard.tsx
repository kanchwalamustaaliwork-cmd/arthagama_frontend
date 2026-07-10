import Badge from './ui/Badge'
import Button from './ui/Button'
import { BookOpen } from 'lucide-react'

export interface Report {
    id: string
    title: string
    category: 'Market' | 'Sector' | 'Strategy' | 'Macro' | 'Quant'
    analyst: string
    date: string
    summary: string
    readTime?: string
    featured?: boolean
}

const CATEGORY_VARIANT: Record<Report['category'], 'info' | 'teal' | 'warning' | 'neutral' | 'success'> = {
    Market:   'info',
    Sector:   'teal',
    Strategy: 'warning',
    Macro:    'neutral',
    Quant:    'success',
}

interface ReportCardProps {
    report: Report
    onView?: (r: Report) => void
    compact?: boolean
}

export default function ReportCard({ report, onView, compact = false }: ReportCardProps) {
    return (
        <div className="db-card" style={{ padding: compact ? '14px 16px' : '18px 20px', display: 'flex', flexDirection: 'column', gap: compact ? '8px' : '12px' }}>
            {/* Category + date */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Badge variant={CATEGORY_VARIANT[report.category]}>{report.category}</Badge>
                <span style={{ fontSize: '11px', color: 'var(--db-text-muted)' }}>{report.date}</span>
            </div>

            {/* Title */}
            <div>
                <h3 style={{ fontSize: compact ? '13px' : '14px', fontWeight: 600, color: 'var(--db-text)', lineHeight: 1.4, marginBottom: '4px' }}>
                    {report.title}
                </h3>
                <p style={{ fontSize: '11.5px', color: 'var(--db-text-muted)' }}>
                    By {report.analyst} {report.readTime && `· ${report.readTime}`}
                </p>
            </div>

            {/* Summary */}
            {!compact && (
                <p style={{ fontSize: '12.5px', color: 'var(--db-text-2)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {report.summary}
                </p>
            )}

            {/* Action */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingTop: compact ? 0 : '4px', borderTop: compact ? 'none' : '1px solid var(--db-border)' }}>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView?.(report)}
                    style={{ color: 'var(--db-mint)', fontSize: '12px', gap: '5px' } as React.CSSProperties}
                >
                    <BookOpen size={12} /> View Report
                </Button>
            </div>
        </div>
    )
}

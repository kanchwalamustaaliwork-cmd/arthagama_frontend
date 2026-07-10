import Badge from './ui/Badge'

export type CalendarCategory = 'RBI' | 'Earnings' | 'IPO' | 'Dividend' | 'Economic'
export type ImpactLevel = 'high' | 'medium' | 'low'

export interface CalendarEvent {
    id: string
    name: string
    date: string
    time?: string
    category: CalendarCategory
    impact: ImpactLevel
    description?: string
}

const CAT_VARIANT: Record<CalendarCategory, 'error' | 'warning' | 'success' | 'info' | 'neutral'> = {
    RBI:      'error',
    Earnings: 'warning',
    IPO:      'success',
    Dividend: 'info',
    Economic: 'neutral',
}

const IMPACT_COLOR: Record<ImpactLevel, string> = {
    high:   'var(--db-loss)',
    medium: 'var(--db-warning)',
    low:    'var(--db-text-muted)',
}

export default function EconomicCalendarItem({ event, last = false }: { event: CalendarEvent; last?: boolean }) {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 14px',
                borderBottom: last ? 'none' : '1px solid var(--db-border)',
                transition: 'background var(--db-transition)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--db-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
            {/* Impact indicator */}
            <div
                style={{
                    width: '4px',
                    height: '32px',
                    borderRadius: '2px',
                    background: IMPACT_COLOR[event.impact],
                    flexShrink: 0,
                }}
            />

            {/* Date block */}
            <div
                style={{
                    width: '40px',
                    flexShrink: 0,
                    textAlign: 'center',
                    background: 'var(--db-elevated)',
                    borderRadius: '8px',
                    padding: '6px 4px',
                }}
            >
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--db-text)', lineHeight: 1 }}>
                    {event.date.split(' ')[0]}
                </div>
                <div style={{ fontSize: '9px', color: 'var(--db-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {event.date.split(' ')[1]}
                </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--db-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {event.name}
                </div>
                {event.time && (
                    <div style={{ fontSize: '11px', color: 'var(--db-text-muted)', marginTop: '2px' }}>{event.time}</div>
                )}
            </div>

            {/* Category badge */}
            <Badge variant={CAT_VARIANT[event.category]}>{event.category}</Badge>
        </div>
    )
}

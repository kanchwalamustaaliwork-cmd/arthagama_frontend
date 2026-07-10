export interface MarketMover {
    ticker: string
    name: string
    price: string
    change: number
    volume: string
    sector?: string
}

export default function MarketMoverRow({ mover }: { mover: MarketMover }) {
    const isUp = mover.change >= 0
    const color = isUp ? 'var(--db-profit)' : 'var(--db-loss)'

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 14px',
                borderBottom: '1px solid var(--db-border)',
                gap: '10px',
                transition: 'background var(--db-transition)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--db-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
            {/* Color dot */}
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, flexShrink: 0 }} />

            {/* Ticker + name */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--db-text)' }}>{mover.ticker}</div>
                <div style={{ fontSize: '11px', color: 'var(--db-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{mover.name}</div>
            </div>

            {/* Volume */}
            <div style={{ fontSize: '11.5px', color: 'var(--db-text-muted)', flexShrink: 0 }}>{mover.volume}</div>

            {/* Price + change */}
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--db-text)' }}>{mover.price}</div>
                <div style={{ fontSize: '12px', fontWeight: 600, color }}>{isUp ? '+' : ''}{mover.change.toFixed(2)}%</div>
            </div>
        </div>
    )
}

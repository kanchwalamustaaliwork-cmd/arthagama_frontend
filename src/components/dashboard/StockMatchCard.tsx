import Badge from './ui/Badge'

export type SignalType = 'buy' | 'hold' | 'sell'

export interface StockMatch {
    id: string
    ticker: string
    name: string
    matchPct: number
    signal: SignalType
    strategyName: string
    confidence: number
    price: string
    change: number
}

const SIGNAL_VARIANT: Record<SignalType, 'success' | 'neutral' | 'error'> = {
    buy:  'success',
    hold: 'neutral',
    sell: 'error',
}

export default function StockMatchCard({ stock }: { stock: StockMatch }) {
    const isUp = stock.change >= 0

    return (
        <div className="db-card" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--db-text)' }}>{stock.ticker}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--db-text-muted)', marginTop: '1px' }}>{stock.name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--db-text)' }}>{stock.price}</div>
                    <div style={{ fontSize: '11.5px', color: isUp ? 'var(--db-profit)' : 'var(--db-loss)', fontWeight: 500 }}>
                        {isUp ? '+' : ''}{stock.change.toFixed(2)}%
                    </div>
                </div>
            </div>

            {/* Match bar */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '10.5px', color: 'var(--db-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Strategy Match</span>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--db-mint)' }}>{stock.matchPct}%</span>
                </div>
                <div style={{ height: '5px', borderRadius: '3px', background: 'var(--db-elevated)' }}>
                    <div
                        style={{
                            height: '100%',
                            borderRadius: '3px',
                            width: `${stock.matchPct}%`,
                            background: 'linear-gradient(90deg, #244147, #B8CEC2)',
                        }}
                    />
                </div>
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                    <Badge variant={SIGNAL_VARIANT[stock.signal]}>{stock.signal.toUpperCase()}</Badge>
                    <span style={{ fontSize: '11px', color: 'var(--db-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {stock.strategyName}
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                    <span style={{ fontSize: '10.5px', color: 'var(--db-text-muted)' }}>Conf</span>
                    <span style={{ fontSize: '11.5px', fontWeight: 600, color: stock.confidence >= 75 ? 'var(--db-profit)' : 'var(--db-warning)' }}>
                        {stock.confidence}%
                    </span>
                </div>
            </div>
        </div>
    )
}

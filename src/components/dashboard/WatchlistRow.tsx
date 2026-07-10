import Badge from './ui/Badge'
import { Bell, Plus } from 'lucide-react'
import type { SignalType } from './StockMatchCard'

export interface WatchlistItem {
    ticker: string
    name: string
    price: string
    change: number
    signal: SignalType
    hasAlert: boolean
}

const SIGNAL_VARIANT: Record<SignalType, 'success' | 'neutral' | 'error'> = {
    buy:  'success',
    hold: 'neutral',
    sell: 'error',
}

export default function WatchlistRow({ item }: { item: WatchlistItem }) {
    const isUp = item.change >= 0

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
            {/* Ticker */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--db-text)' }}>{item.ticker}</div>
                <div style={{ fontSize: '11px', color: 'var(--db-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
            </div>

            {/* Signal badge */}
            <Badge variant={SIGNAL_VARIANT[item.signal]}>{item.signal.toUpperCase()}</Badge>

            {/* Price + change */}
            <div style={{ textAlign: 'right', minWidth: '80px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--db-text)' }}>{item.price}</div>
                <div style={{ fontSize: '12px', fontWeight: 500, color: isUp ? 'var(--db-profit)' : 'var(--db-loss)' }}>
                    {isUp ? '+' : ''}{item.change.toFixed(2)}%
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                <button
                    title="Alert"
                    className="db-btn db-btn-ghost db-btn-sm"
                    style={{ padding: '5px', borderRadius: '7px', color: item.hasAlert ? 'var(--db-warning)' : undefined }}
                >
                    <Bell size={13} />
                </button>
                <button
                    title="Add to strategy"
                    className="db-btn db-btn-ghost db-btn-sm"
                    style={{ padding: '5px', borderRadius: '7px' }}
                >
                    <Plus size={13} />
                </button>
            </div>
        </div>
    )
}

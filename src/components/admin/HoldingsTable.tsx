// src/components/dashboard/holdings/HoldingsTable.tsx
'use client'

import Badge from '@/src/components/dashboard/ui/Badge'

export interface RawHolding {
    symbol: string
    quantity: number
    avg_buy_price: number
    STOPLOSS_TYPE: string | null
    first_exit: boolean
    initial_quantity: number
    buying_date: string
    strategy_id: string
}

interface HoldingsTableProps {
    holdings: RawHolding[]
    emptyMessage?: string
}

function daysHeld(buyingDate: string): number {
    const days = Math.floor((Date.now() - new Date(buyingDate).getTime()) / 86400000)
    return Math.max(days, 0)
}

const COLUMNS = [
    'Stock',
    'Qty',
    'Initial Qty',
    'Avg Buy Price',
    'Stoploss Type',
    'First Exit',
    'Buy Date',
    'Duration',
]

export default function HoldingsTable({ holdings, emptyMessage = 'No holdings found' }: HoldingsTableProps) {
    return (
        <div style={{ overflowX: 'auto' }}>
            <table className="db-table">
                <thead>
                    <tr>
                        {COLUMNS.map(h => (
                            <th key={h}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {holdings.length === 0 ? (
                        <tr>
                            <td colSpan={COLUMNS.length} style={{ textAlign: 'center', padding: '40px', color: 'var(--db-text-muted)' }}>
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : holdings.map((h, i) => (
                        <tr key={`${h.symbol}-${h.buying_date}-${i}`}>
                            <td style={{ fontWeight: 600, color: 'var(--db-text)', fontSize: '13px' }}>
                                {h.symbol}
                            </td>
                            <td style={{ fontWeight: 500 }}>{h.quantity.toLocaleString('en-IN')}</td>
                            <td>{h.initial_quantity.toLocaleString('en-IN')}</td>
                            <td>₹{h.avg_buy_price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            <td>
                                {h.STOPLOSS_TYPE ? h.STOPLOSS_TYPE : <span style={{ color: 'var(--db-text-muted)' }}>—</span>}
                            </td>
                            <td>
                                <Badge variant={h.first_exit ? 'success' : 'neutral'} dot>
                                    {h.first_exit ? 'Yes' : 'No'}
                                </Badge>
                            </td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                {new Date(h.buying_date).toLocaleDateString('en-IN')}
                            </td>
                            <td>{daysHeld(h.buying_date)}d</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
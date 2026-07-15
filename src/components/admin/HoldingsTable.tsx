'use client'

import type { AdminHolding, HoldingStatus } from '@/src/types/admin'
import Badge from '@/src/components/dashboard/ui/Badge'

const STATUS_VARIANT: Record<HoldingStatus, 'success' | 'neutral' | 'warning'> = {
    open:    'success',
    closed:  'neutral',
    partial: 'warning',
}

interface HoldingsTableProps {
    holdings: AdminHolding[]
    emptyMessage?: string
}

export default function HoldingsTable({ holdings, emptyMessage = 'No holdings found' }: HoldingsTableProps) {
    return (
        <div style={{ overflowX: 'auto' }}>
            <table className="db-table">
                <thead>
                    <tr>
                        {['Stock', 'Qty', 'Avg Buy Price', 'Status', 'Buy Date', 'Duration'].map(h => (
                            <th key={h}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {holdings.length === 0 ? (
                        <tr>
                            <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--db-text-muted)' }}>{emptyMessage}</td>
                        </tr>
                    ) : holdings.map(h => (
                        <tr key={h.id}>
                            <td>
                                <div>
                                    <div style={{ fontWeight: 600, color: 'var(--db-text)', fontSize: '13px' }}>{h.stockSymbol}</div>
                                    <div style={{ fontSize: '11px', color: 'var(--db-text-muted)' }}>{h.stockName}</div>
                                </div>
                            </td>
                            <td style={{ fontWeight: 500 }}>{h.quantity.toLocaleString('en-IN')}</td>
                            <td>₹{h.avgBuyPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            <td>
                                <Badge variant={STATUS_VARIANT[h.currentStatus]} dot>
                                    {h.currentStatus.charAt(0).toUpperCase() + h.currentStatus.slice(1)}
                                </Badge>
                            </td>
                            <td style={{ whiteSpace: 'nowrap' }}>{new Date(h.buyDate).toLocaleDateString('en-IN')}</td>
                            <td>{h.holdingDurationDays}d</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

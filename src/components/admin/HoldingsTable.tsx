// src/components/admin/HoldingsTable.tsx
'use client'

import type { AdminHolding, LTPRecord } from '@/src/types/admin'

interface HoldingsTableProps {
    holdings: AdminHolding[]
    /** Live LTP / PnL map from the WebSocket — keyed by contract key (matches holding.priceKey) */
    ltpMap?: Record<string, LTPRecord>
    emptyMessage?: string
}

const WARNING_TEXT: Record<string, string> = {
    expired_contract_still_open: 'Contract has expired but the strategy still marks this leg open',
    quantity_differs_from_fill: 'Quantity differs from the recorded fill for this order',
    missing_avg_price: 'Average price is missing in the strategy data',
}

function formatPnL(pnl: number): string {
    const sign = pnl > 0 ? '+' : pnl < 0 ? '-' : ''
    return `${sign}₹${Math.abs(pnl).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatPrice(price: number): string {
    return `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function pnlColor(pnl: number): string {
    if (pnl > 0) return 'var(--db-profit)'
    if (pnl < 0) return 'var(--db-loss)'
    return 'var(--db-text)'
}

function formatDisplayDate(dateStr?: string | null): string {
    if (!dateStr) return '—'
    const d = new Date(dateStr)
    return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-IN')
}

const muted = <span style={{ color: 'var(--db-text-muted)' }}>—</span>

const badge = (background: string, color: string) => ({
    display: 'inline-block',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 600,
    background,
    color,
})

export default function HoldingsTable({ holdings, ltpMap = {}, emptyMessage = 'No holdings found' }: HoldingsTableProps) {
    const hasDerivatives = holdings.some(h => h.instrument.kind !== 'EQUITY')

    const columns = hasDerivatives
        ? ['Instrument', 'Side', 'Expiry', 'Qty', 'Avg Price', 'LTP', 'PnL', 'Entry Date', 'Duration']
        : ['Stock', 'Qty', 'Initial Qty', 'Avg Buy Price', 'LTP', 'PnL', 'Buy Date', 'Duration']

    return (
        <div style={{ overflowX: 'auto' }}>
            <table className="db-table">
                <thead>
                    <tr>
                        {columns.map(col => (
                            <th key={col}>{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {holdings.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} style={{ textAlign: 'center', padding: '40px', color: 'var(--db-text-muted)' }}>
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : holdings.map(h => {
                        // Price and P&L are backend-computed and streamed; never calculated here.
                        const live = h.priceKey ? ltpMap[h.priceKey] : undefined
                        const latestPrice = live?.latestPrice
                        const pnl = live?.pnl
                        const warning = h.warnings.map(w => WARNING_TEXT[w] ?? w).join('\n')

                        const instrumentCell = (
                            <td style={{ fontWeight: 600, color: 'var(--db-text)', fontSize: '13px', whiteSpace: 'nowrap' }}>
                                {h.instrument.displayName}
                                {warning && (
                                    <span title={warning} style={{ marginLeft: '6px', color: 'var(--db-loss)', cursor: 'help' }}>⚠</span>
                                )}
                            </td>
                        )
                        const priceCells = (
                            <>
                                <td>{formatPrice(h.avgPrice)}</td>
                                <td
                                    style={{ fontWeight: 600, color: 'var(--db-mint)', fontSize: '13px', fontFamily: 'monospace' }}
                                    title={h.priceKey ? undefined : 'Contract not fully identified in the strategy data — cannot be priced'}
                                >
                                    {latestPrice != null ? formatPrice(latestPrice) : muted}
                                </td>
                                <td style={{
                                    fontWeight: 600,
                                    fontSize: '13px',
                                    fontFamily: 'monospace',
                                    color: pnl != null ? pnlColor(pnl) : 'var(--db-text-muted)',
                                }}>
                                    {pnl != null ? formatPnL(pnl) : muted}
                                </td>
                                <td style={{ whiteSpace: 'nowrap' }}>{formatDisplayDate(h.entryDate)}</td>
                                <td>{h.holdingDays != null ? `${h.holdingDays}d` : '—'}</td>
                            </>
                        )

                        if (!hasDerivatives) {
                            return (
                                <tr key={h.id}>
                                    {instrumentCell}
                                    <td style={{ fontWeight: 500 }}>{h.quantity.toLocaleString('en-IN')}</td>
                                    <td>{h.initialQuantity != null ? h.initialQuantity.toLocaleString('en-IN') : '—'}</td>
                                    {priceCells}
                                </tr>
                            )
                        }

                        const isShort = h.side === 'SHORT'
                        return (
                            <tr key={h.id}>
                                {instrumentCell}
                                <td>
                                    <span style={badge(
                                        isShort ? 'rgba(239, 68, 68, 0.12)' : 'rgba(34, 197, 94, 0.12)',
                                        isShort ? 'var(--db-loss, #ef4444)' : 'var(--db-profit, #22c55e)',
                                    )}>
                                        {h.side}
                                    </span>
                                </td>
                                <td style={{ whiteSpace: 'nowrap' }}>{formatDisplayDate(h.instrument.expiry)}</td>
                                <td style={{ fontWeight: 500 }}>{h.quantity.toLocaleString('en-IN')}</td>
                                {priceCells}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

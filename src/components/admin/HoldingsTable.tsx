// src/components/dashboard/holdings/HoldingsTable.tsx
'use client'

import type { LTPRecord } from '@/src/types/admin'

export interface RawHolding {
    symbol: string
    quantity: number
    avg_buy_price?: number
    avgPrice?: number
    initial_quantity?: number
    initialQuantity?: number
    buying_date?: string
    entryDate?: string | null
    strategy_id?: string
    strategyId?: string
}

interface HoldingsTableProps {
    holdings: RawHolding[]
    /** Live LTP / PnL map from the WebSocket — keyed by ticker symbol */
    ltpMap?: Record<string, LTPRecord>
    emptyMessage?: string
}

function daysHeld(buyingDate: string): number {
    if (!buyingDate) return 0
    const ts = new Date(buyingDate).getTime()
    if (isNaN(ts)) return 0
    const days = Math.floor((Date.now() - ts) / 86400000)
    return Math.max(days, 0)
}

function formatPnL(pnl: number): string {
    const sign = pnl > 0 ? '+' : ''
    return `${sign}₹${Math.abs(pnl).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function pnlColor(pnl: number): string {
    if (pnl > 0) return 'var(--db-profit)'
    if (pnl < 0) return 'var(--db-loss)'
    return 'var(--db-text)'
}

const BASE_COLUMNS = [
    'Stock',
    'Qty',
    'Initial Qty',
    'Avg Buy Price',
    // 'Stoploss Type',
    // 'First Exit',
    'LTP',
    'PnL',
    'Buy Date',
    'Duration',
]

export default function HoldingsTable({ holdings, ltpMap = {}, emptyMessage = 'No holdings found' }: HoldingsTableProps) {
    return (
        <div style={{ overflowX: 'auto' }}>
            <table className="db-table">
                <thead>
                    <tr>
                        {BASE_COLUMNS.map(h => (
                            <th key={h}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {holdings.length === 0 ? (
                        <tr>
                            <td colSpan={BASE_COLUMNS.length} style={{ textAlign: 'center', padding: '40px', color: 'var(--db-text-muted)' }}>
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : holdings.map((h, i) => {
                        const ltp = ltpMap[h.symbol]
                        const latestPrice = ltp?.latestPrice
                        const pnl = ltp?.pnl

                        const qty = h.quantity ?? 0
                        const initQty = h.initial_quantity ?? h.initialQuantity ?? qty
                        const avgBuy = h.avg_buy_price ?? h.avgPrice ?? 0
                        const dateStr = h.buying_date || h.entryDate || ''
                        const formattedDate = dateStr && !isNaN(new Date(dateStr).getTime())
                            ? new Date(dateStr).toLocaleDateString('en-IN')
                            : '—'
                        const duration = dateStr ? `${daysHeld(dateStr)}d` : '—'

                        return (
                            <tr key={`${h.symbol}-${dateStr}-${i}`}>
                                <td style={{ fontWeight: 600, color: 'var(--db-text)', fontSize: '13px' }}>
                                    {h.symbol}
                                </td>
                                <td style={{ fontWeight: 500 }}>{qty.toLocaleString('en-IN')}</td>
                                <td>{initQty.toLocaleString('en-IN')}</td>
                                <td>₹{avgBuy.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>

                                {/* LTP — live from WebSocket */}
                                <td style={{ fontWeight: 600, color: 'var(--db-mint)', fontSize: '13px', fontFamily: 'monospace' }}>
                                    {latestPrice != null
                                        ? `₹${latestPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                        : <span style={{ color: 'var(--db-text-muted)' }}>—</span>
                                    }
                                </td>

                                {/* PnL — from WebSocket, backend-computed, never calculated on frontend */}
                                <td style={{
                                    fontWeight: 600,
                                    fontSize: '13px',
                                    fontFamily: 'monospace',
                                    color: pnl != null ? pnlColor(pnl) : 'var(--db-text-muted)',
                                }}>
                                    {pnl != null
                                        ? formatPnL(pnl)
                                        : <span style={{ color: 'var(--db-text-muted)' }}>—</span>
                                    }
                                </td>

                                <td style={{ whiteSpace: 'nowrap' }}>
                                    {formattedDate}
                                </td>
                                <td>{duration}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
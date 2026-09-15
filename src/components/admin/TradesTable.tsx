// src/components/dashboard/trades/TradesTable.tsx
'use client'

import Badge from '@/src/components/dashboard/ui/Badge'
import SearchBar from '@/src/components/dashboard/ui/SearchBar'
import FilterBar from '@/src/components/dashboard/ui/FilterBar'
import Button from '@/src/components/dashboard/ui/Button'
import { ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import type { AdminTrade } from '@/src/types/admin'

const ACTION_FILTERS = [
    { label: 'All Actions', value: 'all' },
    { label: 'Buy', value: 'BUY' },
    { label: 'Sell', value: 'SELL' },
    { label: 'Entry', value: 'ENTRY' },
    { label: 'Exit', value: 'EXIT' },
]

const STATUS_VARIANT: Record<string, 'success' | 'neutral' | 'error'> = {
    completed: 'success',
    cancelled: 'neutral',
    rejected: 'error',
}

// One place to define look & feel per direction.
// BUY = green (profit color), SELL = red (loss color).
// Whether a trade opened or closed exposure is shown separately (Entry / Exit).
const ACTION_STYLE: Record<string, { color: string; bg: string; icon: React.ComponentType<{ size?: number }> }> = {
    BUY: { color: 'var(--db-profit)', bg: 'var(--db-profit-bg)', icon: ArrowDownLeft },
    SELL: { color: 'var(--db-loss)', bg: 'var(--db-loss-bg)', icon: ArrowUpRight },
}

const DEFAULT_ACTION_STYLE = { color: 'var(--db-text-muted)', bg: 'var(--db-hover)', icon: ArrowUpRight }

const EFFECT_LABEL: Record<string, string> = { OPEN: 'Entry', CLOSE: 'Exit' }

const fmtMoney = (value: number) => `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const dash = <span style={{ color: 'var(--db-text-muted)' }}>—</span>

interface TradesTableProps {
    trades: AdminTrade[]
    total: number
    page: number
    pageSize?: number
    hasMore: boolean
    search: string
    onSearchChange: (v: string) => void
    action: string
    onActionChange: (v: string) => void
    tradeStatus: string
    onTradeStatusChange: (v: string) => void
    onPageChange: (p: number) => void
}

export default function TradesTable({
    trades, total, page, pageSize = 5, hasMore, search, onSearchChange, action, onActionChange, tradeStatus, onTradeStatusChange, onPageChange
}: TradesTableProps) {
    const fmtTime = (raw: string) => {
        // handles "2026-07-13 09:15:00" (space-separated) safely across browsers
        const d = new Date(raw.replace(' ', 'T'))
        if (isNaN(d.getTime())) return raw
        return `${d.toLocaleDateString('en-IN')} ${d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Headers & Filters */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <SearchBar value={search} onChange={onSearchChange} placeholder="Search symbol or name…" width="260px" />
                <FilterBar options={ACTION_FILTERS} active={action} onChange={onActionChange} />
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
                <table className="db-table">
                    <thead>
                        <tr>
                            {['Symbol', 'Action', 'Quantity', 'Price', 'Total Value', 'P&L', 'Status', 'Timestamp'].map(h => <th key={h}>{h}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {trades.length === 0 ? (
                            <tr>
                                <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--db-text-muted)' }}>
                                    {search ? 'No trades match your search' : 'No trades recorded'}
                                </td>
                            </tr>
                        ) : trades.map(trade => {
                            const style = (trade.action && ACTION_STYLE[trade.action]) || DEFAULT_ACTION_STYLE
                            const Icon = style.icon
                            const legPrices = (trade.legs?.length ?? 0) > 1
                                ? trade.legs!.map(l => (l.price != null ? l.price.toFixed(2) : '—')).join(' / ')
                                : null
                            return (
                                <tr key={trade.id}>
                                    <td>
                                        <div>
                                            <div style={{ fontWeight: 600, color: 'var(--db-text)', fontSize: '13px' }}>{trade.stockSymbol}</div>
                                            {(trade.stockName || trade.reason) && (
                                                <div style={{ fontSize: '11px', color: 'var(--db-text-muted)' }}>{trade.stockName || trade.reason}</div>
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ whiteSpace: 'nowrap' }}>
                                        <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            fontSize: '11px',
                                            fontWeight: 600,
                                            color: style.color,
                                            background: style.bg,
                                            padding: '2px 8px',
                                            borderRadius: '4px'
                                        }}>
                                            <Icon size={10} />
                                            {trade.action ?? 'MIXED'}
                                        </span>
                                        {trade.effect && (
                                            <span style={{ marginLeft: '6px', fontSize: '11px', color: 'var(--db-text-muted)' }}>
                                                {EFFECT_LABEL[trade.effect]}
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ fontWeight: 500 }}>{trade.quantity != null ? trade.quantity.toLocaleString('en-IN') : dash}</td>
                                    <td>{trade.price != null ? fmtMoney(trade.price) : legPrices ?? dash}</td>
                                    <td style={{ fontWeight: 500 }}>{trade.totalValue != null ? fmtMoney(trade.totalValue) : dash}</td>
                                    <td style={{
                                        fontWeight: 600,
                                        color: trade.pnl != null ? (trade.pnl >= 0 ? 'var(--db-profit)' : 'var(--db-loss)') : 'inherit'
                                    }}>
                                        {trade.pnl != null ? (
                                            `${trade.pnl >= 0 ? '+' : '-'}${fmtMoney(Math.abs(trade.pnl))}`
                                        ) : dash}
                                    </td>
                                    <td>
                                        {trade.status ? (
                                            <Badge variant={STATUS_VARIANT[trade.status] ?? 'neutral'} dot>
                                                {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
                                            </Badge>
                                        ) : dash}
                                    </td>
                                    <td style={{ whiteSpace: 'nowrap', fontSize: '12px' }}>{fmtTime(trade.timestamp)}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination footer */}
            {total > pageSize && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--db-text-muted)' }}>
                        Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total} trades
                    </span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                        <Button variant="ghost" size="sm" onClick={() => onPageChange(page - 1)} disabled={page === 1}>
                            <ChevronLeft size={14} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onPageChange(page + 1)} disabled={!hasMore}>
                            <ChevronRight size={14} />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

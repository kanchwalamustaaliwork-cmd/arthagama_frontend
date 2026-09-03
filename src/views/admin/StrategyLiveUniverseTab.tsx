'use client'

import { useState } from 'react'
import { useStrategyLiveUniverse } from '@/src/hooks/admin/useStrategyLiveUniverse'
import { useStrategyContext } from '@/src/context/StrategyContext'
import LoadingState from '@/src/components/dashboard/ui/LoadingState'
import EmptyState from '@/src/components/dashboard/ui/EmptyState'
import { Globe, Search, Info, ShieldCheck, Eye, Layers } from 'lucide-react'

interface Props {
    strategyId: string
}

type FilterMode = 'all' | 'holdings' | 'watching'

function formatCurrency(val: number): string {
    return `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatPnL(pnl: number): string {
    const sign = pnl > 0 ? '+' : ''
    return `${sign}₹${Math.abs(pnl).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export default function StrategyLiveUniverseTab({ strategyId }: Props) {
    const { strategy } = useStrategyContext()
    const {
        universe,
        items,
        status,
        isConnected,
        totalConstituents,
        activeHoldingsCount,
        watchingCount,
    } = useStrategyLiveUniverse(strategyId)

    const [search, setSearch] = useState('')
    const [filterMode, setFilterMode] = useState<FilterMode>('all')

    if (status === 'loading' && items.length === 0) {
        return <LoadingState variant="skeleton-table" />
    }

    // Filter items based on search and selected segment
    const filteredItems = items.filter(item => {
        const matchesSearch = !search.trim() || item.ticker.toLowerCase().includes(search.trim().toLowerCase())
        if (!matchesSearch) return false

        if (filterMode === 'holdings') return item.isHolding
        if (filterMode === 'watching') return !item.isHolding
        return true
    })

    const universeName = universe?.universeName || strategy?.universeName || 'Unconfigured'
    const universeType = universe?.universeType || strategy?.universeType || 'default'

    if (status === 'empty' && items.length === 0) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '20px 24px', background: 'var(--db-elevated)', border: '1px solid var(--db-border)', borderRadius: 'var(--db-radius-md)' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 650, color: 'var(--db-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Globe size={16} color="var(--db-mint)" />
                        Universe: {universeName}
                    </h3>
                    <span style={{ fontSize: '12px', color: 'var(--db-text-muted)' }}>
                        Type: <strong style={{ textTransform: 'capitalize', color: 'var(--db-text-2)' }}>{universeType}</strong>
                    </span>
                </div>
                <EmptyState
                    icon={Globe}
                    title="No Universe Instruments Available"
                    description="This strategy does not have active instruments or quotes configured in its universe database."
                />
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* ── Top Header / Summary Card ── */}
            <div
                style={{
                    padding: '20px 24px',
                    background: 'var(--db-elevated)',
                    border: '1px solid var(--db-border)',
                    borderRadius: 'var(--db-radius-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <Globe size={17} color="var(--db-mint)" />
                            <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--db-text)' }}>
                                Universe: {universeName}
                            </h2>
                            <span
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    padding: '2px 8px',
                                    borderRadius: '999px',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    background: isConnected ? 'rgba(52, 199, 89, 0.12)' : 'rgba(142, 142, 147, 0.12)',
                                    color: isConnected ? 'var(--db-profit)' : 'var(--db-text-muted)',
                                }}
                            >
                                <span
                                    style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        background: isConnected ? 'var(--db-profit)' : 'var(--db-text-muted)',
                                        display: 'inline-block',
                                    }}
                                />
                                {isConnected ? 'Live' : 'Syncing'}
                            </span>
                        </div>
                        <span style={{ fontSize: '12.5px', color: 'var(--db-text-muted)' }}>
                            Configuration Type:{' '}
                            <strong style={{ textTransform: 'capitalize', color: 'var(--db-text-2)' }}>
                                {universeType}
                            </strong>
                        </span>
                    </div>

                    {/* Stat Badges / Metrics */}
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 14px',
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid var(--db-border)',
                                borderRadius: 'var(--db-radius-sm)',
                            }}
                        >
                            <Layers size={14} color="var(--db-text-muted)" />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '10.5px', color: 'var(--db-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Constituents</span>
                                <span style={{ fontSize: '14px', fontWeight: 650, color: 'var(--db-text)' }}>{totalConstituents}</span>
                            </div>
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 14px',
                                background: 'rgba(52, 199, 89, 0.05)',
                                border: '1px solid rgba(52, 199, 89, 0.2)',
                                borderRadius: 'var(--db-radius-sm)',
                            }}
                        >
                            <ShieldCheck size={14} color="var(--db-profit)" />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '10.5px', color: 'var(--db-profit)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Active Holdings</span>
                                <span style={{ fontSize: '14px', fontWeight: 650, color: 'var(--db-profit)' }}>{activeHoldingsCount}</span>
                            </div>
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 14px',
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid var(--db-border)',
                                borderRadius: 'var(--db-radius-sm)',
                            }}
                        >
                            <Eye size={14} color="var(--db-text-muted)" />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '10.5px', color: 'var(--db-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Watching</span>
                                <span style={{ fontSize: '14px', fontWeight: 650, color: 'var(--db-text-2)' }}>{watchingCount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Toolbar: Search & Segmented Filter ── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '4px', background: 'var(--db-elevated)', padding: '3px', borderRadius: 'var(--db-radius-sm)', border: '1px solid var(--db-border)' }}>
                    <button
                        type="button"
                        onClick={() => setFilterMode('all')}
                        style={{
                            padding: '6px 12px',
                            borderRadius: '4px',
                            border: 'none',
                            fontSize: '12px',
                            fontWeight: filterMode === 'all' ? 600 : 450,
                            background: filterMode === 'all' ? 'var(--db-border)' : 'transparent',
                            color: filterMode === 'all' ? 'var(--db-text)' : 'var(--db-text-muted)',
                            cursor: 'pointer',
                        }}
                    >
                        All ({items.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilterMode('holdings')}
                        style={{
                            padding: '6px 12px',
                            borderRadius: '4px',
                            border: 'none',
                            fontSize: '12px',
                            fontWeight: filterMode === 'holdings' ? 600 : 450,
                            background: filterMode === 'holdings' ? 'rgba(52, 199, 89, 0.15)' : 'transparent',
                            color: filterMode === 'holdings' ? 'var(--db-profit)' : 'var(--db-text-muted)',
                            cursor: 'pointer',
                        }}
                    >
                        Active Holdings ({activeHoldingsCount})
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilterMode('watching')}
                        style={{
                            padding: '6px 12px',
                            borderRadius: '4px',
                            border: 'none',
                            fontSize: '12px',
                            fontWeight: filterMode === 'watching' ? 600 : 450,
                            background: filterMode === 'watching' ? 'var(--db-border)' : 'transparent',
                            color: filterMode === 'watching' ? 'var(--db-text)' : 'var(--db-text-muted)',
                            cursor: 'pointer',
                        }}
                    >
                        Watching ({watchingCount})
                    </button>
                </div>

                <div style={{ position: 'relative', width: '240px' }}>
                    <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--db-text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search ticker..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '7px 10px 7px 32px',
                            background: 'var(--db-elevated)',
                            border: '1px solid var(--db-border)',
                            borderRadius: 'var(--db-radius-sm)',
                            color: 'var(--db-text)',
                            fontSize: '12.5px',
                            outline: 'none',
                        }}
                    />
                </div>
            </div>

            {/* ── Table: Consolidated Universe Instruments & Live LTP ── */}
            <div style={{ overflowX: 'auto' }}>
                <table className="db-table">
                    <thead>
                        <tr>
                            <th>Instrument</th>
                            <th>Status</th>
                            <th>Held Qty</th>
                            <th>Avg Buy Price</th>
                            <th>Unrealized PnL</th>
                            <th>Latest Price (LTP)</th>
                            <th>Last Tick</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--db-text-muted)' }}>
                                    {search.trim() ? `No instruments matching "${search}"` : 'No instruments found for the selected filter.'}
                                </td>
                            </tr>
                        ) : (
                            filteredItems.map(item => {
                                const isHeld = item.isHolding
                                const pnl = item.unrealizedPnl

                                return (
                                    <tr key={item.ticker}>
                                        {/* Instrument Symbol */}
                                        <td style={{ fontWeight: 650, color: 'var(--db-text)', fontSize: '13.5px', fontFamily: 'monospace' }}>
                                            {item.ticker}
                                        </td>

                                        {/* Status: Active Holding vs Watching */}
                                        <td>
                                            <span
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '5px',
                                                    padding: '2px 8px',
                                                    borderRadius: '999px',
                                                    fontSize: '11px',
                                                    fontWeight: 600,
                                                    background: isHeld ? 'rgba(52, 199, 89, 0.12)' : 'rgba(142, 142, 147, 0.12)',
                                                    color: isHeld ? 'var(--db-profit)' : 'var(--db-text-muted)',
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        width: '6px',
                                                        height: '6px',
                                                        borderRadius: '50%',
                                                        background: isHeld ? 'var(--db-profit)' : 'var(--db-text-muted)',
                                                        display: 'inline-block',
                                                    }}
                                                />
                                                {isHeld ? 'Active Holding' : 'Watching'}
                                            </span>
                                        </td>

                                        {/* Held Qty */}
                                        <td style={{ fontWeight: 500 }}>
                                            {isHeld && item.quantity > 0 ? item.quantity.toLocaleString('en-IN') : <span style={{ color: 'var(--db-text-muted)' }}>—</span>}
                                        </td>

                                        {/* Avg Buy Price */}
                                        <td>
                                            {isHeld && item.avgPrice > 0 ? formatCurrency(item.avgPrice) : <span style={{ color: 'var(--db-text-muted)' }}>—</span>}
                                        </td>

                                        {/* Unrealized PnL */}
                                        <td
                                            style={{
                                                fontWeight: 600,
                                                fontSize: '13px',
                                                fontFamily: 'monospace',
                                                color: pnl != null && pnl > 0 ? 'var(--db-profit)' : pnl != null && pnl < 0 ? 'var(--db-loss)' : 'var(--db-text-muted)',
                                            }}
                                        >
                                            {isHeld && pnl != null ? formatPnL(pnl) : <span style={{ color: 'var(--db-text-muted)' }}>—</span>}
                                        </td>

                                        {/* Latest Price (LTP) */}
                                        <td style={{ fontWeight: 650, color: 'var(--db-mint)', fontSize: '13.5px', fontFamily: 'monospace' }}>
                                            {item.latestPrice > 0 ? formatCurrency(item.latestPrice) : <span style={{ color: 'var(--db-text-muted)' }}>—</span>}
                                        </td>

                                        {/* Last Tick Time */}
                                        <td style={{ color: 'var(--db-text-muted)', fontSize: '12px' }}>
                                            {item.timestamp ? new Date(item.timestamp).toLocaleTimeString('en-IN') : '—'}
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* ── Footer Information Note ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: 'rgba(95, 175, 215, 0.05)', border: '1px solid rgba(95, 175, 215, 0.15)', borderRadius: 'var(--db-radius-md)' }}>
                <Info size={14} color="var(--db-info)" />
                <span style={{ fontSize: '12.5px', color: 'var(--db-text-2)' }}>
                    Universe constituents stream real-time prices directly from MongoDB Change Streams. Positions marked as <strong>Active Holding</strong> automatically track unrealized PnL against live ticks.
                </span>
            </div>
        </div>
    )
}

'use client'

import { useStrategyContext } from '@/src/context/StrategyContext'
import type { LTPRecord } from '@/src/types/admin'
import LoadingState from '@/src/components/dashboard/ui/LoadingState'
import EmptyState from '@/src/components/dashboard/ui/EmptyState'
import { Activity, Info } from 'lucide-react'

interface Props {
    strategyId: string
}

export default function StrategyLtpTab({ strategyId: _strategyId }: Props) {
    // ltpRecords and status come from the single shared WebSocket in StrategyContext
    const { ltpRecords, liveUniverseStatus: status } = useStrategyContext()

    if (status === 'loading') {
        return <LoadingState variant="skeleton-table" />
    }

    // Sort holdings first, then alphabetically by ticker within each group
    const recordsArray = Object.values(ltpRecords).sort((a, b) => {
        if (a.isHolding !== b.isHolding) {
            return a.isHolding ? -1 : 1
        }
        return a.ticker.localeCompare(b.ticker)
    })

    if (status === 'empty' || recordsArray.length === 0) {
        return (
            <EmptyState
                icon={Activity}
                title="No Live Data Available"
                description="This strategy does not maintain or configure live market prices at this moment."
            />
        )
    }

    const COLUMNS = ['Ticker', 'Active', 'Latest Price', 'Last Update']
    const holdingCount = recordsArray.filter(rec => rec.isHolding).length

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--db-text)' }}>Last Traded Prices</h2>
                    <span
                        style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: status === 'connected' ? 'var(--db-profit)' : 'var(--db-text-muted)',
                            display: 'inline-block',
                        }}
                    />
                </div>
                <span style={{ marginLeft: '3px', fontSize: '12px', color: 'var(--db-text-muted)' }}>
                    {recordsArray.length} instrument{recordsArray.length !== 1 ? 's' : ''} monitored
                    {holdingCount > 0 ? ` · ${holdingCount} active` : ''}
                </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table className="db-table">
                    <thead>
                        <tr>
                            {COLUMNS.map(col => <th key={col}>{col}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {recordsArray.map((rec) => {
                            return (
                                <tr key={rec.ticker}>
                                    <td style={{ fontWeight: 650, color: 'var(--db-text)', fontSize: '13.5px', fontFamily: 'monospace' }}>
                                        {rec.ticker}
                                    </td>
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
                                                background: rec.isHolding ? 'rgba(52, 199, 89, 0.12)' : 'rgba(142, 142, 147, 0.12)',
                                                color: rec.isHolding ? 'var(--db-profit)' : 'var(--db-text-muted)'
                                            }}
                                        >
                                            <span
                                                style={{
                                                    width: '6px',
                                                    height: '6px',
                                                    borderRadius: '50%',
                                                    background: rec.isHolding ? 'var(--db-profit)' : 'var(--db-text-muted)',
                                                    display: 'inline-block'
                                                }}
                                            />
                                            {rec.isHolding ? 'Holding' : 'Watching'}
                                        </span>
                                    </td>
                                    <td style={{ fontWeight: 600, color: 'var(--db-mint)', fontSize: '13.5px', fontFamily: 'monospace' }}>
                                        ₹{rec.latestPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                    <td style={{ color: 'var(--db-text-muted)', fontSize: '12.5px' }}>
                                        {rec.timestamp}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: 'rgba(95, 175, 215, 0.05)', border: '1px solid rgba(95, 175, 215, 0.15)', borderRadius: 'var(--db-radius-md)', marginTop: '8px' }}>
                <Info size={14} color="var(--db-info)" />
                <span style={{ fontSize: '12.5px', color: 'var(--db-text-2)' }}>
                    Prices stream directly from MongoDB and update in real-time via the Live Universe WebSocket.
                </span>
            </div>
        </div>
    )
}
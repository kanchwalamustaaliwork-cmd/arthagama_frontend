/**
 * src/components/stockdashboard/watchlists/PortfolioSection.tsx
 *
 * Dedicated simulated institutional portfolio overview with holdings and P&L tracking.
 */

'use client'

import React from 'react'
import { Wallet } from 'lucide-react'
import { PortfolioHolding, PortfolioSummary } from '@/src/types/stockdashboard'
import { formatStockPrice, formatPercentChange, getChangeColor } from '@/src/utils/stockdashboard/formatters'

interface PortfolioProps {
    summary: PortfolioSummary | null
    holdings: PortfolioHolding[]
}

export function PortfolioSection({ summary, holdings }: PortfolioProps) {
    if (!summary) return null

    const isTotalPnlPos = summary.totalPnl >= 0
    const isDayPnlPos = summary.dayPnl >= 0

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '-8px' }}>
                <Wallet size={16} color="var(--db-mint, #B8CEC2)" />
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)', margin: 0 }}>
                    Simulated Institutional Portfolio
                </h3>
            </div>

            {/* Summary Cards */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '16px',
                }}
            >
                <div style={{ background: 'var(--db-surface, #18282C)', border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--db-text-muted, #708482)' }}>Current Portfolio Value</div>
                    <div style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'Consolas, monospace', color: 'var(--db-text, #F7FAF9)', marginTop: '4px' }}>
                        {formatStockPrice(summary.currentValue)}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--db-text-muted, #708482)', marginTop: '4px' }}>
                        Invested: {formatStockPrice(summary.totalInvested)}
                    </div>
                </div>

                <div style={{ background: 'var(--db-surface, #18282C)', border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--db-text-muted, #708482)' }}>Total Unrealized P&amp;L</div>
                    <div style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'Consolas, monospace', color: getChangeColor(summary.totalPnl), marginTop: '4px' }}>
                        {isTotalPnlPos ? '+' : ''}{formatStockPrice(summary.totalPnl)}
                    </div>
                    <div style={{ fontSize: '11px', color: getChangeColor(summary.totalPnl), marginTop: '4px', fontWeight: 600 }}>
                        {formatPercentChange(summary.totalPnlPercentage)}
                    </div>
                </div>

                <div style={{ background: 'var(--db-surface, #18282C)', border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--db-text-muted, #708482)' }}>Today&apos;s Session P&amp;L</div>
                    <div style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'Consolas, monospace', color: getChangeColor(summary.dayPnl), marginTop: '4px' }}>
                        {isDayPnlPos ? '+' : ''}{formatStockPrice(summary.dayPnl)}
                    </div>
                    <div style={{ fontSize: '11px', color: getChangeColor(summary.dayPnl), marginTop: '4px', fontWeight: 600 }}>
                        {formatPercentChange(summary.dayPnlPercentage)}
                    </div>
                </div>

                <div style={{ background: 'var(--db-surface, #18282C)', border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--db-text-muted, #708482)' }}>Available Cash Balance</div>
                    <div style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'Consolas, monospace', color: 'var(--db-mint, #B8CEC2)', marginTop: '4px' }}>
                        {formatStockPrice(summary.cashBalance)}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--db-text-muted, #708482)', marginTop: '4px' }}>
                        {summary.totalHoldings} Active Holdings
                    </div>
                </div>
            </div>

            {/* Holdings Table */}
            <div
                style={{
                    background: 'var(--db-surface, #18282C)',
                    border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                    borderRadius: '16px',
                    overflow: 'hidden',
                }}
            >
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ background: 'rgba(32, 53, 58, 0.3)', borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.10))' }}>
                                <th style={{ padding: '12px 18px', fontWeight: 600, color: 'var(--db-text-muted, #708482)' }}>Holding</th>
                                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--db-text-muted, #708482)', textAlign: 'right' }}>Qty</th>
                                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--db-text-muted, #708482)', textAlign: 'right' }}>Avg Cost</th>
                                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--db-text-muted, #708482)', textAlign: 'right' }}>LTP</th>
                                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--db-text-muted, #708482)', textAlign: 'right' }}>Current Value</th>
                                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--db-text-muted, #708482)', textAlign: 'right' }}>Total P&amp;L</th>
                                <th style={{ padding: '12px 18px', fontWeight: 600, color: 'var(--db-text-muted, #708482)', textAlign: 'right' }}>Weight</th>
                            </tr>
                        </thead>
                        <tbody>
                            {holdings.map(h => (
                                <tr
                                    key={h.id}
                                    style={{
                                        borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.05))',
                                    }}
                                >
                                    <td style={{ padding: '12px 18px' }}>
                                        <div style={{ fontWeight: 700, color: 'var(--db-mint, #B8CEC2)', fontFamily: 'Consolas, monospace' }}>
                                            {h.symbol}
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'var(--db-text-muted, #708482)' }}>
                                            {h.name}
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'Consolas, monospace', color: 'var(--db-text, #F7FAF9)' }}>
                                        {h.quantity}
                                    </td>
                                    <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'Consolas, monospace', color: 'var(--db-text-muted, #708482)' }}>
                                        {formatStockPrice(h.averageBuyPrice)}
                                    </td>
                                    <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'Consolas, monospace', fontWeight: 600, color: 'var(--db-text, #F7FAF9)' }}>
                                        {formatStockPrice(h.currentPrice)}
                                    </td>
                                    <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'Consolas, monospace', color: 'var(--db-text, #F7FAF9)' }}>
                                        {formatStockPrice(h.currentValue)}
                                    </td>
                                    <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'Consolas, monospace', fontWeight: 600, color: getChangeColor(h.pnl) }}>
                                        {h.pnl >= 0 ? '+' : ''}{formatStockPrice(h.pnl)} ({formatPercentChange(h.pnlPercentage)})
                                    </td>
                                    <td style={{ padding: '12px 18px', textAlign: 'right', fontFamily: 'Consolas, monospace', color: 'var(--db-mint, #B8CEC2)' }}>
                                        {h.weightPct.toFixed(1)}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

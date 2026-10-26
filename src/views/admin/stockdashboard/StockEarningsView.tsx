/**
 * src/views/admin/stockdashboard/StockEarningsView.tsx
 *
 * Earnings view showing quarterly & annual results, dividend payouts,
 * and corporate actions history.
 */

'use client'

import React from 'react'
import { useStockEarnings } from '@/src/hooks/stockdashboard/useStockEarnings'
import { QuarterlyResultsTable } from '@/src/components/stockdashboard/earnings/QuarterlyResultsTable'
import { DividendsAndActions } from '@/src/components/stockdashboard/earnings/DividendsTable'
import { TableSkeleton } from '@/src/components/stockdashboard/shared/Skeletons'
import { formatCrores } from '@/src/utils/stockdashboard/formatters'

interface Props {
    exchange: string
    symbol: string
}

export default function StockEarningsView({ exchange, symbol }: Props) {
    const { data, resultsPeriod, setResultsPeriod, loading, error } = useStockEarnings(exchange, symbol)

    if (error) {
        return (
            <div style={{ padding: '32px', background: 'var(--db-surface, #18282C)', borderRadius: '16px', color: 'var(--db-loss, #E35D6A)' }}>
                {error}
            </div>
        )
    }

    if (loading || !data) {
        return <TableSkeleton rows={6} cols={6} />
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Period Switcher Toolbar */}
            <div
                style={{
                    background: 'var(--db-surface, #18282C)',
                    border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                    borderRadius: '16px',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                }}
            >
                <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)', margin: 0 }}>
                        Earnings Announcements &amp; Corporate Distributions
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--db-text-muted, #708482)', margin: '2px 0 0 0' }}>
                        Track revenue trajectory, operating margins, EPS progression, and dividend cash flow.
                    </p>
                </div>

                <div style={{ display: 'flex', background: 'var(--db-elevated, #20353A)', borderRadius: '8px', padding: '3px' }}>
                    {(['Quarterly', 'Annual'] as const).map(p => (
                        <button
                            key={p}
                            onClick={() => setResultsPeriod(p)}
                            style={{
                                padding: '6px 14px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 600,
                                background: resultsPeriod === p ? 'var(--db-teal, #244147)' : 'transparent',
                                color: resultsPeriod === p ? 'var(--db-mint, #B8CEC2)' : 'var(--db-text-muted, #708482)',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            {p} Results
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Table */}
            {resultsPeriod === 'Quarterly' ? (
                <QuarterlyResultsTable results={data.quarterlyResults} />
            ) : (
                <div
                    style={{
                        background: 'var(--db-surface, #18282C)',
                        border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        marginBottom: '24px',
                    }}
                >
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.10))' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)' }}>
                            Annual Historical Trajectory (All figures in ₹ Cr)
                        </span>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                            <thead>
                                <tr style={{ background: 'rgba(32, 53, 58, 0.3)', borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.10))' }}>
                                    <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--db-text-muted, #708482)' }}>Fiscal Year</th>
                                    <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--db-text-muted, #708482)', textAlign: 'right' }}>Revenue</th>
                                    <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--db-text-muted, #708482)', textAlign: 'right' }}>Operating Profit</th>
                                    <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--db-text-muted, #708482)', textAlign: 'right' }}>Net Profit</th>
                                    <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--db-text-muted, #708482)', textAlign: 'right' }}>EPS</th>
                                    <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--db-text-muted, #708482)', textAlign: 'right' }}>DPS (Dividend)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.annualResults.map(a => (
                                    <tr key={a.fiscalYear} style={{ borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.06))' }}>
                                        <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--db-mint, #B8CEC2)' }}>{a.fiscalYear}</td>
                                        <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'Consolas, monospace', color: 'var(--db-text, #F7FAF9)' }}>{formatCrores(a.revenueCr, false)}</td>
                                        <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'Consolas, monospace', color: 'var(--db-text, #F7FAF9)' }}>{formatCrores(a.operatingProfitCr, false)}</td>
                                        <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'Consolas, monospace', fontWeight: 600, color: 'var(--db-text, #F7FAF9)' }}>{formatCrores(a.netProfitCr, false)}</td>
                                        <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'Consolas, monospace', color: 'var(--db-text, #F7FAF9)' }}>₹{a.eps.toFixed(2)}</td>
                                        <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'Consolas, monospace', color: 'var(--db-profit, #38D996)', fontWeight: 600 }}>₹{a.dividendPerShare.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Dividends & Actions Breakdown */}
            <DividendsAndActions
                dividends={data.dividends}
                corporateActions={data.corporateActions}
            />
        </div>
    )
}

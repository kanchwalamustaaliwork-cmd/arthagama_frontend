/**
 * src/components/stockdashboard/earnings/QuarterlyResultsTable.tsx
 *
 * Tabulated quarterly earnings reports with margins, EPS, and announcement dates.
 */

'use client'

import React from 'react'
import { QuarterlyResult } from '@/src/types/stockdashboard'
import { formatCrores } from '@/src/utils/stockdashboard/formatters'

export function QuarterlyResultsTable({ results }: { results: QuarterlyResult[] }) {
    return (
        <div
            style={{
                background: 'var(--db-surface, #18282C)',
                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                borderRadius: '16px',
                overflow: 'hidden',
                marginBottom: '24px',
            }}
        >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.10))', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)' }}>
                    Quarterly Financial Performance
                </span>
                <span style={{ fontSize: '11px', color: 'var(--db-text-muted, #708482)' }}>
                    All figures in ₹ Crores (except EPS)
                </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ background: 'rgba(32, 53, 58, 0.3)', borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.10))' }}>
                            <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--db-text-muted, #708482)' }}>Quarter</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--db-text-muted, #708482)', textAlign: 'right' }}>Revenue</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--db-text-muted, #708482)', textAlign: 'right' }}>Operating Profit</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--db-text-muted, #708482)', textAlign: 'right' }}>OPM (%)</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--db-text-muted, #708482)', textAlign: 'right' }}>Net Profit</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--db-text-muted, #708482)', textAlign: 'right' }}>EPS (₹)</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--db-text-muted, #708482)', textAlign: 'right' }}>Announced</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((r, i) => (
                            <tr
                                key={r.quarter}
                                style={{
                                    borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.06))',
                                    background: i === 0 ? 'rgba(56, 217, 150, 0.03)' : 'transparent',
                                }}
                            >
                                <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--db-mint, #B8CEC2)' }}>
                                    {r.quarter}
                                </td>
                                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'Consolas, monospace', color: 'var(--db-text, #F7FAF9)' }}>
                                    {formatCrores(r.revenueCr, false)}
                                </td>
                                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'Consolas, monospace', color: 'var(--db-text, #F7FAF9)' }}>
                                    {formatCrores(r.operatingProfitCr, false)}
                                </td>
                                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'Consolas, monospace', color: 'var(--db-mint, #B8CEC2)' }}>
                                    {r.operatingMarginPct.toFixed(1)}%
                                </td>
                                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'Consolas, monospace', fontWeight: 600, color: 'var(--db-text, #F7FAF9)' }}>
                                    {formatCrores(r.netProfitCr, false)}
                                </td>
                                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'Consolas, monospace', fontWeight: 600, color: 'var(--db-text, #F7FAF9)' }}>
                                    ₹{r.eps.toFixed(2)}
                                </td>
                                <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--db-text-muted, #708482)', fontSize: '12px' }}>
                                    {r.announcementDate}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

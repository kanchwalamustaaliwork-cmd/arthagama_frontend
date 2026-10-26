/**
 * src/components/stockdashboard/earnings/DividendsTable.tsx
 *
 * Tabulated history of dividend distributions and corporate actions.
 */

'use client'

import React from 'react'
import { DividendRecord, CorporateAction } from '@/src/types/stockdashboard'

interface Props {
    dividends: DividendRecord[]
    corporateActions: CorporateAction[]
}

export function DividendsAndActions({ dividends, corporateActions }: Props) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {/* Dividends History */}
            <div
                style={{
                    background: 'var(--db-surface, #18282C)',
                    border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                    borderRadius: '16px',
                    padding: '20px',
                }}
            >
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--db-mint, #B8CEC2)', margin: '0 0 16px 0' }}>
                    Dividend Declarations
                </h4>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
                        <thead>
                            <tr style={{ color: 'var(--db-text-muted, #708482)', borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.08))' }}>
                                <th style={{ padding: '8px 10px', fontWeight: 500 }}>Type</th>
                                <th style={{ padding: '8px 10px', fontWeight: 500, textAlign: 'right' }}>Amount</th>
                                <th style={{ padding: '8px 10px', fontWeight: 500, textAlign: 'right' }}>Percentage</th>
                                <th style={{ padding: '8px 10px', fontWeight: 500, textAlign: 'right' }}>Ex-Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dividends.map((div, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.04))' }}>
                                    <td style={{ padding: '10px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)' }}>
                                        {div.type}
                                    </td>
                                    <td style={{ padding: '10px', textAlign: 'right', fontFamily: 'Consolas, monospace', color: 'var(--db-profit, #38D996)', fontWeight: 600 }}>
                                        ₹{div.amountPerShare.toFixed(2)}
                                    </td>
                                    <td style={{ padding: '10px', textAlign: 'right', fontFamily: 'Consolas, monospace', color: 'var(--db-text-muted, #708482)' }}>
                                        {div.percentage}%
                                    </td>
                                    <td style={{ padding: '10px', textAlign: 'right', color: 'var(--db-text-muted, #708482)' }}>
                                        {div.exDate}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Corporate Actions */}
            <div
                style={{
                    background: 'var(--db-surface, #18282C)',
                    border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                    borderRadius: '16px',
                    padding: '20px',
                }}
            >
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--db-mint, #B8CEC2)', margin: '0 0 16px 0' }}>
                    Corporate Actions &amp; Agendas
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {corporateActions.map((ca, i) => (
                        <div
                            key={i}
                            style={{
                                background: 'var(--db-elevated, #20353A)',
                                borderRadius: '10px',
                                padding: '12px 14px',
                                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.06))',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: 'rgba(184, 206, 194, 0.12)', color: 'var(--db-mint, #B8CEC2)' }}>
                                    {ca.type}
                                </span>
                                <span style={{ fontSize: '11px', color: 'var(--db-text-muted, #708482)' }}>{ca.date}</span>
                            </div>
                            <div style={{ fontSize: '12.5px', color: 'var(--db-text-2, #A5B7B3)', marginTop: '4px', lineHeight: 1.4 }}>
                                {ca.details}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

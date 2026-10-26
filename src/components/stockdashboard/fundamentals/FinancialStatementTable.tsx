/**
 * src/components/stockdashboard/fundamentals/FinancialStatementTable.tsx
 *
 * Multi-period statement table for Income, Balance Sheet, Cash Flow, and Ratios.
 */

'use client'

import React from 'react'
import { FinancialStatementRow } from '@/src/types/stockdashboard'

interface StatementTableProps {
    rows: FinancialStatementRow[]
    periods: string[]
    currency?: string
}

export function FinancialStatementTable({ rows, periods, currency = 'All figures in ₹ Crores' }: StatementTableProps) {
    return (
        <div
            style={{
                background: 'var(--db-surface, #18282C)',
                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                borderRadius: '16px',
                overflow: 'hidden',
            }}
        >
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.10))', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--db-text-muted, #708482)' }}>{currency}</span>
                <span style={{ fontSize: '11px', color: 'var(--db-mint, #B8CEC2)', fontFamily: 'Consolas, monospace' }}>Audited Financial Statements</span>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ background: 'rgba(32, 53, 58, 0.3)', borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.10))' }}>
                            <th style={{ padding: '12px 18px', fontWeight: 600, color: 'var(--db-text-muted, #708482)', minWidth: '240px' }}>
                                Line Item
                            </th>
                            {periods.map(p => (
                                <th key={p} style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--db-mint, #B8CEC2)', textAlign: 'right', minWidth: '100px' }}>
                                    {p}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, idx) => {
                            const isBold = row.isBold
                            return (
                                <tr
                                    key={idx}
                                    style={{
                                        borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.05))',
                                        background: isBold ? 'rgba(32, 53, 58, 0.25)' : 'transparent',
                                    }}
                                >
                                    <td
                                        style={{
                                            padding: '10px 18px',
                                            fontWeight: isBold ? 700 : 400,
                                            color: isBold ? 'var(--db-text, #F7FAF9)' : 'var(--db-text-2, #A5B7B3)',
                                        }}
                                    >
                                        {row.lineItem}
                                    </td>
                                    {periods.map(p => {
                                        const rawVal = row.values[p]
                                        const displayVal =
                                            rawVal === null || rawVal === undefined
                                                ? '—'
                                                : typeof rawVal === 'number'
                                                ? rawVal.toLocaleString('en-IN') + (row.unit ? ` ${row.unit}` : '')
                                                : rawVal
                                        return (
                                            <td
                                                key={p}
                                                style={{
                                                    padding: '10px 16px',
                                                    textAlign: 'right',
                                                    fontFamily: 'Consolas, monospace',
                                                    fontWeight: isBold ? 600 : 400,
                                                    color: isBold ? 'var(--db-text, #F7FAF9)' : 'var(--db-text-2, #A5B7B3)',
                                                }}
                                            >
                                                {displayVal}
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

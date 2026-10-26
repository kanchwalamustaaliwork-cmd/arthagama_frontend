/**
 * src/components/stockdashboard/search/SearchResultsTable.tsx
 *
 * Results table for dedicated search page (/admin/stockdashboard/search).
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { StockIdentity } from '@/src/types/stockdashboard'

interface SearchResultsTableProps {
    results: StockIdentity[]
    loading: boolean
    query: string
}

export function SearchResultsTable({ results, loading, query }: SearchResultsTableProps) {
    if (loading) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--db-text-muted, #708482)' }}>
                Searching Indian equity universe…
            </div>
        )
    }

    if (results.length === 0 && query.trim().length > 0) {
        return (
            <div
                style={{
                    background: 'var(--db-surface, #18282C)',
                    border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                    borderRadius: '16px',
                    padding: '48px 24px',
                    textAlign: 'center',
                }}
            >
                <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)', margin: '0 0 8px 0' }}>
                    No stocks matching &ldquo;{query}&rdquo;
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--db-text-muted, #708482)', margin: 0 }}>
                    Try searching by full company name (e.g. &ldquo;Reliance&rdquo;) or trading ticker (e.g. &ldquo;TCS&rdquo;).
                </p>
            </div>
        )
    }

    if (results.length === 0) {
        return (
            <div
                style={{
                    background: 'var(--db-surface, #18282C)',
                    border: '1px dashed var(--db-border, rgba(184, 206, 194, 0.15))',
                    borderRadius: '16px',
                    padding: '48px 24px',
                    textAlign: 'center',
                    color: 'var(--db-text-muted, #708482)',
                    fontSize: '13px',
                }}
            >
                Type a symbol or company name in the search bar above to begin.
            </div>
        )
    }

    return (
        <div
            style={{
                background: 'var(--db-surface, #18282C)',
                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                borderRadius: '16px',
                overflow: 'hidden',
            }}
        >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.10))', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)' }}>
                    Found {results.length} instrument{results.length > 1 ? 's' : ''}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--db-text-muted, #708482)' }}>
                    Canonical Instrument Identity
                </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ color: 'var(--db-text-muted, #708482)', borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.08))' }}>
                            <th style={{ padding: '12px 16px', fontWeight: 500 }}>Ticker</th>
                            <th style={{ padding: '12px 16px', fontWeight: 500 }}>Company Name</th>
                            <th style={{ padding: '12px 16px', fontWeight: 500 }}>Exchange</th>
                            <th style={{ padding: '12px 16px', fontWeight: 500 }}>Sector</th>
                            <th style={{ padding: '12px 16px', fontWeight: 500 }}>Category</th>
                            <th style={{ padding: '12px 16px', fontWeight: 500, textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map(stock => (
                            <tr
                                key={`${stock.exchange}-${stock.symbol}`}
                                style={{
                                    borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.06))',
                                    transition: 'background 0.12s ease',
                                }}
                            >
                                <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--db-mint, #B8CEC2)', fontFamily: 'Consolas, monospace' }}>
                                    {stock.symbol}
                                </td>
                                <td style={{ padding: '14px 16px', fontWeight: 500, color: 'var(--db-text, #F7FAF9)' }}>
                                    {stock.name}
                                </td>
                                <td style={{ padding: '14px 16px' }}>
                                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: 'rgba(184, 206, 194, 0.12)', color: 'var(--db-mint, #B8CEC2)' }}>
                                        {stock.exchange}
                                    </span>
                                </td>
                                <td style={{ padding: '14px 16px', color: 'var(--db-text-muted, #708482)' }}>
                                    {stock.sector}
                                </td>
                                <td style={{ padding: '14px 16px' }}>
                                    <span style={{ fontSize: '11px', color: 'var(--db-text-muted, #708482)', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.04)' }}>
                                        {stock.marketCapCategory}
                                    </span>
                                </td>
                                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                                        <Link
                                            href={`/admin/stockdashboard/stocks/${stock.exchange.toLowerCase()}/${stock.symbol}`}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                padding: '5px 12px',
                                                borderRadius: '6px',
                                                background: 'var(--db-elevated, #20353A)',
                                                color: 'var(--db-mint, #B8CEC2)',
                                                fontSize: '12px',
                                                fontWeight: 600,
                                                textDecoration: 'none',
                                            }}
                                        >
                                            Overview <ArrowRight size={12} />
                                        </Link>
                                        <Link
                                            href={`/admin/stockdashboard/stocks/${stock.exchange.toLowerCase()}/${stock.symbol}/fundamentals`}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                padding: '5px 10px',
                                                borderRadius: '6px',
                                                background: 'transparent',
                                                color: 'var(--db-text-muted, #708482)',
                                                fontSize: '12px',
                                                fontWeight: 500,
                                                textDecoration: 'none',
                                                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.10))',
                                            }}
                                        >
                                            Fundamentals
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

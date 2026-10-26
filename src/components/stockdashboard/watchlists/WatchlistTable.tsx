/**
 * src/components/stockdashboard/watchlists/WatchlistTable.tsx
 *
 * Tabulated view of stocks in the selected watchlist with prices and quick remove.
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { Trash2, ArrowRight } from 'lucide-react'
import { StockQuote } from '@/src/types/stockdashboard'
import { formatStockPrice, formatPriceChange, formatPercentChange, getChangeColor } from '@/src/utils/stockdashboard/formatters'

interface Props {
    quotes: (StockQuote & { name: string; sector: string })[]
    onRemove: (exchange: string, symbol: string) => void
}

export function WatchlistTable({ quotes, onRemove }: Props) {
    if (quotes.length === 0) {
        return (
            <div
                style={{
                    background: 'var(--db-surface, #18282C)',
                    border: '1px dashed var(--db-border, rgba(184, 206, 194, 0.15))',
                    borderRadius: '16px',
                    padding: '40px',
                    textAlign: 'center',
                    color: 'var(--db-text-muted, #708482)',
                    fontSize: '13px',
                }}
            >
                This watchlist is currently empty. Use the search bar above or &ldquo;Add to Watchlist&rdquo; on stock pages to add stocks.
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
                marginBottom: '24px',
            }}
        >
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ background: 'rgba(32, 53, 58, 0.3)', borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.10))' }}>
                            <th style={{ padding: '12px 18px', fontWeight: 600, color: 'var(--db-text-muted, #708482)' }}>Instrument</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--db-text-muted, #708482)' }}>Sector</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--db-text-muted, #708482)', textAlign: 'right' }}>Price</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--db-text-muted, #708482)', textAlign: 'right' }}>Change</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--db-text-muted, #708482)', textAlign: 'right' }}>52W Range</th>
                            <th style={{ padding: '12px 18px', fontWeight: 600, color: 'var(--db-text-muted, #708482)', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quotes.map(q => {
                            return (
                                <tr
                                    key={`${q.exchange}-${q.symbol}`}
                                    style={{
                                        borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.05))',
                                        transition: 'background 0.12s ease',
                                    }}
                                >
                                    <td style={{ padding: '12px 18px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '10.5px', fontWeight: 700, padding: '2px 5px', borderRadius: '4px', background: 'rgba(184, 206, 194, 0.12)', color: 'var(--db-mint, #B8CEC2)' }}>
                                                {q.exchange}
                                            </span>
                                            <div>
                                                <div style={{ fontWeight: 600, color: 'var(--db-text, #F7FAF9)' }}>{q.symbol}</div>
                                                <div style={{ fontSize: '11px', color: 'var(--db-text-muted, #708482)' }}>{q.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 16px', color: 'var(--db-text-muted, #708482)' }}>
                                        {q.sector}
                                    </td>
                                    <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'Consolas, monospace', fontWeight: 600, color: 'var(--db-text, #F7FAF9)' }}>
                                        {formatStockPrice(q.currentPrice)}
                                    </td>
                                    <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'Consolas, monospace', fontWeight: 600, color: getChangeColor(q.change) }}>
                                        {formatPriceChange(q.change)} ({formatPercentChange(q.percentChange)})
                                    </td>
                                    <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px', color: 'var(--db-text-muted, #708482)', fontFamily: 'Consolas, monospace' }}>
                                        ₹{q.week52Low.toFixed(0)} — ₹{q.week52High.toFixed(0)}
                                    </td>
                                    <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                            <Link
                                                href={`/admin/stockdashboard/stocks/${q.exchange.toLowerCase()}/${q.symbol}`}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    padding: '4px 10px',
                                                    borderRadius: '6px',
                                                    background: 'var(--db-elevated, #20353A)',
                                                    color: 'var(--db-mint, #B8CEC2)',
                                                    fontSize: '11.5px',
                                                    fontWeight: 600,
                                                    textDecoration: 'none',
                                                }}
                                            >
                                                Inspect <ArrowRight size={12} />
                                            </Link>
                                            <button
                                                onClick={() => onRemove(q.exchange, q.symbol)}
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: 'var(--db-text-muted, #708482)',
                                                    cursor: 'pointer',
                                                    padding: '4px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                                title="Remove from watchlist"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

/**
 * src/components/stockdashboard/screener/ScreenerResultsTable.tsx
 *
 * Paginated and sortable table rendering Screener stock results.
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowUpDown, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { ScreenerStockResult } from '@/src/types/stockdashboard'
import { formatStockPrice, formatCrores, formatRatio, formatPercentChange, getChangeColor } from '@/src/utils/stockdashboard/formatters'

interface ScreenerResultsProps {
    results: ScreenerStockResult[]
    totalCount: number
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    sortBy: keyof ScreenerStockResult
    sortDirection: 'asc' | 'desc'
    onSort: (col: keyof ScreenerStockResult) => void
    loading: boolean
}

export function ScreenerResultsTable({
    results,
    totalCount,
    currentPage,
    totalPages,
    onPageChange,
    sortBy,
    sortDirection,
    onSort,
    loading,
}: ScreenerResultsProps) {
    const columns: { key: keyof ScreenerStockResult; label: string; align?: 'right' | 'left' }[] = [
        { key: 'symbol', label: 'Ticker' },
        { key: 'currentPrice', label: 'Price', align: 'right' },
        { key: 'percentChange', label: 'Change', align: 'right' },
        { key: 'marketCapCr', label: 'Market Cap', align: 'right' },
        { key: 'peRatio', label: 'P/E', align: 'right' },
        { key: 'roe', label: 'ROE', align: 'right' },
        { key: 'roce', label: 'ROCE', align: 'right' },
        { key: 'debtToEquity', label: 'D/E', align: 'right' },
        { key: 'rsi14', label: 'RSI (14)', align: 'right' },
    ]

    return (
        <div
            style={{
                background: 'var(--db-surface, #18282C)',
                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                borderRadius: '16px',
                overflow: 'hidden',
            }}
        >
            {/* Header / Summary */}
            <div
                style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.10))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                }}
            >
                <div>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)' }}>
                        Screen Results: {totalCount} Stock{totalCount !== 1 ? 's' : ''} Matched
                    </span>
                    <span style={{ fontSize: '11.5px', color: 'var(--db-text-muted, #708482)', marginLeft: '8px' }}>
                        Page {currentPage} of {totalPages}
                    </span>
                </div>

                {/* Pagination Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage <= 1}
                        style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            background: 'var(--db-elevated, #20353A)',
                            border: '1px solid var(--db-border, rgba(184, 206, 194, 0.10))',
                            color: currentPage <= 1 ? 'var(--db-text-muted, #708482)' : 'var(--db-mint, #B8CEC2)',
                            cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                        }}
                    >
                        <ChevronLeft size={14} />
                    </button>
                    <span style={{ fontSize: '12px', color: 'var(--db-text-muted, #708482)' }}>
                        {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage >= totalPages}
                        style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            background: 'var(--db-elevated, #20353A)',
                            border: '1px solid var(--db-border, rgba(184, 206, 194, 0.10))',
                            color: currentPage >= totalPages ? 'var(--db-text-muted, #708482)' : 'var(--db-mint, #B8CEC2)',
                            cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                        }}
                    >
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>

            {/* Results Table */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ background: 'rgba(32, 53, 58, 0.3)', borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.10))' }}>
                            {columns.map(col => {
                                const isCurrentSort = sortBy === col.key
                                return (
                                    <th
                                        key={col.key}
                                        onClick={() => onSort(col.key)}
                                        style={{
                                            padding: '12px 14px',
                                            fontWeight: 600,
                                            color: isCurrentSort ? 'var(--db-mint, #B8CEC2)' : 'var(--db-text-muted, #708482)',
                                            textAlign: col.align || 'left',
                                            cursor: 'pointer',
                                            userSelect: 'none',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                            <span>{col.label}</span>
                                            <ArrowUpDown size={11} opacity={isCurrentSort ? 1 : 0.4} />
                                        </div>
                                    </th>
                                )
                            })}
                            <th style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 600, color: 'var(--db-text-muted, #708482)' }}>
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + 1} style={{ padding: '36px', textAlign: 'center', color: 'var(--db-text-muted, #708482)' }}>
                                    No instruments match the selected criteria. Adjust your filters above.
                                </td>
                            </tr>
                        ) : (
                            results.map(stock => {
                                const isPos = stock.change >= 0
                                return (
                                    <tr
                                        key={stock.symbol}
                                        style={{
                                            borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.06))',
                                            transition: 'background 0.12s ease',
                                        }}
                                    >
                                        <td style={{ padding: '12px 14px' }}>
                                            <div style={{ fontWeight: 700, color: 'var(--db-mint, #B8CEC2)', fontFamily: 'Consolas, monospace' }}>
                                                {stock.symbol}
                                            </div>
                                            <div style={{ fontSize: '11px', color: 'var(--db-text-muted, #708482)' }}>
                                                {stock.name}
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: 'Consolas, monospace', fontWeight: 600, color: 'var(--db-text, #F7FAF9)' }}>
                                            {formatStockPrice(stock.currentPrice)}
                                        </td>
                                        <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: 'Consolas, monospace', fontWeight: 600, color: getChangeColor(stock.change) }}>
                                            {isPos ? '+' : ''}{formatPercentChange(stock.percentChange)}
                                        </td>
                                        <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: 'Consolas, monospace', color: 'var(--db-text, #F7FAF9)' }}>
                                            {formatCrores(stock.marketCapCr)}
                                        </td>
                                        <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: 'Consolas, monospace', color: 'var(--db-text, #F7FAF9)' }}>
                                            {formatRatio(stock.peRatio)}
                                        </td>
                                        <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: 'Consolas, monospace', color: 'var(--db-mint, #B8CEC2)', fontWeight: 600 }}>
                                            {stock.roe.toFixed(1)}%
                                        </td>
                                        <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: 'Consolas, monospace', color: 'var(--db-text, #F7FAF9)' }}>
                                            {stock.roce.toFixed(1)}%
                                        </td>
                                        <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: 'Consolas, monospace', color: 'var(--db-text, #F7FAF9)' }}>
                                            {stock.debtToEquity.toFixed(2)}x
                                        </td>
                                        <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: 'Consolas, monospace', color: 'var(--db-text-muted, #708482)' }}>
                                            {stock.rsi14.toFixed(1)}
                                        </td>
                                        <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                                            <Link
                                                href={`/admin/stockdashboard/stocks/${stock.exchange.toLowerCase()}/${stock.symbol}`}
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
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

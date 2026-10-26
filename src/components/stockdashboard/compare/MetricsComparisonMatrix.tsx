/**
 * src/components/stockdashboard/compare/MetricsComparisonMatrix.tsx
 *
 * Side-by-side head-to-head metric comparison matrix.
 */

'use client'

import React from 'react'
import { StockComparisonData } from '@/src/types/stockdashboard'
import { formatStockPrice, formatCrores, formatRatio, formatPercentChange, getChangeColor } from '@/src/utils/stockdashboard/formatters'

interface Props {
    stocks: StockComparisonData[]
    metricDefs: { category: string; key: keyof StockComparisonData; label: string; unit: string }[]
}

export function MetricsComparisonMatrix({ stocks, metricDefs }: Props) {
    if (stocks.length === 0) {
        return (
            <div style={{ padding: '36px', textAlign: 'center', color: 'var(--db-text-muted, #708482)' }}>
                Select at least one stock to view comparison metrics.
            </div>
        )
    }

    // Group metrics by category
    const categories = Array.from(new Set(metricDefs.map(m => m.category)))

    const renderMetricValue = (stock: StockComparisonData, key: keyof StockComparisonData, unit: string) => {
        const val = stock[key]
        if (val === undefined || val === null) return '—'

        if (key === 'currentPrice' || key === 'high52w' || key === 'low52w') {
            return formatStockPrice(Number(val))
        }
        if (key === 'percentChange') {
            return (
                <span style={{ color: getChangeColor(Number(val)), fontWeight: 600 }}>
                    {formatPercentChange(Number(val))}
                </span>
            )
        }
        if (key === 'marketCapCr') {
            return formatCrores(Number(val))
        }
        if (unit === '%') {
            return `${Number(val).toFixed(1)}%`
        }
        if (unit === 'x') {
            return formatRatio(Number(val))
        }
        return val.toString()
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
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ background: 'rgba(32, 53, 58, 0.4)', borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.10))' }}>
                            <th style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--db-text-muted, #708482)', minWidth: '220px' }}>
                                Metric / Ratio
                            </th>
                            {stocks.map(s => (
                                <th key={s.symbol} style={{ padding: '16px 20px', textAlign: 'right', minWidth: '160px' }}>
                                    <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--db-mint, #B8CEC2)', fontFamily: 'Consolas, monospace' }}>
                                        {s.symbol}
                                    </div>
                                    <div style={{ fontSize: '11px', color: 'var(--db-text-muted, #708482)', fontWeight: 400 }}>
                                        {s.name}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(cat => {
                            const catMetrics = metricDefs.filter(m => m.category === cat)
                            return (
                                <React.Fragment key={cat}>
                                    {/* Category Subheader */}
                                    <tr style={{ background: 'rgba(24, 40, 44, 0.9)', borderTop: '1px solid var(--db-border, rgba(184, 206, 194, 0.08))' }}>
                                        <td
                                            colSpan={stocks.length + 1}
                                            style={{
                                                padding: '10px 20px',
                                                fontSize: '11.5px',
                                                fontWeight: 700,
                                                letterSpacing: '0.04em',
                                                textTransform: 'uppercase',
                                                color: 'var(--db-mint, #B8CEC2)',
                                            }}
                                        >
                                            {cat}
                                        </td>
                                    </tr>

                                    {/* Category Metric Rows */}
                                    {catMetrics.map(metric => (
                                        <tr
                                            key={metric.key}
                                            style={{
                                                borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.04))',
                                                transition: 'background 0.12s ease',
                                            }}
                                        >
                                            <td style={{ padding: '12px 20px', color: 'var(--db-text-2, #A5B7B3)' }}>
                                                {metric.label}
                                            </td>
                                            {stocks.map(s => (
                                                <td
                                                    key={s.symbol}
                                                    style={{
                                                        padding: '12px 20px',
                                                        textAlign: 'right',
                                                        fontFamily: 'Consolas, monospace',
                                                        fontWeight: 500,
                                                        color: 'var(--db-text, #F7FAF9)',
                                                    }}
                                                >
                                                    {renderMetricValue(s, metric.key, metric.unit)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </React.Fragment>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

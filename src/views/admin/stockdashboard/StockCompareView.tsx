/**
 * src/views/admin/stockdashboard/StockCompareView.tsx
 *
 * Compare Stocks view for head-to-head analysis across valuation, profitability, and growth.
 */

'use client'

import React from 'react'
import { useStockCompare } from '@/src/hooks/stockdashboard/useStockCompare'
import { CompareStockChips } from '@/src/components/stockdashboard/compare/CompareStockChips'
import { MetricsComparisonMatrix } from '@/src/components/stockdashboard/compare/MetricsComparisonMatrix'
import { TableSkeleton } from '@/src/components/stockdashboard/shared/Skeletons'

export default function StockCompareView() {
    const {
        selectedSymbols,
        comparisonData,
        metricDefs,
        loading,
        error,
        addStock,
        removeStock,
    } = useStockCompare(['RELIANCE', 'TCS', 'HDFCBANK'])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--db-text, #F7FAF9)', margin: 0 }}>
                    Compare Stocks Side-by-Side
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--db-text-muted, #708482)', margin: '4px 0 0 0' }}>
                    Multi-company valuation multiples, operating efficiency, leverage metrics, and technical standing.
                </p>
            </div>

            {/* Selected Stocks Bar */}
            <CompareStockChips
                selectedSymbols={selectedSymbols}
                onAddStock={addStock}
                onRemoveStock={removeStock}
            />

            {/* Error Message */}
            {error && (
                <div style={{ padding: '16px', background: 'var(--db-loss-bg, rgba(227, 93, 106, 0.1))', borderRadius: '12px', color: 'var(--db-loss, #E35D6A)' }}>
                    {error}
                </div>
            )}

            {/* Metrics Comparison Matrix */}
            {loading ? (
                <TableSkeleton rows={12} cols={selectedSymbols.length + 1} />
            ) : (
                <MetricsComparisonMatrix
                    stocks={comparisonData}
                    metricDefs={metricDefs}
                />
            )}
        </div>
    )
}

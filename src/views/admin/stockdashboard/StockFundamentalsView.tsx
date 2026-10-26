/**
 * src/views/admin/stockdashboard/StockFundamentalsView.tsx
 *
 * Fundamentals view with statement switcher (P&L, Balance Sheet, Cash Flow, Ratios, Shareholding),
 * Consolidated vs Standalone toggle, and Annual vs Quarterly periods.
 */

'use client'

import React from 'react'
import { useStockFundamentals } from '@/src/hooks/stockdashboard/useStockFundamentals'
import { FinancialStatementTable } from '@/src/components/stockdashboard/fundamentals/FinancialStatementTable'
import { ShareholdingChart } from '@/src/components/stockdashboard/fundamentals/ShareholdingChart'
import { PeerComparison } from '@/src/components/stockdashboard/fundamentals/PeerComparison'
import { TableSkeleton } from '@/src/components/stockdashboard/shared/Skeletons'

interface Props {

    exchange: string
    symbol: string
}

export default function StockFundamentalsView({ exchange, symbol }: Props) {
    const {
        data,
        activeTab,
        setActiveTab,
        periodType,
        setPeriodType,
        viewMode,
        setViewMode,
        loading,
        error,
    } = useStockFundamentals(exchange, symbol)

    const tabs = [
        { id: 'income', label: 'Profit & Loss (P&L)' },
        { id: 'balance', label: 'Balance Sheet' },
        { id: 'cashflow', label: 'Cash Flow' },
        { id: 'ratios', label: 'Key Financial Ratios' },
        { id: 'shareholding', label: 'Shareholding Pattern' },
    ]

    if (error) {
        return (
            <div style={{ padding: '32px', background: 'var(--db-surface, #18282C)', borderRadius: '16px', color: 'var(--db-loss, #E35D6A)' }}>
                {error}
            </div>
        )
    }

    if (loading || !data) {
        return <TableSkeleton rows={8} cols={6} />
    }

    const currentRows =
        activeTab === 'income'
            ? data.incomeStatement
            : activeTab === 'balance'
            ? data.balanceSheet
            : activeTab === 'cashflow'
            ? data.cashFlowStatement
            : data.keyRatios

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Peer Comparison Section (Before Profit & Loss) */}
            <PeerComparison exchange={exchange} symbol={symbol} />

            {/* Controls Bar: Statement Tabs & Period/Consolidated Selectors */}
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
                {/* Statement Switcher Tabs */}
                <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
                    {tabs.map(t => {
                        const isSelected = activeTab === t.id
                        return (
                            <button
                                key={t.id}
                                onClick={() => setActiveTab(t.id as any)}
                                style={{
                                    padding: '7px 14px',
                                    borderRadius: '8px',
                                    fontSize: '12.5px',
                                    fontWeight: isSelected ? 600 : 500,
                                    background: isSelected ? 'var(--db-teal, #244147)' : 'var(--db-elevated, #20353A)',
                                    color: isSelected ? 'var(--db-mint, #B8CEC2)' : 'var(--db-text-muted, #708482)',
                                    border: '1px solid var(--db-border, rgba(184, 206, 194, 0.10))',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.15s ease',
                                }}
                            >
                                {t.label}
                            </button>
                        )
                    })}
                </div>

                {/* Right controls: Consolidated / Standalone & Annual / Quarterly */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', background: 'var(--db-elevated, #20353A)', borderRadius: '6px', padding: '2px' }}>
                        {(['Consolidated', 'Standalone'] as const).map(mode => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                style={{
                                    padding: '4px 10px',
                                    borderRadius: '5px',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    background: viewMode === mode ? 'var(--db-teal, #244147)' : 'transparent',
                                    color: viewMode === mode ? 'var(--db-mint, #B8CEC2)' : 'var(--db-text-muted, #708482)',
                                    border: 'none',
                                    cursor: 'pointer',
                                }}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', background: 'var(--db-elevated, #20353A)', borderRadius: '6px', padding: '2px' }}>
                        {(['Annual', 'Quarterly'] as const).map(p => (
                            <button
                                key={p}
                                onClick={() => setPeriodType(p)}
                                style={{
                                    padding: '4px 10px',
                                    borderRadius: '5px',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    background: periodType === p ? 'var(--db-teal, #244147)' : 'transparent',
                                    color: periodType === p ? 'var(--db-mint, #B8CEC2)' : 'var(--db-text-muted, #708482)',
                                    border: 'none',
                                    cursor: 'pointer',
                                }}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Active Statement View */}
            {activeTab === 'shareholding' ? (
                <ShareholdingChart trends={data.shareholdingTrends} />
            ) : (
                <FinancialStatementTable
                    rows={currentRows}
                    periods={data.periods}
                    currency={data.currency}
                />
            )}
        </div>
    )
}

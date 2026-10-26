/**
 * src/components/stockdashboard/dashboard/TopMoversSection.tsx
 *
 * Tabbed section showing Top Gainers, Top Losers, and Most Active stocks.
 */

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, TrendingUp, TrendingDown, Activity } from 'lucide-react'
import { TopMoverItem } from '@/src/types/stockdashboard'
import { formatStockPrice, formatPercentChange, formatVolume, getChangeColor } from '@/src/utils/stockdashboard/formatters'

interface TopMoversProps {
    gainers: TopMoverItem[]
    losers: TopMoverItem[]
    active: TopMoverItem[]
}

export function TopMoversSection({ gainers, losers, active }: TopMoversProps) {
    const [activeTab, setActiveTab] = useState<'gainers' | 'losers' | 'active'>('gainers')

    const items = activeTab === 'gainers' ? gainers : activeTab === 'losers' ? losers : active

    return (
        <div
            style={{
                background: 'var(--db-surface, #18282C)',
                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
            }}
        >
            {/* Header with Switcher Tabs */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.10))',
                    paddingBottom: '12px',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={16} color="var(--db-mint, #B8CEC2)" />
                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)', margin: 0 }}>
                        Market Movers
                    </h3>
                </div>

                <div
                    style={{
                        display: 'flex',
                        background: 'var(--db-elevated, #20353A)',
                        borderRadius: '8px',
                        padding: '3px',
                        gap: '2px',
                    }}
                >
                    {[
                        { id: 'gainers', label: 'Top Gainers', icon: TrendingUp },
                        { id: 'losers', label: 'Top Losers', icon: TrendingDown },
                        { id: 'active', label: 'Most Active', icon: Activity },
                    ].map(tab => {
                        const isSelected = activeTab === tab.id
                        const Icon = tab.icon
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    padding: '5px 12px',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    background: isSelected ? 'var(--db-teal, #244147)' : 'transparent',
                                    color: isSelected ? 'var(--db-mint, #B8CEC2)' : 'var(--db-text-muted, #708482)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                }}
                            >
                                <Icon size={12} />
                                {tab.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Movers Table */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ color: 'var(--db-text-muted, #708482)', borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.08))' }}>
                            <th style={{ padding: '8px 12px', fontWeight: 500 }}>Instrument</th>
                            <th style={{ padding: '8px 12px', fontWeight: 500 }}>Sector</th>
                            <th style={{ padding: '8px 12px', fontWeight: 500, textAlign: 'right' }}>Price</th>
                            <th style={{ padding: '8px 12px', fontWeight: 500, textAlign: 'right' }}>Change</th>
                            <th style={{ padding: '8px 12px', fontWeight: 500, textAlign: 'right' }}>Volume</th>
                            <th style={{ padding: '8px 12px', fontWeight: 500, textAlign: 'right' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(stock => {
                            const isPos = stock.change >= 0
                            return (
                                <tr
                                    key={stock.symbol}
                                    style={{
                                        borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.06))',
                                        transition: 'background 0.12s ease',
                                    }}
                                >
                                    <td style={{ padding: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 5px', borderRadius: '4px', background: 'rgba(184, 206, 194, 0.12)', color: 'var(--db-mint, #B8CEC2)' }}>
                                                {stock.exchange}
                                            </span>
                                            <div>
                                                <div style={{ fontWeight: 600, color: 'var(--db-text, #F7FAF9)' }}>{stock.symbol}</div>
                                                <div style={{ fontSize: '11px', color: 'var(--db-text-muted, #708482)' }}>{stock.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px', color: 'var(--db-text-muted, #708482)' }}>
                                        {stock.sector}
                                    </td>
                                    <td style={{ padding: '12px', textAlign: 'right', fontFamily: 'Consolas, monospace', fontWeight: 600, color: 'var(--db-text, #F7FAF9)' }}>
                                        {formatStockPrice(stock.price)}
                                    </td>
                                    <td style={{ padding: '12px', textAlign: 'right', fontFamily: 'Consolas, monospace', fontWeight: 600, color: getChangeColor(stock.change) }}>
                                        {isPos ? '+' : ''}{formatPercentChange(stock.percentChange)}
                                    </td>
                                    <td style={{ padding: '12px', textAlign: 'right', color: 'var(--db-text-muted, #708482)', fontFamily: 'Consolas, monospace' }}>
                                        {formatVolume(stock.volume)}
                                    </td>
                                    <td style={{ padding: '12px', textAlign: 'right' }}>
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
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

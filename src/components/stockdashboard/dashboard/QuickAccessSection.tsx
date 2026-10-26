/**
 * src/components/stockdashboard/dashboard/QuickAccessSection.tsx
 *
 * Fast navigation tiles for Screener, Compare, Watchlist, and Recently Viewed instruments.
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { SlidersHorizontal, GitCompare, Bookmark, ArrowRight, Clock } from 'lucide-react'
import { StockIdentity } from '@/src/types/stockdashboard'

interface QuickAccessProps {
    recentSearches: StockIdentity[]
}

export function QuickAccessSection({ recentSearches }: QuickAccessProps) {
    const tools = [
        {
            title: 'Stock Screener',
            desc: 'Run multi-parameter fundamental and technical equity filters.',
            href: '/admin/stockdashboard/screener',
            icon: SlidersHorizontal,
            badge: '10+ Metrics',
        },
        {
            title: 'Compare Stocks',
            desc: 'Side-by-side valuation, growth, and profitability matrices.',
            href: '/admin/stockdashboard/compare',
            icon: GitCompare,
            badge: 'Head-to-Head',
        },
        {
            title: 'Watchlists & Portfolio',
            desc: 'Track custom stock baskets and simulated institutional holdings.',
            href: '/admin/stockdashboard/watchlists',
            icon: Bookmark,
            badge: 'Active Baskets',
        },
    ]

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* 3 Quick Tool Cards */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '16px',
                }}
            >
                {tools.map(tool => {
                    const Icon = tool.icon
                    return (
                        <Link
                            key={tool.title}
                            href={tool.href}
                            style={{
                                background: 'var(--db-surface, #18282C)',
                                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                                borderRadius: '14px',
                                padding: '20px',
                                textDecoration: 'none',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                transition: 'all 0.18s ease',
                            }}
                        >
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <div
                                        style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '8px',
                                            background: 'var(--db-elevated, #20353A)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'var(--db-mint, #B8CEC2)',
                                        }}
                                    >
                                        <Icon size={18} />
                                    </div>
                                    <span
                                        style={{
                                            fontSize: '11px',
                                            fontWeight: 600,
                                            padding: '2px 8px',
                                            borderRadius: '999px',
                                            background: 'rgba(184, 206, 194, 0.10)',
                                            color: 'var(--db-mint, #B8CEC2)',
                                        }}
                                    >
                                        {tool.badge}
                                    </span>
                                </div>
                                <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)', margin: '0 0 6px 0' }}>
                                    {tool.title}
                                </h4>
                                <p style={{ fontSize: '12.5px', color: 'var(--db-text-muted, #708482)', margin: 0, lineHeight: 1.4 }}>
                                    {tool.desc}
                                </p>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    marginTop: '16px',
                                    fontSize: '12.5px',
                                    fontWeight: 600,
                                    color: 'var(--db-mint, #B8CEC2)',
                                }}
                            >
                                Open Module <ArrowRight size={14} />
                            </div>
                        </Link>
                    )
                })}
            </div>

            {/* Recently Viewed Bar */}
            {recentSearches && recentSearches.length > 0 && (
                <div
                    style={{
                        background: 'var(--db-surface, #18282C)',
                        border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '12px',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--db-text-muted, #708482)' }}>
                        <Clock size={14} color="var(--db-mint, #B8CEC2)" />
                        <span>Recently Inspected:</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        {recentSearches.map(stock => (
                            <Link
                                key={stock.symbol}
                                href={`/admin/stockdashboard/stocks/${stock.exchange.toLowerCase()}/${stock.symbol}`}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    background: 'var(--db-elevated, #20353A)',
                                    color: 'var(--db-text, #F7FAF9)',
                                    fontSize: '12px',
                                    fontWeight: 500,
                                    textDecoration: 'none',
                                    border: '1px solid var(--db-border, rgba(184, 206, 194, 0.10))',
                                }}
                            >
                                <span style={{ fontWeight: 700, color: 'var(--db-mint, #B8CEC2)' }}>{stock.symbol}</span>
                                <span style={{ color: 'var(--db-text-muted, #708482)', fontSize: '11px' }}>{stock.sector}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

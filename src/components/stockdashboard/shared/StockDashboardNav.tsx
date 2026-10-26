/**
 * src/components/stockdashboard/shared/StockDashboardNav.tsx
 *
 * Module-level navigation bar for the Admin Stock Research & Screener suite.
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    SlidersHorizontal,
    GitCompare,
    Bookmark,
    Search,
} from 'lucide-react'
import { DataFreshnessBadge } from './DataFreshnessBadge'

const NAV_TABS = [
    { label: 'Dashboard', href: '/admin/stockdashboard/all', icon: LayoutDashboard },
    { label: 'Stock Screener', href: '/admin/stockdashboard/screener', icon: SlidersHorizontal },
    { label: 'Compare Stocks', href: '/admin/stockdashboard/compare', icon: GitCompare },
    { label: 'Watchlists & Portfolio', href: '/admin/stockdashboard/watchlists', icon: Bookmark },
    { label: 'Stock Search', href: '/admin/stockdashboard/search', icon: Search },
]

export function StockDashboardNav() {
    const pathname = usePathname()

    const isActive = (href: string) => {
        if (href === '/admin/stockdashboard/all') {
            return pathname === '/admin/stockdashboard/all' || pathname === '/admin/stockdashboard'
        }
        return pathname.startsWith(href)
    }

    return (
        <div style={{ marginBottom: '20px' }}>
            {/* Top row: Module Title & Freshness Badge */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    marginBottom: '16px',
                }}
            >
                <div>
                    <h1
                        style={{
                            fontSize: '22px',
                            fontWeight: 700,
                            color: 'var(--db-text, #F7FAF9)',
                            letterSpacing: '-0.02em',
                            margin: 0,
                        }}
                    >
                        Stock Research &amp; Screening
                    </h1>
                    <p
                        style={{
                            fontSize: '13px',
                            color: 'var(--db-text-muted, #708482)',
                            margin: '4px 0 0 0',
                        }}
                    >
                        Institutional-grade fundamental analysis, multi-stock comparison, and equity screening.
                    </p>
                </div>
                {/* <DataFreshnessBadge compact /> */}
            </div>

            {/* Navigation Tabs */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                    overflowX: 'auto',
                    paddingBottom: '2px',
                }}
            >
                {NAV_TABS.map(tab => {
                    const active = isActive(tab.href)
                    const Icon = tab.icon
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 16px',
                                borderRadius: '8px 8px 0 0',
                                fontSize: '13px',
                                fontWeight: active ? 600 : 500,
                                color: active ? 'var(--db-mint, #B8CEC2)' : 'var(--db-text-2, #A5B7B3)',
                                background: active ? 'var(--db-surface, #18282C)' : 'transparent',
                                borderBottom: active ? '2px solid var(--db-mint, #B8CEC2)' : '2px solid transparent',
                                textDecoration: 'none',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.18s ease',
                            }}
                        >
                            <Icon size={15} color={active ? 'var(--db-mint, #B8CEC2)' : 'currentColor'} />
                            <span>{tab.label}</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

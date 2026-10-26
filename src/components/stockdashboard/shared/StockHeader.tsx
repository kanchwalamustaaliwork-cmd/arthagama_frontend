/**
 * src/components/stockdashboard/shared/StockHeader.tsx
 *
 * Shared header across Stock Overview, Fundamentals, and Earnings routes.
 * Renders company identity, mock live quote, 52-week bar, quick-actions,
 * and sub-route tabs.
 */

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    ArrowLeft,
    BookmarkPlus,
    Check,
    TrendingUp,
    TrendingDown,
    FileText,
    BarChart3,
    PieChart,
} from 'lucide-react'
import { CompanyProfile } from '@/src/types/stockdashboard'
import { formatStockPrice, formatPriceChange, formatPercentChange, getChangeColor } from '@/src/utils/stockdashboard/formatters'
import { addStockToWatchlist } from '@/src/lib/api/stockdashboard/watchlists.api'
import { KeyMetricsGrid } from '@/src/components/stockdashboard/overview/KeyMetricsGrid'
import { CompanyDescriptionBox } from '@/src/components/stockdashboard/shared/CompanyDescriptionBox'


interface StockHeaderProps {
    profile: CompanyProfile
}

export function StockHeader({ profile }: StockHeaderProps) {
    const pathname = usePathname()
    const [addedToWl, setAddedToWl] = useState(false)
    const [adding, setAdding] = useState(false)

    const exch = profile.exchange.toLowerCase()
    const sym = profile.symbol

    const subTabs = [
        { label: 'Overview', href: `/admin/stockdashboard/stocks/${exch}/${sym}`, icon: BarChart3 },
        { label: 'Fundamentals', href: `/admin/stockdashboard/stocks/${exch}/${sym}/fundamentals`, icon: FileText },
        { label: 'Earnings & Results', href: `/admin/stockdashboard/stocks/${exch}/${sym}/earnings`, icon: PieChart },
    ]

    const isTabActive = (href: string) => {
        if (href.endsWith('/fundamentals')) return pathname.endsWith('/fundamentals')
        if (href.endsWith('/earnings')) return pathname.endsWith('/earnings')
        return pathname === href
    }

    const handleQuickAdd = async () => {
        setAdding(true)
        try {
            await addStockToWatchlist('wl_nifty_core', profile.symbol, profile.exchange)
            setAddedToWl(true)
            setTimeout(() => setAddedToWl(false), 2500)
        } finally {
            setAdding(false)
        }
    }

    const isPositive = profile.quote.change >= 0

    return (
        <div
            style={{
                background: 'var(--db-surface, #18282C)',
                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                borderRadius: '16px',
                padding: '20px 24px 0 24px',
                marginBottom: '24px',
            }}
        >
            {/* Top row: Back link & Watchlist action */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                }}
            >
                <Link
                    href="/admin/stockdashboard/all"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '12px',
                        color: 'var(--db-text-muted, #708482)',
                        textDecoration: 'none',
                        transition: 'color 0.15s ease',
                    }}
                >
                    <ArrowLeft size={14} />
                    Back to Stock Dashboard
                </Link>

                <button
                    onClick={handleQuickAdd}
                    disabled={adding || addedToWl}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 600,
                        background: addedToWl ? 'var(--db-profit-bg, rgba(56, 217, 150, 0.12))' : 'var(--db-elevated, #20353A)',
                        color: addedToWl ? 'var(--db-profit, #38D996)' : 'var(--db-mint, #B8CEC2)',
                        border: '1px solid var(--db-border, rgba(184, 206, 194, 0.15))',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                    }}
                >
                    {addedToWl ? <Check size={14} /> : <BookmarkPlus size={14} />}
                    {addedToWl ? 'Added to Watchlist' : 'Add to Watchlist'}
                </button>
            </div>

            {/* Middle row: Symbol, Price, High/Low bar */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '20px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.10))',
                }}
            >
                {/* Left: Identity */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h2
                            style={{
                                fontSize: '24px',
                                fontWeight: 700,
                                color: 'var(--db-text, #F7FAF9)',
                                margin: 0,
                                letterSpacing: '-0.02em',
                            }}
                        >
                            {profile.name}
                        </h2>
                        <span
                            style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                padding: '3px 8px',
                                borderRadius: '6px',
                                background: 'rgba(184, 206, 194, 0.12)',
                                color: 'var(--db-mint, #B8CEC2)',
                            }}
                        >
                            {profile.exchange}: {profile.symbol}
                        </span>
                        <span
                            style={{
                                fontSize: '11px',
                                color: 'var(--db-text-muted, #708482)',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                background: 'rgba(255, 255, 255, 0.04)',
                            }}
                        >
                            {profile.sector}
                        </span>
                    </div>
                    <p
                        style={{
                            fontSize: '12.5px',
                            color: 'var(--db-text-muted, #708482)',
                            margin: '6px 0 0 0',
                        }}
                    >
                        ISIN: {profile.isin || 'INE002A01018'} • {profile.industry || 'Equities'} • {profile.marketCapCategory}
                    </p>
                </div>

                {/* Right: Real-time price display */}
                <div style={{ textAlign: 'right' }}>
                    <div
                        style={{
                            fontSize: '28px',
                            fontWeight: 700,
                            fontFamily: 'Consolas, monospace',
                            color: 'var(--db-text, #F7FAF9)',
                            lineHeight: 1.1,
                        }}
                    >
                        {formatStockPrice(profile.quote.currentPrice)}
                    </div>
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            marginTop: '4px',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: getChangeColor(profile.quote.change),
                        }}
                    >
                        {isPositive ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
                        <span>{formatPriceChange(profile.quote.change)}</span>
                        <span>({formatPercentChange(profile.quote.percentChange)})</span>
                    </div>
                    <div style={{ fontSize: '10.5px', color: 'var(--db-text-muted, #708482)', marginTop: '2px' }}>
                        Simulated Session • Vol: {(profile.quote.volume / 100000).toFixed(2)} L
                    </div>
                </div>
            </div>

            {/* Key Financial Ratios & Company Description (Default Layout across all tabs) */}
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '20px',
                    marginTop: '20px',
                    alignItems: 'stretch',
                }}
            >

                {/* Key Financial Ratios */}
                <div style={{ flex: '3 1 540px', minWidth: '300px' }}>
                    <KeyMetricsGrid metrics={profile.metrics} quote={profile.quote} profile={profile} />
                </div>

                {/* Small square box for Company Description */}
                <div style={{ flex: '1 1 280px', maxWidth: '340px', minWidth: '260px' }}>
                    <CompanyDescriptionBox profile={profile} />
                </div>

            </div>


            {/* Bottom: Sub-route Tabs */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    paddingTop: '4px',
                }}
            >
                {subTabs.map(tab => {
                    const active = isTabActive(tab.href)
                    const Icon = tab.icon
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '12px 16px',
                                fontSize: '13px',
                                fontWeight: active ? 600 : 500,
                                color: active ? 'var(--db-mint, #B8CEC2)' : 'var(--db-text-muted, #708482)',
                                borderBottom: active ? '2px solid var(--db-mint, #B8CEC2)' : '2px solid transparent',
                                textDecoration: 'none',
                                transition: 'all 0.15s ease',
                            }}
                        >
                            <Icon size={14} color={active ? 'var(--db-mint, #B8CEC2)' : 'currentColor'} />
                            <span>{tab.label}</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

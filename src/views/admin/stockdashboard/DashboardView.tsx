/**
 * src/views/admin/stockdashboard/DashboardView.tsx
 *
 * View for Dashboard landing route (/admin/stockdashboard/all).
 */

'use client'

import React from 'react'
import { useStockDashboard } from '@/src/hooks/stockdashboard/useStockDashboard'
import { MarketIndicesSection } from '@/src/components/stockdashboard/dashboard/MarketIndicesSection'
import { TopMoversSection } from '@/src/components/stockdashboard/dashboard/TopMoversSection'
import { QuickAccessSection } from '@/src/components/stockdashboard/dashboard/QuickAccessSection'
import { GlobalStockSearch } from '@/src/components/stockdashboard/shared/GlobalStockSearch'
import { MetricCardsSkeleton, TableSkeleton } from '@/src/components/stockdashboard/shared/Skeletons'
import { useInViewport } from '@/src/hooks/stockdashboard/useInViewport'

export default function DashboardView() {
    const { data, loading, error } = useStockDashboard()
    const { ref: moversRef, isVisible: moversVisible } = useInViewport({ freezeOnceVisible: true, rootMargin: '120px' })

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Hero Search Section */}
            <div
                style={{
                    background: 'radial-gradient(ellipse at 50% 0%, rgba(46, 85, 96, 0.25) 0%, rgba(15, 23, 25, 0.6) 80%)',
                    borderRadius: '20px',
                    padding: '32px 24px',
                    border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '16px',
                }}
            >
                <h2
                    style={{
                        fontSize: '24px',
                        fontWeight: 700,
                        color: 'var(--db-text, #F7FAF9)',
                        margin: 0,
                        letterSpacing: '-0.02em',
                    }}
                >
                    Institutional Stock Intelligence &amp; Screening
                </h2>
                <p style={{ fontSize: '13.5px', color: 'var(--db-text-muted, #708482)', margin: 0, maxWidth: '540px' }}>
                    Real-time simulated analytics for Indian equities across NSE and BSE. Search any company, ticker, or sector.
                </p>

                <div style={{ width: '100%', maxWidth: '640px', marginTop: '8px' }}>
                    <GlobalStockSearch variant="hero" placeholder="Search RELIANCE, TCS, HDFCBANK, INFY…" />
                </div>
            </div>

            {/* Benchmark Indices */}
            {loading ? (
                <MetricCardsSkeleton count={4} />
            ) : error ? (
                <div style={{ padding: '24px', background: 'var(--db-surface, #18282C)', borderRadius: '12px', color: 'var(--db-loss, #E35D6A)' }}>
                    {error}
                </div>
            ) : data ? (
                <MarketIndicesSection indices={data.marketIndices} />
            ) : null}

            {/* Quick Access Tools */}
            {data && <QuickAccessSection recentSearches={data.recentSearches} />}

            {/* Below-the-fold Viewport-Aware Movers Section */}
            <div ref={moversRef}>
                {moversVisible && data ? (
                    <TopMoversSection
                        gainers={data.topGainers}
                        losers={data.topLosers}
                        active={data.mostActive}
                    />
                ) : (
                    <TableSkeleton rows={4} cols={5} />
                )}
            </div>
        </div>
    )
}

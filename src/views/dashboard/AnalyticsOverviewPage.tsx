'use client'

import { useState } from 'react'
import { useAuth } from '@/src/auth/AuthContext'
import StatCard from '@/src/components/dashboard/StatCard'
import SectionHeader from '@/src/components/dashboard/SectionHeader'
import PerformanceChart from '@/src/components/dashboard/PerformanceChart'
import AIInsightCard from '@/src/components/dashboard/AIInsightCard'
import StrategyCard from '@/src/components/dashboard/StrategyCard'
import StockMatchCard from '@/src/components/dashboard/StockMatchCard'
import ReportCard from '@/src/components/dashboard/ReportCard'
import MarketMoverRow from '@/src/components/dashboard/MarketMoverRow'
import HeatmapCell from '@/src/components/dashboard/HeatmapCell'
import WatchlistRow from '@/src/components/dashboard/WatchlistRow'
import NotificationCard from '@/src/components/dashboard/NotificationCard'
import ActivityItem from '@/src/components/dashboard/ActivityItem'
import EconomicCalendarItem from '@/src/components/dashboard/EconomicCalendarItem'
import FilterBar from '@/src/components/dashboard/ui/FilterBar'
import {
    MOVER_TABS,
    PORTFOLIO_STATS
} from '@/src/data/dashboard/analytics-overview'

import {
    MOCK_STRATEGIES, MOCK_INSIGHTS, MOCK_STOCK_MATCHES, MOCK_REPORTS,
    MOCK_GAINERS, MOCK_LOSERS, MOCK_ACTIVE,
    MOCK_SECTORS, MOCK_WATCHLIST, MOCK_NOTIFICATIONS, MOCK_ACTIVITIES, MOCK_CALENDAR,
} from '@/src/data/dashboard/dashboard-mock'
import { useRouter } from 'next/navigation'

export default function AnalyticsOverviewPage() {
    const { user } = useAuth()
    const router = useRouter()
    const [moverTab, setMoverTab] = useState('gainers')

    const movers = moverTab === 'gainers' ? MOCK_GAINERS : moverTab === 'losers' ? MOCK_LOSERS : MOCK_ACTIVE

    const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1400px' }}>

            {/* ── Welcome Banner ── */}
            <div
                style={{
                    borderRadius: 'var(--db-radius-lg)',
                    padding: '24px 28px',
                    background: 'linear-gradient(135deg, rgba(36,65,71,0.6) 0%, rgba(32,53,58,0.4) 100%)',
                    border: '1px solid var(--db-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    flexWrap: 'wrap',
                }}
            >
                <div>
                    <p style={{ fontSize: '12px', color: 'var(--db-text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '6px' }}>
                        {today}
                    </p>
                    <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--db-text)', letterSpacing: '-0.01em' }}>
                        Welcome back, {user?.firstName ?? 'Trader'} 👋
                    </h1>
                    <p style={{ fontSize: '13px', color: 'var(--db-text-2)', marginTop: '6px' }}>
                        Markets are open · Nifty 50 is trading at <span style={{ color: 'var(--db-profit)', fontWeight: 600 }}>▲ 23,842 (+0.82%)</span>
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <button className="db-btn db-btn-secondary db-btn-sm" onClick={() => router.push('/dashboard/my-strategies')}>
                        My Strategies
                    </button>
                    <button className="db-btn db-btn-primary db-btn-sm" onClick={() => router.push('/dashboard/backtest')}>
                        Run Backtest
                    </button>
                </div>
            </div>

            {/* ── Portfolio Overview Cards ── */}
            <section>
                <SectionHeader title="Portfolio Overview" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '14px' }}>
                    {PORTFOLIO_STATS.map(s => (
                        <StatCard key={s.label} {...s} sublabel={s.trendLabel ? undefined : ''} />
                    ))}
                </div>
            </section>

            {/* ── Performance Chart ── */}
            <section>
                <SectionHeader title="Portfolio Performance" />
                <PerformanceChart height={220} />
            </section>

            {/* ── AI Insights ── */}
            <section>
                <SectionHeader title="AI Insights" subtitle="Powered by Arthagama's quantitative research engine" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
                    {MOCK_INSIGHTS.map(insight => <AIInsightCard key={insight.id} insight={insight} />)}
                </div>
            </section>

            {/* ── My Strategies ── */}
            <section>
                <SectionHeader title="My Strategies" actionLabel="View All" actionHref="/dashboard/my-strategies" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
                    {MOCK_STRATEGIES.slice(0, 3).map(s => (
                        <StrategyCard
                            key={s.id}
                            strategy={s}
                            onEdit={() => router.push('/dashboard/my-strategies')}
                            onBacktest={() => router.push('/dashboard/backtest')}
                            onView={() => router.push('/dashboard/my-strategies')}
                            onClone={() => { }}
                            onDeploy={() => { }}
                        />
                    ))}
                </div>
            </section>

            {/* ── Stocks Matching Strategies ── */}
            <section>
                <SectionHeader title="Stocks Matching My Strategies" subtitle="Updated every 15 minutes during market hours" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '14px' }}>
                    {MOCK_STOCK_MATCHES.map(s => <StockMatchCard key={s.id} stock={s} />)}
                </div>
            </section>

            {/* ── 3-column grid: Reports + Market Movers + Calendar ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>

                {/* Latest Reports */}
                <section className="db-card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '18px 20px 12px' }}>
                        <SectionHeader title="Latest Research Reports" actionLabel="View All" actionHref="/dashboard/research-reports" />
                    </div>
                    <div style={{ padding: '0 12px 12px' }}>
                        {MOCK_REPORTS.slice(0, 3).map(r => (
                            <div key={r.id} style={{ marginBottom: '8px' }}>
                                <ReportCard report={r} compact />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Market Movers */}
                <section className="db-card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '18px 20px 12px', borderBottom: '1px solid var(--db-border)' }}>
                        <SectionHeader title="Market Movers" />
                        <FilterBar options={MOVER_TABS} active={moverTab} onChange={setMoverTab} />
                    </div>
                    {movers.map(m => <MarketMoverRow key={m.ticker} mover={m} />)}
                </section>

                {/* Economic Calendar */}
                <section className="db-card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '18px 20px 12px' }}>
                        <SectionHeader title="Economic Calendar" />
                    </div>
                    {MOCK_CALENDAR.map((e, i) => (
                        <EconomicCalendarItem key={e.id} event={e} last={i === MOCK_CALENDAR.length - 1} />
                    ))}
                </section>
            </div>

            {/* ── Market Heatmap ── */}
            <section>
                <SectionHeader title="Market Heatmap" subtitle="Sector performance today" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px' }}>
                    {MOCK_SECTORS.map(s => <HeatmapCell key={s.name} sector={s} />)}
                </div>
            </section>

            {/* ── 2-column: Watchlist + Notifications + Activity ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>

                {/* Watchlist */}
                <section className="db-card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '18px 20px 12px' }}>
                        <SectionHeader title="Watchlist" actionLabel="Manage" actionHref="#" />
                    </div>
                    {MOCK_WATCHLIST.map(item => <WatchlistRow key={item.ticker} item={item} />)}
                </section>

                {/* Notifications */}
                <section className="db-card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '18px 20px 12px' }}>
                        <SectionHeader title="Notifications" actionLabel="Mark all read" />
                    </div>
                    {MOCK_NOTIFICATIONS.map(n => <NotificationCard key={n.id} notif={n} />)}
                </section>

                {/* Recent Activity */}
                <section className="db-card" style={{ padding: '20px' }}>
                    <SectionHeader title="Recent Activity" />
                    {MOCK_ACTIVITIES.map((a, i) => (
                        <ActivityItem key={a.id} activity={a} last={i === MOCK_ACTIVITIES.length - 1} />
                    ))}
                </section>
            </div>

        </div>
    )
}

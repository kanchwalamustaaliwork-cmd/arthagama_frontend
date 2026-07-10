'use client'

import { useAuth } from '@/src/auth/AuthContext'
import { useRouter } from 'next/navigation'
import { Layers, FlaskConical, BarChart2, BookOpen, Zap, ArrowUpRight, Clock } from 'lucide-react'
import DashboardCard from '@/src/components/dashboard/ui/DashboardCard'
import SectionHeader from '@/src/components/dashboard/SectionHeader'
import ActivityItem from '@/src/components/dashboard/ActivityItem'
import ReportCard from '@/src/components/dashboard/ReportCard'
import EconomicCalendarItem from '@/src/components/dashboard/EconomicCalendarItem'
import WatchlistRow from '@/src/components/dashboard/WatchlistRow'
import { MOCK_ACTIVITIES, MOCK_REPORTS, MOCK_CALENDAR, MOCK_WATCHLIST } from '@/src/data/dashboard/dashboard-mock'

const QUICK_TILES = [
    { label: 'New Strategy', desc: 'Create a systematic strategy', icon: Layers, href: '/dashboard/my-strategies', color: '#5FAFD7' },
    { label: 'Run Backtest', desc: 'Test your strategy on history', icon: FlaskConical, href: '/dashboard/backtest', color: '#F3B84D' },
    { label: 'Compare Stocks', desc: 'Side-by-side stock analysis', icon: BarChart2, href: '/dashboard/compare-stocks', color: '#B8CEC2' },
    { label: 'Browse Reports', desc: 'Read latest research', icon: BookOpen, href: '/dashboard/research-reports', color: '#38D996' },
]

export default function WorkspaceHomePage() {
    const { user } = useAuth()
    const router = useRouter()

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1200px' }}>

            {/* ── Greeting Banner ── */}
            <div
                style={{
                    borderRadius: 'var(--db-radius-xl)',
                    padding: '32px',
                    background: 'linear-gradient(135deg, #1A3038 0%, #0F2028 100%)',
                    border: '1px solid var(--db-border)',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* BG glow */}
                <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(184,206,194,0.07) 0%, transparent 70%)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                    <Zap size={18} color="var(--db-mint)" />
                    <span style={{ fontSize: '11px', color: 'var(--db-mint)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 500 }}>
                        Quick Launch
                    </span>
                </div>
                <h1 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--db-text)', letterSpacing: '-0.02em', marginBottom: '6px' }}>
                    Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.firstName ?? 'Trader'}
                </h1>
                <p style={{ fontSize: '13px', color: 'var(--db-text-2)', lineHeight: 1.6 }}>
                    What would you like to work on today?
                </p>
            </div>

            {/* ── Quick-Launch Tiles ── */}
            <section>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
                    {QUICK_TILES.map(tile => (
                        <button
                            key={tile.label}
                            onClick={() => router.push(tile.href)}
                            className="db-card"
                            style={{
                                padding: '20px',
                                textAlign: 'left',
                                cursor: 'pointer',
                                border: 'none',
                                width: '100%',
                                transition: 'all 0.2s ease',
                                background: 'var(--db-surface)',
                                borderRadius: 'var(--db-radius-lg)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
                                    ; (e.currentTarget as HTMLElement).style.borderColor = 'var(--db-border-hover)'
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                                    ; (e.currentTarget as HTMLElement).style.borderColor = 'var(--db-border)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div
                                    style={{
                                        width: '38px', height: '38px',
                                        borderRadius: '10px',
                                        background: `${tile.color}18`,
                                        border: `1px solid ${tile.color}30`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}
                                >
                                    <tile.icon size={18} color={tile.color} />
                                </div>
                                <ArrowUpRight size={14} color="var(--db-text-muted)" />
                            </div>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--db-text)', marginBottom: '3px' }}>{tile.label}</div>
                                <div style={{ fontSize: '12px', color: 'var(--db-text-muted)' }}>{tile.desc}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            {/* ── AI Daily Summary Card ── */}
            <DashboardCard elevated style={{ padding: '22px 24px', borderLeft: '3px solid var(--db-mint)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(184,206,194,0.1)', border: '1px solid rgba(184,206,194,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Zap size={16} color="var(--db-mint)" />
                    </div>
                    <div>
                        <div style={{ fontSize: '11px', color: 'var(--db-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>AI Daily Summary</div>
                        <p style={{ fontSize: '13.5px', color: 'var(--db-text)', lineHeight: 1.65 }}>
                            Markets opened mixed today. <strong style={{ color: 'var(--db-mint)' }}>Nifty50 is up +0.82%</strong> while BankNifty lags at +0.2%.
                            Your <span style={{ color: 'var(--db-mint)', fontWeight: 500 }}>Nifty Momentum Breakout</span> strategy generated a BUY signal
                            for RELIANCE — consistent with the breakout pattern forming since Monday. RBI MPC meeting tomorrow is the key risk event.
                            Consider reducing leverage on rate-sensitive names before 10 AM.
                        </p>
                    </div>
                </div>
            </DashboardCard>

            {/* ── 3-column: Recent Activity + Mini Watchlist + Upcoming Events ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>

                {/* Recent Activity */}
                <DashboardCard style={{ padding: '20px' }}>
                    <SectionHeader title="Recent Activity" actionLabel="View All" actionHref="/dashboard" />
                    {MOCK_ACTIVITIES.slice(0, 5).map((a, i) => (
                        <ActivityItem key={a.id} activity={a} last={i === 4} />
                    ))}
                </DashboardCard>

                {/* Mini Watchlist */}
                <DashboardCard style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '18px 20px 12px' }}>
                        <SectionHeader title="Watchlist" actionLabel="Full View" actionHref="/dashboard" />
                    </div>
                    {MOCK_WATCHLIST.slice(0, 5).map(item => <WatchlistRow key={item.ticker} item={item} />)}
                </DashboardCard>

                {/* Upcoming Calendar */}
                <DashboardCard style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '18px 20px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                            <Clock size={14} color="var(--db-text-muted)" />
                            <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--db-text)' }}>Upcoming Events</span>
                        </div>
                    </div>
                    {MOCK_CALENDAR.slice(0, 4).map((e, i) => (
                        <EconomicCalendarItem key={e.id} event={e} last={i === 3} />
                    ))}
                </DashboardCard>
            </div>

            {/* ── Latest 2 Reports ── */}
            <section>
                <SectionHeader title="Latest Research Reports" actionLabel="Browse All" actionHref="/dashboard/research-reports" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
                    {MOCK_REPORTS.slice(0, 2).map(r => <ReportCard key={r.id} report={r} />)}
                </div>
            </section>
        </div>
    )
}

'use client'

import StatCard from '@/src/components/dashboard/StatCard'
import SectionHeader from '@/src/components/dashboard/SectionHeader'
import PerformanceChart from '@/src/components/dashboard/PerformanceChart'
import type { AdminStrategy } from '@/src/types/admin'
import { ShoppingCart, TrendingUp, TrendingDown, Layers, X, CheckCircle, Database, Globe, Percent, Calendar } from 'lucide-react'

interface Props { strategy: AdminStrategy }

export default function StrategyOverviewTab({ strategy }: Props) {
    const metrics = strategy.metrics || {
        totalReturn: 0,
        totalPnL: 0,
        todayPnL: 0,
        activeHoldings: 0,
        winRate: 0,
        sharpeRatio: 0,
        averageHoldingTime: 0,
    }
    const netPnl = metrics.totalPnL
    const isProfit = netPnl >= 0

    const fmtINR = (v: number) => `₹${Math.abs(v).toLocaleString('en-IN')}`
    const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

    const stats = [
        { label: 'Active Holdings', value: String(metrics.activeHoldings), icon: Layers, accent: '#5FAFD7' },
        { label: 'Win Rate', value: `${metrics.winRate?.toFixed(1)}%`, icon: TrendingUp, accent: '#38D996' },
        { label: 'Sharpe Ratio', value: metrics.sharpeRatio?.toFixed(2), icon: CheckCircle, accent: '#F3B84D' },
        { label: 'Avg Holding Time', value: `${metrics.averageHoldingTime?.toFixed(1)} Days`, icon: Calendar, accent: '#708482' },
    ]

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Overview Metrics Grid */}
            <section>
                <SectionHeader title="Strategy Metrics" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: '12px' }}>
                    {stats.map(s => (
                        <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} accent={s.accent} />
                    ))}
                    
                    {/* Net P&L card */}
                    <div className="db-card" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: `3px solid ${isProfit ? 'var(--db-profit)' : 'var(--db-loss)'}` }}>
                        <span style={{ fontSize: '11px', color: 'var(--db-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Net P&L</span>
                        <span style={{ fontSize: '20px', fontWeight: 700, color: isProfit ? 'var(--db-profit)' : 'var(--db-loss)', letterSpacing: '-0.02em' }}>
                            {isProfit ? '+' : '-'}{fmtINR(netPnl)}
                        </span>
                    </div>

                    {/* Today's P&L card */}
                    <div className="db-card" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: `3px solid ${metrics.todayPnL >= 0 ? 'var(--db-profit)' : 'var(--db-loss)'}` }}>
                        <span style={{ fontSize: '11px', color: 'var(--db-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Today's P&L</span>
                        <span style={{ fontSize: '20px', fontWeight: 700, color: metrics.todayPnL >= 0 ? 'var(--db-profit)' : 'var(--db-loss)', letterSpacing: '-0.02em' }}>
                            {metrics.todayPnL >= 0 ? '+' : '-'}{fmtINR(metrics.todayPnL)}
                        </span>
                    </div>
                </div>
            </section>

            {/* Info Summary Panel & Chart split */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                    
                    {/* System Parameters Card */}
                    <div className="db-card" style={{ padding: '20px 24px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--db-text)', marginBottom: '16px', borderBottom: '1px solid var(--db-border)', paddingBottom: '8px' }}>Deployment Configurations</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                            {[
                                { icon: Database, label: 'Execution Database', value: strategy.databaseName, desc: 'TimescaleDB deployment container' },
                                { icon: Globe, label: 'Trading Universe', value: strategy.universeName, desc: 'Assigned index component assets' },
                                { icon: Percent, label: 'Cumulative ROI', value: `${metrics.totalReturn?.toFixed(2)}%`, desc: 'Overall portfolio gain factor', color: metrics.totalReturn >= 0 ? 'var(--db-profit)' : 'var(--db-loss)' },
                                { icon: Calendar, label: 'Created Time', value: fmtDate(strategy.createdAt), desc: 'Date when module initialized' }
                            ].map(item => (
                                <div key={item.label} style={{ display: 'flex', gap: '12px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--db-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <item.icon size={14} color="var(--db-mint)" />
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '11px', color: 'var(--db-text-muted)', display: 'block' }}>{item.label}</span>
                                        <span style={{ fontSize: '13px', fontWeight: 650, color: item.color || 'var(--db-text)', display: 'block', margin: '2px 0' }}>{item.value}</span>
                                        <span style={{ fontSize: '10.5px', color: 'var(--db-text-muted)' }}>{item.desc}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Performance Chart */}
                <section>
                    <SectionHeader title="Portfolio Cumulative Equity Curve" />
                    <div className="db-card" style={{ padding: '20px' }}>
                        <PerformanceChart height={220} />
                    </div>
                </section>
            </div>

        </div>
    )
}

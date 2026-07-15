'use client'

import StatCard from '@/src/components/dashboard/StatCard'
import SectionHeader from '@/src/components/dashboard/SectionHeader'
import PerformanceChart from '@/src/components/dashboard/PerformanceChart'
import type { AdminStrategy } from '@/src/types/admin'
import { ShoppingCart, TrendingUp, TrendingDown, Layers, X, CheckCircle } from 'lucide-react'

interface Props { strategy: AdminStrategy }

export default function StrategyOverviewTab({ strategy }: Props) {
    const netPnl = strategy.totalProfit - strategy.totalLoss
    const isProfit = netPnl >= 0

    const fmtINR = (v: number) => `₹${Math.abs(v).toLocaleString('en-IN')}`

    const stats = [
        { label: 'Total Holdings', value: String(strategy.holdingsCount), icon: Layers, accent: '#5FAFD7' },
        { label: 'Buy Orders', value: String(strategy.totalBuyOrders), icon: ShoppingCart, accent: '#38D996' },
        { label: 'Sell Orders', value: String(strategy.totalSellOrders), icon: TrendingDown, accent: '#B8CEC2' },
        { label: 'Open Positions', value: String(strategy.openPositions), icon: TrendingUp, accent: '#F3B84D' },
        { label: 'Closed Positions', value: String(strategy.closedPositions), icon: CheckCircle, accent: '#708482' },
        { label: 'Total Profit', value: fmtINR(strategy.totalProfit), icon: TrendingUp, accent: '#38D996', trendLabel: '+P&L' },
        { label: 'Total Loss', value: fmtINR(strategy.totalLoss), icon: X, accent: '#E35D6A', trendLabel: 'Drawdown' },
    ]

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Summary stat cards */}
            <section>
                <SectionHeader title="Strategy Metrics" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: '12px' }}>
                    {stats.map(s => (
                        <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} accent={s.accent} trendLabel={s.trendLabel} />
                    ))}
                    {/* Net P&L card */}
                    <div className="db-card" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: `3px solid ${isProfit ? 'var(--db-profit)' : 'var(--db-loss)'}` }}>
                        <span style={{ fontSize: '11px', color: 'var(--db-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Net P&L</span>
                        <span style={{ fontSize: '22px', fontWeight: 700, color: isProfit ? 'var(--db-profit)' : 'var(--db-loss)', letterSpacing: '-0.02em' }}>
                            {isProfit ? '+' : '-'}{fmtINR(netPnl)}
                        </span>
                    </div>
                </div>
            </section>

            {/* Performance Chart */}
            <section>
                <SectionHeader title="Portfolio Performance" />
                <PerformanceChart height={220} />
            </section>

        </div>
    )
}

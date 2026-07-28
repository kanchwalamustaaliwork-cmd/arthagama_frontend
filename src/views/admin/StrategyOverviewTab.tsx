'use client'

import React from 'react'
import SectionHeader from '@/src/components/dashboard/SectionHeader'
import PerformanceChart from '@/src/components/dashboard/PerformanceChart'
import type { AdminStrategy } from '@/src/types/admin'
import { useStrategyContext } from '@/src/context/StrategyContext'
import { useStrategyMetrics } from '@/src/hooks/admin/useStrategyMetrics'
import MetricsGrid from '@/src/components/admin/metrics/MetricsGrid'
import { Database, Globe, Percent, Calendar, Coins, ShieldCheck } from 'lucide-react'
import { formatCurrency, formatPercentage, formatTimestamp } from '@/src/utils/metrics'

interface Props {
    strategy?: AdminStrategy
}

export default function StrategyOverviewTab({ strategy: propStrategy }: Props = {}) {
    const ctx = useStrategyContext()
    const strategy = propStrategy || ctx.strategy
    const strategyId = strategy?.id || ctx.strategyId || ''

    const {
        metrics,
        loading,
        recalculating,
        error,
        refresh,
        recalculateAndRefresh,
        lastUpdated,
    } = useStrategyMetrics(strategyId)

    if (!strategy) return null

    const totalReturn = metrics?.totalReturn ?? 0
    const initialCapital = strategy.initialCapital ?? 0
    const riskFreeRate = strategy.riskFreeRate ?? 0.06

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Live & Cached Hybrid Metrics Grid */}
            <MetricsGrid
                metrics={metrics}
                loading={loading}
                recalculating={recalculating}
                error={error}
                onRefresh={refresh}
                onRecalculate={recalculateAndRefresh}
                lastUpdated={lastUpdated}
            />

            {/* System Parameters & Equity Curve Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                {/* Deployment Configurations Card */}
                <div className="db-card" style={{ padding: '20px 24px' }}>
                    <h3
                        style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: 'var(--db-text)',
                            marginBottom: '16px',
                            borderBottom: '1px solid var(--db-border)',
                            paddingBottom: '8px',
                        }}
                    >
                        Deployment Configurations
                    </h3>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                            gap: '16px',
                        }}
                    >
                        {[
                            {
                                icon: Database,
                                label: 'Execution Database',
                                value: strategy.databaseName,
                                desc: 'TimescaleDB deployment container',
                            },
                            {
                                icon: Globe,
                                label: 'Trading Universe',
                                value: strategy.universeName,
                                desc: 'Assigned index component assets',
                            },
                            {
                                icon: Coins,
                                label: 'Initial Capital',
                                value: formatCurrency(initialCapital),
                                desc: 'Allocated starting strategy capital',
                            },
                            {
                                icon: ShieldCheck,
                                label: 'Risk-Free Rate',
                                value: formatPercentage(riskFreeRate * 100),
                                desc: 'Sharpe ratio annual benchmark rate',
                            },
                            {
                                icon: Percent,
                                label: 'Cumulative ROI',
                                value: formatPercentage(totalReturn),
                                desc: 'Overall portfolio gain factor',
                                color: totalReturn >= 0 ? 'var(--db-profit)' : 'var(--db-loss)',
                            },
                            {
                                icon: Calendar,
                                label: 'Created Time',
                                value: formatTimestamp(strategy.createdAt),
                                desc: 'Date when module initialized',
                            },
                        ].map((item) => (
                            <div key={item.label} style={{ display: 'flex', gap: '12px' }}>
                                <div
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '8px',
                                        background: 'var(--db-elevated)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}
                                >
                                    <item.icon size={14} color="var(--db-mint)" />
                                </div>
                                <div>
                                    <span style={{ fontSize: '11px', color: 'var(--db-text-muted)', display: 'block' }}>
                                        {item.label}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: '13px',
                                            fontWeight: 650,
                                            color: item.color || 'var(--db-text)',
                                            display: 'block',
                                            margin: '2px 0',
                                        }}
                                    >
                                        {item.value}
                                    </span>
                                    <span style={{ fontSize: '10.5px', color: 'var(--db-text-muted)' }}>
                                        {item.desc}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Portfolio Cumulative Equity Curve */}
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

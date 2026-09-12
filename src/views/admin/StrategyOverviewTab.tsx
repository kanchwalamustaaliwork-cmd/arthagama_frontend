'use client'

import React from 'react'
import SectionHeader from '@/src/components/dashboard/SectionHeader'
import PerformanceChart from '@/src/components/dashboard/PerformanceChart'
import type { AdminStrategy, LTPRecord } from '@/src/types/admin'
import { useStrategyContext } from '@/src/context/StrategyContext'
import { useStrategyMetrics } from '@/src/hooks/admin/useStrategyMetrics'
import MetricsGrid from '@/src/components/admin/metrics/MetricsGrid'
import {
    Tag, Globe, Percent, Calendar, Coins, ShieldCheck,
    TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
    Activity, Clock,
} from 'lucide-react'
import { formatCurrency, formatPercentage, formatTimestamp } from '@/src/utils/metrics'

interface Props {
    strategy?: AdminStrategy
}

interface GainerLoserCardProps {
    type: 'gainer' | 'loser'
    record: LTPRecord | null
    liveUniverseStatus: string
}

function GainerLoserCard({ type, record, liveUniverseStatus }: GainerLoserCardProps) {
    const isGainer = type === 'gainer'
    const accentColor = isGainer ? 'var(--db-profit)' : 'var(--db-loss)'
    const bgGradient = isGainer
        ? 'radial-gradient(circle at 100% 0%, rgba(52, 199, 89, 0.12) 0%, transparent 70%)'
        : 'radial-gradient(circle at 100% 0%, rgba(239, 68, 68, 0.12) 0%, transparent 70%)'
    const borderColor = isGainer ? 'rgba(52, 199, 89, 0.25)' : 'rgba(239, 68, 68, 0.25)'
    const borderLeft = isGainer ? '4px solid var(--db-profit)' : '4px solid var(--db-loss)'
    const Icon = isGainer ? TrendingUp : TrendingDown
    const ArrowIcon = isGainer ? ArrowUpRight : ArrowDownRight
    const title = isGainer ? 'MAX GAINER' : 'MAX LOSER'
    const subtitle = isGainer ? 'Top performing active holding' : 'Highest drawdown active holding'

    const pnl = record?.pnl ?? 0
    const pnlPercent = record?.pnlPercent ?? 0
    const sign = pnl > 0 ? '+' : ''

    return (
        <div
            className="db-card"
            style={{
                padding: '20px 24px',
                position: 'relative',
                overflow: 'hidden',
                borderLeft,
                borderColor,
                background: bgGradient,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
            }}
        >
            {/* Header: Label + Live badge + Icon */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                        style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '8px',
                            background: isGainer ? 'rgba(52, 199, 89, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Icon size={16} color={accentColor} />
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span
                                style={{
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    letterSpacing: '0.06em',
                                    color: accentColor,
                                }}
                            >
                                {title}
                            </span>
                            <span
                                style={{
                                    fontSize: '10.5px',
                                    fontWeight: 600,
                                    padding: '1px 7px',
                                    borderRadius: '999px',
                                    background: isGainer ? 'rgba(52, 199, 89, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                                    color: accentColor,
                                }}
                            >
                                Live LTP
                            </span>
                        </div>
                        <span style={{ fontSize: '11px', color: 'var(--db-text-muted)', display: 'block' }}>
                            {subtitle}
                        </span>
                    </div>
                </div>

                {record && (
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            background: isGainer ? 'rgba(52, 199, 89, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                            color: accentColor,
                            fontSize: '13px',
                            fontWeight: 700,
                            fontFamily: 'monospace',
                        }}
                    >
                        <ArrowIcon size={14} />
                        {sign}{pnlPercent.toFixed(2)}%
                    </div>
                )}
            </div>

            {/* Body */}
            {record ? (
                <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                        <div>
                            <span
                                style={{
                                    fontSize: '20px',
                                    fontWeight: 800,
                                    color: 'var(--db-text)',
                                    fontFamily: 'monospace',
                                    letterSpacing: '0.02em',
                                }}
                            >
                                {record.ticker}
                            </span>
                            <span style={{ fontSize: '12px', color: 'var(--db-text-muted)', marginLeft: '8px' }}>
                                {record.quantity ? `${record.quantity.toLocaleString('en-IN')} shares` : 'Holding'}
                            </span>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--db-mint)', fontFamily: 'monospace' }}>
                                ₹{record.latestPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--db-text-muted)' }}>
                                Current LTP
                            </div>
                        </div>
                    </div>

                    {/* Metric row: Unrealized PnL & Avg Buy */}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '12px',
                            padding: '10px 14px',
                            background: 'var(--db-elevated)',
                            borderRadius: '8px',
                            border: '1px solid var(--db-border)',
                        }}
                    >
                        <div>
                            <span style={{ fontSize: '11px', color: 'var(--db-text-muted)', display: 'block' }}>
                                Unrealized PnL
                            </span>
                            <span
                                style={{
                                    fontSize: '14px',
                                    fontWeight: 700,
                                    color: accentColor,
                                    fontFamily: 'monospace',
                                }}
                            >
                                {sign}₹{Math.abs(pnl).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>

                        <div>
                            <span style={{ fontSize: '11px', color: 'var(--db-text-muted)', display: 'block' }}>
                                Avg Buy Price
                            </span>
                            <span
                                style={{
                                    fontSize: '14px',
                                    fontWeight: 650,
                                    color: 'var(--db-text)',
                                    fontFamily: 'monospace',
                                }}
                            >
                                ₹{(record.avgPrice ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    style={{
                        padding: '24px 16px',
                        background: 'var(--db-elevated)',
                        borderRadius: '8px',
                        border: '1px dashed var(--db-border)',
                        textAlign: 'center',
                        color: 'var(--db-text-muted)',
                        fontSize: '12.5px',
                    }}
                >
                    {liveUniverseStatus === 'loading'
                        ? 'Connecting to real-time stream...'
                        : isGainer
                            ? 'No active gainers in current holdings'
                            : 'No active losers in current holdings'}
                </div>
            )}
        </div>
    )
}

export default function StrategyOverviewTab({ strategy: propStrategy }: Props = {}) {
    const ctx = useStrategyContext()
    const strategy = propStrategy || ctx.strategy
    const strategyId = strategy?.id || ctx.strategyId || ''
    const { maxGainer, maxLoser, liveUniverseStatus } = ctx

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Real-time MAX Gainer & MAX Loser Highlight Cards */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '16px',
                }}
            >
                <GainerLoserCard type="gainer" record={maxGainer} liveUniverseStatus={liveUniverseStatus} />
                <GainerLoserCard type="loser" record={maxLoser} liveUniverseStatus={liveUniverseStatus} />
            </div>

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
                                icon: Tag,
                                label: 'Strategy Type',
                                value: strategy.strategyType?.replace('_', ' / ') ?? strategy.category,
                                desc: 'Canonical trading modality classification',
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

                {/* Portfolio Cumulative Equity Curve
                <section>
                    <SectionHeader title="Portfolio Cumulative Equity Curve" />
                    <div className="db-card" style={{ padding: '20px' }}>
                        <PerformanceChart height={220} />
                    </div>
                </section> */}
            </div>
        </div>
    )
}

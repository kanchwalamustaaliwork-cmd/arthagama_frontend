/**
 * src/components/indices/IndexPerformanceSummary.tsx
 *
 * Performance metric summary tiles on the Index Details page.
 */

import { ArrowUpRight, ArrowDownRight, Calendar, DollarSign, Clock, TrendingUp } from 'lucide-react'
import { IndexPerformanceSummary as IPerfSummary } from '@/src/types/indices'
import {
    formatIndexValue,
    formatIndexChange,
    formatIndexPercent,
    formatIndexDate,
} from '@/src/utils/indices/format-index-value'

interface IndexPerformanceSummaryProps {
    performance?: IPerfSummary
}

export default function IndexPerformanceSummary({ performance }: IndexPerformanceSummaryProps) {
    if (!performance) return null

    const isPositive = (performance.percentChange ?? 0) >= 0

    const returnMetrics = [
        { label: '1W Return', value: performance.return1wPct },
        { label: '1M Return', value: performance.return1mPct },
        { label: '3M Return', value: performance.return3mPct },
        { label: '6M Return', value: performance.return6mPct },
        { label: '1Y Return', value: performance.return1yPct },
        { label: 'YTD Return', value: performance.returnYtdPct },
    ]

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Top Row: Primary Metric Cards */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '16px',
                }}
            >
                {/* 1. Current Value & 1D Change */}
                <div className="db-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', color: 'var(--db-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            Current Value
                        </span>
                        <div
                            style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '6px',
                                background: 'var(--db-elevated)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <TrendingUp size={15} color="var(--db-mint)" />
                        </div>
                    </div>

                    <div style={{ marginTop: '8px', fontSize: '26px', fontWeight: 700, color: 'var(--db-text)' }}>
                        {formatIndexValue(performance.currentValue)}
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            marginTop: '6px',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: isPositive ? 'var(--db-profit)' : 'var(--db-loss)',
                        }}
                    >
                        {isPositive ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
                        <span>
                            {formatIndexChange(performance.absoluteChange)} ({formatIndexPercent(performance.percentChange)})
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--db-text-muted)', fontWeight: 400, marginLeft: '4px' }}>
                            Today
                        </span>
                    </div>
                </div>

                {/* 2. Base Value */}
                <div className="db-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', color: 'var(--db-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            Base Value
                        </span>
                        <div
                            style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '6px',
                                background: 'var(--db-elevated)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <DollarSign size={15} color="var(--db-mint)" />
                        </div>
                    </div>

                    <div style={{ marginTop: '8px', fontSize: '26px', fontWeight: 700, color: 'var(--db-text)' }}>
                        {formatIndexValue(performance.baseValue)}
                    </div>

                    <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--db-text-muted)' }}>
                        Inception Baseline
                    </div>
                </div>

                {/* 3. Base Date */}
                <div className="db-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', color: 'var(--db-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            Base Date
                        </span>
                        <div
                            style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '6px',
                                background: 'var(--db-elevated)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Calendar size={15} color="var(--db-mint)" />
                        </div>
                    </div>

                    <div style={{ marginTop: '8px', fontSize: '20px', fontWeight: 600, color: 'var(--db-text)' }}>
                        {formatIndexDate(performance.baseDate)}
                    </div>

                    <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--db-text-muted)' }}>
                        Calculation Start Date
                    </div>
                </div>

                {/* 4. As-Of Timestamp */}
                <div className="db-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', color: 'var(--db-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            Pricing Status
                        </span>
                        <div
                            style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '6px',
                                background: 'var(--db-elevated)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Clock size={15} color="var(--db-mint)" />
                        </div>
                    </div>

                    <div style={{ marginTop: '8px', fontSize: '14px', fontWeight: 600, color: 'var(--db-text)' }}>
                        {performance.asOf}
                    </div>

                    <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--db-text-muted)' }}>
                        Mock illustrative snapshot
                    </div>
                </div>
            </div>

            {/* Bottom Row: Period Returns Bar */}
            <div
                className="db-card"
                style={{
                    padding: '16px 20px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                    gap: '12px',
                    background: 'var(--db-elevated)',
                }}
            >
                {returnMetrics.map(item => {
                    const val = item.value ?? 0
                    const pos = val >= 0
                    return (
                        <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            <span style={{ fontSize: '11px', color: 'var(--db-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                {item.label}
                            </span>
                            <span
                                style={{
                                    fontSize: '15px',
                                    fontWeight: 700,
                                    color: item.value === null || item.value === undefined
                                        ? 'var(--db-text-muted)'
                                        : pos ? 'var(--db-profit)' : 'var(--db-loss)',
                                }}
                            >
                                {formatIndexPercent(item.value)}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

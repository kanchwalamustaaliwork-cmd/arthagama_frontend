/**
 * src/components/indices/IndexCard.tsx
 *
 * Card component for browsing active indices in the User Dashboard.
 */

import Link from 'next/link'
import { ArrowUpRight, ArrowDownRight, Layers, ChevronRight } from 'lucide-react'
import { IndexWithPerformance } from '@/src/types/indices'
import { formatIndexValue, formatIndexChange, formatIndexPercent } from '@/src/utils/indices/format-index-value'
import IndexSparkline from './IndexSparkline'

interface IndexCardProps {
    index: IndexWithPerformance
}

export default function IndexCard({ index }: IndexCardProps) {
    const perf = index.performance
    const isPositive = (perf?.percentChange ?? 0) >= 0

    return (
        <div
            className="db-card"
            style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform var(--db-transition), border-color var(--db-transition), box-shadow var(--db-transition)',
                cursor: 'pointer',
                position: 'relative',
            }}
        >
            {/* Header: Title, Symbol, Sector */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                    <div>
                        <h3
                            style={{
                                fontSize: '15px',
                                fontWeight: 600,
                                color: 'var(--db-text)',
                                lineHeight: 1.3,
                                marginBottom: '4px',
                            }}
                        >
                            {index.indexName}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {index.indexSymbol && (
                                <span
                                    style={{
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        color: 'var(--db-mint)',
                                        letterSpacing: '0.06em',
                                        background: 'var(--db-mint-faint)',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                    }}
                                >
                                    {index.indexSymbol}
                                </span>
                            )}
                            <span style={{ fontSize: '12px', color: 'var(--db-text-muted)' }}>
                                {index.sector}
                            </span>
                        </div>
                    </div>

                    {/* Quick navigation link icon */}
                    <Link
                        href={`/dashboard/indices/${index.indexId}`}
                        style={{
                            color: 'var(--db-text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            background: 'var(--db-elevated)',
                            transition: 'color var(--db-transition), background var(--db-transition)',
                        }}
                        aria-label={`View ${index.indexName} details`}
                    >
                        <ChevronRight size={16} />
                    </Link>
                </div>

                {/* Index Value & Daily Change */}
                <div style={{ marginTop: '16px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--db-text)', letterSpacing: '-0.02em' }}>
                            {formatIndexValue(perf?.currentValue)}
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                marginTop: '4px',
                                fontSize: '13px',
                                fontWeight: 600,
                                color: isPositive ? 'var(--db-profit)' : 'var(--db-loss)',
                            }}
                        >
                            {isPositive ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
                            <span>
                                {formatIndexChange(perf?.absoluteChange)} ({formatIndexPercent(perf?.percentChange)})
                            </span>
                            <span style={{ fontSize: '11px', color: 'var(--db-text-muted)', fontWeight: 400, marginLeft: '2px' }}>
                                1D
                            </span>
                        </div>
                    </div>

                    {/* Sparkline trend */}
                    {index.sparkline && (
                        <IndexSparkline points={index.sparkline} isPositive={isPositive} width={90} height={32} />
                    )}
                </div>
            </div>

            {/* Bottom stats & details link */}
            <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid var(--db-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--db-text-2)' }}>
                        <Layers size={13} color="var(--db-text-muted)" />
                        <span>{index.constituentCount} Constituents</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: 'var(--db-text-muted)' }}>1M Return:</span>
                        <span
                            style={{
                                fontWeight: 600,
                                color: (perf?.return1mPct ?? 0) >= 0 ? 'var(--db-profit)' : 'var(--db-loss)',
                            }}
                        >
                            {formatIndexPercent(perf?.return1mPct)}
                        </span>
                    </div>
                </div>

                <div style={{ marginTop: '12px' }}>
                    <Link
                        href={`/dashboard/indices/${index.indexId}`}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: 'var(--db-radius-sm)',
                            background: 'var(--db-elevated)',
                            color: 'var(--db-mint)',
                            fontSize: '12.5px',
                            fontWeight: 500,
                            textDecoration: 'none',
                            transition: 'background var(--db-transition)',
                        }}
                    >
                        <span>View Index Analytics</span>
                        <ChevronRight size={14} />
                    </Link>
                </div>
            </div>
        </div>
    )
}

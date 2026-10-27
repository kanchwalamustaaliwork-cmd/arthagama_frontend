'use client'

/**
 * src/components/indices/UserIndicesTable.tsx
 *
 * Responsive, premium table component for browsing active indices in the user dashboard.
 * Replaces the card layout with a clean tabular representation.
 */

import Link from 'next/link'
import { ArrowUpRight, ArrowDownRight, Layers, ChevronRight } from 'lucide-react'
import { IndexWithPerformance } from '@/src/types/indices'
import {
    formatIndexValue,
    formatIndexChange,
    formatIndexPercent,
} from '@/src/utils/indices/format-index-value'
import IndexSparkline from './IndexSparkline'

interface UserIndicesTableProps {
    indices: IndexWithPerformance[]
}

export default function UserIndicesTable({ indices }: UserIndicesTableProps) {
    if (indices.length === 0) return null

    return (
        <div className="db-card" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                        <tr
                            style={{
                                borderBottom: '1px solid var(--db-border)',
                                background: 'rgba(184, 206, 194, 0.03)',
                            }}
                        >
                            <th style={{ padding: '14px 20px', color: 'var(--db-text-muted)', fontWeight: 600 }}>
                                Index Name
                            </th>
                            <th style={{ padding: '14px 20px', color: 'var(--db-text-muted)', fontWeight: 600 }}>
                                Sector
                            </th>
                            <th style={{ padding: '14px 20px', color: 'var(--db-text-muted)', fontWeight: 600, textAlign: 'center' }}>
                                Constituents
                            </th>
                            <th style={{ padding: '14px 20px', color: 'var(--db-text-muted)', fontWeight: 600, textAlign: 'right' }}>
                                Current Value
                            </th>
                            <th style={{ padding: '14px 20px', color: 'var(--db-text-muted)', fontWeight: 600, textAlign: 'right' }}>
                                1D Return
                            </th>
                            <th style={{ padding: '14px 20px', color: 'var(--db-text-muted)', fontWeight: 600, textAlign: 'right' }}>
                                1W Return
                            </th>
                            <th style={{ padding: '14px 20px', color: 'var(--db-text-muted)', fontWeight: 600, textAlign: 'right' }}>
                                1M Return
                            </th>
                            <th style={{ padding: '14px 20px', color: 'var(--db-text-muted)', fontWeight: 600, textAlign: 'right' }}>
                                1Y Return
                            </th>
                            <th style={{ padding: '14px 20px', color: 'var(--db-text-muted)', fontWeight: 600, textAlign: 'center' }}>
                                1M Trend
                            </th>
                            <th style={{ padding: '14px 20px', color: 'var(--db-text-muted)', fontWeight: 600, textAlign: 'right' }}>
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {indices.map((idx, index) => {
                            const perf = idx.performance
                            const is1dPos = (perf?.percentChange ?? 0) >= 0
                            const is1wPos = (perf?.return1wPct ?? 0) >= 0
                            const is1mPos = (perf?.return1mPct ?? 0) >= 0
                            const is1yPos = (perf?.return1yPct ?? 0) >= 0

                            return (
                                <tr
                                    key={idx.indexId}
                                    style={{
                                        borderBottom: index < indices.length - 1 ? '1px solid var(--db-border)' : 'none',
                                        transition: 'background var(--db-transition)',
                                    }}
                                >
                                    {/* Index Name & Symbol */}
                                    <td style={{ padding: '14px 20px' }}>
                                        <Link
                                            href={`/dashboard/indices/${idx.indexId}`}
                                            style={{
                                                textDecoration: 'none',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '2px',
                                            }}
                                        >
                                            <span style={{ fontWeight: 600, color: 'var(--db-text)', fontSize: '13.5px' }}>
                                                {idx.indexName}
                                            </span>
                                            {idx.indexSymbol && (
                                                <span
                                                    style={{
                                                        fontSize: '11px',
                                                        fontWeight: 700,
                                                        color: 'var(--db-mint)',
                                                        fontFamily: 'monospace',
                                                    }}
                                                >
                                                    {idx.indexSymbol}
                                                </span>
                                            )}
                                        </Link>
                                    </td>

                                    {/* Sector */}
                                    <td style={{ padding: '14px 20px' }}>
                                        <span
                                            style={{
                                                fontSize: '11.5px',
                                                fontWeight: 500,
                                                padding: '3px 8px',
                                                borderRadius: '6px',
                                                background: 'var(--db-elevated)',
                                                color: 'var(--db-text-2)',
                                            }}
                                        >
                                            {idx.sector}
                                        </span>
                                    </td>

                                    {/* Constituents */}
                                    <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                                        <span
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                fontSize: '12.5px',
                                                color: 'var(--db-text-2)',
                                            }}
                                        >
                                            <Layers size={13} color="var(--db-text-muted)" />
                                            {idx.constituentCount}
                                        </span>
                                    </td>

                                    {/* Current Value */}
                                    <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 700, color: 'var(--db-text)', fontSize: '14px' }}>
                                        {formatIndexValue(perf?.currentValue)}
                                    </td>

                                    {/* 1D Return */}
                                    <td
                                        style={{
                                            padding: '14px 20px',
                                            textAlign: 'right',
                                            fontWeight: 600,
                                            color: is1dPos ? 'var(--db-profit)' : 'var(--db-loss)',
                                        }}
                                    >
                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                            {is1dPos ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                            <span>{formatIndexPercent(perf?.percentChange)}</span>
                                        </div>
                                    </td>

                                    {/* 1W Return */}
                                    <td
                                        style={{
                                            padding: '14px 20px',
                                            textAlign: 'right',
                                            fontWeight: 600,
                                            color: is1wPos ? 'var(--db-profit)' : 'var(--db-loss)',
                                        }}
                                    >
                                        {formatIndexPercent(perf?.return1wPct)}
                                    </td>

                                    {/* 1M Return */}
                                    <td
                                        style={{
                                            padding: '14px 20px',
                                            textAlign: 'right',
                                            fontWeight: 600,
                                            color: is1mPos ? 'var(--db-profit)' : 'var(--db-loss)',
                                        }}
                                    >
                                        {formatIndexPercent(perf?.return1mPct)}
                                    </td>

                                    {/* 1Y Return */}
                                    <td
                                        style={{
                                            padding: '14px 20px',
                                            textAlign: 'right',
                                            fontWeight: 600,
                                            color: is1yPos ? 'var(--db-profit)' : 'var(--db-loss)',
                                        }}
                                    >
                                        {formatIndexPercent(perf?.return1yPct)}
                                    </td>

                                    {/* Sparkline Trend */}
                                    <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                                        {idx.sparkline && (
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                <IndexSparkline points={idx.sparkline} isPositive={is1mPos} width={80} height={26} />
                                            </div>
                                        )}
                                    </td>

                                    {/* Action link */}
                                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                                        <Link
                                            href={`/dashboard/indices/${idx.indexId}`}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                padding: '6px 12px',
                                                borderRadius: 'var(--db-radius-sm)',
                                                background: 'var(--db-elevated)',
                                                color: 'var(--db-mint)',
                                                fontSize: '12px',
                                                fontWeight: 500,
                                                textDecoration: 'none',
                                                transition: 'background var(--db-transition)',
                                            }}
                                        >
                                            <span>Details</span>
                                            <ChevronRight size={13} />
                                        </Link>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

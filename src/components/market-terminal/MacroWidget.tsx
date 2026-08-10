'use client'

import React, { useState } from 'react'
import { useMacro } from '@/src/hooks/terminal/useMacro'
import { useMacroDetail } from '@/src/hooks/terminal/useMacroDetail'
import { MacroSeriesPoint } from '@/src/types/terminal'
import { Skeleton } from './Skeleton'

// ─────────────────────────────────────────────────────────────────────────────
// Mini Sparkline — pure SVG, no extra dependencies
// ─────────────────────────────────────────────────────────────────────────────
function Sparkline({ series }: { series: MacroSeriesPoint[] }) {
    if (!series || series.length < 2) return null

    const vals = series.map((p) => p.value)
    const min = Math.min(...vals)
    const max = Math.max(...vals)
    const range = max - min || 1
    const W = 300
    const H = 72

    const pts = vals.map((v, i): [number, number] => [
        (i / (vals.length - 1)) * W,
        H - ((v - min) / range) * H,
    ])

    const pathD = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
    const areaD = `${pathD} L${W},${H} L0,${H}Z`

    const isUp = vals[vals.length - 1] >= vals[0]
    const col = isUp ? '#26a65b' : '#e0524b'
    const [lx, ly] = pts[pts.length - 1]

    return (
        <svg
            viewBox={`0 0 ${W} ${H}`}
            style={{ width: '100%', height: '72px', display: 'block' }}
            preserveAspectRatio="none"
        >
            <defs>
                <linearGradient id={`sg-${isUp ? 'up' : 'dn'}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={col} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={col} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={areaD} fill={`url(#sg-${isUp ? 'up' : 'dn'})`} />
            <path d={pathD} fill="none" stroke={col} strokeWidth="1.5" />
            <circle cx={lx.toFixed(1)} cy={ly.toFixed(1)} r="3" fill={col} />
        </svg>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton layouts
// ─────────────────────────────────────────────────────────────────────────────
function GridSkeleton() {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {Array.from({ length: 8 }).map((_, i) => (
                <div
                    key={i}
                    style={{
                        padding: '8px 10px',
                        borderRadius: '6px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.04)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                    }}
                >
                    <Skeleton height={10} width="55%" borderRadius={3} />
                    <Skeleton height={13} borderRadius={3} />
                </div>
            ))}
        </div>
    )
}

function DetailSkeleton() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Skeleton height={26} width="45%" borderRadius={4} />
            <Skeleton height={14} width="25%" borderRadius={3} />
            <Skeleton height={72} borderRadius={6} />
            <Skeleton height={11} borderRadius={3} />
            <Skeleton height={11} width="88%" borderRadius={3} />
            <Skeleton height={11} width="75%" borderRadius={3} />
        </div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// Detail view (shown when a tile is clicked)
// ─────────────────────────────────────────────────────────────────────────────
interface DetailViewProps {
    indicatorKey: string
    onBack: () => void
}

function DetailView({ indicatorKey, onBack }: DetailViewProps) {
    const { detail, loading, error } = useMacroDetail(indicatorKey)

    const fmt = (n?: number | null, maxDec = 4) =>
        n == null || isNaN(n)
            ? '—'
            : n.toLocaleString('en-IN', { maximumFractionDigits: maxDec })

    const isBull = (detail?.change_pct ?? 0) >= 0
    const changeCol = isBull ? 'var(--db-gain, #26a65b)' : 'var(--db-loss, #e0524b)'

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Back + indicator name header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                    onClick={onBack}
                    title="Back to overview"
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#7d848c',
                        cursor: 'pointer',
                        fontSize: '18px',
                        lineHeight: 1,
                        padding: '0 4px 0 0',
                        transition: 'color 0.15s',
                    }}
                    onMouseEnter={(e) => { (e.target as HTMLElement).style.color = '#fff' }}
                    onMouseLeave={(e) => { (e.target as HTMLElement).style.color = '#7d848c' }}
                >
                    ←
                </button>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>
                    {detail?.name || indicatorKey}
                </span>
                {detail?.available && (
                    <span style={{ fontSize: '9.5px', color: '#7d848c', marginLeft: 'auto', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '3px' }}>
                        {detail.source?.toUpperCase()}
                    </span>
                )}
            </div>

            {/* Loading state */}
            {loading && <DetailSkeleton />}

            {/* Network/auth error */}
            {!loading && error && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '24px 0', color: '#7d848c' }}>
                    <span style={{ fontSize: '22px' }}>⚠</span>
                    <span style={{ fontSize: '12px', fontWeight: 500 }}>Could not load data</span>
                    <span style={{ fontSize: '11px', color: '#555' }}>Check your connection and try again</span>
                </div>
            )}

            {/* Data unavailable (provider returned available: false) */}
            {!loading && !error && detail && !detail.available && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '24px 0', color: '#7d848c' }}>
                    <span style={{ fontSize: '26px', opacity: 0.4 }}>⊘</span>
                    <span style={{ fontSize: '12px', fontWeight: 500 }}>Data Unavailable</span>
                    <span style={{ fontSize: '11px', color: '#555', textAlign: 'center', lineHeight: 1.5 }}>
                        This indicator could not be retrieved at this time.<br />
                        Other indicators remain available.
                    </span>
                </div>
            )}

            {/* Success state */}
            {!loading && !error && detail?.available && (
                <>
                    {/* Current value */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '22px', fontWeight: 700, color: '#fff', fontFamily: 'Consolas, monospace' }}>
                            {fmt(detail.value)}
                        </span>
                        <span style={{ fontSize: '11px', color: '#7d848c' }}>{detail.unit}</span>
                        {detail.change_pct != null && (
                            <span style={{ fontSize: '12px', fontWeight: 600, color: changeCol, fontFamily: 'Consolas, monospace' }}>
                                {isBull ? '+' : ''}{fmt(detail.change_pct, 2)}%
                            </span>
                        )}
                    </div>

                    {/* Sparkline chart */}
                    {detail.series && detail.series.length > 1 && (
                        <div style={{ borderRadius: '6px', overflow: 'hidden', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                            <Sparkline series={detail.series} />
                        </div>
                    )}

                    {/* Description */}
                    {detail.description && (
                        <div style={{ fontSize: '11.5px', color: '#7d848c', lineHeight: '1.65' }}>
                            {detail.description}
                        </div>
                    )}

                    {/* Date range label */}
                    {detail.series && detail.series.length > 1 && (
                        <div style={{ fontSize: '10px', color: '#444', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '6px' }}>
                            {detail.series[0]?.date} → {detail.series[detail.series.length - 1]?.date}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// MacroWidget — main export
// ─────────────────────────────────────────────────────────────────────────────
export default function MacroWidget() {
    const { tiles, loading: snapshotLoading } = useMacro()
    const [selectedKey, setSelectedKey] = useState<string | null>(null)

    const fmt = (n?: number | null) =>
        n == null || isNaN(n) ? '—' : n.toLocaleString('en-IN', { maximumFractionDigits: 2 })

    const isDetail = selectedKey !== null

    return (
        <div
            style={{
                borderRadius: '10px',
                background: '#111417',
                border: '1px solid var(--db-border, rgba(255,255,255,0.08))',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
            }}
        >
            {/* Header — hides when detail is showing (DetailView has its own back+title row) */}
            {!isDetail && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>
                        Macro Overview
                    </span>
                    {snapshotLoading && (
                        <span style={{ fontSize: '10px', color: '#a855f7' }}>…</span>
                    )}
                </div>
            )}

            {/* Content area */}
            <div>
                {isDetail ? (
                    <DetailView
                        indicatorKey={selectedKey!}
                        onBack={() => setSelectedKey(null)}
                    />
                ) : snapshotLoading ? (
                    <GridSkeleton />
                ) : (
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '8px',
                            fontFamily: 'Consolas, monospace',
                        }}
                    >
                        {tiles.map((tile) => {
                            const isBull = (tile.change_pct ?? 0) >= 0
                            const changeCol = isBull ? 'var(--db-gain, #26a65b)' : 'var(--db-loss, #e0524b)'

                            return (
                                <div
                                    key={tile.key}
                                    onClick={() => setSelectedKey(tile.key)}
                                    style={{
                                        padding: '8px 10px',
                                        borderRadius: '6px',
                                        background: 'rgba(255,255,255,0.02)',
                                        border: '1px solid rgba(255,255,255,0.04)',
                                        cursor: 'pointer',
                                        opacity: tile.available ? 1 : 0.45,
                                        transition: 'background 0.15s ease, border-color 0.15s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        const el = e.currentTarget
                                        el.style.background = 'rgba(255,255,255,0.05)'
                                        el.style.borderColor = 'rgba(168,85,247,0.3)'
                                    }}
                                    onMouseLeave={(e) => {
                                        const el = e.currentTarget
                                        el.style.background = 'rgba(255,255,255,0.02)'
                                        el.style.borderColor = 'rgba(255,255,255,0.04)'
                                    }}
                                >
                                    <div style={{ fontSize: '10.5px', color: '#7d848c', marginBottom: '4px' }}>
                                        {tile.name}
                                    </div>

                                    {!tile.available ? (
                                        <div style={{ fontSize: '10px', color: '#444', fontStyle: 'italic' }}>
                                            Unavailable
                                        </div>
                                    ) : (
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'baseline',
                                                justifyContent: 'space-between',
                                                gap: '4px',
                                            }}
                                        >
                                            <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#fff' }}>
                                                {fmt(tile.value)}
                                            </span>
                                            <span style={{ fontSize: '10.5px', fontWeight: 600, color: changeCol }}>
                                                {tile.change_pct != null ? (isBull ? '+' : '') : ''}
                                                {fmt(tile.change_pct)}%
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

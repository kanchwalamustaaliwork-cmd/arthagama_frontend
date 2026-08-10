'use client'

import React from 'react'
import { useInstrument } from '@/src/context/InstrumentContext'
import { useFundamentals } from '@/src/hooks/terminal/useFundamentals'
import { Skeleton } from './Skeleton'

// ── Skeleton that matches the 6-cell ratios grid ──────────────────────────────
function FundamentalsLoadingSkeleton() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Skeleton height={11} width="65%" borderRadius={3} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        style={{ background: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '5px' }}
                    >
                        <Skeleton height={9} width="55%" borderRadius={2} />
                        <Skeleton height={13} borderRadius={2} />
                    </div>
                ))}
            </div>
            <Skeleton height={9} borderRadius={2} />
            <Skeleton height={9} width="88%" borderRadius={2} />
        </div>
    )
}

export default function FundamentalsWidget() {
    const { instrument } = useInstrument()
    const { fundamentals, loading, error } = useFundamentals(instrument)

    const fmt = (n?: number | null, d = 2) =>
        n === undefined || n === null || isNaN(n)
            ? '—'
            : n.toLocaleString('en-IN', { maximumFractionDigits: d })

    const compactCap = (n?: number | null) => {
        if (!n) return '—'
        if (n >= 1e7) return (n / 1e7).toFixed(2) + ' Cr'
        if (n >= 1e5) return (n / 1e5).toFixed(2) + ' L'
        return '₹' + Math.round(n).toLocaleString('en-IN')
    }

    const isUnavailable = !loading && !error && fundamentals && (fundamentals as any).available === false

    return (
        <div
            data-lenis-prevent
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>
                    Company Fundamentals
                </span>
                {!loading && fundamentals?.source && (
                    <span style={{ fontSize: '10px', color: '#a855f7', background: 'rgba(168,85,247,0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                        {fundamentals.source.toUpperCase()}
                    </span>
                )}
            </div>

            {/* Loading skeleton */}
            {loading && <FundamentalsLoadingSkeleton />}

            {/* Error state */}
            {!loading && error && (
                <div style={{ fontSize: '12px', color: 'var(--db-loss, #e0524b)', padding: '12px 0' }}>
                    {error}
                </div>
            )}

            {/* Data unavailable */}
            {isUnavailable && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '16px 0', color: '#7d848c' }}>
                    <span style={{ fontSize: '20px', opacity: 0.4 }}>⊘</span>
                    <span style={{ fontSize: '12px', fontWeight: 500 }}>Data Unavailable</span>
                    <span style={{ fontSize: '11px', color: '#555', textAlign: 'center' }}>
                        Fundamental data could not be retrieved for {instrument.symbol}
                    </span>
                </div>
            )}

            {/* Success state */}
            {!loading && !error && !isUnavailable && fundamentals && (
                <>
                    <div style={{ fontSize: '12px', color: '#7d848c' }}>
                        {fundamentals.sector
                            ? `${fundamentals.sector} · ${fundamentals.industry || ''}`
                            : instrument.displayName}
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '8px',
                            fontFamily: 'Consolas, monospace',
                            fontSize: '11.5px',
                        }}
                    >
                        {[
                            { label: 'Market Cap', value: compactCap(fundamentals.market_cap) },
                            { label: 'P/E Ratio', value: fmt(fundamentals.pe) },
                            { label: 'P/B Ratio', value: fmt(fundamentals.pb) },
                            { label: 'EPS', value: `₹${fmt(fundamentals.eps)}` },
                            { label: '52W High', value: `₹${fmt(fundamentals.week52_high)}`, color: 'var(--db-gain, #26a65b)' },
                            { label: '52W Low', value: `₹${fmt(fundamentals.week52_low)}`, color: 'var(--db-loss, #e0524b)' },
                        ].map(({ label, value, color }) => (
                            <div key={label} style={{ background: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: '6px' }}>
                                <div style={{ color: '#7d848c', fontSize: '10px' }}>{label}</div>
                                <div style={{ color: color || '#fff', fontWeight: 600, marginTop: '2px' }}>{value}</div>
                            </div>
                        ))}
                    </div>

                    {fundamentals.description && (
                        <div
                            style={{
                                fontSize: '11px',
                                color: '#7d848c',
                                lineHeight: '1.5',
                                maxHeight: '100px',
                                overflowY: 'auto',
                                paddingRight: '4px',
                                borderTop: '1px solid rgba(255,255,255,0.05)',
                                paddingTop: '8px',
                            }}
                        >
                            {fundamentals.description}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

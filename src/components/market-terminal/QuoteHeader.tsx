'use client'

import React from 'react'
import { useInstrument } from '@/src/context/InstrumentContext'
import { useQuote } from '@/src/hooks/terminal/useQuote'
import { Skeleton } from './Skeleton'

export default function QuoteHeader() {
    const { instrument } = useInstrument()
    const { quote, loading } = useQuote(instrument)

    const isUnavailable = !loading && quote && (quote as any).available === false

    const isBull = (quote?.change ?? 0) >= 0
    const changeColor = isBull ? 'var(--db-gain, #26a65b)' : 'var(--db-loss, #e0524b)'

    const fmt = (n?: number | null, d = 2) =>
        n === undefined || n === null || isNaN(n)
            ? '—'
            : n.toLocaleString('en-IN', { maximumFractionDigits: d })

    const compactVol = (n?: number | null) => {
        if (!n) return '—'
        if (n >= 1e7) return (n / 1e7).toFixed(2) + 'Cr'
        if (n >= 1e5) return (n / 1e5).toFixed(1) + 'L'
        if (n >= 1e3) return (n / 1e3).toFixed(1) + 'k'
        return String(n)
    }

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 16px',
                borderRadius: '8px',
                background: '#111417',
                border: '1px solid var(--db-border, rgba(255,255,255,0.08))',
                flexWrap: 'wrap',
                gap: '12px',
            }}
        >
            {/* Left: Instrument label + type badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff', letterSpacing: '0.02em' }}>
                    {instrument.displayName}
                </div>
                <span
                    style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: 'rgba(168,85,247,0.15)',
                        color: '#a855f7',
                        border: '1px solid rgba(168,85,247,0.3)',
                    }}
                >
                    {instrument.type} · {instrument.exchange}
                </span>
            </div>

            {/* Middle: LTP & change — skeleton while loading */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                {loading ? (
                    <>
                        <Skeleton width={90} height={24} borderRadius={4} />
                        <Skeleton width={70} height={16} borderRadius={3} />
                    </>
                ) : isUnavailable ? (
                    <span style={{ fontSize: '13px', color: '#555', fontStyle: 'italic' }}>Quote unavailable</span>
                ) : (
                    <>
                        <span style={{ fontSize: '20px', fontWeight: 700, color: '#fff', fontFamily: 'Consolas, monospace' }}>
                            ₹{fmt(quote?.last)}
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: changeColor, fontFamily: 'Consolas, monospace' }}>
                            {quote?.change != null ? (isBull ? '+' : '') : ''}
                            {fmt(quote?.change)} ({quote?.change_pct != null ? (isBull ? '+' : '') : ''}
                            {fmt(quote?.change_pct)}%)
                        </span>
                    </>
                )}
            </div>

            {/* Right: OHLCV summary — skeleton or data */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '11px', color: '#7d848c', fontFamily: 'Consolas, monospace' }}>
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} width={36} height={12} borderRadius={3} />)
                ) : !isUnavailable && quote ? (
                    <>
                        <div>O <span style={{ color: '#d6d9dc' }}>{fmt(quote?.open)}</span></div>
                        <div>H <span style={{ color: '#d6d9dc' }}>{fmt(quote?.high)}</span></div>
                        <div>L <span style={{ color: '#d6d9dc' }}>{fmt(quote?.low)}</span></div>
                        <div>V <span style={{ color: '#d6d9dc' }}>{compactVol(quote?.volume)}</span></div>
                        {quote?.source && (
                            <span style={{ fontSize: '9.5px', background: 'rgba(255,255,255,0.05)', padding: '2px 5px', borderRadius: '3px', color: '#a855f7' }}>
                                {quote.source.toUpperCase()}
                            </span>
                        )}
                    </>
                ) : null}
            </div>
        </div>
    )
}

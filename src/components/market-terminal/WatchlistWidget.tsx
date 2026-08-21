'use client'

import React, { useEffect, useState } from 'react'
import { useInstrument } from '@/src/context/InstrumentContext'
import { marketSdk } from '@/src/lib/terminal-sdk'
import { Quote, WatchlistCategory } from '@/src/types/terminal'
import { Skeleton } from './Skeleton'

function WatchlistSkeleton() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {Array.from({ length: 8 }).map((_, i) => (
                <div
                    key={i}
                    style={{
                        padding: '8px 10px',
                        borderRadius: '6px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.04)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <Skeleton width={60} height={11} borderRadius={2} />
                        <Skeleton width={30} height={9} borderRadius={2} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
                        <Skeleton width={52} height={11} borderRadius={2} />
                        <Skeleton width={36} height={9} borderRadius={2} />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default function WatchlistWidget() {
    const { instrument, selectBySymbol } = useInstrument()
    const [quotes, setQuotes] = useState<Quote[]>([])
    const [categories, setCategories] = useState<WatchlistCategory[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let isMounted = true

        const fetchWatchlist = () => {
            marketSdk
                .getWatchlist()
                .then((data) => {
                    if (isMounted) {
                        if (data.categorized && data.categorized.length > 0) {
                            setCategories(data.categorized)
                        }
                        setQuotes(data.quotes || (Array.isArray(data) ? data : []))
                        setLoading(false)
                    }
                })
                .catch(() => {
                    if (isMounted) setLoading(false)
                })
        }

        fetchWatchlist()
        const timer = setInterval(fetchWatchlist, 15000)

        return () => {
            isMounted = false
            clearInterval(timer)
        }
    }, [])

    const fmt = (n?: number | null) =>
        n === undefined || n === null || isNaN(n)
            ? '—'
            : n.toLocaleString('en-IN', { maximumFractionDigits: 2 })

    const mapInstrumentType = (itype?: string): 'equity' | 'index' | 'futures' | 'options' => {
        if (itype === 'index') return 'index'
        if (itype === 'future' || itype === 'futures') return 'futures'
        if (itype === 'option' || itype === 'options') return 'options'
        return 'equity'
    }

    const renderRow = (q: Quote) => {
        const isSelected = q.symbol === instrument.symbol
        const isUnavailable = (q as any).available === false
        const isBull = (q.change ?? 0) >= 0
        const changeCol = isBull ? 'var(--db-gain, #26a65b)' : 'var(--db-loss, #e0524b)'

        return (
            <div
                key={q.symbol}
                onClick={() =>
                    selectBySymbol(
                        q.symbol,
                        mapInstrumentType(q.instrument_type),
                        q.name || undefined,
                    )
                }
                style={{
                    padding: '8px 10px',
                    borderRadius: '6px',
                    background: isSelected ? 'rgba(168,85,247,0.18)' : 'rgba(255,255,255,0.02)',
                    border: '1px solid ' + (isSelected ? 'rgba(168,85,247,0.4)' : 'rgba(255,255,255,0.04)'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    opacity: isUnavailable ? 0.5 : 1,
                }}
            >
                <div>
                    <span style={{ fontWeight: 600, color: isSelected ? '#a855f7' : '#fff' }}>
                        {q.symbol}
                    </span>
                    <span style={{ fontSize: '10px', color: '#7d848c', marginLeft: '6px' }}>
                        {q.exchange}
                    </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                    {isUnavailable ? (
                        <div style={{ fontSize: '10px', color: '#444', fontStyle: 'italic' }}>—</div>
                    ) : (
                        <>
                            <div style={{ fontWeight: 600, color: '#fff' }}>₹{fmt(q.last)}</div>
                            <div style={{ fontSize: '10px', color: changeCol }}>
                                {q.change != null ? (isBull ? '+' : '') : ''}
                                {fmt(q.change_pct)}%
                            </div>
                        </>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div
            style={{
                borderRadius: '10px',
                background: '#111417',
                border: '1px solid var(--db-border, rgba(255,255,255,0.08))',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>
                    Market Watchlist
                </span>
            </div>

            {loading ? (
                <WatchlistSkeleton />
            ) : (
                <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'Consolas, monospace', fontSize: '11.5px' }}>
                    {categories.length > 0 ? (
                        categories.map((cat) => (
                            <div key={cat.instrument_type} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <div style={{ fontSize: '10px', color: '#7d848c', padding: '4px 8px 2px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    {cat.category}
                                </div>
                                {cat.items.map(renderRow)}
                            </div>
                        ))
                    ) : (
                        quotes.map(renderRow)
                    )}
                </div>
            )}
        </div>
    )
}

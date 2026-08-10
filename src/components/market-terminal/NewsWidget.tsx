'use client'

import React from 'react'
import { useInstrument } from '@/src/context/InstrumentContext'
import { useTerminalNews } from '@/src/hooks/terminal/useTerminalNews'
import { Skeleton } from './Skeleton'

function NewsSkeleton() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Array.from({ length: 4 }).map((_, i) => (
                <div
                    key={i}
                    style={{ padding: '10px', borderRadius: '6px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', flexDirection: 'column', gap: '6px' }}
                >
                    <Skeleton height={12} borderRadius={3} />
                    <Skeleton height={12} width="85%" borderRadius={3} />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Skeleton height={10} width="40%" borderRadius={2} />
                        <Skeleton height={10} width="20%" borderRadius={8} />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default function NewsWidget() {
    const { instrument } = useInstrument()
    const { news, loading, error } = useTerminalNews(instrument)

    const renderSentiment = (s?: number | null) => {
        if (s == null || isNaN(s)) return null
        if (s > 0.15)
            return <span style={{ fontSize: '9.5px', color: 'var(--db-gain, #26a65b)', background: 'rgba(38,166,91,0.15)', padding: '1px 5px', borderRadius: '3px', fontWeight: 600 }}>BULLISH (+{s.toFixed(2)})</span>
        if (s < -0.15)
            return <span style={{ fontSize: '9.5px', color: 'var(--db-loss, #e0524b)', background: 'rgba(224,82,75,0.15)', padding: '1px 5px', borderRadius: '3px', fontWeight: 600 }}>BEARISH ({s.toFixed(2)})</span>
        return <span style={{ fontSize: '9.5px', color: '#7d848c', background: 'rgba(255,255,255,0.05)', padding: '1px 5px', borderRadius: '3px' }}>NEUTRAL</span>
    }

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
                height: '340px',
                overflow: 'hidden',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>
                    {instrument.symbol} Market News
                </span>
                <span style={{ fontSize: '10px', color: '#7d848c' }}>RSS / GOOGLE NEWS</span>
            </div>

            {loading && <NewsSkeleton />}

            {!loading && error && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '20px 0', color: '#7d848c' }}>
                    <span style={{ fontSize: '20px', opacity: 0.4 }}>⊘</span>
                    <span style={{ fontSize: '12px' }}>News unavailable</span>
                </div>
            )}

            {!loading && !error && (
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '4px' }}>
                    {news.length === 0 && (
                        <div style={{ fontSize: '12px', color: '#555', textAlign: 'center', paddingTop: '20px' }}>
                            No news found for {instrument.symbol}
                        </div>
                    )}
                    {news.map((item, idx) => (
                        <a
                            key={`${item.link}-${idx}`}
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: 'block', padding: '10px', borderRadius: '6px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', textDecoration: 'none', transition: 'background 0.15s ease' }}
                        >
                            <div style={{ fontSize: '12px', fontWeight: 500, color: '#d6d9dc', lineHeight: '1.4' }}>
                                {item.title}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                                <span style={{ fontSize: '10px', color: '#7d848c' }}>
                                    {item.source} {item.published ? `· ${item.published.slice(0, 16)}` : ''}
                                </span>
                                {renderSentiment(item.sentiment)}
                            </div>
                        </a>
                    ))}
                </div>
            )}
        </div>
    )
}

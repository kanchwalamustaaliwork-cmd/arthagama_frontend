'use client'

import React from 'react'
import { SymbolCardResult } from '@/src/types/terminal'
import { Instrument } from '@/src/types/terminal'

interface Props {
    card: SymbolCardResult
    onSelect: (inst: Instrument) => void
}

const BADGE: Record<string, { label: string; color: string }> = {
    equity:  { label: 'EQ',   color: '#26a65b' },
    index:   { label: 'INDX', color: '#a855f7' },
    futures: { label: 'FUT',  color: '#ff9e00' },
    options: { label: 'OPT',  color: '#4a9fd4' },
}

export default function SearchResultSymbolCard({ card, onSelect }: Props) {
    const badges: { type: string; exchange: string; token?: string }[] = []

    for (const exch of ['NSE', 'BSE'] as const) {
        const slot = card[exch]
        if (!slot) continue
        if (slot.has_equity)  badges.push({ type: 'equity',  exchange: exch, token: slot.equity_token })
        if (slot.has_index)   badges.push({ type: 'index',   exchange: exch, token: slot.index_token })
        if (slot.has_futures) badges.push({ type: 'futures', exchange: exch })
        if (slot.has_options) badges.push({ type: 'options', exchange: exch })
    }

    return (
        <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
            <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#fff', fontFamily: 'Consolas, monospace', marginBottom: '6px' }}>
                {card.name}
                <span style={{ fontSize: '10.5px', color: '#7d848c', marginLeft: '6px' }}>{card.symbol}</span>
            </div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {badges.map((b, i) => {
                    const { label, color } = BADGE[b.type] || { label: b.type, color: '#888' }
                    return (
                        <button
                            key={i}
                            id={`symbol-card-${card.symbol}-${b.exchange}-${b.type}`}
                            onClick={() => onSelect({
                                symbol: card.symbol,
                                displayName: card.name,
                                type: b.type as any,
                                exchange: b.exchange,
                                token: b.token,
                            })}
                            style={{
                                fontSize: '10px',
                                fontWeight: 600,
                                color,
                                background: `${color}18`,
                                border: `1px solid ${color}40`,
                                borderRadius: '4px',
                                padding: '2px 7px',
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                            }}
                        >
                            {b.exchange} {label}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

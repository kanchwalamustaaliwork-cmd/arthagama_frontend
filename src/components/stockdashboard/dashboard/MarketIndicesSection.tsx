/**
 * src/components/stockdashboard/dashboard/MarketIndicesSection.tsx
 *
 * Market benchmark overview cards (NIFTY 50, SENSEX, BANK NIFTY, NIFTY IT).
 */

'use client'

import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { MarketIndex } from '@/src/types/stockdashboard'
import { formatPercentChange, getChangeColor } from '@/src/utils/stockdashboard/formatters'

export function MarketIndicesSection({ indices }: { indices: MarketIndex[] }) {
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '16px',
                marginBottom: '24px',
            }}
        >
            {indices.map(idx => {
                const isPos = idx.change >= 0
                return (
                    <div
                        key={idx.name}
                        style={{
                            background: 'var(--db-surface, #18282C)',
                            border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                            borderRadius: '14px',
                            padding: '16px 18px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)' }}>
                                {idx.name}
                            </span>
                            <span
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '3px',
                                    fontSize: '11.5px',
                                    fontWeight: 600,
                                    color: getChangeColor(idx.change),
                                }}
                            >
                                {isPos ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                                {formatPercentChange(idx.percentChange)}
                            </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <span
                                style={{
                                    fontSize: '22px',
                                    fontWeight: 700,
                                    fontFamily: 'Consolas, monospace',
                                    color: 'var(--db-text, #F7FAF9)',
                                }}
                            >
                                {idx.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </span>
                            <span style={{ fontSize: '11.5px', color: getChangeColor(idx.change), fontFamily: 'Consolas, monospace' }}>
                                {isPos ? '+' : ''}{idx.change.toFixed(2)}
                            </span>
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '11px',
                                color: 'var(--db-text-muted, #708482)',
                                paddingTop: '4px',
                                borderTop: '1px solid var(--db-border, rgba(184, 206, 194, 0.08))',
                            }}
                        >
                            <span>H: {idx.high.toFixed(1)}</span>
                            <span>L: {idx.low.toFixed(1)}</span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

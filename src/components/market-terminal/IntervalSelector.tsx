'use client'

import React from 'react'
import { Interval, INTERVALS, INTERVAL_LABELS } from '@/src/types/terminal'

interface IntervalSelectorProps {
    interval: Interval
    onChange: (interval: Interval) => void
}

export default function IntervalSelector({ interval, onChange }: IntervalSelectorProps) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {INTERVALS.map((item) => (
                <button
                    key={item}
                    onClick={() => onChange(item)}
                    style={{
                        padding: '4px 8px',
                        fontSize: '11px',
                        fontFamily: 'Consolas, monospace',
                        borderRadius: '4px',
                        border: '1px solid var(--db-border, rgba(255,255,255,0.1))',
                        background: item === interval ? 'rgba(168,85,247,0.2)' : 'transparent',
                        color: item === interval ? '#a855f7' : 'var(--db-text-muted, #7d848c)',
                        cursor: 'pointer',
                        fontWeight: item === interval ? 600 : 400,
                        transition: 'all 0.15s ease',
                    }}
                >
                    {INTERVAL_LABELS[item]}
                </button>
            ))}
        </div>
    )
}

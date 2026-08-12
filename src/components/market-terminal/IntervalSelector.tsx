'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Interval, INTERVAL_GROUPS, INTERVAL_LABELS } from '@/src/types/terminal/ohlcv'

interface IntervalSelectorProps {
    interval: Interval
    onChange: (interval: Interval) => void
}

const QUICK_INTERVALS: Interval[] = ['1m', '5m', '15m', '1h', '1d']

export default function IntervalSelector({ interval, onChange }: IntervalSelectorProps) {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelect = (selected: Interval) => {
        onChange(selected)
        setIsOpen(false)
    }

    const currentLabel = INTERVAL_LABELS[interval] || interval

    return (
        <div ref={containerRef} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {/* Quick Access Buttons */}
            {QUICK_INTERVALS.map((item) => (
                <button
                    key={item}
                    onClick={() => handleSelect(item)}
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
                    {item.toUpperCase()}
                </button>
            ))}

            {/* Dropdown Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    borderRadius: '4px',
                    border: '1px solid rgba(168,85,247,0.4)',
                    background: isOpen || !QUICK_INTERVALS.includes(interval) ? 'rgba(168,85,247,0.25)' : 'rgba(255,255,255,0.04)',
                    color: isOpen || !QUICK_INTERVALS.includes(interval) ? '#a855f7' : '#d6d9dc',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                }}
            >
                <span>{currentLabel}</span>
                <span style={{ fontSize: '9px', opacity: 0.7, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
                    ▼
                </span>
            </button>

            {/* Categorized Dropdown Popover */}
            {isOpen && (
                <div
                    data-lenis-prevent
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 6px)',
                        left: 0,
                        zIndex: 9999,
                        width: '320px',
                        maxHeight: '420px',
                        overflowY: 'auto',
                        background: '#161a1e',
                        border: '1px solid rgba(168,85,247,0.3)',
                        borderRadius: '8px',
                        boxShadow: '0 12px 32px rgba(0,0,0,0.75)',
                        padding: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                    }}
                >
                    {INTERVAL_GROUPS.map((group) => (
                        <div key={group.category} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div
                                style={{
                                    fontSize: '10px',
                                    fontWeight: 700,
                                    letterSpacing: '0.06em',
                                    color: '#7d848c',
                                    padding: '2px 6px',
                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                }}
                            >
                                {group.category}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px' }}>
                                {group.options.map((opt) => {
                                    const active = opt.value === interval
                                    return (
                                        <button
                                            key={opt.value}
                                            onClick={() => handleSelect(opt.value)}
                                            style={{
                                                textAlign: 'left',
                                                padding: '6px 8px',
                                                fontSize: '11px',
                                                fontFamily: 'Inter, sans-serif',
                                                borderRadius: '4px',
                                                border: active ? '1px solid rgba(168,85,247,0.4)' : '1px solid transparent',
                                                background: active ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.02)',
                                                color: active ? '#a855f7' : '#d6d9dc',
                                                cursor: 'pointer',
                                                fontWeight: active ? 600 : 400,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                transition: 'background 0.12s',
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'
                                            }}
                                        >
                                            <span>{opt.label}</span>
                                            <span style={{ fontSize: '9px', opacity: 0.4, fontFamily: 'Consolas, monospace' }}>
                                                {opt.value}
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

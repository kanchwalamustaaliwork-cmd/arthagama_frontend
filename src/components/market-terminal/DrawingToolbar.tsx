'use client'

import React from 'react'
import { ChartTool } from '@/src/lib/market-terminal/CandleChart'
import { MousePointer, TrendingUp, Minus, Layers, Trash2, Undo } from 'lucide-react'

interface DrawingToolbarProps {
    tool: ChartTool
    onSelectTool: (tool: ChartTool) => void
    onClear: () => void
    onUndo: () => void
}

export default function DrawingToolbar({ tool, onSelectTool, onClear, onUndo }: DrawingToolbarProps) {
    const tools: { id: ChartTool; label: string; icon: React.ElementType }[] = [
        { id: 'none', label: 'Crosshair', icon: MousePointer },
        { id: 'trend', label: 'Trend Line', icon: TrendingUp },
        { id: 'hray', label: 'Price Ray', icon: Minus },
        { id: 'fib', label: 'Fib Retracements', icon: Layers },
    ]

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--db-border, rgba(255,255,255,0.08))',
            }}
        >
            {tools.map(({ id, label, icon: Icon }) => (
                <button
                    key={id}
                    onClick={() => onSelectTool(id)}
                    title={label}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '26px',
                        height: '26px',
                        borderRadius: '4px',
                        border: 'none',
                        background: tool === id ? 'rgba(168,85,247,0.25)' : 'transparent',
                        color: tool === id ? '#a855f7' : 'var(--db-text-muted, #7d848c)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                    }}
                >
                    <Icon size={14} />
                </button>
            ))}
            <div style={{ width: '1px', height: '16px', background: 'var(--db-border, rgba(255,255,255,0.1))', margin: '0 4px' }} />
            <button
                onClick={onUndo}
                title="Undo Drawing"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '26px',
                    height: '26px',
                    borderRadius: '4px',
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--db-text-muted, #7d848c)',
                    cursor: 'pointer',
                }}
            >
                <Undo size={14} />
            </button>
            <button
                onClick={onClear}
                title="Clear All Drawings"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '26px',
                    height: '26px',
                    borderRadius: '4px',
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--db-loss, #e0524b)',
                    cursor: 'pointer',
                }}
            >
                <Trash2 size={14} />
            </button>
        </div>
    )
}

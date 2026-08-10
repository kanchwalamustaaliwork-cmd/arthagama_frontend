'use client'

import React, { useState } from 'react'
import { EXAMPLES } from '@/src/lib/market-terminal/pine/examples'
import { Code, Play, X, Check } from 'lucide-react'

interface IndicatorEditorProps {
    isOpen: boolean
    onClose: () => void
    onApplyScript: (script: string) => void
    currentScript?: string
}

export default function IndicatorEditor({
    isOpen,
    onClose,
    onApplyScript,
    currentScript = EXAMPLES[0].src,
}: IndicatorEditorProps) {
    const [script, setScript] = useState(currentScript)

    if (!isOpen) return null

    const handleApply = () => {
        onApplyScript(script)
        onClose()
    }

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 999,
                background: 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
            }}
        >
            <div
                style={{
                    width: '100%',
                    maxWidth: '720px',
                    borderRadius: '12px',
                    background: '#111417',
                    border: '1px solid var(--db-border, rgba(255,255,255,0.12))',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                }}
            >
                {/* Header */}
                <div
                    style={{
                        padding: '14px 18px',
                        borderBottom: '1px solid var(--db-border, rgba(255,255,255,0.1))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Code size={18} color="#a855f7" />
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff', letterSpacing: '0.02em' }}>
                            Pine Script™ Indicator Editor
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        style={{ background: 'none', border: 'none', color: '#7d848c', cursor: 'pointer' }}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Templates strip */}
                <div
                    style={{
                        padding: '10px 18px',
                        background: 'rgba(255,255,255,0.02)',
                        borderBottom: '1px solid var(--db-border, rgba(255,255,255,0.06))',
                        display: 'flex',
                        gap: '6px',
                        overflowX: 'auto',
                    }}
                >
                    <span style={{ fontSize: '11px', color: '#7d848c', alignSelf: 'center', marginRight: '4px' }}>
                        Presets:
                    </span>
                    {EXAMPLES.map((ex) => (
                        <button
                            key={ex.name}
                            onClick={() => setScript(ex.src)}
                            style={{
                                padding: '4px 10px',
                                fontSize: '11px',
                                borderRadius: '4px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(255,255,255,0.04)',
                                color: '#d6d9dc',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {ex.name}
                        </button>
                    ))}
                </div>

                {/* Code Textarea */}
                <div style={{ padding: '16px', flex: 1 }}>
                    <textarea
                        value={script}
                        onChange={(e) => setScript(e.target.value)}
                        placeholder="Write Pine script here..."
                        style={{
                            width: '100%',
                            height: '260px',
                            background: '#0a0c0e',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            padding: '12px',
                            color: '#26a65b',
                            fontFamily: 'Consolas, monospace',
                            fontSize: '12.5px',
                            lineHeight: '1.6',
                            resize: 'none',
                            outline: 'none',
                        }}
                    />
                </div>

                {/* Footer action */}
                <div
                    style={{
                        padding: '12px 18px',
                        borderTop: '1px solid var(--db-border, rgba(255,255,255,0.1))',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '10px',
                    }}
                >
                    <button
                        onClick={onClose}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '6px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            background: 'transparent',
                            color: '#7d848c',
                            fontSize: '12px',
                            cursor: 'pointer',
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleApply}
                        style={{
                            padding: '8px 18px',
                            borderRadius: '6px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
                            color: '#fff',
                            fontSize: '12px',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer',
                        }}
                    >
                        <Play size={14} /> Apply Indicator
                    </button>
                </div>
            </div>
        </div>
    )
}

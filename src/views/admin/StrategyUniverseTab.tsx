'use client'

import type { AdminStrategy } from '@/src/types/admin'
import { useStrategyContext } from '@/src/context/StrategyContext'
import { Info, Globe, Cpu } from 'lucide-react'

interface Props {
    strategy?: AdminStrategy
}

export default function StrategyUniverseTab({ strategy: propStrategy }: Props = {}) {
    const ctx = useStrategyContext()
    const strategy = propStrategy || ctx.strategy

    if (!strategy) return null

    const isCustom = strategy.universeType === 'custom'
    const instrumentsList = strategy.instruments
        ? strategy.instruments.split(',').map(s => s.trim()).filter(Boolean)
        : []

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
                <h3 style={{ fontSize: '15px', fontWeight: 650, color: 'var(--db-text)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Globe size={16} color="var(--db-mint)" />
                    Universe: {strategy.universeName || 'Unconfigured'}
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--db-text-muted)' }}>
                    Type: <strong style={{ textTransform: 'capitalize', color: 'var(--db-text-2)' }}>{strategy.universeType || 'default'}</strong>
                </span>
            </div>

            {isCustom ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--db-text-2)' }}>Instruments in this universe:</span>
                    {instrumentsList.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
                            {instrumentsList.map((inst, idx) => (
                                <div 
                                    key={`${inst}-${idx}`}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '10px 14px',
                                        background: 'var(--db-elevated)',
                                        border: '1px solid var(--db-border)',
                                        borderRadius: 'var(--db-radius-md)',
                                        color: 'var(--db-text)',
                                        fontFamily: 'monospace',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        letterSpacing: '0.03em',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                    }}
                                >
                                    {inst}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ fontSize: '12px', color: 'var(--db-text-muted)', fontStyle: 'italic' }}>
                            No instruments defined for this custom universe.
                        </div>
                    )}
                </div>
            ) : (
                <div style={{ padding: '20px 24px', background: 'var(--db-elevated)', border: '1px solid var(--db-border)', borderRadius: 'var(--db-radius-md)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Cpu size={18} color="var(--db-mint)" />
                    <span style={{ fontSize: '13.5px', color: 'var(--db-text-2)', fontWeight: 500 }}>
                        This strategy uses the selected default universe.
                    </span>
                </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: 'rgba(95, 175, 215, 0.05)', border: '1px solid rgba(95, 175, 215, 0.15)', borderRadius: 'var(--db-radius-md)' }}>
                <Info size={14} color="var(--db-info)" />
                <span style={{ fontSize: '12px', color: 'var(--db-text-2)' }}>
                    {isCustom 
                        ? `Total active target count: ${instrumentsList.length} instruments. Executed order triggers evaluate against this set on tick triggers.`
                        : `Executed order triggers evaluate against the constituents of the selected default universe.`
                    }
                </span>
            </div>
        </div>
    )
}

'use client'

import Badge from './ui/Badge'
import Button from './ui/Button'
import { Eye, Edit2, PlayCircle, Copy, Rocket } from 'lucide-react'

export interface Strategy {
    id: string
    name: string
    status: 'active' | 'draft' | 'paused' | 'archived'
    pnl: number
    pnlPct: number
    winRate: number
    totalTrades: number
    drawdown: number
    lastUpdated: string
    instruments?: string[]
}

const STATUS_VARIANT: Record<Strategy['status'], 'success' | 'warning' | 'neutral' | 'error'> = {
    active:   'success',
    draft:    'warning',
    paused:   'neutral',
    archived: 'error',
}

interface StrategyCardProps {
    strategy: Strategy
    onView?:     (s: Strategy) => void
    onEdit?:     (s: Strategy) => void
    onBacktest?: (s: Strategy) => void
    onClone?:    (s: Strategy) => void
    onDeploy?:   (s: Strategy) => void
}

export default function StrategyCard({ strategy, onView, onEdit, onBacktest, onClone, onDeploy }: StrategyCardProps) {
    const isProfitable = strategy.pnl >= 0

    return (
        <div className="db-card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--db-text)', marginBottom: '4px' }}>
                        {strategy.name}
                    </h3>
                    {strategy.instruments && (
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            {strategy.instruments.slice(0, 3).map(inst => (
                                <span key={inst} className="db-badge db-badge-neutral" style={{ fontSize: '10px' }}>{inst}</span>
                            ))}
                        </div>
                    )}
                </div>
                <Badge variant={STATUS_VARIANT[strategy.status]} dot>
                    {strategy.status.charAt(0).toUpperCase() + strategy.status.slice(1)}
                </Badge>
            </div>

            {/* Metrics grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {[
                    {
                        label: 'P&L',
                        value: `${isProfitable ? '+' : ''}₹${Math.abs(strategy.pnl).toLocaleString('en-IN')}`,
                        sub: `${isProfitable ? '+' : ''}${strategy.pnlPct.toFixed(1)}%`,
                        color: isProfitable ? 'var(--db-profit)' : 'var(--db-loss)',
                    },
                    {
                        label: 'Win Rate',
                        value: `${strategy.winRate}%`,
                        sub: `${strategy.totalTrades} trades`,
                        color: strategy.winRate >= 55 ? 'var(--db-profit)' : 'var(--db-text)',
                    },
                    {
                        label: 'Drawdown',
                        value: `${strategy.drawdown.toFixed(1)}%`,
                        sub: 'Max DD',
                        color: strategy.drawdown > 15 ? 'var(--db-loss)' : 'var(--db-text)',
                    },
                ].map(m => (
                    <div
                        key={m.label}
                        style={{
                            background: 'var(--db-elevated)',
                            borderRadius: '10px',
                            padding: '10px 12px',
                        }}
                    >
                        <div style={{ fontSize: '10px', color: 'var(--db-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px' }}>
                            {m.label}
                        </div>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: m.color, letterSpacing: '-0.01em' }}>
                            {m.value}
                        </div>
                        <div style={{ fontSize: '10.5px', color: 'var(--db-text-muted)', marginTop: '2px' }}>
                            {m.sub}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer: last updated + actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--db-border)' }}>
                <span style={{ fontSize: '11px', color: 'var(--db-text-muted)' }}>
                    Updated {strategy.lastUpdated}
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                    {[
                        { icon: Eye,        label: 'View',     cb: onView },
                        { icon: Edit2,      label: 'Edit',     cb: onEdit },
                        { icon: PlayCircle, label: 'Backtest', cb: onBacktest },
                        { icon: Copy,       label: 'Clone',    cb: onClone },
                        { icon: Rocket,     label: 'Deploy',   cb: onDeploy },
                    ].map(({ icon: Icon, label, cb }) => (
                        <button
                            key={label}
                            onClick={() => cb?.(strategy)}
                            title={label}
                            className="db-btn db-btn-ghost db-btn-sm"
                            style={{ padding: '5px', borderRadius: '8px' }}
                            aria-label={label}
                        >
                            <Icon size={14} />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

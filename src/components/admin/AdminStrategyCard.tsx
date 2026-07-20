'use client'

import { useState } from 'react'
import type { AdminStrategy, AdminStrategyStatus } from '@/src/types/admin'
import Badge from '@/src/components/dashboard/ui/Badge'
import ConfirmDialog from '@/src/components/admin/ConfirmDialog'
import { Play, Pause, Edit2, Trash2, Eye, Server, Globe, Calendar, RefreshCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'

const STATUS_VARIANT: Record<AdminStrategyStatus, 'success' | 'warning' | 'neutral' | 'error'> = {
    running:  'success',
    paused:   'warning',
    draft:    'neutral',
    error:    'error',
    archived: 'error',
}

const STATUS_LABEL: Record<AdminStrategyStatus, string> = {
    running:  'Running',
    paused:   'Paused',
    draft:    'Draft',
    error:    'Error',
    archived: 'Archived',
}

interface AdminStrategyCardProps {
    strategy: AdminStrategy
    onStatusChange?: (id: string, action: 'start' | 'stop' | 'archive') => void
    onToggleActive?: (id: string) => void
    onDelete?: (id: string) => void
}

export default function AdminStrategyCard({ strategy, onStatusChange, onToggleActive, onDelete }: AdminStrategyCardProps) {
    const router = useRouter()
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const metrics = strategy.metrics || {
        totalReturn: 0,
        totalPnL: 0,
        todayPnL: 0,
        activeHoldings: 0,
        winRate: 0,
        sharpeRatio: 0,
        averageHoldingTime: 0,
    }
    const netPnl = metrics.totalPnL
    const isProfit = netPnl >= 0

    const fmtCurrency = (v: number) =>
        `${v >= 0 ? '+' : ''}₹${Math.abs(v).toLocaleString('en-IN')}`

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        setShowDeleteConfirm(true)
    }

    const handleDeleteConfirm = () => {
        setShowDeleteConfirm(false)
        if (onDelete) {
            onDelete(strategy.id)
        }
    }

    return (
        <div
            className="db-card"
            style={{ 
                padding: '20px 22px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '16px', 
                cursor: 'pointer', 
                transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                position: 'relative',
                boxShadow: 'var(--db-shadow-sm)'
            }}
            onClick={() => router.push(`/admin/strategies/${strategy.id}`)}
            onMouseEnter={e => { 
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; 
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--db-border-hover)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'var(--db-shadow-md)';
            }}
            onMouseLeave={e => { 
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; 
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--db-border)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'var(--db-shadow-sm)';
            }}
        >
            {/* Top row: Title and Status Badge */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--db-text)', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {strategy.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span className="db-badge db-badge-teal" style={{ fontSize: '10px', padding: '2px 8px', fontWeight: 600 }}>{strategy.category}</span>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <Badge variant={STATUS_VARIANT[strategy.status]} dot>
                        {STATUS_LABEL[strategy.status]}
                    </Badge>
                </div>
            </div>

            {/* Quick Summary description */}
            {strategy.summary && (
                <p style={{ fontSize: '12px', color: 'var(--db-text-muted)', fontStyle: 'italic', lineHeight: 1.4, margin: '0' }}>
                    &ldquo;{strategy.summary}&rdquo;
                </p>
            )}

            {/* Description */}
            <p style={{ fontSize: '12.5px', color: 'var(--db-text-2)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: '0' }}>
                {strategy.description}
            </p>

            {/* Database & Universe indicators */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '10px 12px', background: 'var(--db-elevated)', borderRadius: 'var(--db-radius-md)', border: '1px solid var(--db-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Server size={12} color="var(--db-text-muted)" />
                    <span style={{ fontSize: '11.5px', color: 'var(--db-text-muted)' }}>Database:</span>
                    <span style={{ fontSize: '11.5px', fontWeight: 500, color: 'var(--db-text-2)', fontFamily: 'monospace' }}>{strategy.databaseName}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Globe size={12} color="var(--db-text-muted)" />
                    <span style={{ fontSize: '11.5px', color: 'var(--db-text-muted)' }}>Universe:</span>
                    <span style={{ fontSize: '11.5px', fontWeight: 500, color: 'var(--db-text-2)' }}>{strategy.universeName}</span>
                </div>
            </div>

            {/* Metrics grid - 2 rows x 3 columns */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {[
                    { label: 'Net P&L', value: fmtCurrency(netPnl), color: isProfit ? 'var(--db-profit)' : 'var(--db-loss)' },
                    { label: 'Return', value: `${metrics.totalReturn?.toFixed(1)}%`, color: metrics.totalReturn >= 0 ? 'var(--db-profit)' : 'var(--db-loss)' },
                    { label: 'Win Rate', value: `${metrics.winRate?.toFixed(1)}%`, color: 'var(--db-text)' },
                    { label: 'Holdings', value: String(metrics.activeHoldings), color: 'var(--db-text)' },
                    { label: 'Sharpe Ratio', value: metrics.sharpeRatio?.toFixed(2), color: 'var(--db-text)' },
                    { label: 'Today\'s P&L', value: fmtCurrency(metrics.todayPnL), color: metrics.todayPnL >= 0 ? 'var(--db-profit)' : 'var(--db-loss)' }
                ].map(m => (
                    <div key={m.label} style={{ background: 'var(--db-elevated)', borderRadius: '8px', padding: '6px 8px', border: '1px solid var(--db-border)' }}>
                        <div style={{ fontSize: '9px', color: 'var(--db-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.label}</div>
                        <div style={{ fontSize: '12.5px', fontWeight: 700, color: m.color }}>{m.value}</div>
                    </div>
                ))}
            </div>

            {/* Footer row: Active Toggle Switch, Last Updated & Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--db-border)', flexWrap: 'wrap', gap: '8px' }}>
                {/* Active switch */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={e => e.stopPropagation()}>
                    <label style={{ position: 'relative', display: 'inline-block', width: '28px', height: '16px' }}>
                        <input 
                            type="checkbox" 
                            checked={strategy.isActive} 
                            onChange={() => onToggleActive?.(strategy.id)}
                            style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{ 
                            position: 'absolute', 
                            cursor: 'pointer', 
                            inset: 0, 
                            backgroundColor: strategy.isActive ? 'var(--db-profit)' : 'rgba(255,255,255,0.15)',
                            transition: '0.2s',
                            borderRadius: '16px'
                        }}>
                            <span style={{ 
                                position: 'absolute', 
                                content: '""', 
                                height: '12px', 
                                width: '12px', 
                                left: strategy.isActive ? '14px' : '2px', 
                                bottom: '2px', 
                                backgroundColor: 'white',
                                transition: '0.2s',
                                borderRadius: '50%'
                            }} />
                        </span>
                    </label>
                    <span style={{ fontSize: '11px', fontWeight: 500, color: strategy.isActive ? 'var(--db-profit)' : 'var(--db-text-muted)' }}>
                        {strategy.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={e => e.stopPropagation()}>
                    <span style={{ fontSize: '11px', color: 'var(--db-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <RefreshCcw size={10} /> {new Date(strategy.updatedAt).toLocaleDateString('en-IN')}
                    </span>
                    <div style={{ display: 'flex', gap: '2px' }}>
                        <button 
                            onClick={() => router.push(`/admin/strategies/${strategy.id}`)} 
                            title="Open Strategy" 
                            className="db-btn db-btn-ghost db-btn-sm" 
                            style={{ padding: '6px', borderRadius: '6px', color: 'var(--db-mint)' }}
                        >
                            <Eye size={13} />
                        </button>
                        {strategy.status === 'paused' || strategy.status === 'draft' ? (
                            <button 
                                onClick={() => onStatusChange?.(strategy.id, 'start')} 
                                title="Start Engine" 
                                className="db-btn db-btn-ghost db-btn-sm" 
                                style={{ padding: '6px', borderRadius: '6px', color: 'var(--db-profit)' }}
                            >
                                <Play size={13} />
                            </button>
                        ) : strategy.status === 'running' ? (
                            <button 
                                onClick={() => onStatusChange?.(strategy.id, 'stop')} 
                                title="Stop Engine" 
                                className="db-btn db-btn-ghost db-btn-sm" 
                                style={{ padding: '6px', borderRadius: '6px', color: 'var(--db-warning)' }}
                            >
                                <Pause size={13} />
                            </button>
                        ) : null}
                        <button 
                            onClick={() => router.push(`/admin/strategies/${strategy.id}/settings`)} 
                            title="Configure Settings" 
                            className="db-btn db-btn-ghost db-btn-sm" 
                            style={{ padding: '6px', borderRadius: '6px' }}
                        >
                            <Edit2 size={13} />
                        </button>
                        <button 
                            onClick={handleDeleteClick} 
                            title="Delete Strategy" 
                            className="db-btn db-btn-ghost db-btn-sm" 
                            style={{ padding: '6px', borderRadius: '6px', color: 'var(--db-loss)' }}
                        >
                            <Trash2 size={13} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Confirm Deletion */}
            <ConfirmDialog 
                open={showDeleteConfirm}
                title="Delete Strategy?"
                message={`Are you sure you want to delete "${strategy.name}"? This action cannot be undone.`}
                confirmLabel="Delete"
                cancelLabel="Cancel"
                variant="danger"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </div>
    )
}

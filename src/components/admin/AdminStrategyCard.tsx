'use client'

import type { AdminStrategy, AdminStrategyStatus } from '@/src/types/admin'
import Badge from '@/src/components/dashboard/ui/Badge'
import { Play, Pause, Edit2, Archive, Eye, User } from 'lucide-react'
import { useRouter } from 'next/navigation'

const STATUS_VARIANT: Record<AdminStrategyStatus, 'success' | 'warning' | 'neutral' | 'error'> = {
    running:  'success',
    paused:   'warning',
    draft:    'neutral',
    archived: 'error',
}

const STATUS_LABEL: Record<AdminStrategyStatus, string> = {
    running:  'Running',
    paused:   'Paused',
    draft:    'Draft',
    archived: 'Archived',
}

interface AdminStrategyCardProps {
    strategy: AdminStrategy
    onStatusChange?: (id: string, action: 'start' | 'stop' | 'archive') => void
}

export default function AdminStrategyCard({ strategy, onStatusChange }: AdminStrategyCardProps) {
    const router = useRouter()
    const netPnl = strategy.totalProfit - strategy.totalLoss
    const isProfit = netPnl >= 0

    const fmtCurrency = (v: number) =>
        `${v >= 0 ? '+' : ''}₹${Math.abs(v).toLocaleString('en-IN')}`

    return (
        <div
            className="db-card"
            style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '14px', cursor: 'pointer', transition: 'transform 0.15s ease, border-color 0.15s ease' }}
            onClick={() => router.push(`/admin/strategies/${strategy.id}`)}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--db-border-hover)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--db-border)' }}
        >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--db-text)', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{strategy.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '11px', color: 'var(--db-text-muted)' }}>{strategy.version}</span>
                        {strategy.instruments.slice(0, 2).map(inst => (
                            <span key={inst} className="db-badge db-badge-neutral" style={{ fontSize: '10px' }}>{inst}</span>
                        ))}
                        {strategy.instruments.length > 2 && <span style={{ fontSize: '10px', color: 'var(--db-text-muted)' }}>+{strategy.instruments.length - 2}</span>}
                    </div>
                </div>
                <Badge variant={STATUS_VARIANT[strategy.status]} dot>
                    {STATUS_LABEL[strategy.status]}
                </Badge>
            </div>

            {/* Assigned user */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--db-elevated)', border: '1px solid var(--db-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={11} color="var(--db-text-muted)" />
                </div>
                <span style={{ fontSize: '12px', color: 'var(--db-text-2)' }}>{strategy.assignedUserName}</span>
            </div>

            {/* Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {[
                    { label: 'Net P&L', value: fmtCurrency(netPnl), color: isProfit ? 'var(--db-profit)' : 'var(--db-loss)' },
                    { label: 'Holdings', value: String(strategy.holdingsCount), color: 'var(--db-text)' },
                    { label: 'Win Rate', value: strategy.totalBuyOrders > 0 ? `${Math.round((strategy.openPositions / strategy.totalBuyOrders) * 100)}%` : '—', color: 'var(--db-text)' },
                ].map(m => (
                    <div key={m.label} style={{ background: 'var(--db-elevated)', borderRadius: '10px', padding: '8px 10px' }}>
                        <div style={{ fontSize: '10px', color: 'var(--db-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px' }}>{m.label}</div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: m.color }}>{m.value}</div>
                    </div>
                ))}
            </div>

            {/* Footer: actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--db-border)' }}>
                <span style={{ fontSize: '11px', color: 'var(--db-text-muted)' }}>Updated {new Date(strategy.updatedAt).toLocaleDateString('en-IN')}</span>
                <div style={{ display: 'flex', gap: '4px' }} onClick={e => e.stopPropagation()}>
                    <button onClick={() => router.push(`/admin/strategies/${strategy.id}`)} title="View" className="db-btn db-btn-ghost db-btn-sm" style={{ padding: '5px', borderRadius: '8px' }}>
                        <Eye size={14} />
                    </button>
                    {strategy.status === 'paused' || strategy.status === 'draft' ? (
                        <button onClick={() => onStatusChange?.(strategy.id, 'start')} title="Start" className="db-btn db-btn-ghost db-btn-sm" style={{ padding: '5px', borderRadius: '8px', color: 'var(--db-profit)' }}>
                            <Play size={14} />
                        </button>
                    ) : strategy.status === 'running' ? (
                        <button onClick={() => onStatusChange?.(strategy.id, 'stop')} title="Stop" className="db-btn db-btn-ghost db-btn-sm" style={{ padding: '5px', borderRadius: '8px', color: 'var(--db-warning)' }}>
                            <Pause size={14} />
                        </button>
                    ) : null}
                    <button onClick={() => router.push(`/admin/strategies/${strategy.id}/edit`)} title="Edit" className="db-btn db-btn-ghost db-btn-sm" style={{ padding: '5px', borderRadius: '8px' }}>
                        <Edit2 size={14} />
                    </button>
                    {strategy.status !== 'archived' && (
                        <button onClick={() => onStatusChange?.(strategy.id, 'archive')} title="Archive" className="db-btn db-btn-ghost db-btn-sm" style={{ padding: '5px', borderRadius: '8px', color: 'var(--db-text-muted)' }}>
                            <Archive size={14} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

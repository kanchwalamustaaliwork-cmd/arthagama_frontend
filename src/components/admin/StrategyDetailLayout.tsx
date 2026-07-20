'use client'

/**
 * src/components/admin/StrategyDetailLayout.tsx
 *
 * The canonical, reusable layout for ALL strategy detail pages.
 *
 * This layout renders:
 *   - Strategy header (name, description, status, version, assigned user)
 *   - Action toolbar (Start / Stop / Edit / Duplicate / Archive)
 *   - Tab navigation (Overview | Holdings | Analysis | Logs | Edit)
 *   - Children slot for the active tab content
 *
 * Every current and future strategy page should use this layout.
 * Add new tabs to StrategyTabs.tsx without touching this file.
 */

import type { AdminStrategy } from '@/src/types/admin'
import type { AdminStrategyStatus } from '@/src/types/admin'
import Badge from '@/src/components/dashboard/ui/Badge'
import Button from '@/src/components/dashboard/ui/Button'
import StrategyTabs from './StrategyTabs'
import LoadingState from '@/src/components/dashboard/ui/LoadingState'
import EmptyState from '@/src/components/dashboard/ui/EmptyState'
import { useRouter } from 'next/navigation'
import {
    Play, Square, Edit2, Copy, Archive, User, Calendar, Tag,
    AlertCircle,
} from 'lucide-react'

const STATUS_VARIANT: Record<AdminStrategyStatus, 'success' | 'warning' | 'neutral' | 'error'> = {
    running:  'success',
    paused:   'warning',
    draft:    'neutral',
    error:    'error',
    archived: 'error',
}

const STATUS_LABEL: Record<AdminStrategyStatus, string> = {
    running: 'Running', paused: 'Paused', draft: 'Draft', error: 'Error', archived: 'Archived',
}

interface StrategyDetailLayoutProps {
    strategy: AdminStrategy | null
    loading?: boolean
    error?: boolean
    onStatusChange?: (action: 'start' | 'stop' | 'archive') => void
    children: React.ReactNode
}

export default function StrategyDetailLayout({
    strategy,
    loading,
    error,
    onStatusChange,
    children,
}: StrategyDetailLayoutProps) {
    const router = useRouter()

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1200px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '14px' }}>
                    <LoadingState variant="skeleton-card" count={4} />
                </div>
                <LoadingState variant="skeleton-table" />
            </div>
        )
    }

    if (error || !strategy) {
        return (
            <EmptyState
                icon={AlertCircle}
                title="Strategy not found"
                description="This strategy may have been archived or the URL is incorrect."
                actionLabel="Back to Strategies"
                onAction={() => router.push('/admin/strategies')}
            />
        )
    }

    const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1300px' }}>

            {/* ── Strategy Header ── */}
            <div className="db-card" style={{ padding: '24px 28px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                    {/* Left: identity */}
                    <div style={{ flex: 1, minWidth: '260px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                            <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--db-text)', letterSpacing: '-0.01em' }}>{strategy.name}</h1>
                            <Badge variant={STATUS_VARIANT[strategy.status]} dot>{STATUS_LABEL[strategy.status]}</Badge>
                            <span className="db-badge db-badge-teal">{strategy.category}</span>
                        </div>
                        <p style={{ fontSize: '13px', color: 'var(--db-text-2)', lineHeight: 1.6, marginBottom: '14px', maxWidth: '600px' }}>
                            {strategy.description}
                        </p>
                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                            {[
                                { icon: User, label: strategy.ownerAdminName || 'Unassigned Admin' },
                                { icon: Calendar, label: `Created ${fmtDate(strategy.createdAt)}` },
                                { icon: Tag, label: `Updated ${fmtDate(strategy.updatedAt)}` },
                            ].map(({ icon: Icon, label }) => (
                                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Icon size={13} color="var(--db-text-muted)" />
                                    <span style={{ fontSize: '12px', color: 'var(--db-text-muted)' }}>{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: action toolbar */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                        {strategy.status === 'running' ? (
                            <Button variant="secondary" size="sm" onClick={() => onStatusChange?.('stop')}>
                                <Square size={13} /> Stop
                            </Button>
                        ) : strategy.status !== 'archived' ? (
                            <Button variant="primary" size="sm" onClick={() => onStatusChange?.('start')}>
                                <Play size={13} /> Start
                            </Button>
                        ) : null}
                        <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/strategies/${strategy.id}/edit`)}>
                            <Edit2 size={13} /> Edit
                        </Button>
                        <Button variant="ghost" size="sm">
                            <Copy size={13} /> Duplicate
                        </Button>
                        {strategy.status !== 'archived' && (
                            <Button variant="danger" size="sm" onClick={() => onStatusChange?.('archive')}>
                                <Archive size={13} /> Archive
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Tabs ── */}
            <div className="db-card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '0 24px' }}>
                    <StrategyTabs strategyId={strategy.id} />
                </div>
                <div style={{ padding: '24px' }}>
                    {children}
                </div>
            </div>
        </div>
    )
}

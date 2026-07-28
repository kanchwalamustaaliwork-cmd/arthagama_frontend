import React from 'react'
import type { StrategyMetrics } from '@/src/types/admin'
import { METRICS_SECTIONS_CONFIG } from './metricsConfig'
import MetricSection from './MetricSection'
import LoadingState from '@/src/components/dashboard/ui/LoadingState'
import EmptyState from '@/src/components/dashboard/ui/EmptyState'
import Badge from '@/src/components/dashboard/ui/Badge'
import Button from '@/src/components/dashboard/ui/Button'
import { RefreshCw, RotateCw, AlertTriangle, Activity } from 'lucide-react'
import { formatTimestamp } from '@/src/utils/metrics'

interface MetricsGridProps {
    metrics: StrategyMetrics | null
    loading: boolean
    recalculating: boolean
    error: string | null
    onRefresh: () => void
    onRecalculate: () => void
    lastUpdated: Date | null
}

export default function MetricsGrid({
    metrics,
    loading,
    recalculating,
    error,
    onRefresh,
    onRecalculate,
    lastUpdated,
}: MetricsGridProps) {
    const isBusy = loading || recalculating

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Main Header Bar with Status Indicator & Actions */}
            <div
                className="db-card"
                style={{
                    padding: '16px 20px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    borderLeft: '4px solid var(--db-mint)',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: 'var(--db-elevated)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Activity size={18} color="var(--db-mint)" />
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--db-text)' }}>
                                Strategy Hybrid Metrics
                            </h2>
                            <Badge variant="success">🟢 Live Dynamic + Cached Static</Badge>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--db-text-muted)', marginTop: '2px' }}>
                            {lastUpdated
                                ? `Last updated: ${formatTimestamp(lastUpdated.toISOString())}`
                                : 'Fetching real-time and cached metrics...'}
                        </p>
                    </div>
                </div>

                {/* Control Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={onRecalculate}
                        disabled={isBusy}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                        <RotateCw
                            size={14}
                            className={recalculating ? 'animate-spin' : ''}
                            style={{ animation: recalculating ? 'dbspin 1s linear infinite' : 'none' }}
                        />
                        {recalculating ? 'Recalculating...' : 'Recalculate'}
                    </Button>

                    <Button
                        variant="primary"
                        size="sm"
                        onClick={onRefresh}
                        disabled={isBusy}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                        <RefreshCw
                            size={14}
                            style={{ animation: loading && !recalculating ? 'dbspin 1s linear infinite' : 'none' }}
                        />
                        {loading && !recalculating ? 'Refreshing...' : 'Refresh Metrics'}
                    </Button>
                </div>
            </div>

            {/* Inline keyframe for spin animation if needed */}
            <style>{`@keyframes dbspin { to { transform: rotate(360deg); } }`}</style>

            {/* Loading State */}
            {loading && !metrics && (
                <div style={{ padding: '20px 0' }}>
                    <LoadingState variant="skeleton-card" count={6} message="Fetching strategy metrics..." />
                </div>
            )}

            {/* Error State */}
            {error && (
                <div
                    className="db-card"
                    style={{
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        gap: '12px',
                        borderColor: 'var(--db-loss)',
                        background: 'rgba(239, 68, 68, 0.05)',
                    }}
                >
                    <AlertTriangle size={32} color="var(--db-loss)" />
                    <div>
                        <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--db-text)' }}>
                            Failed to Load Metrics
                        </h3>
                        <p style={{ fontSize: '13px', color: 'var(--db-text-muted)', marginTop: '4px' }}>
                            {error}
                        </p>
                    </div>
                    <Button variant="secondary" size="sm" onClick={onRefresh} disabled={isBusy}>
                        Retry Request
                    </Button>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && !metrics && (
                <EmptyState
                    title="No Metrics Available"
                    description="This strategy does not have any recorded performance metrics or active trades yet."
                    actionLabel="Recalculate Metrics"
                    onAction={onRecalculate}
                />
            )}

            {/* Active Rendered Metric Sections */}
            {!loading && metrics && (
                <div>
                    {METRICS_SECTIONS_CONFIG.map((sec) => (
                        <MetricSection key={sec.id} config={sec} metrics={metrics} />
                    ))}
                </div>
            )}
        </div>
    )
}

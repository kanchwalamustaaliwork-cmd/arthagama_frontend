'use client'

/**
 * src/views/dashboard/indices/IndexDetailsView.tsx
 *
 * Detailed index overview: real-time mock price, historical chart, and constituents table.
 */

import { useRouter } from 'next/navigation'
import { ArrowLeft, BookOpen, Layers, ShieldCheck } from 'lucide-react'
import { useIndexDetails } from '@/src/hooks/indices/useIndexDetails'
import IndexPerformanceSummary from '@/src/components/indices/IndexPerformanceSummary'
import IndexPerformanceChart from '@/src/components/indices/IndexPerformanceChart'
import IndexConstituentsTable from '@/src/components/indices/IndexConstituentsTable'
import IndexDisclaimer from '@/src/components/indices/IndexDisclaimer'
import { IndexDetailSkeleton } from '@/src/components/indices/skeletons/IndexDetailSkeleton'
import LazyViewport from '@/src/components/shared/LazyViewport'
import EmptyState from '@/src/components/dashboard/ui/EmptyState'
import Button from '@/src/components/dashboard/ui/Button'

interface IndexDetailsViewProps {
    indexId: number
}

export default function IndexDetailsView({ indexId }: IndexDetailsViewProps) {
    const router = useRouter()
    const { index, constituents, performance, loading, error } = useIndexDetails(indexId)

    if (loading) {
        return (
            <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <IndexDetailSkeleton />
            </div>
        )
    }

    if (error || !index) {
        return (
            <div style={{ maxWidth: '600px', margin: '60px auto' }}>
                <EmptyState
                    title="Index Not Found"
                    description={`The requested index (#${indexId}) does not exist or may have been deactivated.`}
                    actionLabel="Back to Indices Catalogue"
                    onAction={() => router.push('/dashboard/indices')}
                />
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1440px', margin: '0 auto' }}>
            {/* Top Bar: Back Button & Index Title */}
            <div>
                <button
                    onClick={() => router.push('/dashboard/indices')}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'none',
                        border: 'none',
                        color: 'var(--db-mint)',
                        fontSize: '13px',
                        cursor: 'pointer',
                        padding: '4px 0',
                        marginBottom: '12px',
                    }}
                >
                    <ArrowLeft size={16} />
                    <span>Back to Indices</span>
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--db-text)', letterSpacing: '-0.02em' }}>
                                {index.indexName}
                            </h1>
                            {index.indexSymbol && (
                                <span
                                    style={{
                                        fontSize: '12px',
                                        fontWeight: 700,
                                        color: 'var(--db-mint)',
                                        background: 'var(--db-mint-faint)',
                                        padding: '2px 8px',
                                        borderRadius: '6px',
                                        letterSpacing: '0.06em',
                                    }}
                                >
                                    {index.indexSymbol}
                                </span>
                            )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', fontSize: '13px', color: 'var(--db-text-muted)' }}>
                            <span>Sector: <strong style={{ color: 'var(--db-text-2)' }}>{index.sector}</strong></span>
                            <span>•</span>
                            <span>{constituents.length} Constituents</span>
                            <span>•</span>
                            <span style={{ color: 'var(--db-profit)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <ShieldCheck size={14} /> Active Benchmark
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Disclaimer */}
            <IndexDisclaimer />

            {/* Metrics Summary Grid */}
            <IndexPerformanceSummary performance={performance} />

            {/* Historical Interactive Chart with Viewport Lazy Loading */}
            <LazyViewport minHeight="380px">
                <IndexPerformanceChart indexId={indexId} initialPeriod="1M" />
            </LazyViewport>

            {/* Methodology Overview Card */}
            <div className="db-card" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--db-text)' }}>
                    <BookOpen size={16} color="var(--db-mint)" />
                    <h3 style={{ fontSize: '14px', fontWeight: 600 }}>Methodology & Index Construction</h3>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--db-text-2)', lineHeight: 1.6 }}>
                    {index.description ||
                        'This index is constructed using a market-representative selection of industry leaders. Constituent weights are monitored and rebalanced periodically to maintain pure-play sector exposure while controlling single-stock concentration risk.'}
                </p>
            </div>

            {/* Constituents Table with Viewport Lazy Loading */}
            <LazyViewport minHeight="240px">
                <IndexConstituentsTable constituents={constituents} />
            </LazyViewport>
        </div>
    )
}

'use client'

/**
 * src/views/dashboard/indices/IndicesListView.tsx
 *
 * User dashboard catalogue view: active indices presented in table format
 * with unified search by name & sector, sector filtering, and period-based return sorting.
 */

import { TrendingUp, HelpCircle } from 'lucide-react'
import { useIndices } from '@/src/hooks/indices/useIndices'
import UserIndicesTable from '@/src/components/indices/UserIndicesTable'
import IndexFilters from '@/src/components/indices/IndexFilters'
import IndexDisclaimer from '@/src/components/indices/IndexDisclaimer'
import { IndexTableSkeleton } from '@/src/components/indices/skeletons/IndexTableSkeleton'
import LazyViewport from '@/src/components/shared/LazyViewport'
import EmptyState from '@/src/components/dashboard/ui/EmptyState'

export default function IndicesListView() {
    const {
        indices,
        sectors,
        loading,
        search,
        setSearch,
        selectedSector,
        setSelectedSector,
        sortBy,
        setSortBy,
    } = useIndices({ sortBy: 'return1d', sortOrder: 'desc' })

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1440px', margin: '0 auto' }}>
            {/* Page Header */}
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <div
                        style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            background: 'var(--db-teal)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <TrendingUp size={18} color="var(--db-mint)" />
                    </div>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--db-text)', letterSpacing: '-0.02em' }}>
                        Arthagama Indices
                    </h1>
                </div>
                <p style={{ fontSize: '13.5px', color: 'var(--db-text-muted)', lineHeight: 1.5, maxWidth: '680px' }}>
                    Proprietary sector benchmarks and equity baskets. Search by index name or sector, and sort by daily, weekly, or annual returns.
                </p>
            </div>

            {/* Illustrative Mock Data Notice */}
            <IndexDisclaimer />

            {/* Search, Sector Filtering & Return Sorting */}
            <IndexFilters
                search={search}
                onSearchChange={setSearch}
                selectedSector={selectedSector}
                onSectorChange={setSelectedSector}
                sectors={sectors}
                sortBy={sortBy}
                onSortChange={setSortBy}
                placeholder="Search by index name, sector, or symbol..."
            />

            {/* Results Counter */}
            {!loading && indices.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px', color: 'var(--db-text-muted)' }}>
                    <span>
                        Showing <strong style={{ color: 'var(--db-text)' }}>{indices.length}</strong> {indices.length === 1 ? 'index' : 'indices'}
                        {selectedSector !== 'ALL' ? ` in ${selectedSector}` : ''}
                    </span>
                    <span>
                        Sorted by: <strong style={{ color: 'var(--db-mint)' }}>
                            {sortBy === 'return1d' && 'Best 1D Return'}
                            {sortBy === 'return1w' && 'Best 1W Return'}
                            {sortBy === 'return1m' && 'Best 1M Return'}
                            {sortBy === 'return3m' && 'Best 3M Return'}
                            {sortBy === 'return6m' && 'Best 6M Return'}
                            {sortBy === 'return1y' && 'Best 1Y Return'}
                            {sortBy === 'returnYtd' && 'Best YTD Return'}
                            {sortBy === 'currentValue' && 'Index Value'}
                            {sortBy === 'name' && 'Name (A-Z)'}
                            {sortBy === 'constituents' && 'Constituent Count'}
                        </strong>
                    </span>
                </div>
            )}

            {/* Table View with Viewport Lazy Loading */}
            {loading ? (
                <IndexTableSkeleton rows={7} />
            ) : indices.length === 0 ? (
                <EmptyState
                    icon={HelpCircle}
                    title="No Indices Match Your Search"
                    description={
                        search
                            ? `No active indices found matching "${search}". Try searching another index name or sector.`
                            : 'No active indices are currently published in this sector.'
                    }
                    actionLabel="Reset Filters"
                    onAction={() => {
                        setSearch('')
                        setSelectedSector('ALL')
                    }}
                />
            ) : (
                <LazyViewport minHeight="300px" fallback={<IndexTableSkeleton rows={indices.length} />}>
                    <UserIndicesTable indices={indices} />
                </LazyViewport>
            )}
        </div>
    )
}

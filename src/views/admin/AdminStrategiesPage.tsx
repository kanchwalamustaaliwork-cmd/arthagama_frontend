'use client'

import { Layers } from 'lucide-react'
import PageHeader from '@/src/components/admin/PageHeader'
import AdminStrategyCard from '@/src/components/admin/AdminStrategyCard'
import SearchBar from '@/src/components/dashboard/ui/SearchBar'
import FilterBar from '@/src/components/dashboard/ui/FilterBar'
import LoadingState from '@/src/components/dashboard/ui/LoadingState'
import EmptyState from '@/src/components/dashboard/ui/EmptyState'
import { useAdminStrategies } from '@/src/hooks/admin/useAdminStrategies'
import type { AdminStrategyStatus } from '@/src/types/admin'

const FILTERS = [
    { label: 'All', value: 'all' },
    { label: 'Running', value: 'running' },
    { label: 'Paused', value: 'paused' },
    { label: 'Draft', value: 'draft' },
    { label: 'Archived', value: 'archived' },
]

export default function AdminStrategiesPage() {
    const { strategies, total, status, search, setSearch, filterStatus, setFilterStatus, handleStatusChange } = useAdminStrategies()

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1400px' }}>
            <PageHeader title="Strategies" subtitle="All trading strategies across all customers" icon={Layers} badge={`${total}`} />

            {/* Search + Filter */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <SearchBar value={search} onChange={setSearch} placeholder="Search by name or customer…" width="280px" />
                <FilterBar options={FILTERS} active={filterStatus} onChange={v => setFilterStatus(v as AdminStrategyStatus | 'all')} />
            </div>

            {status === 'loading' ? (
                <LoadingState variant="skeleton-card" count={6} />
            ) : strategies.length === 0 ? (
                <EmptyState icon={Layers} title="No strategies found" description="Try adjusting your search or filter." />
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
                    {strategies.map(s => (
                        <AdminStrategyCard key={s.id} strategy={s} onStatusChange={handleStatusChange} />
                    ))}
                </div>
            )}
        </div>
    )
}

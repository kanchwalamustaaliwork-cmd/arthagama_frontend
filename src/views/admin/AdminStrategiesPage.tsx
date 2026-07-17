'use client'

import { Layers, Plus } from 'lucide-react'
import PageHeader from '@/src/components/admin/PageHeader'
import AdminStrategyCard from '@/src/components/admin/AdminStrategyCard'
import SearchBar from '@/src/components/dashboard/ui/SearchBar'
import FilterBar from '@/src/components/dashboard/ui/FilterBar'
import Button from '@/src/components/dashboard/ui/Button'
import LoadingState from '@/src/components/dashboard/ui/LoadingState'
import EmptyState from '@/src/components/dashboard/ui/EmptyState'
import { useAdminStrategies } from '@/src/hooks/admin/useAdminStrategies'
import type { AdminStrategyStatus } from '@/src/types/admin'
import { useRouter } from 'next/navigation'

const FILTERS = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Running', value: 'running' },
    { label: 'Paused', value: 'paused' },
    { label: 'Draft', value: 'draft' },
    { label: 'Error', value: 'error' },
]

const ACTIVE_FILTERS = [
    { label: 'All States', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
]

export default function AdminStrategiesPage() {
    const router = useRouter()
    const { 
        strategies, 
        total, 
        status, 
        search, 
        setSearch, 
        filterStatus, 
        setFilterStatus, 
        filterActive,
        setFilterActive,
        sortBy,
        setSortBy,
        handleStatusChange,
        handleToggleActive,
        handleDelete
    } = useAdminStrategies()

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1400px' }}>
            <PageHeader title="Strategies" subtitle="All trading strategies across all customers" icon={Layers} badge={`${total}`}>
                <Button variant="primary" size="md" onClick={() => router.push('/admin/strategies/create')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Plus size={16} /> Create Strategy
                </Button>
            </PageHeader>

            {/* Search + Filter */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <SearchBar value={search} onChange={setSearch} placeholder="Search strategies…" width="280px" />
                    <FilterBar options={FILTERS} active={filterStatus} onChange={v => setFilterStatus(v as AdminStrategyStatus | 'all')} />
                    <FilterBar options={ACTIVE_FILTERS} active={filterActive} onChange={v => setFilterActive(v as any)} />
                </div>
                <div>
                    <select 
                        value={sortBy} 
                        onChange={e => setSortBy(e.target.value)} 
                        style={{ 
                            background: 'var(--db-elevated)', 
                            border: '1px solid var(--db-border)', 
                            borderRadius: 'var(--db-radius-md)', 
                            color: 'var(--db-text)', 
                            padding: '8px 12px', 
                            fontSize: '13px', 
                            outline: 'none', 
                            cursor: 'pointer' 
                        }}
                    >
                        <option value="">Sort By</option>
                        <option value="name">Name (A-Z)</option>
                        <option value="currentPnL">Current PnL (Highest)</option>
                        <option value="overallReturnPct">Overall Return % (Highest)</option>
                        <option value="winRate">Win Rate % (Highest)</option>
                        <option value="updatedAt">Last Updated</option>
                    </select>
                </div>
            </div>

            {status === 'loading' ? (
                <LoadingState variant="skeleton-card" count={6} />
            ) : strategies.length === 0 ? (
                <EmptyState icon={Layers} title="No strategies found" description="Try adjusting your search, filters, or create a new strategy." />
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
                    {strategies.map(s => (
                        <AdminStrategyCard 
                            key={s.id} 
                            strategy={s} 
                            onStatusChange={handleStatusChange} 
                            onToggleActive={handleToggleActive}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}


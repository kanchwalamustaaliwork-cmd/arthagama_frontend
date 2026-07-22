'use client'

import { useAdminStrategies } from '@/src/hooks/admin/useAdminStrategies'
import CategorySelector from '@/src/components/admin/stratergy/mystratergy/CategorySelector'
import StrategyListHeader from '@/src/components/admin/stratergy/mystratergy/StrategyListHeader'
import StrategyToolbar from '@/src/components/admin/stratergy/mystratergy/StrategyToolbar'
import StrategyGrid from '@/src/components/admin/stratergy/mystratergy/StrategyGrid'

export default function AdminStrategiesPage() {
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
        filterCategory,
        setFilterCategory,
        sortBy,
        setSortBy,
        handleStatusChange,
        handleToggleActive,
        handleDelete,
    } = useAdminStrategies()

    if (filterCategory === 'all') {
        return <CategorySelector total={total} onSelectCategory={setFilterCategory} />
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1400px' }}>
            <StrategyListHeader category={filterCategory} total={total} onBack={() => setFilterCategory('all')} />

            <StrategyToolbar
                search={search}
                onSearchChange={setSearch}
                filterStatus={filterStatus}
                onFilterStatusChange={setFilterStatus}
                filterActive={filterActive}
                onFilterActiveChange={setFilterActive}
                sortBy={sortBy}
                onSortByChange={setSortBy}
            />

            <StrategyGrid
                status={status}
                strategies={strategies}
                onStatusChange={handleStatusChange}
                onToggleActive={handleToggleActive}
                onDelete={handleDelete}
            />
        </div>
    )
}
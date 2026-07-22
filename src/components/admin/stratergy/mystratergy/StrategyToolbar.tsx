'use client'

import SearchBar from '@/src/components/dashboard/ui/SearchBar'
import FilterBar from '@/src/components/dashboard/ui/FilterBar'
import type { AdminStrategyStatus } from '@/src/types/admin'
import { STATUS_FILTERS, ACTIVE_FILTERS, SORT_OPTIONS } from '@/src/data/admin/stratergy/strategyCategories'

type ActiveFilterValue = 'all' | 'active' | 'inactive'

interface StrategyToolbarProps {
    search: string
    onSearchChange: (value: string) => void
    filterStatus: AdminStrategyStatus | 'all'
    onFilterStatusChange: (value: AdminStrategyStatus | 'all') => void
    filterActive: ActiveFilterValue
    onFilterActiveChange: (value: ActiveFilterValue) => void
    sortBy: string
    onSortByChange: (value: string) => void
}

export default function StrategyToolbar({
    search,
    onSearchChange,
    filterStatus,
    onFilterStatusChange,
    filterActive,
    onFilterActiveChange,
    sortBy,
    onSortByChange,
}: StrategyToolbarProps) {
    return (
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <SearchBar value={search} onChange={onSearchChange} placeholder="Search strategies…" width="320px" />

                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted, #8a8f98)' }}>Status</span>
                        <FilterBar
                            options={STATUS_FILTERS}
                            active={filterStatus}
                            onChange={v => onFilterStatusChange(v as AdminStrategyStatus | 'all')}
                        />
                    </div>

                    <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)' }} />

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted, #8a8f98)' }}>Active</span>
                        <FilterBar
                            options={ACTIVE_FILTERS}
                            active={filterActive}
                            onChange={v => onFilterActiveChange(v as ActiveFilterValue)}
                        />
                    </div>
                </div>
            </div>

            <div>
                <select
                    value={sortBy}
                    onChange={e => onSortByChange(e.target.value)}
                    style={{
                        background: 'var(--db-elevated)',
                        border: '1px solid var(--db-border)',
                        borderRadius: 'var(--db-radius-md)',
                        color: 'var(--db-text)',
                        padding: '8px 12px',
                        fontSize: '13px',
                        outline: 'none',
                        cursor: 'pointer',
                    }}
                >
                    {SORT_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}
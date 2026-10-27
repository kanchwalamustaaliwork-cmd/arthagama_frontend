/**
 * src/components/indices/IndexFilters.tsx
 *
 * Search bar, sector filtering tabs, and sorting dropdown.
 */

import { Search, X } from 'lucide-react'
import { IndexQueryParams } from '@/src/types/indices'

interface IndexFiltersProps {
    search: string
    onSearchChange: (value: string) => void
    selectedSector: string
    onSectorChange: (sector: string) => void
    sectors: string[]
    sortBy?: IndexQueryParams['sortBy']
    onSortChange?: (sort: IndexQueryParams['sortBy']) => void
    placeholder?: string
}

export default function IndexFilters({
    search,
    onSearchChange,
    selectedSector,
    onSectorChange,
    sectors,
    sortBy,
    onSortChange,
    placeholder = 'Search by index name, sector, or symbol...',
}: IndexFiltersProps) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Top Bar: Search + Sorting */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* Search Input */}
                <div
                    style={{
                        position: 'relative',
                        flex: '1 1 280px',
                        maxWidth: '420px',
                    }}
                >
                    <Search
                        size={16}
                        color="var(--db-text-muted)"
                        style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                    />
                    <input
                        type="text"
                        value={search}
                        onChange={e => onSearchChange(e.target.value)}
                        placeholder={placeholder}
                        style={{
                            width: '100%',
                            padding: '9px 36px 9px 36px',
                            background: 'var(--db-surface)',
                            border: '1px solid var(--db-border)',
                            borderRadius: 'var(--db-radius-md)',
                            color: 'var(--db-text)',
                            fontSize: '13px',
                            outline: 'none',
                        }}
                    />
                    {search && (
                        <button
                            onClick={() => onSearchChange('')}
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                color: 'var(--db-text-muted)',
                                cursor: 'pointer',
                                padding: '2px',
                            }}
                            aria-label="Clear search"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* Sort selector if provided */}
                {onSortChange && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--db-text-muted)' }}>Sort by:</span>
                        <select
                            value={sortBy || 'return1d'}
                            onChange={e => onSortChange(e.target.value as IndexQueryParams['sortBy'])}
                            style={{
                                background: 'var(--db-surface)',
                                border: '1px solid var(--db-border)',
                                color: 'var(--db-text)',
                                padding: '7px 12px',
                                borderRadius: 'var(--db-radius-sm)',
                                fontSize: '12.5px',
                                outline: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            <option value="return1d">Best 1D Return</option>
                            <option value="return1w">Best 1W Return</option>
                            <option value="return1m">Best 1M Return</option>
                            <option value="return3m">Best 3M Return</option>
                            <option value="return6m">Best 6M Return</option>
                            <option value="return1y">Best 1Y Return</option>
                            <option value="returnYtd">Best YTD Return</option>
                            <option value="currentValue">Index Value</option>
                            <option value="name">Name (A-Z)</option>
                            <option value="constituents">Constituent Count</option>
                        </select>
                    </div>
                )}
            </div>

            {/* Sector Tabs Bar */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    overflowX: 'auto',
                    paddingBottom: '4px',
                }}
            >
                <button
                    onClick={() => onSectorChange('ALL')}
                    style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        border: '1px solid',
                        borderColor: selectedSector === 'ALL' ? 'var(--db-mint)' : 'var(--db-border)',
                        background: selectedSector === 'ALL' ? 'var(--db-teal)' : 'var(--db-surface)',
                        color: selectedSector === 'ALL' ? 'var(--db-text)' : 'var(--db-text-muted)',
                        fontSize: '12px',
                        fontWeight: selectedSector === 'ALL' ? 600 : 500,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'all var(--db-transition)',
                    }}
                >
                    All Sectors
                </button>

                {sectors.map(sec => {
                    const active = selectedSector === sec
                    return (
                        <button
                            key={sec}
                            onClick={() => onSectorChange(sec)}
                            style={{
                                padding: '6px 14px',
                                borderRadius: '20px',
                                border: '1px solid',
                                borderColor: active ? 'var(--db-mint)' : 'var(--db-border)',
                                background: active ? 'var(--db-teal)' : 'var(--db-surface)',
                                color: active ? 'var(--db-text)' : 'var(--db-text-muted)',
                                fontSize: '12px',
                                fontWeight: active ? 600 : 500,
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                transition: 'all var(--db-transition)',
                            }}
                        >
                            {sec}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

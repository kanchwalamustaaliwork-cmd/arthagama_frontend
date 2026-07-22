'use client'

import { useState, useMemo } from 'react'
import { BookOpen, Star } from 'lucide-react'
import SearchBar from '@/src/components/dashboard/ui/SearchBar'
import FilterBar from '@/src/components/dashboard/ui/FilterBar'
import SectionHeader from '@/src/components/dashboard/SectionHeader'
import ReportCard from '@/src/components/dashboard/ReportCard'
import EmptyState from '@/src/components/dashboard/ui/EmptyState'
import { MOCK_REPORTS } from '@/src/data/dashboard/dashboard-mock'
import type { Report } from '@/src/components/dashboard/ReportCard'
import { useDebounce } from '@/src/hooks/useDebounce'

const CATEGORY_FILTERS = [
    { label: 'All', value: 'all' },
    { label: 'Market', value: 'Market' },
    { label: 'Sector', value: 'Sector' },
    { label: 'Strategy', value: 'Strategy' },
    { label: 'Macro', value: 'Macro' },
    { label: 'Quant', value: 'Quant' },
]

const SORT_OPTIONS = [
    { label: 'Latest', value: 'latest' },
    { label: 'Oldest', value: 'oldest' },
]

export default function ResearchReportsPage() {
    const [search, setSearch] = useState('')
    const debouncedSearch = useDebounce(search, 300)
    const activeSearch = search === '' ? '' : debouncedSearch

    const [category, setCategory] = useState('all')
    const [sort, setSort] = useState('latest')
    const [savedIds, setSavedIds] = useState<Set<string>>(new Set())

    const filtered = useMemo(() => {
        let list = [...MOCK_REPORTS]
        if (category !== 'all') list = list.filter(r => r.category === category)
        if (activeSearch) {
            const q = activeSearch.toLowerCase()
            list = list.filter(r =>
                r.title.toLowerCase().includes(q) ||
                r.analyst.toLowerCase().includes(q) ||
                r.summary.toLowerCase().includes(q)
            )
        }
        if (sort === 'oldest') list.reverse()
        return list
    }, [activeSearch, category, sort])

    const featured = MOCK_REPORTS.filter(r => r.featured)
    const saved = MOCK_REPORTS.filter(r => savedIds.has(r.id))

    const toggleSave = (r: Report) => {
        setSavedIds(prev => {
            const next = new Set(prev)
            next.has(r.id) ? next.delete(r.id) : next.add(r.id)
            return next
        })
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1200px' }}>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--db-text)' }}>Research Reports</h1>
                    <p style={{ fontSize: '13px', color: 'var(--db-text-muted)', marginTop: '4px' }}>
                        In-depth research from Arthagama's quantitative research desk.
                    </p>
                </div>
            </div>

            {/* ── Featured Reports ── */}
            <section>
                <SectionHeader title="Featured Reports" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '14px' }}>
                    {featured.map(r => (
                        <div key={r.id} style={{ position: 'relative' }}>
                            <ReportCard report={r} />
                            <button
                                onClick={() => toggleSave(r)}
                                style={{
                                    position: 'absolute', top: '14px', right: '14px',
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: savedIds.has(r.id) ? 'var(--db-warning)' : 'var(--db-text-muted)',
                                    transition: 'color var(--db-transition)',
                                }}
                                title={savedIds.has(r.id) ? 'Unsave' : 'Save'}
                            >
                                <Star size={15} fill={savedIds.has(r.id) ? 'var(--db-warning)' : 'none'} />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Search + Filter ── */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <SearchBar value={search} onChange={setSearch} placeholder="Search reports, analysts…" width="280px" />
                <FilterBar options={CATEGORY_FILTERS} active={category} onChange={setCategory} />
                <div style={{ marginLeft: 'auto' }}>
                    <FilterBar options={SORT_OPTIONS} active={sort} onChange={setSort} />
                </div>
            </div>

            {/* ── All Reports Grid ── */}
            <section>
                <SectionHeader title="All Reports" subtitle={`${filtered.length} reports`} />
                {filtered.length === 0 ? (
                    <EmptyState
                        icon={BookOpen}
                        title="No reports found"
                        description="Try different keywords or clear your filters."
                        actionLabel="Clear Filters"
                        onAction={() => { setSearch(''); setCategory('all') }}
                    />
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
                        {filtered.map(r => (
                            <div key={r.id} style={{ position: 'relative' }}>
                                <ReportCard report={r} />
                                <button
                                    onClick={() => toggleSave(r)}
                                    style={{
                                        position: 'absolute', top: '14px', right: '14px',
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        color: savedIds.has(r.id) ? 'var(--db-warning)' : 'var(--db-text-muted)',
                                        transition: 'color var(--db-transition)',
                                    }}
                                    title={savedIds.has(r.id) ? 'Unsave' : 'Save'}
                                >
                                    <Star size={13} fill={savedIds.has(r.id) ? 'var(--db-warning)' : 'none'} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* ── Saved Reports ── */}
            {saved.length > 0 && (
                <section>
                    <SectionHeader title="Saved Reports" subtitle={`${saved.length} saved`} />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
                        {saved.map(r => <ReportCard key={r.id} report={r} compact />)}
                    </div>
                </section>
            )}
        </div>
    )
}

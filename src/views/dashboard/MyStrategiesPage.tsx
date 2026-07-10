'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, Trash2, Layers } from 'lucide-react'
import StrategyCard from '@/src/components/dashboard/StrategyCard'
import FilterBar from '@/src/components/dashboard/ui/FilterBar'
import SearchBar from '@/src/components/dashboard/ui/SearchBar'
import EmptyState from '@/src/components/dashboard/ui/EmptyState'
import Button from '@/src/components/dashboard/ui/Button'
import { MOCK_STRATEGIES } from '@/src/data/dashboard/dashboard-mock'
import type { Strategy } from '@/src/components/dashboard/StrategyCard'
import { StrategyFormData } from '@/src/types/dashboard'

const FILTERS = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Draft', value: 'draft' },
    { label: 'Paused', value: 'paused' },
    { label: 'Archived', value: 'archived' },
]

const EMPTY_FORM: StrategyFormData = {
    name: '', description: '', instruments: '', entryRules: '', exitRules: '', riskPct: '2',
}

export default function MyStrategiesPage() {
    const router = useRouter()
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('all')
    const [strategies, setStrategies] = useState<Strategy[]>(MOCK_STRATEGIES)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState<StrategyFormData>(EMPTY_FORM)

    const filtered = strategies.filter(s => {
        const matchFilter = filter === 'all' || s.status === filter
        const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
        return matchFilter && matchSearch
    })

    const handleCreate = () => {
        setEditingId(null)
        setForm(EMPTY_FORM)
        setShowForm(true)
    }

    const handleEdit = (s: Strategy) => {
        setEditingId(s.id)
        setForm({
            name: s.name,
            description: '',
            instruments: s.instruments?.join(', ') ?? '',
            entryRules: '',
            exitRules: '',
            riskPct: '2',
        })
        setShowForm(true)
    }

    const handleSave = () => {
        if (!form.name.trim()) return
        if (editingId) {
            setStrategies(prev => prev.map(s =>
                s.id === editingId
                    ? { ...s, name: form.name, instruments: form.instruments.split(',').map(i => i.trim()).filter(Boolean), lastUpdated: 'Just now' }
                    : s
            ))
        } else {
            const newS: Strategy = {
                id: `s${Date.now()}`, name: form.name, status: 'draft',
                pnl: 0, pnlPct: 0, winRate: 0, totalTrades: 0, drawdown: 0,
                lastUpdated: 'Just now',
                instruments: form.instruments.split(',').map(i => i.trim()).filter(Boolean),
            }
            setStrategies(prev => [newS, ...prev])
        }
        setShowForm(false)
        setForm(EMPTY_FORM)
        setEditingId(null)
    }

    const handleDelete = (s: Strategy) => {
        setStrategies(prev => prev.filter(x => x.id !== s.id))
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1200px' }}>

            {/* ── Header ── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <div>
                    <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--db-text)' }}>My Strategies</h1>
                    <p style={{ fontSize: '13px', color: 'var(--db-text-muted)', marginTop: '4px' }}>
                        {strategies.length} strategies · {strategies.filter(s => s.status === 'active').length} active
                    </p>
                </div>
                <Button variant="primary" size="md" onClick={handleCreate}>
                    <Plus size={14} /> Create Strategy
                </Button>
            </div>

            {/* ── Search + Filter ── */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <SearchBar value={search} onChange={setSearch} placeholder="Search strategies…" width="260px" />
                <FilterBar options={FILTERS} active={filter} onChange={setFilter} />
            </div>

            {/* ── Create/Edit Form Modal ── */}
            {showForm && (
                <div
                    style={{
                        position: 'fixed', inset: 0, zIndex: 100,
                        background: 'rgba(0,0,0,0.65)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '20px',
                    }}
                    onClick={e => { if (e.target === e.currentTarget) setShowForm(false) }}
                >
                    <div
                        style={{
                            background: 'var(--db-elevated)',
                            border: '1px solid var(--db-border)',
                            borderRadius: 'var(--db-radius-xl)',
                            padding: '28px',
                            width: '100%',
                            maxWidth: '540px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '18px',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--db-text)' }}>
                                {editingId ? 'Edit Strategy' : 'Create New Strategy'}
                            </h2>
                            <button onClick={() => setShowForm(false)} className="db-btn db-btn-ghost db-btn-sm" style={{ borderRadius: '8px' }}>✕</button>
                        </div>

                        {[
                            { label: 'Strategy Name *', key: 'name' as const, placeholder: 'e.g. Nifty Momentum Breakout', type: 'text' },
                            { label: 'Description', key: 'description' as const, placeholder: 'Briefly describe your strategy', type: 'textarea' },
                            { label: 'Instruments', key: 'instruments' as const, placeholder: 'e.g. NIFTY50, RELIANCE, HDFCBANK', type: 'text' },
                            { label: 'Entry Rules', key: 'entryRules' as const, placeholder: 'e.g. EMA(20) crosses above EMA(50) with RSI > 55', type: 'textarea' },
                            { label: 'Exit Rules', key: 'exitRules' as const, placeholder: 'e.g. Trailing stop 3% or target +8%', type: 'textarea' },
                            { label: 'Risk per Trade (%)', key: 'riskPct' as const, placeholder: '2', type: 'number' },
                        ].map(field => (
                            <div key={field.key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '11.5px', color: 'var(--db-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                    {field.label}
                                </label>
                                {field.type === 'textarea' ? (
                                    <textarea
                                        value={form[field.key]}
                                        onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                                        placeholder={field.placeholder}
                                        className="db-input"
                                        rows={2}
                                        style={{ resize: 'vertical' }}
                                    />
                                ) : (
                                    <input
                                        type={field.type}
                                        value={form[field.key]}
                                        onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                                        placeholder={field.placeholder}
                                        className="db-input"
                                    />
                                )}
                            </div>
                        ))}

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <Button variant="ghost" size="md" onClick={() => setShowForm(false)}>Cancel</Button>
                            <Button variant="primary" size="md" onClick={handleSave}>
                                {editingId ? 'Save Changes' : 'Create Strategy'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Strategy Grid ── */}
            {filtered.length === 0 ? (
                <EmptyState
                    icon={Layers}
                    title={search ? 'No strategies match your search' : 'No strategies yet'}
                    description={search ? 'Try a different search term or clear the filter.' : 'Create your first systematic trading strategy to get started.'}
                    actionLabel="Create Strategy"
                    onAction={handleCreate}
                />
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                    {filtered.map(s => (
                        <StrategyCard
                            key={s.id}
                            strategy={s}
                            onView={() => { }}
                            onEdit={() => handleEdit(s)}
                            onBacktest={() => router.push('/dashboard/backtest')}
                            onClone={() => setStrategies(prev => [{ ...s, id: `s${Date.now()}`, name: `${s.name} (Copy)`, status: 'draft', lastUpdated: 'Just now' }, ...prev])}
                            onDeploy={() => { }}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

'use client'

import { Layers, Plus, ArrowLeft, TrendingUp, Cpu, Landmark } from 'lucide-react'
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
    { label: 'All Status', value: 'all' },
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

const CATEGORIES = [
    {
        id: 'Options',
        title: 'Options Trading',
        description: 'Advanced derivatives, calls & puts, spreads, straddles, and market hedging strategies.',
        icon: Cpu,
        gradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
        hoverBorder: 'rgba(168, 85, 247, 0.4)',
        glow: 'rgba(168, 85, 247, 0.15)',
        textColor: '#a78bfa',
    },
    {
        id: 'Futures',
        title: 'Futures & Leveraged',
        description: 'Directional index futures, commodity markets, margin leverage, and long-term futures positioning.',
        icon: TrendingUp,
        gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
        hoverBorder: 'rgba(6, 182, 212, 0.4)',
        glow: 'rgba(6, 182, 212, 0.15)',
        textColor: '#67e8f9',
    },
    {
        id: 'Equity',
        title: 'Equity & Growth',
        description: 'Direct stock investing, sectoral baskets, dividend-yielding setups, and algorithmic cash segments.',
        icon: Landmark,
        gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
        hoverBorder: 'rgba(16, 185, 129, 0.4)',
        glow: 'rgba(16, 185, 129, 0.15)',
        textColor: '#34d399',
    }
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
        filterCategory,
        setFilterCategory,
        sortBy,
        setSortBy,
        handleStatusChange,
        handleToggleActive,
        handleDelete
    } = useAdminStrategies()

    if (filterCategory === 'all') {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1400px' }}>
                <PageHeader title="Strategies" subtitle="All trading strategies across all customers" icon={Layers} badge={`${total}`}>
                    <Button variant="primary" size="md" onClick={() => router.push('/admin/strategies/create')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Plus size={16} /> Create Strategy
                    </Button>
                </PageHeader>

                <div style={{ textAlign: 'center', margin: '10px 0 20px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--db-text)', marginBottom: '8px' }}>Select Strategy Category</h2>
                    <p style={{ fontSize: '14px', color: 'var(--db-text-muted)' }}>Choose a category below to explore and manage your trading bots.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                    {CATEGORIES.map(cat => {
                        const Icon = cat.icon
                        return (
                            <div
                                key={cat.id}
                                onClick={() => setFilterCategory(cat.id)}
                                style={{
                                    background: cat.gradient,
                                    border: '1px solid var(--db-border)',
                                    borderRadius: '16px',
                                    padding: '32px 28px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '20px',
                                    position: 'relative',
                                    boxShadow: 'var(--db-shadow-sm)',
                                    overflow: 'hidden'
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)';
                                    (e.currentTarget as HTMLElement).style.borderColor = cat.hoverBorder;
                                    (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 24px -10px ${cat.glow}, var(--db-shadow-lg)`;
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--db-border)';
                                    (e.currentTarget as HTMLElement).style.boxShadow = 'var(--db-shadow-sm)';
                                }}
                            >
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    background: 'rgba(255,255,255,0.06)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: cat.textColor
                                }}>
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--db-text)', marginBottom: '8px' }}>
                                        {cat.title}
                                    </h3>
                                    <p style={{ fontSize: '13px', color: 'var(--db-text-muted)', lineHeight: 1.6 }}>
                                        {cat.description}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1400px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                    onClick={() => setFilterCategory('all')}
                    style={{
                        background: 'var(--db-elevated)',
                        border: '1px solid var(--db-border)',
                        borderRadius: '10px',
                        padding: '10px',
                        cursor: 'pointer',
                        color: 'var(--db-text)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = 'var(--db-border-hover)';
                        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = 'var(--db-border)';
                        (e.currentTarget as HTMLElement).style.background = 'var(--db-elevated)';
                    }}
                    title="Back to Categories"
                >
                    <ArrowLeft size={18} />
                </button>
                <PageHeader title={`${filterCategory} Strategies`} subtitle={`Managing bots under ${filterCategory}`} icon={Layers} badge={`${total}`}>
                    <Button variant="primary" size="md" onClick={() => router.push('/admin/strategies/create')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Plus size={16} /> Create Strategy
                    </Button>
                </PageHeader>
            </div>

            {/* Search + Filter */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Row 1: Search */}
                    <SearchBar
                        value={search}
                        onChange={setSearch}
                        placeholder="Search strategies…"
                        width="320px"
                    />

                    {/* Row 2: Filters, grouped and separated */}
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted, #8a8f98)' }}>
                                Status
                            </span>
                            <FilterBar
                                options={FILTERS}
                                active={filterStatus}
                                onChange={v => setFilterStatus(v as AdminStrategyStatus | 'all')}
                            />
                        </div>

                        {/* divider to visually break the two groups apart */}
                        <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)' }} />

                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted, #8a8f98)' }}>
                                Active
                            </span>
                            <FilterBar
                                options={ACTIVE_FILTERS}
                                active={filterActive}
                                onChange={v => setFilterActive(v as any)}
                            />
                        </div>
                    </div>
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


'use client'

import { Layers, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import PageHeader from '@/src/components/admin/PageHeader'
import Button from '@/src/components/dashboard/ui/Button'
import CategoryCard from './CategoryCard'
import { STRATEGY_CATEGORIES } from '@/src/data/admin/stratergy/strategyCategories'

interface CategorySelectorProps {
    total: number
    onSelectCategory: (id: string) => void
}

export default function CategorySelector({ total, onSelectCategory }: CategorySelectorProps) {
    const router = useRouter()

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1400px' }}>
            <PageHeader title="Strategies" subtitle="All trading strategies across all customers" icon={Layers} badge={`${total}`}>
                <Button
                    variant="primary"
                    size="md"
                    onClick={() => router.push('/admin/strategies/create')}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                    <Plus size={16} /> Create Strategy
                </Button>
            </PageHeader>

            <div style={{ textAlign: 'center', margin: '10px 0 20px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--db-text)', marginBottom: '8px' }}>
                    Select Strategy Category
                </h2>
                <p style={{ fontSize: '14px', color: 'var(--db-text-muted)' }}>
                    Choose a category below to explore and manage your trading bots.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                {STRATEGY_CATEGORIES.map(cat => (
                    <CategoryCard key={cat.id} category={cat} onSelect={onSelectCategory} />
                ))}
            </div>
        </div>
    )
}
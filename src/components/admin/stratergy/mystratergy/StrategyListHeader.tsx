'use client'

import { Layers, Plus, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import PageHeader from '@/src/components/admin/PageHeader'
import Button from '@/src/components/dashboard/ui/Button'

interface StrategyListHeaderProps {
    category: string
    total: number
    onBack: () => void
}

export default function StrategyListHeader({ category, total, onBack }: StrategyListHeaderProps) {
    const router = useRouter()

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
                onClick={onBack}
                title="Back to Categories"
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
            >
                <ArrowLeft size={18} />
            </button>
            <PageHeader title={`${category} Strategies`} subtitle={`Managing bots under ${category}`} icon={Layers} badge={`${total}`}>
                <Button
                    variant="primary"
                    size="md"
                    onClick={() => router.push('/admin/strategies/create')}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                    <Plus size={16} /> Create Strategy
                </Button>
            </PageHeader>
        </div>
    )
}
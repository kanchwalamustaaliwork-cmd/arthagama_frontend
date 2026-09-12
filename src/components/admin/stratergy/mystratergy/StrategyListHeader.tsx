'use client'

import { Layers, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import PageHeader from '@/src/components/admin/PageHeader'
import Button from '@/src/components/dashboard/ui/Button'
import BackButton from '@/src/components/dashboard/ui/BackButton'

interface StrategyListHeaderProps {
    category: string
    total: number
    onBack: () => void
}

export default function StrategyListHeader({ category, total, onBack }: StrategyListHeaderProps) {
    const router = useRouter()

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <BackButton onClick={onBack} title="Back to Categories" />
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
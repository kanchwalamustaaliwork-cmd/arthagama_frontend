'use client'

import { Layers } from 'lucide-react'
import AdminStrategyCard from '@/src/components/admin/AdminStrategyCard'
import LoadingState from '@/src/components/dashboard/ui/LoadingState'
import EmptyState from '@/src/components/dashboard/ui/EmptyState'
import type { AdminStrategyStatus } from '@/src/types/admin'

interface StrategyGridProps {
    status: 'loading' | 'success' | 'error' | string
    strategies: any[]
    onStatusChange: (id: string, status: 'start' | 'stop' | 'archive') => void
    onToggleActive: (id: string) => void
    onDelete: (id: string) => void
}

export default function StrategyGrid({ status, strategies, onStatusChange, onToggleActive, onDelete }: StrategyGridProps) {
    if (status === 'loading') {
        return <LoadingState variant="skeleton-card" count={6} />
    }

    if (strategies.length === 0) {
        return (
            <EmptyState
                icon={Layers}
                title="No strategies found"
                description="Try adjusting your search, filters, or create a new strategy."
            />
        )
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
            {strategies.map(s => (
                <AdminStrategyCard
                    key={s.id}
                    strategy={s}
                    onStatusChange={onStatusChange}
                    onToggleActive={onToggleActive}
                    onDelete={onDelete}
                />
            ))}
        </div>
    )
}
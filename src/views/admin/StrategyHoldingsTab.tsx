'use client'

import HoldingsTable from '@/src/components/admin/HoldingsTable'
import LoadingState from '@/src/components/dashboard/ui/LoadingState'
import EmptyState from '@/src/components/dashboard/ui/EmptyState'
import { useStrategyHoldings } from '@/src/hooks/admin/useStrategyHoldings'
import { useStrategyContext } from '@/src/context/StrategyContext'
import { Briefcase } from 'lucide-react'

interface Props { strategyId: string }

export default function StrategyHoldingsTab({ strategyId }: Props) {
    const { holdings, status } = useStrategyHoldings(strategyId)
    // ltpRecords come from the single shared WebSocket in StrategyContext
    const { ltpRecords } = useStrategyContext()

    if (status === 'loading') return <LoadingState variant="skeleton-table" />

    if (status === 'error') {
        return <EmptyState icon={Briefcase} title="Failed to load holdings" description="An error occurred while fetching holdings." />
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--db-text)' }}>Current Holdings</h2>
                <span style={{ fontSize: '12px', color: 'var(--db-text-muted)' }}>{holdings.length} position{holdings.length !== 1 ? 's' : ''}</span>
            </div>
            <HoldingsTable holdings={holdings} ltpMap={ltpRecords} />
        </div>
    )
}

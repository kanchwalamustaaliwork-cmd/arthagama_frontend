'use client'

import TradesTable from '@/src/components/admin/TradesTable'
import LoadingState from '@/src/components/dashboard/ui/LoadingState'
import EmptyState from '@/src/components/dashboard/ui/EmptyState'
import { useStrategyTrades } from '@/src/hooks/admin/useStrategyTrades'
import { TrendingUp } from 'lucide-react'

interface Props { strategyId: string }

export default function StrategyTradesTab({ strategyId }: Props) {
    const {
        trades, total, status, page, setPage, search, setSearch,
        action, setAction, tradeStatus, setTradeStatus, hasMore
    } = useStrategyTrades(strategyId)

    if (status === 'loading' && page === 1 && trades.length === 0) {
        return <LoadingState variant="skeleton-table" />
    }

    if (status === 'error') {
        return <EmptyState icon={TrendingUp} title="Failed to load trades" description="An error occurred while fetching strategy trades history." />
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--db-text)' }}>Trade Ledger</h2>
                <span style={{ fontSize: '12px', color: 'var(--db-text-muted)' }}>{total} total records</span>
            </div>
            <TradesTable
                trades={trades}
                total={total}
                page={page}
                hasMore={hasMore}
                search={search}
                onSearchChange={setSearch}
                action={action}
                onActionChange={v => setAction(v as any)}
                tradeStatus={tradeStatus}
                onTradeStatusChange={v => setTradeStatus(v as any)}
                onPageChange={setPage}
            />
        </div>
    )
}

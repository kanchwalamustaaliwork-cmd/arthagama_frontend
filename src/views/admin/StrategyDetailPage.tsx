'use client'

/**
 * src/views/admin/StrategyDetailPage.tsx
 *
 * Renders the shared StrategyDetailLayout with the appropriate tab content.
 * The `tab` prop is passed by the Next.js page based on the URL segment.
 */

import StrategyDetailLayout from '@/src/components/admin/StrategyDetailLayout'
import StrategyOverviewTab from './StrategyOverviewTab'
import StrategyHoldingsTab from './StrategyHoldingsTab'
import StrategyAnalysisTab from './StrategyAnalysisTab'
import StrategyLogsTab from './StrategyLogsTab'
import StrategyEditTab from './StrategyEditTab'
import { useAdminStrategy } from '@/src/hooks/admin/useAdminStrategy'

export type StrategyTab = 'overview' | 'holdings' | 'analysis' | 'logs' | 'edit'

interface Props {
    strategyId: string
    tab: StrategyTab
}

export default function StrategyDetailPage({ strategyId, tab }: Props) {
    const { strategy, status, saving, handleStatusChange, handleSave } = useAdminStrategy(strategyId)

    return (
        <StrategyDetailLayout
            strategy={strategy}
            loading={status === 'loading'}
            error={status === 'error' || status === 'not_found'}
            onStatusChange={handleStatusChange}
        >
            {tab === 'overview'  && strategy && <StrategyOverviewTab strategy={strategy} />}
            {tab === 'holdings' && <StrategyHoldingsTab strategyId={strategyId} />}
            {tab === 'analysis' && <StrategyAnalysisTab strategyId={strategyId} />}
            {tab === 'logs'     && <StrategyLogsTab strategyId={strategyId} />}
            {tab === 'edit'     && strategy && <StrategyEditTab strategy={strategy} onSave={handleSave} saving={saving} />}
        </StrategyDetailLayout>
    )
}

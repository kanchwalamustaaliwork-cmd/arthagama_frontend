'use client'

/**
 * src/views/admin/StrategyDetailPage.tsx
 *
 * Legacy wrapper for strategy detail page.
 * Strategy detail sub-routes are now handled by Next.js persistent layout at app/admin/strategies/[strategyId]/layout.tsx.
 */

import StrategyDetailLayout from '@/src/components/admin/StrategyDetailLayout'
import StrategyOverviewTab from './StrategyOverviewTab'
import StrategyHoldingsTab from './StrategyHoldingsTab'
import StrategyTradesTab from './StrategyTradesTab'
import StrategyUniverseTab from './StrategyUniverseTab'
import StrategyAnalysisTab from './StrategyAnalysisTab'
import StrategySettingsTab from './StrategySettingsTab'
import StrategyLogsTab from './StrategyLogsTab'
import StrategyLtpTab from './StrategyLtpTab'
import { StrategyProvider } from '@/src/context/StrategyContext'

export type StrategyTab = 'overview' | 'holdings' | 'trades' | 'logs' | 'universe' | 'ltp' | 'analysis' | 'settings'

interface Props {
    strategyId: string
    tab: StrategyTab
}

export default function StrategyDetailPage({ strategyId, tab }: Props) {
    return (
        <StrategyProvider strategyId={strategyId}>
            <StrategyDetailLayout>
                {tab === 'overview' && <StrategyOverviewTab />}
                {tab === 'holdings' && <StrategyHoldingsTab strategyId={strategyId} />}
                {tab === 'trades' && <StrategyTradesTab strategyId={strategyId} />}
                {tab === 'universe' && <StrategyUniverseTab />}
                {tab === 'ltp' && <StrategyLtpTab strategyId={strategyId} />}
                {tab === 'analysis' && <StrategyAnalysisTab strategyId={strategyId} />}
                {tab === 'settings' && <StrategySettingsTab />}
                {tab === 'logs' && <StrategyLogsTab strategyId={strategyId} />}
            </StrategyDetailLayout>
        </StrategyProvider>
    )
}

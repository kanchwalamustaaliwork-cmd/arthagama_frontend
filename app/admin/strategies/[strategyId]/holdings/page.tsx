'use client'

import { use } from 'react'
import StrategyHoldingsTab from '@/src/views/admin/StrategyHoldingsTab'

interface Props {
    params: Promise<{ strategyId: string }>
}

export default function StrategyHoldingsPage({ params }: Props) {
    const { strategyId } = use(params)
    return <StrategyHoldingsTab strategyId={strategyId} />
}

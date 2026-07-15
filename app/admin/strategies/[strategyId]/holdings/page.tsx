'use client'

import { use } from 'react'
import StrategyDetailPage from '@/src/views/admin/StrategyDetailPage'

interface Props {
    params: Promise<{ strategyId: string }>
}

export default function StrategyHoldingsPage({ params }: Props) {
    const { strategyId } = use(params)
    return <StrategyDetailPage strategyId={strategyId} tab="holdings" />
}

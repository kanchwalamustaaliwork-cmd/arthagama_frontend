'use client'

import { use } from 'react'
import StrategyAnalysisTab from '@/src/views/admin/StrategyAnalysisTab'

interface Props {
    params: Promise<{ strategyId: string }>
}

export default function StrategyAnalysisPage({ params }: Props) {
    const { strategyId } = use(params)
    return <StrategyAnalysisTab strategyId={strategyId} />
}

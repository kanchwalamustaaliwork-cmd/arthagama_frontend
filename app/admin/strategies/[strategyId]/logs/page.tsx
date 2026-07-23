'use client'

import { use } from 'react'
import StrategyLogsTab from '@/src/views/admin/StrategyLogsTab'

interface Props {
    params: Promise<{ strategyId: string }>
}

export default function StrategyLogsPage({ params }: Props) {
    const { strategyId } = use(params)
    return <StrategyLogsTab strategyId={strategyId} />
}

'use client'

import { use } from 'react'
import { StrategyProvider } from '@/src/context/StrategyContext'
import StrategyDetailLayout from '@/src/components/admin/StrategyDetailLayout'

interface Props {
    params: Promise<{ strategyId: string }>
    children: React.ReactNode
}

export default function StrategyLayout({ params, children }: Props) {
    const { strategyId } = use(params)

    return (
        <StrategyProvider strategyId={strategyId}>
            <StrategyDetailLayout>
                {children}
            </StrategyDetailLayout>
        </StrategyProvider>
    )
}

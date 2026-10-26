/**
 * src/views/admin/stockdashboard/StockOverviewView.tsx
 *
 * Stock Overview view displaying live mock quote, interactive chart,
 * valuation & profitability grid, and corporate overview.
 */

'use client'

import React from 'react'
import { useStockOverview } from '@/src/hooks/stockdashboard/useStockOverview'
import { PriceChart } from '@/src/components/stockdashboard/shared/PriceChart'
import { CompanyDescriptionCard } from '@/src/components/stockdashboard/overview/CompanyDescriptionCard'
import { ChartSkeleton } from '@/src/components/stockdashboard/shared/Skeletons'

interface Props {
    exchange: string
    symbol: string
}

export default function StockOverviewView({ exchange, symbol }: Props) {
    const {
        profile,
        candles,
        range,
        setRange,
        loadingChart,
        error,
    } = useStockOverview(exchange, symbol)

    if (error) {
        return (
            <div style={{ padding: '32px', background: 'var(--db-surface, #18282C)', borderRadius: '16px', color: 'var(--db-loss, #E35D6A)' }}>
                {error}
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Interactive Price & Volume Chart */}
            {loadingChart ? (
                <ChartSkeleton height={320} />
            ) : (
                <PriceChart
                    candles={candles}
                    range={range}
                    onRangeChange={setRange}
                    symbol={symbol}
                    height={340}
                />
            )}

            {/* Company Background Card */}
            {profile && <CompanyDescriptionCard profile={profile} />}
        </div>
    )
}


/**
 * app/admin/stockdashboard/stocks/[exchange]/[symbol]/fundamentals/page.tsx
 *
 * Page 4: Stock Fundamentals route (/admin/stockdashboard/stocks/:exchange/:symbol/fundamentals).
 */

import React from 'react'
import StockFundamentalsView from '@/src/views/admin/stockdashboard/StockFundamentalsView'

interface Props {
    params: Promise<{ exchange: string; symbol: string }>
}

export default async function FundamentalsPage({ params }: Props) {
    const { exchange, symbol } = await params
    return <StockFundamentalsView exchange={exchange} symbol={symbol} />
}

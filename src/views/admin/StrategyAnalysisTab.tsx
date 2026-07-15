'use client'

import AnalysisCard from '@/src/components/admin/AnalysisCard'
import LoadingState from '@/src/components/dashboard/ui/LoadingState'
import { useStrategyAnalysis } from '@/src/hooks/admin/useStrategyAnalysis'
import {
    TrendingUp, TrendingDown, Target, Clock, Award,
    AlertTriangle, BarChart2, ShoppingCart, Star, Minus,
} from 'lucide-react'

interface Props { strategyId: string }

export default function StrategyAnalysisTab({ strategyId }: Props) {
    const { analysis, status } = useStrategyAnalysis(strategyId)

    if (status === 'loading') return <LoadingState variant="skeleton-card" count={10} />

    if (!analysis) return null

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Performance */}
            <section>
                <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--db-text)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Performance Metrics</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                    <AnalysisCard label="Win Rate" value={`${analysis.winRate.toFixed(1)}%`} icon={Target} color="#38D996" sublabel="of closed trades profitable" />
                    <AnalysisCard label="Sharpe Ratio" value={analysis.sharpeRatio.toFixed(2)} icon={BarChart2} color="#5FAFD7" sublabel="risk-adjusted return" />
                    <AnalysisCard label="Max Drawdown" value={`${analysis.maxDrawdown.toFixed(1)}%`} icon={AlertTriangle} color="#E35D6A" sublabel="peak to trough" />
                    <AnalysisCard label="Avg Hold Period" value={`${analysis.avgHoldingPeriodDays}d`} icon={Clock} color="#F3B84D" sublabel="per trade" />
                </div>
            </section>

            {/* Trade Statistics */}
            <section>
                <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--db-text)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Trade Statistics</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                    <AnalysisCard label="Stocks Bought" value={analysis.totalStocksBought} icon={ShoppingCart} color="#38D996" />
                    <AnalysisCard label="Stocks Sold" value={analysis.totalStocksSold} icon={TrendingDown} color="#B8CEC2" />
                    <AnalysisCard label="Active Holdings" value={analysis.activeHoldings} icon={TrendingUp} color="#5FAFD7" />
                    <AnalysisCard label="Closed Trades" value={analysis.closedHoldings} icon={Minus} color="#708482" />
                    <AnalysisCard label="Total Profit" value={`₹${analysis.totalProfit.toLocaleString('en-IN')}`} icon={TrendingUp} color="#38D996" />
                    <AnalysisCard label="Total Loss" value={`₹${analysis.totalLoss.toLocaleString('en-IN')}`} icon={TrendingDown} color="#E35D6A" />
                </div>
            </section>

            {/* Highlights */}
            <section>
                <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--db-text)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Highlights</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                    <AnalysisCard label="Best Performer" value={analysis.bestPerformingStock} icon={Award} color="#38D996" sublabel="highest return stock" />
                    <AnalysisCard label="Worst Performer" value={analysis.worstPerformingStock} icon={AlertTriangle} color="#E35D6A" sublabel="most loss incurred" />
                    <AnalysisCard label="Most Traded" value={analysis.mostTradedStock} icon={Star} color="#F3B84D" sublabel="by number of trades" />
                </div>
            </section>

        </div>
    )
}

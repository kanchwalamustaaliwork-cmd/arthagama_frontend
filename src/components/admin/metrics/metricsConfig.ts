import type { StrategyMetrics } from '@/src/types/admin'
import type { MetricValueType, MetricColorType } from '@/src/utils/metrics'

export interface MetricMetadata {
    key: keyof StrategyMetrics
    title: string
    type: MetricValueType
    colorType: MetricColorType
    iconName: string
    tooltip: string
    accentColor?: string
}

export interface MetricSectionConfig {
    id: 'portfolio' | 'performance' | 'trading_statistics'
    title: string
    subtitle: string
    metrics: MetricMetadata[]
}

export const METRICS_SECTIONS_CONFIG: MetricSectionConfig[] = [
    {
        id: 'portfolio',
        title: 'Portfolio Overview',
        subtitle: 'Live dynamic values computed from open holdings and market LTP',
        metrics: [
            {
                key: 'portfolioValue',
                title: 'Portfolio Value',
                type: 'currency',
                colorType: 'neutral',
                iconName: 'Wallet',
                tooltip: 'Total current market value of all active holdings (Quantity × LTP)',
                accentColor: '#5FAFD7',
            },
            {
                key: 'unrealizedPnL',
                title: 'Total Unrealized P&L',
                type: 'currency',
                colorType: 'pnl',
                iconName: 'TrendingUp',
                tooltip: 'Floating profit or loss across currently open positions',
            },
            {
                key: 'totalReturn',
                title: 'Total Return (%)',
                type: 'percentage',
                colorType: 'pnl',
                iconName: 'Percent',
                tooltip: 'Overall percentage return on strategy initial capital',
                accentColor: '#38D996',
            },
            {
                key: 'activeHoldings',
                title: 'Active Holdings',
                type: 'number',
                colorType: 'neutral',
                iconName: 'Layers',
                tooltip: 'Number of open asset positions currently active',
                accentColor: '#5FAFD7',
            },
        ],
    },
    {
        id: 'performance',
        title: 'Strategy Performance',
        subtitle: 'Cached performance metrics from completed historical executions',
        metrics: [
            {
                key: 'totalPnL',
                title: 'Total Realized P&L',
                type: 'currency',
                colorType: 'pnl',
                iconName: 'DollarSign',
                tooltip: 'Cumulative net realized PnL across all closed positions',
            },
            {
                key: 'todayPnLRealized',
                title: "Today's Realized P&L",
                type: 'currency',
                colorType: 'pnl',
                iconName: 'CheckCircle',
                tooltip: 'Realized profit/loss from positions closed today',
            },
            {
                key: 'winRate',
                title: 'Win Rate',
                type: 'percentage',
                colorType: 'neutral',
                iconName: 'Award',
                tooltip: 'Percentage of closed trades resulting in a net profit',
                accentColor: '#38D996',
            },
            {
                key: 'sharpeRatio',
                title: 'Sharpe Ratio',
                type: 'number',
                colorType: 'ratio',
                iconName: 'ShieldCheck',
                tooltip: 'Risk-adjusted return ratio calculated against risk-free rate',
                accentColor: '#F3B84D',
            },
        ],
    },
    {
        id: 'trading_statistics',
        title: 'Trading Statistics',
        subtitle: 'Execution counts, trade holding durations, and timestamp tracking',
        metrics: [
            {
                key: 'totalTrades',
                title: 'Total Trades',
                type: 'number',
                colorType: 'neutral',
                iconName: 'BarChart2',
                tooltip: 'Total count of executed trade orders (BUY + SELL)',
                accentColor: '#5FAFD7',
            },
            {
                key: 'winningTrades',
                title: 'Winning Trades',
                type: 'number',
                colorType: 'profit',
                iconName: 'ThumbsUp',
                tooltip: 'Number of closed trade positions with positive realized profit',
            },
            {
                key: 'losingTrades',
                title: 'Losing Trades',
                type: 'number',
                colorType: 'loss',
                iconName: 'ThumbsDown',
                tooltip: 'Number of closed trade positions resulting in a loss',
            },
            {
                key: 'averageHoldingTime',
                title: 'Average Holding Time',
                type: 'duration',
                colorType: 'neutral',
                iconName: 'Timer',
                tooltip: 'Average duration positions remain open prior to exit (in days)',
                accentColor: '#708482',
            },
            {
                key: 'lastTradeTimestamp',
                title: 'Last Trade',
                type: 'timestamp',
                colorType: 'neutral',
                iconName: 'Calendar',
                tooltip: 'Timestamp of the most recently executed trade',
                accentColor: '#708482',
            },
        ],
    },
]

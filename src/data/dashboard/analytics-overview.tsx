
import {
    Wallet, TrendingUp, TrendingDown, Layers, FlaskConical, Eye, Bell, BookOpen,
} from 'lucide-react'
export const MOVER_TABS = [
    { label: 'Gainers', value: 'gainers' },
    { label: 'Losers', value: 'losers' },
    { label: 'Active', value: 'active' },
]

export const PORTFOLIO_STATS = [
    { label: 'Portfolio Value', value: '₹12,84,320', trend: 'up' as const, trendLabel: '+₹24,500 today', icon: Wallet, accent: '#B8CEC2' },
    { label: "Today's P&L", value: '+₹24,500', trend: 'up' as const, trendLabel: '+1.94%', icon: TrendingUp, accent: '#38D996' },
    { label: 'Overall Returns', value: '+28.4%', trend: 'up' as const, trendLabel: 'Since inception', icon: TrendingUp, accent: '#38D996' },
    { label: 'Active Strategies', value: '2', trend: 'neutral' as const, icon: Layers, accent: '#5FAFD7' },
    { label: 'Running Backtests', value: '1', trend: 'neutral' as const, icon: FlaskConical, accent: '#F3B84D' },
    { label: 'Watchlist', value: '6 stocks', trend: 'neutral' as const, icon: Eye, accent: '#B8CEC2' },
    { label: 'Research Reports', value: '6', trend: 'neutral' as const, icon: BookOpen, accent: '#5FAFD7' },
    { label: 'Notifications', value: '3 unread', trend: 'down' as const, trendLabel: 'Needs attention', icon: Bell, accent: '#E35D6A' },
]
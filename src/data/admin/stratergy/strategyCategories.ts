import { Cpu, TrendingUp, Landmark, type LucideIcon } from 'lucide-react'

export interface StrategyCategory {
    id: string
    title: string
    description: string
    icon: LucideIcon
    gradient: string
    hoverBorder: string
    glow: string
    textColor: string
}

export const STRATEGY_CATEGORIES: StrategyCategory[] = [
    {
        id: 'Options',
        title: 'Options Trading',
        description: 'Advanced derivatives, calls & puts, spreads, straddles, and market hedging strategies.',
        icon: Cpu,
        gradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
        hoverBorder: 'rgba(168, 85, 247, 0.4)',
        glow: 'rgba(168, 85, 247, 0.15)',
        textColor: '#a78bfa',
    },
    {
        id: 'Futures',
        title: 'Futures & Leveraged',
        description: 'Directional index futures, commodity markets, margin leverage, and long-term futures positioning.',
        icon: TrendingUp,
        gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
        hoverBorder: 'rgba(6, 182, 212, 0.4)',
        glow: 'rgba(6, 182, 212, 0.15)',
        textColor: '#67e8f9',
    },
    {
        id: 'Equity',
        title: 'Equity & Growth',
        description: 'Direct stock investing, sectoral baskets, dividend-yielding setups, and algorithmic cash segments.',
        icon: Landmark,
        gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
        hoverBorder: 'rgba(16, 185, 129, 0.4)',
        glow: 'rgba(16, 185, 129, 0.15)',
        textColor: '#34d399',
    },
]

export const STATUS_FILTERS = [
    { label: 'All Status', value: 'all' },
    { label: 'Running', value: 'running' },
    { label: 'Paused', value: 'paused' },
    { label: 'Draft', value: 'draft' },
    { label: 'Error', value: 'error' },
]

export const ACTIVE_FILTERS = [
    { label: 'All States', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
]

export const SORT_OPTIONS = [
    { label: 'Sort By', value: '' },
    { label: 'Name (A-Z)', value: 'name' },
    { label: 'Current PnL (Highest)', value: 'currentPnL' },
    { label: 'Overall Return % (Highest)', value: 'overallReturnPct' },
    { label: 'Win Rate % (Highest)', value: 'winRate' },
    { label: 'Last Updated', value: 'updatedAt' },
]
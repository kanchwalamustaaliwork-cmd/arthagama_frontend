import React from 'react'
import {
    Wallet,
    TrendingUp,
    Percent,
    Clock,
    Layers,
    DollarSign,
    CheckCircle,
    Activity,
    Award,
    ShieldCheck,
    BarChart2,
    ThumbsUp,
    ThumbsDown,
    Timer,
    Calendar,
    HelpCircle,
    type LucideIcon,
} from 'lucide-react'
import StatCard from '@/src/components/dashboard/StatCard'

const ICON_MAP: Record<string, LucideIcon> = {
    Wallet,
    TrendingUp,
    Percent,
    Clock,
    Layers,
    DollarSign,
    CheckCircle,
    Activity,
    Award,
    ShieldCheck,
    BarChart2,
    ThumbsUp,
    ThumbsDown,
    Timer,
    Calendar,
}

interface StrategyMetricCardProps {
    title: string
    value: string
    iconName?: string
    accentColor?: string
    textColor?: string
    tooltip?: string
    sublabel?: string
}

export default function StrategyMetricCard({
    title,
    value,
    iconName,
    accentColor,
    textColor,
    tooltip,
    sublabel,
}: StrategyMetricCardProps) {
    const IconComponent = iconName ? ICON_MAP[iconName] : undefined

    return (
        <div title={tooltip}>
            <StatCard
                label={title}
                value={value}
                sublabel={sublabel}
                icon={IconComponent}
                accent={accentColor || textColor}
            />
        </div>
    )
}

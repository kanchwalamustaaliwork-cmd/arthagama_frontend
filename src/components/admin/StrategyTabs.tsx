'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Tab {
    label: string
    href: string
}

interface StrategyTabsProps {
    strategyId: string
}

export default function StrategyTabs({ strategyId }: StrategyTabsProps) {
    const pathname = usePathname()

    const tabs: Tab[] = [
        { label: 'Overview',             href: `/admin/strategies/${strategyId}` },
        { label: 'Holdings',             href: `/admin/strategies/${strategyId}/holdings` },
        { label: 'Trades',               href: `/admin/strategies/${strategyId}/trades` },
        { label: 'Logs',                 href: `/admin/strategies/${strategyId}/logs` },
        { label: 'Universe',             href: `/admin/strategies/${strategyId}/universe` },
        { label: 'LTP',                  href: `/admin/strategies/${strategyId}/ltp` },
        { label: 'Performance Analysis', href: `/admin/strategies/${strategyId}/analysis` },
        { label: 'Settings',             href: `/admin/strategies/${strategyId}/settings` },
    ]

    return (
        <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid var(--db-border)', paddingBottom: '0' }}>
            {tabs.map(tab => {
                const isSettingsTab = tab.href.endsWith('/settings')
                const isActive = tab.href === `/admin/strategies/${strategyId}`
                    ? pathname === tab.href
                    : isSettingsTab
                        ? (pathname.startsWith(tab.href) || pathname.startsWith(`/admin/strategies/${strategyId}/edit`))
                        : pathname.startsWith(tab.href)

                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        style={{
                            padding: '10px 16px',
                            fontSize: '13.5px',
                            fontWeight: isActive ? 600 : 450,
                            color: isActive ? 'var(--db-text)' : 'var(--db-text-muted)',
                            textDecoration: 'none',
                            borderBottom: isActive ? '2px solid var(--db-mint)' : '2px solid transparent',
                            marginBottom: '-1px',
                            transition: 'color var(--db-transition), border-color var(--db-transition)',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {tab.label}
                    </Link>
                )
            })}
        </div>
    )
}

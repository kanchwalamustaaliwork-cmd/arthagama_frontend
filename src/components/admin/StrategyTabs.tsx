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
        { label: 'Overview',  href: `/admin/strategies/${strategyId}` },
        { label: 'Holdings',  href: `/admin/strategies/${strategyId}/holdings` },
        { label: 'Analysis',  href: `/admin/strategies/${strategyId}/analysis` },
        { label: 'Logs',      href: `/admin/strategies/${strategyId}/logs` },
        { label: 'Edit',      href: `/admin/strategies/${strategyId}/edit` },
    ]

    return (
        <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid var(--db-border)', paddingBottom: '0' }}>
            {tabs.map(tab => {
                const isActive = tab.href === `/admin/strategies/${strategyId}`
                    ? pathname === tab.href
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

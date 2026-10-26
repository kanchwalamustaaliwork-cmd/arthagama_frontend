/**
 * src/components/stockdashboard/shared/MetricCard.tsx
 *
 * Reusable financial metric card for ratios, valuations, and market summaries.
 */

'use client'

import React from 'react'

interface MetricCardProps {
    label: string
    value: string | number
    subtext?: string
    badge?: string
    badgeType?: 'profit' | 'loss' | 'neutral' | 'mint'
    icon?: React.ReactNode
}

export function MetricCard({
    label,
    value,
    subtext,
    badge,
    badgeType = 'neutral',
    icon,
}: MetricCardProps) {
    const getBadgeStyle = () => {
        switch (badgeType) {
            case 'profit':
                return { bg: 'rgba(56, 217, 150, 0.12)', color: 'var(--db-profit, #38D996)' }
            case 'loss':
                return { bg: 'rgba(227, 93, 106, 0.12)', color: 'var(--db-loss, #E35D6A)' }
            case 'mint':
                return { bg: 'rgba(184, 206, 194, 0.12)', color: 'var(--db-mint, #B8CEC2)' }
            default:
                return { bg: 'rgba(255, 255, 255, 0.06)', color: 'var(--db-text-muted, #708482)' }
        }
    }

    const badgeStyle = getBadgeStyle()

    return (
        <div
            style={{
                background: 'var(--db-surface, #18282C)',
                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'border-color 0.18s ease',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--db-text-muted, #708482)', fontWeight: 500 }}>
                    {label}
                </span>
                {icon && <span style={{ color: 'var(--db-mint, #B8CEC2)' }}>{icon}</span>}
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span
                    style={{
                        fontSize: '20px',
                        fontWeight: 700,
                        fontFamily: 'Consolas, monospace',
                        color: 'var(--db-text, #F7FAF9)',
                    }}
                >
                    {value}
                </span>
                {badge && (
                    <span
                        style={{
                            fontSize: '10.5px',
                            fontWeight: 600,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: badgeStyle.bg,
                            color: badgeStyle.color,
                        }}
                    >
                        {badge}
                    </span>
                )}
            </div>

            {subtext && (
                <div style={{ fontSize: '11px', color: 'var(--db-text-muted, #708482)', marginTop: '6px' }}>
                    {subtext}
                </div>
            )}
        </div>
    )
}

/**
 * src/components/indices/IndexStatusBadge.tsx
 *
 * Visual status indicator badge for Arthagama Indices (Active / Inactive / Draft).
 */

import { IndexStatus } from '@/src/types/indices'

interface IndexStatusBadgeProps {
    status: IndexStatus
    size?: 'sm' | 'md'
}

export default function IndexStatusBadge({ status, size = 'sm' }: IndexStatusBadgeProps) {
    const config: Record<IndexStatus, { label: string; bg: string; color: string; border: string }> = {
        ACTIVE: {
            label: 'Active',
            bg: 'rgba(56, 217, 150, 0.12)',
            color: 'var(--db-profit)',
            border: 'rgba(56, 217, 150, 0.25)',
        },
        INACTIVE: {
            label: 'Inactive',
            bg: 'rgba(227, 93, 106, 0.12)',
            color: 'var(--db-loss)',
            border: 'rgba(227, 93, 106, 0.25)',
        },
        DRAFT: {
            label: 'Draft',
            bg: 'rgba(243, 184, 77, 0.12)',
            color: 'var(--db-warning)',
            border: 'rgba(243, 184, 77, 0.25)',
        },
    }

    const { label, bg, color, border } = config[status] || config.DRAFT

    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: size === 'sm' ? '3px 8px' : '4px 12px',
                borderRadius: '6px',
                fontSize: size === 'sm' ? '11px' : '12px',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                background: bg,
                color,
                border: `1px solid ${border}`,
            }}
        >
            <span
                style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: color,
                }}
            />
            {label}
        </span>
    )
}

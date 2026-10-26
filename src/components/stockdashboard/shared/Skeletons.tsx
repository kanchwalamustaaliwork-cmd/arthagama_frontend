/**
 * src/components/stockdashboard/shared/Skeletons.tsx
 *
 * Page-level and component-level loading skeleton placeholders.
 */

'use client'

import React from 'react'

export function SkeletonPrimitive({
    width = '100%',
    height = '20px',
    borderRadius = '8px',
    style,
}: {
    width?: string | number
    height?: string | number
    borderRadius?: string | number
    style?: React.CSSProperties
}) {
    return (
        <div
            style={{
                width,
                height,
                borderRadius,
                background: 'linear-gradient(90deg, rgba(32, 53, 58, 0.6) 0%, rgba(46, 85, 96, 0.4) 50%, rgba(32, 53, 58, 0.6) 100%)',
                backgroundSize: '200% 100%',
                animation: 'skeletonShimmer 1.5s infinite ease-in-out',
                ...style,
            }}
        />
    )
}

export function MetricCardsSkeleton({ count = 4 }: { count?: number }) {
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(auto-fit, minmax(220px, 1fr))`,
                gap: '16px',
            }}
        >
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    style={{
                        background: 'var(--db-surface, #18282C)',
                        border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                        borderRadius: '12px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                    }}
                >
                    <SkeletonPrimitive width="60%" height="14px" />
                    <SkeletonPrimitive width="80%" height="28px" />
                    <SkeletonPrimitive width="40%" height="12px" />
                </div>
            ))}
        </div>
    )
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
    return (
        <div
            style={{
                background: 'var(--db-surface, #18282C)',
                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                borderRadius: '12px',
                padding: '20px',
            }}
        >
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                {Array.from({ length: cols }).map((_, i) => (
                    <SkeletonPrimitive key={i} width={`${100 / cols}%`} height="16px" />
                ))}
            </div>
            {Array.from({ length: rows }).map((_, r) => (
                <div
                    key={r}
                    style={{
                        display: 'flex',
                        gap: '16px',
                        padding: '12px 0',
                        borderTop: '1px solid var(--db-border, rgba(184, 206, 194, 0.08))',
                    }}
                >
                    {Array.from({ length: cols }).map((_, c) => (
                        <SkeletonPrimitive key={c} width={`${100 / cols}%`} height="18px" />
                    ))}
                </div>
            ))}
        </div>
    )
}

export function ChartSkeleton({ height = 300 }: { height?: number }) {
    return (
        <div
            style={{
                background: 'var(--db-surface, #18282C)',
                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <SkeletonPrimitive width="180px" height="24px" />
                <SkeletonPrimitive width="220px" height="28px" />
            </div>
            <SkeletonPrimitive width="100%" height={`${height}px`} borderRadius="12px" />
        </div>
    )
}

export function PageSkeleton() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <SkeletonPrimitive width="320px" height="32px" />
            <MetricCardsSkeleton count={4} />
            <ChartSkeleton height={280} />
            <TableSkeleton rows={4} cols={5} />
        </div>
    )
}

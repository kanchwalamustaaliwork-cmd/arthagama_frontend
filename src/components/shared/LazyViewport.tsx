'use client'

/**
 * src/components/shared/LazyViewport.tsx
 *
 * Canonical shared viewport-activated wrapper.
 * Only mounts children and triggers API requests when the container scrolls into or near the viewport.
 */

import React, { ReactNode } from 'react'
import { useInViewport } from '@/src/hooks/useInViewport'

export interface LazyViewportProps {
    children: ReactNode
    fallback?: ReactNode
    minHeight?: string | number
    rootMargin?: string
    className?: string
    style?: React.CSSProperties
}

export default function LazyViewport({
    children,
    fallback,
    minHeight = '140px',
    rootMargin = '150px',
    className = '',
    style = {},
}: LazyViewportProps) {
    const { ref, hasBeenInViewport } = useInViewport<HTMLDivElement>({
        rootMargin,
        triggerOnce: true,
    })

    return (
        <div
            ref={ref}
            className={className}
            style={{
                minHeight: hasBeenInViewport ? undefined : minHeight,
                ...style,
            }}
        >
            {hasBeenInViewport ? children : fallback || null}
        </div>
    )
}

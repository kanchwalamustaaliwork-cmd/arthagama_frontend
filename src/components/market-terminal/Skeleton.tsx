'use client'

import React from 'react'

// Inject shimmer keyframes once into the document head (client-side only)
if (typeof document !== 'undefined' && !document.getElementById('sk-shimmer')) {
    const style = document.createElement('style')
    style.id = 'sk-shimmer'
    style.textContent = `
        @keyframes sk-shimmer {
            0%   { background-position: -200% 0; }
            100% { background-position:  200% 0; }
        }
    `
    document.head.appendChild(style)
}

interface SkeletonProps {
    width?: string | number
    height?: string | number
    borderRadius?: string | number
    style?: React.CSSProperties
}

/**
 * Skeleton — animated shimmer placeholder used during loading states.
 *
 * Every widget in the terminal should replace text-based "Loading…"
 * messages with Skeleton placeholders that closely match the final layout.
 */
export function Skeleton({ width = '100%', height = 16, borderRadius = 4, style }: SkeletonProps) {
    return (
        <div
            style={{
                width,
                height,
                borderRadius,
                background:
                    'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.04) 75%)',
                backgroundSize: '200% 100%',
                animation: 'sk-shimmer 1.4s infinite linear',
                flexShrink: 0,
                ...style,
            }}
        />
    )
}

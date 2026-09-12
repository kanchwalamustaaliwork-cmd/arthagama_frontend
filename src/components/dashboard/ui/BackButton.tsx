'use client'

import React, { useState } from 'react'
import { ArrowLeft } from 'lucide-react'

export interface BackButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
    title?: string
    iconSize?: number
    label?: string
}

export default function BackButton({
    onClick,
    title = 'Back',
    iconSize = 18,
    label,
    className = '',
    style,
    onMouseEnter,
    onMouseLeave,
    ...rest
}: BackButtonProps) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            aria-label={title}
            className={className}
            style={{
                background: isHovered ? 'rgba(255,255,255,0.05)' : 'var(--db-elevated)',
                border: `1px solid ${isHovered ? 'var(--db-border-hover)' : 'var(--db-border)'}`,
                borderRadius: '10px',
                padding: '10px',
                cursor: 'pointer',
                color: 'var(--db-text)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: label ? '8px' : '0',
                transition: 'all 0.2s ease',
                flexShrink: 0,
                ...style,
            }}
            onMouseEnter={e => {
                setIsHovered(true)
                onMouseEnter?.(e)
            }}
            onMouseLeave={e => {
                setIsHovered(false)
                onMouseLeave?.(e)
            }}
            {...rest}
        >
            <ArrowLeft size={iconSize} />
            {label && <span style={{ fontSize: '13px', fontWeight: 500 }}>{label}</span>}
        </button>
    )
}

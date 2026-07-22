'use client'

import React, { useRef } from 'react'
import { Search, X } from 'lucide-react'

export interface SearchBarProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    width?: string | number
    variant?: 'default' | 'compact' | 'pill' | 'glass'
    style?: React.CSSProperties
    containerStyle?: React.CSSProperties
    inputStyle?: React.CSSProperties
    className?: string
    iconColor?: string
    iconSize?: number
    disabled?: boolean
    autoFocus?: boolean
}

export default function SearchBar({
    value,
    onChange,
    placeholder = 'Search…',
    width = '100%',
    variant = 'default',
    style,
    containerStyle,
    inputStyle,
    className = '',
    iconColor = 'var(--db-text-muted, #8a8f98)',
    iconSize = 14,
    disabled = false,
    autoFocus = false,
}: SearchBarProps) {
    const inputRef = useRef<HTMLInputElement>(null)

    const handleClear = () => {
        onChange('')
        inputRef.current?.focus()
    }

    const getVariantStyles = (): { container: React.CSSProperties; input: React.CSSProperties } => {
        switch (variant) {
            case 'pill':
                return {
                    container: { borderRadius: '9999px' },
                    input: { borderRadius: '9999px', height: '42px', paddingLeft: '40px' },
                }
            case 'compact':
                return {
                    container: {},
                    input: { height: '32px', fontSize: '12px', paddingLeft: '28px' },
                }
            case 'glass':
                return {
                    container: { borderRadius: '12px' },
                    input: {
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        height: '38px',
                        paddingLeft: '34px',
                    },
                }
            case 'default':
            default:
                return {
                    container: {},
                    input: { height: '36px', paddingLeft: '32px' },
                }
        }
    }

    const variantStyles = getVariantStyles()

    return (
        <div
            className={`search-bar-container ${className}`}
            style={{
                position: 'relative',
                width,
                display: 'inline-flex',
                alignItems: 'center',
                ...variantStyles.container,
                ...containerStyle,
                ...style,
            }}
        >
            <Search
                size={iconSize}
                style={{
                    position: 'absolute',
                    left: variant === 'compact' ? '8px' : variant === 'pill' ? '14px' : '10px',
                    color: iconColor,
                    pointerEvents: 'none',
                    flexShrink: 0,
                    zIndex: 1,
                }}
            />
            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                autoFocus={autoFocus}
                className="db-input"
                style={{
                    width: '100%',
                    paddingRight: value ? '32px' : '12px',
                    ...variantStyles.input,
                    ...inputStyle,
                }}
            />
            {value && (
                <button
                    type="button"
                    onClick={handleClear}
                    style={{
                        position: 'absolute',
                        right: variant === 'pill' ? '14px' : '10px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: iconColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0,
                        zIndex: 2,
                    }}
                    aria-label="Clear search"
                >
                    <X size={iconSize - 1 > 0 ? iconSize - 1 : 12} />
                </button>
            )}
        </div>
    )
}

'use client'

import { useRef } from 'react'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    width?: string | number
}

export default function SearchBar({ value, onChange, placeholder = 'Search…', width = '100%' }: SearchBarProps) {
    const inputRef = useRef<HTMLInputElement>(null)

    return (
        <div style={{ position: 'relative', width, display: 'inline-flex', alignItems: 'center' }}>
            <Search
                size={14}
                style={{
                    position: 'absolute',
                    left: '10px',
                    color: 'var(--db-text-muted)',
                    pointerEvents: 'none',
                    flexShrink: 0,
                }}
            />
            <input
                ref={inputRef}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="db-input"
                style={{ paddingLeft: '32px', paddingRight: value ? '32px' : '12px', height: '36px' }}
            />
            {value && (
                <button
                    onClick={() => { onChange(''); inputRef.current?.focus() }}
                    style={{
                        position: 'absolute',
                        right: '10px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--db-text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        padding: 0,
                    }}
                    aria-label="Clear search"
                >
                    <X size={13} />
                </button>
            )}
        </div>
    )
}

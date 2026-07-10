import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
    children: React.ReactNode
}

const VARIANT_CLASS: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary:   'db-btn-primary',
    secondary: 'db-btn-secondary',
    ghost:     'db-btn-ghost',
    danger:    'db-btn-danger',
}

const SIZE_CLASS: Record<NonNullable<ButtonProps['size']>, string> = {
    sm: 'db-btn-sm',
    md: 'db-btn-md',
    lg: 'db-btn-lg',
}

export default function Button({
    variant = 'primary',
    size = 'md',
    loading = false,
    children,
    disabled,
    className = '',
    ...rest
}: ButtonProps) {
    return (
        <button
            className={`db-btn ${VARIANT_CLASS[variant]} ${SIZE_CLASS[size]} ${className}`}
            disabled={disabled || loading}
            style={{ opacity: (disabled || loading) ? 0.5 : 1, cursor: (disabled || loading) ? 'not-allowed' : 'pointer' }}
            {...rest}
        >
            {loading && (
                <span
                    style={{
                        width: '12px',
                        height: '12px',
                        border: '1.5px solid currentColor',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 0.7s linear infinite',
                        display: 'inline-block',
                        flexShrink: 0,
                    }}
                />
            )}
            {children}
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </button>
    )
}

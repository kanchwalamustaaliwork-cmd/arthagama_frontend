interface BadgeProps {
    variant?: 'success' | 'error' | 'warning' | 'info' | 'neutral' | 'teal'
    dot?: boolean
    children: React.ReactNode
    className?: string
}

const VARIANT_CLASS: Record<NonNullable<BadgeProps['variant']>, string> = {
    success: 'db-badge-success',
    error:   'db-badge-error',
    warning: 'db-badge-warning',
    info:    'db-badge-info',
    neutral: 'db-badge-neutral',
    teal:    'db-badge-teal',
}

export default function Badge({ variant = 'neutral', dot = false, children, className = '' }: BadgeProps) {
    return (
        <span className={`db-badge ${VARIANT_CLASS[variant]} ${className}`}>
            {dot && (
                <span
                    style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        background: 'currentColor',
                        display: 'inline-block',
                        flexShrink: 0,
                    }}
                />
            )}
            {children}
        </span>
    )
}

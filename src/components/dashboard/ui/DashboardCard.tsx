import React from 'react'

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
    elevated?: boolean
    children: React.ReactNode
}

export default function DashboardCard({ elevated = false, children, className = '', style, ...rest }: DashboardCardProps) {
    return (
        <div
            className={elevated ? 'db-card-elevated' : 'db-card'}
            style={{ padding: '20px', ...style }}
            {...rest}
        >
            {children}
        </div>
    )
}

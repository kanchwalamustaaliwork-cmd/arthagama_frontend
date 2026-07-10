'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/src/auth/AuthContext'

interface DashboardGuardProps {
    children: React.ReactNode
}

export default function DashboardGuard({ children }: DashboardGuardProps) {
    const { isAuthenticated, isInitializing } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isInitializing && !isAuthenticated) {
            router.replace('/login')
        }
    }, [isAuthenticated, isInitializing, router])

    // While session is restoring — show a minimal full-screen loader
    if (isInitializing) {
        return (
            <div
                style={{
                    minHeight: '100vh',
                    background: 'var(--db-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: '16px',
                }}
            >
                <div
                    style={{
                        width: '36px',
                        height: '36px',
                        border: '2px solid var(--db-border)',
                        borderTopColor: 'var(--db-mint)',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                    }}
                />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <p style={{ color: 'var(--db-text-muted)', fontSize: '13px' }}>Restoring session…</p>
            </div>
        )
    }

    // If auth check is done and user is not authenticated, return null (redirect handled above)
    if (!isAuthenticated) return null

    return <>{children}</>
}

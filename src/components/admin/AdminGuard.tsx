'use client'

/**
 * src/components/admin/AdminGuard.tsx
 *
 * Protects admin routes:
 *   - Unauthenticated users → /login
 *   - Authenticated but role = 0 → /dashboard (normal users cannot access /admin)
 *   - Authenticated + role = 1 → allowed
 *
 * Security note: This guard improves UX only. The backend MUST enforce
 * role = 1 on every /admin API endpoint independently.
 */

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/src/auth/AuthContext'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isAdmin, isInitializing } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (isInitializing) return
        if (!isAuthenticated) {
            router.replace('/login')
            return
        }
        if (!isAdmin) {
            // Authenticated but not admin — redirect to their dashboard
            router.replace('/dashboard')
        }
    }, [isAuthenticated, isAdmin, isInitializing, router])

    // While session is restoring
    if (isInitializing) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--db-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
                <div style={{ width: '36px', height: '36px', border: '2px solid var(--db-border)', borderTopColor: 'var(--db-warning)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <p style={{ color: 'var(--db-text-muted)', fontSize: '13px' }}>Verifying admin access…</p>
            </div>
        )
    }

    // Not authenticated or not admin — return null (redirect handled above)
    if (!isAuthenticated || !isAdmin) return null

    return <>{children}</>
}

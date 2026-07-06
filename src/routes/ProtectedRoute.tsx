"use client"

import { useEffect, type ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '../auth/AuthContext'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { isAuthenticated, isInitializing, setPendingRedirect } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (!isInitializing && !isAuthenticated) {
            setPendingRedirect(pathname)
            router.replace('/login')
        }
    }, [isInitializing, isAuthenticated, pathname, router, setPendingRedirect])

    // While session check is in progress, render nothing (prevents flash + premature redirect)
    if (isInitializing) return null
    
    // While redirect is pending (effect not yet fired), also render nothing
    if (!isAuthenticated) return null
    
    return <>{children}</>
}
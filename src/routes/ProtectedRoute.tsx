import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { isAuthenticated, isInitializing } = useAuth()
    const location = useLocation()

    // Avoid a flash-redirect to /login before the stored session has been checked
    if (isInitializing) return null

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return <>{children}</>
}
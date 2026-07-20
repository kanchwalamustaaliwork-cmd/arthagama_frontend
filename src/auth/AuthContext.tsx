'use client'

/**
 * src/auth/AuthContext.tsx
 *
 * Global authentication context for the app.
 *
 * Session Strategy:
 *   - Tokens are stored in httpOnly cookies (set by Next.js route handlers).
 *   - On mount, calls restoreSession() which hits GET /users/me using the
 *     stored access token cookie — if valid, the user is rehydrated.
 *   - No localStorage usage anywhere in this file.
 *
 * Flow:
 *   Component
 *     └── useAuth()
 *           └── AuthContext
 *                 └── authService.ts
 *                       ├── authApi.ts  (HTTP)
 *                       └── /api/auth/* (httpOnly cookie handlers)
 */

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import {
    login as loginService,
    signup as signupService,
    logout as logoutService,
    restoreSession,
} from './authService'
import type { AuthContextValue, AuthUser, LoginPayload, SignupPayload } from '../types/auth'

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [isInitializing, setIsInitializing] = useState(true)
    const [pendingRedirect, setPendingRedirect] = useState<string | null>(null)

    // ── Session restoration on app boot ─────────────────────────────────────
    useEffect(() => {
        restoreSession()
            .then((restoredUser) => setUser(restoredUser))
            .catch(() => setUser(null))
            .finally(() => setIsInitializing(false))
    }, [])

    // ── Login ────────────────────────────────────────────────────────────────
    const login = useCallback(async (email: string, password: string): Promise<void> => {
        const payload: LoginPayload = { email, password }
        const authUser = await loginService(payload)
        setUser(authUser)
    }, [])

    // ── Signup ───────────────────────────────────────────────────────────────
    const signup = useCallback(async (payload: SignupPayload): Promise<void> => {
        const authUser = await signupService(payload)
        setUser(authUser)
    }, [])

    // ── Logout ───────────────────────────────────────────────────────────────
    const logout = useCallback(async (): Promise<void> => {
        await logoutService()
        setUser(null)
    }, [])

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isAdmin: user?.role === 1,
                isInitializing,
                login,
                signup,
                logout,
                pendingRedirect,
                setPendingRedirect,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
    return ctx
}
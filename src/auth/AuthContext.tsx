'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { login as loginRequest, logout as logoutRequest } from './authService'
import type { AuthContextValue, AuthUser } from '../types/auth'


const AuthContext = createContext<AuthContextValue | undefined>(undefined)
const STORAGE_KEY = 'arthagama_auth_user'
const TOKEN_KEY = 'arthagama_auth_token'

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [isInitializing, setIsInitializing] = useState(true)
    const [pendingRedirect, setPendingRedirect] = useState<string | null>(null)

    // Restore session on load — swap for a "validate token" API call once
    // real JWT auth exists (verify the stored token instead of trusting it).
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            try {
                setUser(JSON.parse(stored))
            } catch {
                localStorage.removeItem(STORAGE_KEY)
            }
        }
        setIsInitializing(false)
    }, [])

    const login = async (email: string, password: string) => {
        const result = await loginRequest(email, password)
        setUser(result.user)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(result.user))
        localStorage.setItem(TOKEN_KEY, result.token)
    }

    const logout = () => {
        logoutRequest()
        setUser(null)
        localStorage.removeItem(STORAGE_KEY)
        localStorage.removeItem(TOKEN_KEY)
    }

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isInitializing,
            login,
            logout,
            pendingRedirect,
            setPendingRedirect,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
    return ctx
}
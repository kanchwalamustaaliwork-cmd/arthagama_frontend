"use client"

/**
 * src/components/ui/NavAuthButtons.tsx
 *
 * Renders the correct auth controls in the navbar based on session state:
 *   - Logged OUT → "Log in" + "Become a Member" buttons
 *   - Logged IN  → single "Log out" button
 *
 * Used by both DesktopPillNav and MobileMenu so the logic lives in one place.
 */

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../auth/AuthContext'

// ─── Desktop variant ─────────────────────────────────────────────────────────

export function DesktopNavAuthButtons() {
    const { isAuthenticated, isInitializing, logout } = useAuth()
    const router = useRouter()
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const handleLogout = async () => {
        setIsLoggingOut(true)
        await logout()
        router.replace('/login')
        setIsLoggingOut(false)
    }

    // While session is being checked — render nothing to avoid a flash
    if (isInitializing) return null

    if (isAuthenticated) {
        return (
            <>
                {/* Dashboard link */}
                <Link
                    href="/dashboard"
                    className="relative z-10 text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-all duration-200 whitespace-nowrap"
                    style={{
                        border: '1px solid hsl(var(--mint) / 0.3)',
                        color: 'hsl(var(--mint) / 0.85)',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'hsl(var(--mint-soft))'
                        e.currentTarget.style.borderColor = 'hsl(var(--mint) / 0.6)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'hsl(var(--mint) / 0.85)'
                        e.currentTarget.style.borderColor = 'hsl(var(--mint) / 0.3)'
                    }}
                >
                    Dashboard ↗
                </Link>
                {/* Log out */}
                <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="relative z-10 text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-all duration-200 whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none"
                    style={{
                        background: 'hsl(var(--mint))',
                        color: 'hsl(var(--teal-deep))',
                    }}
                >
                    {isLoggingOut ? 'Signing out…' : 'Log out'}
                </button>
            </>
        )
    }

    return (
        <>
            {/* Log in — outlined ghost button */}
            <Link
                href="/login"
                scroll={false}
                className="relative z-10 text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-all duration-200 whitespace-nowrap"
                style={{
                    border: '1px solid hsl(var(--mint) / 0.3)',
                    color: 'hsl(var(--mint) / 0.85)',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'hsl(var(--mint-soft))'
                    e.currentTarget.style.borderColor = 'hsl(var(--mint) / 0.6)'
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'hsl(var(--mint) / 0.85)'
                    e.currentTarget.style.borderColor = 'hsl(var(--mint) / 0.3)'
                }}
            >
                Log in
            </Link>

            {/* Become a Member — filled pill with gradient border on hover */}
            <DesktopSignUpButton />
        </>
    )
}

function DesktopSignUpButton() {
    const [hovered, setHovered] = useState(false)
    return (
        <div
            className="relative z-10"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <span
                className="absolute inset-[-2px] rounded-full transition-opacity duration-300 pointer-events-none"
                style={{
                    opacity: hovered ? 1 : 0,
                    background: 'linear-gradient(90deg, hsl(var(--mint)) 0%, hsl(var(--teal-soft)) 100%)',
                }}
            />
            <Link
                href="/signup"
                scroll={false}
                className="relative z-10 flex items-center gap-1 text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 backdrop-blur-md transition-all duration-200 whitespace-nowrap"
                style={{
                    background: 'hsl(var(--teal) / 0.7)',
                    color: 'hsl(var(--mint-soft))',
                }}
            >
                Become a Member <span style={{ color: 'hsl(var(--mint) / 0.6)' }}>↗</span>
            </Link>
        </div>
    )
}

// ─── Mobile variant ──────────────────────────────────────────────────────────

interface MobileNavAuthButtonsProps {
    /** Number of nav links — used to calculate entrance animation delays */
    navLinksCount: number
}

export function MobileNavAuthButtons({ navLinksCount }: MobileNavAuthButtonsProps) {
    const { isAuthenticated, isInitializing, logout } = useAuth()
    const router = useRouter()
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const handleLogout = async () => {
        setIsLoggingOut(true)
        await logout()
        router.replace('/login')
        setIsLoggingOut(false)
    }

    if (isInitializing) return null

    if (isAuthenticated) {
        return (
            <>
                {/* Go to Dashboard */}
                <Link
                    href="/dashboard"
                    className="flex items-center justify-center min-h-[44px] w-full rounded-2xl text-base transition-colors duration-200"
                    style={{
                        background: 'hsl(var(--teal) / 0.7)',
                        color: 'hsl(var(--mint-soft))',
                        border: '1px solid hsl(var(--mint) / 0.3)',
                    }}
                >
                    Go to Dashboard ↗
                </Link>
                {/* Log out */}
                <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center justify-center min-h-[44px] w-full rounded-2xl text-base transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none"
                    style={{
                        background: 'hsl(var(--mint))',
                        color: 'hsl(var(--teal-deep))',
                    }}
                >
                    {isLoggingOut ? 'Signing out…' : 'Log out'}
                </button>
            </>
        )
    }

    return (
        <>
            {/* Log in */}
            <Link
                href="/login"
                scroll={false}
                className="flex items-center justify-center min-h-[44px] w-full rounded-2xl text-base transition-colors duration-200"
                style={{
                    border: '1px solid hsl(var(--mint) / 0.3)',
                    color: 'hsl(var(--mint) / 0.85)',
                }}
            >
                Log in
            </Link>

            {/* Become a Member */}
            <Link
                href="/signup"
                scroll={false}
                className="flex items-center justify-center gap-1 min-h-[44px] w-full rounded-2xl text-base transition-colors duration-200"
                style={{
                    background: 'hsl(var(--mint))',
                    color: 'hsl(var(--teal-deep))',
                }}
            >
                Become a Member <span>↗</span>
            </Link>
        </>
    )
}

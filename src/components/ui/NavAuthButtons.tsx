"use client"

/**
 * src/components/ui/NavAuthButtons.tsx
 *
 * Renders the correct auth controls in the navbar based on session state and CMS configuration:
 *   - Logged OUT → CMS-driven Login + Signup / Member buttons (if visible)
 *   - Logged IN  → CMS-driven Dashboard + Logout buttons (if visible)
 */

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../auth/AuthContext'
import type { CMSNavigation } from '@/src/types/cms'

export interface NavAuthButtonsProps {
  cmsNav?: CMSNavigation | null
}

// ─── Desktop variant ─────────────────────────────────────────────────────────

export function DesktopNavAuthButtons({ cmsNav }: NavAuthButtonsProps) {
  const { isAuthenticated, isInitializing, logout } = useAuth()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await logout()
    const logoutUrl = cmsNav?.logoutButton?.url ?? '/login'
    router.replace(logoutUrl)
    setIsLoggingOut(false)
  }

  if (isInitializing) return null

  const loginBtn = cmsNav?.loginButton ?? { label: 'Log in', url: '/login', visible: true }
  const signupBtn = cmsNav?.signupButton ?? { label: 'Become a Member', url: '/signup', visible: true }
  const dashboardBtn = cmsNav?.dashboardButton ?? { label: 'Dashboard', url: '/dashboard', visible: true }
  const logoutBtn = cmsNav?.logoutButton ?? { label: 'Log out', url: '/login', visible: true }

  if (isAuthenticated) {
    return (
      <>
        {dashboardBtn.visible && (
          <Link
            href={dashboardBtn.url || '/dashboard'}
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
            {dashboardBtn.label} ↗
          </Link>
        )}
        {logoutBtn.visible && (
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="relative z-10 text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-all duration-200 whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none"
            style={{
              background: 'hsl(var(--mint))',
              color: 'hsl(var(--teal-deep))',
            }}
          >
            {isLoggingOut ? 'Signing out…' : logoutBtn.label}
          </button>
        )}
      </>
    )
  }

  return (
    <>
      {loginBtn.visible && (
        <Link
          href={loginBtn.url || '/login'}
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
          {loginBtn.label}
        </Link>
      )}

      {signupBtn.visible && <DesktopSignUpButton label={signupBtn.label} url={signupBtn.url} />}
    </>
  )
}

function DesktopSignUpButton({ label, url }: { label: string; url: string }) {
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
        href={url || '/signup'}
        scroll={false}
        className="relative z-10 flex items-center gap-1 text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 backdrop-blur-md transition-all duration-200 whitespace-nowrap"
        style={{
          background: 'hsl(var(--teal) / 0.7)',
          color: 'hsl(var(--mint-soft))',
        }}
      >
        {label} <span style={{ color: 'hsl(var(--mint) / 0.6)' }}>↗</span>
      </Link>
    </div>
  )
}

// ─── Mobile variant ──────────────────────────────────────────────────────────

interface MobileNavAuthButtonsProps {
  navLinksCount?: number
  cmsNav?: CMSNavigation | null
}

export function MobileNavAuthButtons({ cmsNav }: MobileNavAuthButtonsProps) {
  const { isAuthenticated, isInitializing, logout } = useAuth()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await logout()
    const logoutUrl = cmsNav?.logoutButton?.url ?? '/login'
    router.replace(logoutUrl)
    setIsLoggingOut(false)
  }

  if (isInitializing) return null

  const loginBtn = cmsNav?.loginButton ?? { label: 'Log in', url: '/login', visible: true }
  const signupBtn = cmsNav?.signupButton ?? { label: 'Become a Member', url: '/signup', visible: true }
  const dashboardBtn = cmsNav?.dashboardButton ?? { label: 'Dashboard', url: '/dashboard', visible: true }
  const logoutBtn = cmsNav?.logoutButton ?? { label: 'Log out', url: '/login', visible: true }

  if (isAuthenticated) {
    return (
      <>
        {dashboardBtn.visible && (
          <Link
            href={dashboardBtn.url || '/dashboard'}
            className="flex items-center justify-center min-h-[44px] w-full rounded-2xl text-base transition-colors duration-200"
            style={{
              background: 'hsl(var(--teal) / 0.7)',
              color: 'hsl(var(--mint-soft))',
              border: '1px solid hsl(var(--mint) / 0.3)',
            }}
          >
            {dashboardBtn.label} ↗
          </Link>
        )}
        {logoutBtn.visible && (
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center justify-center min-h-[44px] w-full rounded-2xl text-base transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none"
            style={{
              background: 'hsl(var(--mint))',
              color: 'hsl(var(--teal-deep))',
            }}
          >
            {isLoggingOut ? 'Signing out…' : logoutBtn.label}
          </button>
        )}
      </>
    )
  }

  return (
    <>
      {loginBtn.visible && (
        <Link
          href={loginBtn.url || '/login'}
          scroll={false}
          className="flex items-center justify-center min-h-[44px] w-full rounded-2xl text-base transition-colors duration-200"
          style={{
            border: '1px solid hsl(var(--mint) / 0.3)',
            color: 'hsl(var(--mint) / 0.85)',
          }}
        >
          {loginBtn.label}
        </Link>
      )}

      {signupBtn.visible && (
        <Link
          href={signupBtn.url || '/signup'}
          scroll={false}
          className="flex items-center justify-center gap-1 min-h-[44px] w-full rounded-2xl text-base transition-colors duration-200"
          style={{
            background: 'hsl(var(--mint))',
            color: 'hsl(var(--teal-deep))',
          }}
        >
          {signupBtn.label} <span>↗</span>
        </Link>
      )}
    </>
  )
}

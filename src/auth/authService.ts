/**
 * src/auth/authService.ts
 *
 * Auth service — orchestrates API calls, token storage, and session management.
 *
 * TOKEN STRATEGY:
 *   Access token  → tokenStore (in-memory) so the axios interceptor can read it.
 *   Refresh token → httpOnly cookie via /api/auth/set-tokens route handler.
 *
 * FLOW after login / signup:
 *   1. Call backend → receive { access_token, refresh_token }
 *   2. tokenStore.set(access_token)        ← axios can now attach Authorization header
 *   3. persistRefreshToken(refresh_token)  ← sets httpOnly cookie server-side
 *   4. getMeApi()                          ← succeeds because step 2 already ran
 *
 * FLOW on page refresh (restoreSession):
 *   1. POST /api/auth/refresh (no body)    ← route handler reads httpOnly cookie
 *   2. Route handler calls backend, sets new httpOnly refresh cookie
 *   3. Returns { access_token } in body
 *   4. tokenStore.set(access_token)        ← restore in-memory token
 *   5. getMeApi()                          ← succeeds
 *
 * FLOW on logout:
 *   1. tokenStore.clear()                  ← drop in-memory token immediately
 *   2. /api/auth/clear-tokens              ← expire the httpOnly refresh cookie
 *   3. logoutApi()                         ← best-effort backend invalidation
 */

import { loginApi, signupApi, getMeApi, logoutApi } from '../services/authApi'
import { tokenStore } from '../api/tokenStore'
import type { AuthUser, LoginPayload, SignupPayload, UserResponse } from '../types/auth'

// ─── Cookie helpers (server-side via Next.js route handlers) ─────────────────

/**
 * Store the refresh token as an httpOnly cookie.
 * httpOnly cookies can only be set by server responses — hence the route handler.
 */
async function persistRefreshToken(refresh_token: string): Promise<void> {
    const res = await fetch('/api/auth/set-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token }),
    })
    if (!res.ok) throw new Error('Failed to persist refresh token')
}

/** Expire the httpOnly refresh cookie via the Next.js route handler. */
async function clearRefreshToken(): Promise<void> {
    await fetch('/api/auth/clear-tokens', { method: 'POST' })
}

// ─── Mapping ──────────────────────────────────────────────────────────────────

/** Map the full backend UserResponse → trimmed AuthUser for the UI. */
function mapToAuthUser(r: UserResponse): AuthUser {
    return {
        id: r.id,
        email: r.email,
        firstName: r.first_name,
        lastName: r.last_name,
        phoneNumber: r.phone_number,
    }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Login with email + password.
 *
 * Critical order:
 *   tokenStore.set() must happen BEFORE getMeApi() so the axios
 *   request interceptor has a token to attach.
 */
export async function login(payload: LoginPayload): Promise<AuthUser> {
    // 1. Authenticate — receive tokens from backend
    const tokens = await loginApi(payload)

    // 2. Store access token in memory FIRST (axios interceptor reads this)
    tokenStore.set(tokens.access_token)

    // 3. Store refresh token as httpOnly cookie (server-side only)
    await persistRefreshToken(tokens.refresh_token)

    // 4. Fetch user profile — Authorization header is now attached by interceptor
    const userResponse = await getMeApi()
    return mapToAuthUser(userResponse)
}

/**
 * Register a new user (auto-login on success).
 *
 * Same token-first ordering as login().
 */
export async function signup(payload: SignupPayload): Promise<AuthUser> {
    // 1. Register — receive tokens from backend
    const tokens = await signupApi(payload)

    // 2. Store access token in memory FIRST
    tokenStore.set(tokens.access_token)

    // 3. Store refresh token as httpOnly cookie
    await persistRefreshToken(tokens.refresh_token)

    // 4. Fetch user profile
    const userResponse = await getMeApi()
    return mapToAuthUser(userResponse)
}

/**
 * Restore session on page load/refresh.
 *
 * The in-memory access token is gone after a page refresh, but the httpOnly
 * refresh cookie survives. We call /api/auth/refresh to exchange it for a
 * new access token, then restore the user from /auth/me.
 *
 * Returns null if no valid session exists (user must log in again).
 */
export async function restoreSession(): Promise<AuthUser | null> {
    try {
        // Call the Next.js route handler — it reads the httpOnly refresh cookie
        // server-side, calls the backend, sets a new httpOnly refresh cookie,
        // and returns { access_token } in the response body.
        const res = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        })

        if (!res.ok) return null

        const { access_token } = (await res.json()) as { access_token: string }

        if (!access_token) return null

        // Restore in-memory token so subsequent API calls work
        tokenStore.set(access_token)

        // Now we can fetch the user profile
        const userResponse = await getMeApi()
        return mapToAuthUser(userResponse)
    } catch {
        // No valid refresh token or network error — user must log in
        return null
    }
}

/**
 * Logout the current user.
 * Clears memory token immediately, then expires the httpOnly cookie.
 */
export async function logout(): Promise<void> {
    // Clear in-memory token immediately so no further requests can use it
    tokenStore.clear()

    // Clear httpOnly cookie and notify backend in parallel
    await Promise.allSettled([
        clearRefreshToken(),
        logoutApi(), // best-effort — backend may not have a /logout endpoint
    ])
}
/**
 * src/auth/authService.ts
 *
 * Auth service — orchestrates API calls and token storage.
 *
 * ─── TOKEN STRATEGY ──────────────────────────────────────────────────────────
 *
 *   Access token  → tokenStore (in-memory module variable, this process only)
 *                   Set here, read by the axios request interceptor.
 *                   Lost on page refresh — restored via the refresh flow below.
 *
 *   Refresh token → httpOnly cookie, managed exclusively by the backend.
 *                   NEVER touched by frontend JavaScript.
 *                   The browser sends it automatically on every request to the
 *                   backend because axiosInstance is created with withCredentials: true.
 *
 * ─── FLOWS ───────────────────────────────────────────────────────────────────
 *
 *   LOGIN / SIGNUP
 *     1. POST /auth/login (or /auth/signup) with credentials
 *     2. Backend validates, returns { access_token } in body
 *        AND sets Set-Cookie: refresh_token=<jwt>; HttpOnly; Secure
 *     3. tokenStore.set(access_token)     ← axios can now attach Authorization header
 *     4. GET /users/me                     ← succeeds, returns user profile
 *
 *   PAGE REFRESH (restoreSession)
 *     1. POST /auth/refresh — no body
 *        Browser automatically sends the httpOnly refresh cookie
 *     2. Backend validates cookie, rotates refresh token, returns { access_token }
 *        AND sets a new Set-Cookie with the rotated refresh token
 *     3. tokenStore.set(access_token)     ← restore in-memory token
 *     4. GET /users/me                     ← succeeds
 *
 *   SILENT REFRESH (axios 401 interceptor)
 *     Same as PAGE REFRESH — handled automatically in axios.ts
 *
 *   LOGOUT
 *     1. tokenStore.clear()               ← drop in-memory token immediately
 *     2. POST /auth/logout                ← backend clears the httpOnly cookie
 *        (Set-Cookie: refresh_token=; Max-Age=0)
 *
 * ─── WHAT THIS FILE DOES NOT DO ──────────────────────────────────────────────
 *   ✗ Never reads or writes any cookie
 *   ✗ Never stores the refresh token anywhere
 *   ✗ Never sends the refresh token in any request body
 *   ✗ No localStorage, sessionStorage, Redux, Zustand, or React state for tokens
 */

import { loginApi, signupApi, refreshApi, getMeApi, logoutApi } from '../services/authApi'
import { tokenStore } from '../api/tokenStore'
import type { AuthUser, LoginPayload, SignupPayload, UserResponse } from '../types/auth'

// ─── Mapping ──────────────────────────────────────────────────────────────────

/** Map the full backend UserResponse → trimmed AuthUser for the UI. */
function mapToAuthUser(r: UserResponse): AuthUser {
    return {
        id: r.id,
        email: r.email,
        firstName: r.first_name,
        lastName: r.last_name,
        phoneNumber: r.phone_number,
        // Map backend string role ('0' or '1') to numeric: '1' → 1, anything else → 0
        role: r.role === 1 ? 1 : 0,
    }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Login with email + password.
 *
 * The backend response:
 *   - Body contains { access_token } → stored in tokenStore
 *   - Set-Cookie header contains the httpOnly refresh token → stored by browser
 *
 * tokenStore.set() MUST happen before getMeApi() so the axios interceptor
 * has a token to attach as Authorization: Bearer <token>.
 */
export async function login(payload: LoginPayload): Promise<AuthUser> {
    const tokens = await loginApi(payload)
    tokenStore.set(tokens.access_token)

    const userResponse = await getMeApi()
    return mapToAuthUser(userResponse)
}

/**
 * Register a new user (auto-login on success).
 * Backend sets the httpOnly refresh cookie in the same response.
 */
export async function signup(payload: SignupPayload): Promise<AuthUser> {
    const tokens = await signupApi(payload)
    tokenStore.set(tokens.access_token)

    const userResponse = await getMeApi()
    return mapToAuthUser(userResponse)
}

/**
 * Restore session on page load/refresh.
 *
 * The in-memory access token is gone after a page refresh, but the httpOnly
 * refresh cookie persists in the browser. Calling POST /auth/refresh with
 * withCredentials: true causes the browser to send the cookie automatically.
 * The backend validates it, rotates it (issues a new httpOnly cookie), and
 * returns a fresh access token in the body.
 *
 * Returns null if no valid session exists (user must log in again).
 */
export async function restoreSession(): Promise<AuthUser | null> {
    try {
        // Browser sends the httpOnly refresh cookie automatically
        const tokens = await refreshApi()
        tokenStore.set(tokens.access_token)

        const userResponse = await getMeApi()
        return mapToAuthUser(userResponse)
    } catch {
        // Refresh token missing, expired, or revoked — must log in
        return null
    }
}

/**
 * Logout the current user.
 *
 * 1. Clear in-memory access token immediately (stops all in-flight requests)
 * 2. Call backend /auth/logout — it responds with Set-Cookie: refresh_token=; Max-Age=0
 *    which instructs the browser to delete the httpOnly cookie
 */
export async function logout(): Promise<void> {
    tokenStore.clear()
    await logoutApi()
}
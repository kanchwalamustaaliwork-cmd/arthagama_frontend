/**
 * src/services/authApi.ts
 *
 * Pure API layer for authentication endpoints.
 * This layer is responsible only for HTTP communication —
 * no side-effects, no cookie manipulation, no context updates.
 *
 * Flow:
 *   AuthContext / authService
 *     └── authApi        (this file)
 *           └── axios.ts (http instance)
 *                 └── Backend
 */

import { apiGet, apiPost } from '../api/axios'
import type { LoginPayload, SignupPayload, TokenResponse, UserResponse } from '../types/auth'

// ─── Auth Endpoints ───────────────────────────────────────────────────────────

/**
 * POST /auth/login
 * Authenticates a user with email + password.
 * Returns a pair of JWTs (access + refresh).
 */
export async function loginApi(payload: LoginPayload): Promise<TokenResponse> {
    const res = await apiPost<TokenResponse>('/auth/login', payload)
    return res.data
}

/**
 * POST /auth/signup
 * Registers a new user and returns tokens immediately (auto-login).
 */
export async function signupApi(payload: SignupPayload): Promise<TokenResponse> {
    const res = await apiPost<TokenResponse>('/auth/signup', payload)
    return res.data
}

/**
 * POST /auth/refresh
 * Exchanges a valid refresh token for a new access + refresh token pair.
 * Called by the axios interceptor automatically — rarely needed directly.
 */
export async function refreshApi(refreshToken: string): Promise<TokenResponse> {
    const res = await apiPost<TokenResponse>('/auth/refresh', { refresh_token: refreshToken })
    return res.data
}

/**
 * GET /auth/me
 * Returns the currently authenticated user's profile.
 * Requires a valid access token (sent as Authorization: Bearer header).
 * Used on app boot to rehydrate the auth session from the stored token.
 */
export async function getMeApi(): Promise<UserResponse> {
    const res = await apiGet<UserResponse>('/auth/me')
    return res.data
}

/**
 * POST /auth/logout  (optional — call if backend supports token invalidation)
 * Notifies the server to invalidate the session.
 * Safe to call even if the endpoint does not exist — failures are silenced.
 */
export async function logoutApi(): Promise<void> {
    try {
        await apiPost('/auth/logout')
    } catch {
        // Server-side logout is best-effort; client-side cookie removal always runs
    }
}

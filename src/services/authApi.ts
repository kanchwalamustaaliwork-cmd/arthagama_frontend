/**
 * src/services/authApi.ts
 *
 * Pure API layer for authentication endpoints.
 * This layer is responsible only for HTTP communication —
 * no side-effects, no cookie manipulation, no context updates.
 *
 * REFRESH TOKEN CONTRACT:
 *   The refresh token is exclusively managed as an httpOnly cookie by the backend.
 *   - On login/signup: backend sets cookie via Set-Cookie header (browser stores it)
 *   - On refresh:      browser sends cookie automatically (withCredentials: true)
 *   - On logout:       backend clears cookie via Set-Cookie with Max-Age=0
 *   The frontend never reads, stores, or sends the refresh token in any form.
 *
 * Flow:
 *   AuthContext / authService
 *     └── authApi        (this file)
 *           └── axios.ts (http instance — withCredentials: true on all requests)
 *                 └── Backend
 */

import { apiGet, apiPost } from '../api/axios'
import type { LoginPayload, SignupPayload, TokenResponse, UserResponse } from '../types/auth'

// ─── Auth Endpoints ───────────────────────────────────────────────────────────

/**
 * POST /auth/login
 * Authenticates with email + password.
 * Backend response:
 *   - Body: { access_token, token_type }
 *   - Set-Cookie: refresh_token=<jwt>; HttpOnly; Secure; SameSite=Lax
 */
export async function loginApi(payload: LoginPayload): Promise<TokenResponse> {
    const res = await apiPost<TokenResponse>('/auth/login', payload)
    return res.data
}

/**
 * POST /auth/signup
 * Registers a new user. Backend auto-logs in on success (same response shape as login).
 */
export async function signupApi(payload: SignupPayload): Promise<TokenResponse> {
    const res = await apiPost<TokenResponse>('/auth/signup', payload)
    return res.data
}

/**
 * POST /auth/refresh
 * Exchanges the httpOnly refresh cookie for a new access token.
 *
 * NO request body is sent — the browser automatically attaches the
 * httpOnly `refresh_token` cookie because axiosInstance has `withCredentials: true`.
 *
 * Backend response:
 *   - Body: { access_token, token_type }
 *   - Set-Cookie: refresh_token=<new_jwt>; HttpOnly; Secure; SameSite=Lax (rotated)
 */
export async function refreshApi(): Promise<TokenResponse> {
    const res = await apiPost<TokenResponse>('/auth/refresh')
    return res.data
}

/**
 * GET /users/me
 * Returns the currently authenticated user profile.
 * Requires Authorization: Bearer <access_token> header (set by axios interceptor).
 */
export async function getMeApi(): Promise<UserResponse> {
    const res = await apiGet<UserResponse>('/users/me')
    return res.data
}

/**
 * POST /auth/logout
 * Instructs the backend to clear the httpOnly refresh cookie (Set-Cookie: Max-Age=0).
 * Also invalidates the token server-side if the backend supports it.
 */
export async function logoutApi(): Promise<void> {
    try {
        await apiPost('/auth/logout')
    } catch {
        // Best-effort — even if this fails, tokenStore.clear() already ran
    }
}

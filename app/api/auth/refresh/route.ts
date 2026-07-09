/**
 * app/api/auth/refresh/route.ts
 *
 * Next.js Route Handler — silently refreshes the access token.
 *
 * WHY THIS EXISTS:
 *   The refresh_token lives in an httpOnly cookie — JavaScript cannot read it.
 *   This server-side handler can read it using next/headers `cookies()`,
 *   forward it to the backend, receive a new token pair, and:
 *     - Set the new refresh_token as a new httpOnly cookie (via Set-Cookie)
 *     - Return the new access_token in the response BODY
 *       (caller stores it in-memory via tokenStore.set())
 *
 * This is the ONLY way to implement silent token refresh when the refresh
 * token is in an httpOnly cookie.
 *
 * Called by:
 *   - src/auth/authService.ts restoreSession() — on every page load
 *   - src/api/axios.ts 401 interceptor — on any failed API request
 */

import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api'
const IS_PRODUCTION = process.env.NODE_ENV === 'production'
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function POST() {
    // Read the httpOnly refresh_token cookie server-side
    // (next/headers cookies() is the ONLY way to access httpOnly cookies in Next.js)
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get('refresh_token')?.value

    if (!refreshToken) {
        return NextResponse.json(
            { error: 'No refresh token cookie found' },
            { status: 401 },
        )
    }

    // Forward the refresh token to the backend
    let backendRes: Response
    try {
        backendRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken }),
        })
    } catch {
        return NextResponse.json(
            { error: 'Backend unreachable during token refresh' },
            { status: 503 },
        )
    }

    if (!backendRes.ok) {
        // Refresh token is expired or invalid — force re-login
        const err = await backendRes.json().catch(() => ({ error: 'Refresh failed' }))
        return NextResponse.json(err, { status: backendRes.status })
    }

    const tokens = await backendRes.json() as {
        access_token: string
        refresh_token: string
        token_type: string
    }

    // Build response — only return access_token in body (stored in-memory by caller)
    const response = NextResponse.json({ access_token: tokens.access_token })

    // Set the new refresh_token as httpOnly cookie
    response.cookies.set('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: IS_PRODUCTION,
        sameSite: 'lax',
        maxAge: REFRESH_TOKEN_MAX_AGE,
        path: '/',
    })

    return response
}

/**
 * app/api/auth/set-tokens/route.ts
 *
 * Next.js Route Handler — sets the refresh token as an httpOnly cookie.
 *
 * WHY THIS EXISTS:
 *   httpOnly cookies cannot be set by client-side JS (document.cookie).
 *   This server-side handler receives the refresh_token from the client
 *   (which got it from the backend) and sets it securely via Set-Cookie.
 *
 * NOTE ON ACCESS TOKEN:
 *   The access token is NOT handled here. It is stored in-memory in
 *   `src/api/tokenStore.ts` by authService.ts, so the axios interceptor
 *   can attach it as an Authorization header without any cookie reads.
 *
 * Called by: src/auth/authService.ts (persistRefreshToken) after login/signup
 */

import { type NextRequest, NextResponse } from 'next/server'

const IS_PRODUCTION = process.env.NODE_ENV === 'production'

// Keep in sync with backend REFRESH_TOKEN_EXPIRE_DAYS (default: 7 days)
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7 // 7 days in seconds

export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as { refresh_token: string }

        if (!body.refresh_token) {
            return NextResponse.json(
                { error: 'refresh_token is required' },
                { status: 400 },
            )
        }

        const response = NextResponse.json({ success: true })

        // Set refresh token as httpOnly cookie — inaccessible to JavaScript
        response.cookies.set('refresh_token', body.refresh_token, {
            httpOnly: true,
            secure: IS_PRODUCTION,
            sameSite: 'lax',
            maxAge: REFRESH_TOKEN_MAX_AGE,
            path: '/',
        })

        return response
    } catch {
        return NextResponse.json(
            { error: 'Invalid request body' },
            { status: 400 },
        )
    }
}

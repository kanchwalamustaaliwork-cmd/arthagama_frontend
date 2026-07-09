/**
 * app/api/auth/clear-tokens/route.ts
 *
 * Next.js Route Handler — clears the httpOnly refresh_token cookie on logout.
 *
 * The access token does not need clearing here — it lives in-memory (tokenStore)
 * and is cleared directly by authService.logout() via tokenStore.clear().
 *
 * Called by: src/auth/authService.ts (clearRefreshToken) on logout
 */

import { NextResponse } from 'next/server'

export async function POST() {
    const response = NextResponse.json({ success: true })

    // Expire the refresh_token cookie immediately
    response.cookies.set('refresh_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
    })

    return response
}

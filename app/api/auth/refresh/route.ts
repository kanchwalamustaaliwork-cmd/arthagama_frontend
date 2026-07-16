/**
 * app/api/auth/refresh/route.ts  [RETIRED]
 *
 * This route handler is no longer used.
 *
 * The refresh flow is now handled directly between the browser and the backend:
 *   - Browser sends POST /auth/refresh to the backend with withCredentials: true
 *   - Browser automatically attaches the httpOnly refresh_token cookie
 *   - Backend reads cookie, rotates it, returns { access_token } in body
 *     + sets a new httpOnly Set-Cookie header
 *
 * No Next.js server-side proxy is needed because the refresh token never
 * passes through JavaScript — it is exclusively a browser ↔ backend cookie.
 *
 * This file is kept only to prevent 404s from stale references.
 * It returns 410 Gone to signal that the endpoint has been retired.
 */

import { NextResponse } from 'next/server'

export async function POST() {
    return NextResponse.json(
        { error: 'This proxy endpoint is retired. Call the backend /auth/refresh directly.' },
        { status: 410 },
    )
}

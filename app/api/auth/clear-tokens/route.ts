/**
 * app/api/auth/clear-tokens/route.ts  [RETIRED]
 *
 * This route handler is no longer used.
 *
 * Previously, the frontend called this to clear the httpOnly refresh cookie
 * by setting Max-Age=0 server-side (since JS can't clear httpOnly cookies).
 *
 * Now, the backend handles cookie clearing directly:
 *   POST /auth/logout → backend responds with Set-Cookie: refresh_token=; Max-Age=0
 *   The browser clears the cookie automatically from that response.
 */

import { NextResponse } from 'next/server'

export async function POST() {
    return NextResponse.json(
        { error: 'This proxy endpoint is retired. Call the backend /auth/logout directly.' },
        { status: 410 },
    )
}

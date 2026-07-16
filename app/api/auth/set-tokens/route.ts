/**
 * app/api/auth/set-tokens/route.ts  [RETIRED]
 *
 * This route handler is no longer used.
 *
 * Previously, the frontend received the refresh token in the response body
 * and used this handler to store it as an httpOnly cookie server-side.
 *
 * Now, the backend sets the httpOnly refresh_token cookie directly via
 * Set-Cookie on its own login/signup/refresh responses. The frontend never
 * receives or handles the refresh token at all.
 */

import { NextResponse } from 'next/server'

export async function POST() {
    return NextResponse.json(
        { error: 'This proxy endpoint is retired. The backend now sets cookies directly.' },
        { status: 410 },
    )
}

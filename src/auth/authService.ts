import type { AuthResult } from '../types/auth'

// Static, hardcoded for now — replace this function's body with a real
// POST /auth/login call once a backend exists. Nothing else in the app
// needs to change: AuthContext, ProtectedRoute, and LoginPage all consume
// this via the same login()/logout() signatures.
const STATIC_CREDENTIALS = { email: 'info@arthagama.com', password: 'arthagama2026' }

export async function login(email: string, password: string): Promise<AuthResult> {
    // Real implementation later:
    // const res = await fetch(`${API_BASE}/auth/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password }),
    // })
    // if (!res.ok) throw new Error('Invalid email or password.')
    // return res.json() // expects { user, token }

    await new Promise((resolve) => setTimeout(resolve, 600))

    if (
        email.trim().toLowerCase() !== STATIC_CREDENTIALS.email ||
        password !== STATIC_CREDENTIALS.password
    ) {
        throw new Error('Invalid email or password.')
    }

    return { user: { email, name: 'Demo User' }, token: 'static-demo-token' }
}

export function logout(): void {
    // Real implementation later: POST /auth/logout to invalidate the token
    // server-side. No-op for the static version.
}
/**
 * src/types/auth.ts
 *
 * Shared TypeScript types for authentication.
 * These mirror the backend Pydantic schemas exactly so that
 * any backend contract change is immediately visible here.
 */

// ─── User ─────────────────────────────────────────────────────────────────────

/** The public user object returned by GET /auth/me */
export interface UserResponse {
    id: string          // MongoDB ObjectId as string
    first_name: string
    last_name: string
    email: string
    phone_number: string
    is_active: boolean
    created_at: string  // ISO-8601 datetime string
}

/**
 * The trimmed user object stored in AuthContext.
 * Derived from UserResponse — includes only what the UI needs.
 */
export interface AuthUser {
    id: string
    email: string
    firstName: string
    lastName: string
    phoneNumber: string
}

// ─── Token ────────────────────────────────────────────────────────────────────

/** Shape returned by POST /auth/login, /auth/signup, /auth/refresh */
export interface TokenResponse {
    access_token: string
    refresh_token: string
    token_type: string // "bearer"
}

// ─── Request Payloads ────────────────────────────────────────────────────────

/** POST /auth/login body */
export interface LoginPayload {
    email: string
    password: string
}

/** POST /auth/signup body — mirrors backend UserSignup schema */
export interface SignupPayload {
    first_name: string
    last_name: string
    email: string
    phone_number: string
    password: string
}

// ─── Context ─────────────────────────────────────────────────────────────────

export interface AuthContextValue {
    user: AuthUser | null
    isAuthenticated: boolean
    isInitializing: boolean
    login: (email: string, password: string) => Promise<void>
    signup: (payload: SignupPayload) => Promise<void>
    logout: () => Promise<void>
    pendingRedirect: string | null
    setPendingRedirect: (path: string | null) => void
}
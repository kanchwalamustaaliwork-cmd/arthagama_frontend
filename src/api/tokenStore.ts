/**
 * src/api/tokenStore.ts
 *
 * In-memory access token store.
 *
 * WHY IN MEMORY:
 *   httpOnly cookies cannot be read by JavaScript — that is their security purpose.
 *   So the access token is stored in a module-level variable that:
 *     - Lives as long as the browser tab is open
 *     - Is readable by the axios request interceptor
 *     - Is lost on page refresh (renewed automatically via the httpOnly refresh cookie)
 *     - Is never exposed to localStorage / sessionStorage / document.cookie
 *
 * The refresh token stays in an httpOnly cookie, read only by the
 * Next.js server-side route handler at /api/auth/refresh.
 */

let _accessToken: string | null = null

export const tokenStore = {
    /** Get the current in-memory access token. */
    get: (): string | null => _accessToken,

    /** Set a new access token (called after login / signup / silent refresh). */
    set: (token: string): void => {
        _accessToken = token
    },

    /** Clear the access token (called on logout). */
    clear: (): void => {
        _accessToken = null
    },
}

/**
 * src/api/axios.ts
 *
 * Central Axios instance for all backend communication.
 *
 * ─── TOKEN STRATEGY ──────────────────────────────────────────────────────────
 *
 *   Access token  → stored in `tokenStore` (in-memory module variable)
 *                   Read by the request interceptor → Authorization: Bearer header
 *
 *   Refresh token → httpOnly cookie, set by the backend via Set-Cookie.
 *                   JavaScript never reads, stores, or sends it.
 *                   The browser sends it automatically on every request because
 *                   axiosInstance is created with `withCredentials: true`.
 *
 * ─── SILENT REFRESH ──────────────────────────────────────────────────────────
 *
 *   On a 401 response the interceptor:
 *     1. Sends POST /auth/refresh with no body and withCredentials: true
 *        → browser attaches the httpOnly refresh cookie automatically
 *     2. Backend validates cookie, rotates it, returns { access_token } in body
 *        + new Set-Cookie with rotated httpOnly refresh token
 *     3. Interceptor stores new access_token in tokenStore
 *     4. Retries the original request with the new Authorization header
 *     5. If refresh also fails → clear tokenStore, redirect to /login
 *
 * ─── REQUEST QUEUING ─────────────────────────────────────────────────────────
 *   If multiple requests fail with 401 simultaneously, only one refresh is
 *   attempted. All other requests are queued and retried after the refresh.
 *
 * All HTTP helpers (get / post / put / patch / delete) are exported so callers
 * never import axios directly.
 */

import axios, {
    type AxiosInstance,
    type AxiosRequestConfig,
    type AxiosResponse,
    type InternalAxiosRequestConfig,
} from 'axios'
import { tokenStore } from './tokenStore'

// ─── Instance ────────────────────────────────────────────────────────────────

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api'

const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    /**
     * withCredentials: true causes the browser to include cookies on every
     * cross-origin request. This is what makes the httpOnly refresh cookie
     * get sent to the backend automatically — no JS cookie reading needed.
     */
    withCredentials: true,
})

// ─── Request Interceptor — attach access token from memory ───────────────────

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = tokenStore.get()
        if (token) {
            // Only set the header when a token exists.
            // Never sends an empty "Authorization: Bearer " header.
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error),
)

// ─── Response Interceptor — silent refresh on 401 ────────────────────────────

let isRefreshing = false
let refreshQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = []

function processQueue(error: unknown, token: string | null = null): void {
    refreshQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error)
        else if (token) resolve(token)
    })
    refreshQueue = []
}

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

        const isAuthEntryPoint =
            originalRequest.url?.includes('/auth/login') ||
            originalRequest.url?.includes('/auth/signup') ||
            originalRequest.url?.includes('/auth/refresh')

        // Only attempt one refresh per request; skip non-401 errors
        if (error.response?.status !== 401 || originalRequest._retry || isAuthEntryPoint) {
            return Promise.reject(error)
        }

        // If a refresh is already in flight, queue this request
        if (isRefreshing) {
            return new Promise<string>((resolve, reject) => {
                refreshQueue.push({ resolve, reject })
            })
                .then((newToken) => {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`
                    return axiosInstance(originalRequest)
                })
                .catch((err) => Promise.reject(err))
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
            /**
             * POST /auth/refresh — sent directly to the backend.
             *
             * NO request body. The browser sends the httpOnly refresh_token
             * cookie automatically because withCredentials: true is set.
             *
             * The backend:
             *   1. Reads the refresh token from the cookie
             *   2. Validates and rotates it (issues a new httpOnly cookie)
             *   3. Returns { access_token } in the response body
             *
             * We use a bare axios.post (not axiosInstance) to avoid triggering
             * this same interceptor recursively on a nested 401.
             */
            const res = await axios.post<{ access_token: string }>(
                `${API_BASE_URL}/auth/refresh`,
                {},           // empty body — refresh token comes from cookie
                { withCredentials: true },
            )

            const newAccessToken = res.data.access_token
            tokenStore.set(newAccessToken)

            processQueue(null, newAccessToken)
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
            return axiosInstance(originalRequest)
        } catch (refreshError) {
            processQueue(refreshError, null)
            tokenStore.clear()
            // Session fully expired — redirect to login
            if (typeof window !== 'undefined') window.location.replace('/login')
            return Promise.reject(refreshError)
        } finally {
            isRefreshing = false
        }
    },
)

// ─── Typed HTTP helpers ───────────────────────────────────────────────────────

/**
 * GET request.
 * @example apiGet<User[]>('/users')
 */
export function apiGet<T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> {
    return axiosInstance.get<T>(url, config)
}

/**
 * POST request.
 * @example apiPost<TokenResponse>('/auth/login', { email, password })
 */
export function apiPost<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> {
    return axiosInstance.post<T>(url, data, config)
}

/**
 * PUT request (full replacement).
 * @example apiPut<User>('/users/123', updatedUser)
 */
export function apiPut<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> {
    return axiosInstance.put<T>(url, data, config)
}

/**
 * PATCH request (partial update).
 * @example apiPatch<User>('/users/123', { email: 'new@example.com' })
 */
export function apiPatch<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> {
    return axiosInstance.patch<T>(url, data, config)
}

/**
 * DELETE request.
 * @example apiDelete('/users/123')
 */
export function apiDelete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> {
    return axiosInstance.delete<T>(url, config)
}

export default axiosInstance

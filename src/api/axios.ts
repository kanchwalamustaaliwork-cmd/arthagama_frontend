/**
 * src/api/axios.ts
 *
 * Central Axios instance for all backend communication.
 *
 * TOKEN STRATEGY:
 *   Access token  → stored in `tokenStore` (in-memory module variable)
 *                   Read by the request interceptor and set as Authorization header.
 *
 *   Refresh token → stored in an httpOnly cookie (set by Next.js route handlers).
 *                   CANNOT be read by JS. The /api/auth/refresh route handler
 *                   reads it server-side using next/headers `cookies()`.
 *
 * SILENT REFRESH:
 *   On a 401 response, the interceptor calls POST /api/auth/refresh (no body).
 *   The route handler reads the httpOnly refresh cookie, calls the backend,
 *   sets a new httpOnly refresh cookie, and returns { access_token } in the body.
 *   The interceptor stores the new access token in tokenStore and retries.
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
    withCredentials: true, // sends the httpOnly refresh cookie on every request
})

// ─── Request Interceptor — attach access token from memory ───────────────────

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = tokenStore.get()
        if (token) {
            // Only set the header when a token actually exists.
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

        // Only attempt refresh on 401 and only once per request
        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error)
        }

        // If a refresh is already in flight, queue this request until it completes
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
            // POST /api/auth/refresh — NO body required.
            // The Next.js route handler reads the httpOnly refresh_token cookie
            // server-side (via next/headers cookies()) and calls the backend.
            // It returns { access_token } in the response body.
            const res = await axios.post<{ access_token: string }>(
                '/api/auth/refresh',
                {},
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
            // Redirect to login — session is fully expired
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
 * @example apiPost<Token>('/auth/login', { email, password })
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

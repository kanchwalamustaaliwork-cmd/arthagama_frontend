/**
 * src/lib/api/indices/indices.endpoints.ts
 *
 * Frontend API endpoint constants for Arthagama Indices.
 * Note: No version prefixes (/v1, /v2) per specification.
 */

export const INDICES_ENDPOINTS = {
    // User endpoints
    LIST: '/api/indices',
    SECTORS: '/api/indices/sectors',
    DETAIL: (indexId: number | string) => `/api/indices/${indexId}`,
    PERFORMANCE: (indexId: number | string) => `/api/indices/${indexId}/performance`,
    HISTORY: (indexId: number | string) => `/api/indices/${indexId}/history`,
    CONSTITUENTS: (indexId: number | string) => `/api/indices/${indexId}/constituents`,
    SEARCH_INSTRUMENTS: '/api/instruments/search',

    // Admin endpoints
    ADMIN_LIST: '/api/admin/indices',
    ADMIN_CREATE: '/api/admin/indices',
    ADMIN_DETAIL: (indexId: number | string) => `/api/admin/indices/${indexId}`,
    ADMIN_UPDATE: (indexId: number | string) => `/api/admin/indices/${indexId}`,
    ADMIN_DELETE: (indexId: number | string) => `/api/admin/indices/${indexId}`,
} as const

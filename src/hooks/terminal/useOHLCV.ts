'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Instrument, Interval } from '@/src/types/terminal'
import { Bar } from '@/src/lib/market-terminal/CandleChart'
import { chartSdk } from '@/src/lib/terminal-sdk'

/**
 * useOHLCV — fetches and manages OHLCV bar data for a chart instrument.
 *
 * Initial load:
 *   On mount (or when instrument/interval changes), fetches the default
 *   lookback window (limit bars) from the backend.
 *
 * Chart pagination:
 *   loadOlder() — fetches bars BEFORE bars[0] and prepends.
 *                 Returns the newly added bars so ChartWidget can call
 *                 chart.prepend() to preserve the current scroll position.
 *
 *   loadNewer() — fetches bars AFTER bars[bars.length-1] and appends.
 *                 Returns the newly added bars so ChartWidget can update
 *                 the right edge without resetting the view.
 *
 * Duplicate prevention:
 *   A loadingMoreRef guard prevents parallel or duplicate pagination requests.
 *   hasReachedHistoricalEnd / hasReachedLatestEnd prevent repeated API calls
 *   when no more data exists.  hasReachedLatestEnd auto-resets after 30 s so
 *   live data can be re-checked later.
 *
 * Deduplication:
 *   On every prepend/append, bars are merged by unix-second timestamp — first
 *   occurrence wins (existing bars take priority over newly fetched ones in
 *   the overlapping region).
 */
export function useOHLCV(instrument: Instrument, interval: Interval = '1d') {
    const [bars, setBars] = useState<Bar[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // barsRef always mirrors the bars state so pagination callbacks can
    // read the current value without being in their dependency arrays.
    const barsRef = useRef<Bar[]>([])
    useEffect(() => { barsRef.current = bars }, [bars])

    // Guards — use refs so callbacks always see the latest value without
    // needing to be in their dependency arrays.
    const loadingMoreRef             = useRef(false)
    const hasReachedHistoricalEndRef = useRef(false)
    const hasReachedLatestEndRef     = useRef(false)
    const latestEndTimerRef          = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Stable key that changes only when the actual instrument identity changes.
    // All fields that distinguish one contract from another must be included.
    const instrumentKey = [
        instrument.symbol,
        instrument.exchange,
        instrument.token ?? '',
        instrument.type,
        String(instrument.strike ?? ''),
        instrument.optionType ?? '',
        instrument.expiry ?? instrument.contractExpiry ?? '',
    ].join('|')

    // ── Initial load ─────────────────────────────────────────────────────────
    useEffect(() => {
        let isMounted = true

        setLoading(true)
        setError(null)

        // Reset pagination guards on every fresh load
        loadingMoreRef.current             = false
        hasReachedHistoricalEndRef.current = false
        hasReachedLatestEndRef.current     = false
        if (latestEndTimerRef.current) {
            clearTimeout(latestEndTimerRef.current)
            latestEndTimerRef.current = null
        }

        chartSdk
            .getCandles(instrument, interval)
            .then((data) => {
                if (isMounted) {
                    setBars(data)
                    setLoading(false)
                }
            })
            .catch((err) => {
                if (isMounted) {
                    setError(err?.message || 'Failed to load chart candles')
                    setLoading(false)
                }
            })

        return () => {
            isMounted = false
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [instrumentKey, interval])

    // ── loadOlder ────────────────────────────────────────────────────────────
    /**
     * Fetch bars before the current oldest bar and prepend them.
     *
     * Returns the newly added bars (deduplicated against current state) so
     * the caller (ChartWidget) can call chart.prepend() to keep the viewport
     * anchored to the user's current scroll position.
     *
     * Returns an empty array when:
     *   - a request is already in-flight
     *   - no bars are loaded yet
     *   - historical end has been reached (no more older data exists)
     */
    const loadOlder = useCallback(async (): Promise<Bar[]> => {
        if (loadingMoreRef.current || hasReachedHistoricalEndRef.current) return []

        const snapshot = barsRef.current
        if (!snapshot.length) return []

        loadingMoreRef.current = true
        try {
            // Request bars up to (but NOT including) the current oldest bar.
            const oldestBar = snapshot[0]
            const toDt = new Date((oldestBar.time - 1) * 1000)

            const olderBars = await chartSdk.getCandles(
                instrument, interval, 500, undefined, toDt
            )

            if (!olderBars.length) {
                hasReachedHistoricalEndRef.current = true
                return []
            }

            // Deduplicate: existing bars win over incoming ones at same timestamp.
            const existingTimes = new Set(snapshot.map((b) => b.time))
            const fresh = olderBars.filter((b) => !existingTimes.has(b.time))

            if (!fresh.length) {
                hasReachedHistoricalEndRef.current = true
                return []
            }

            // Merge into state (existing bars take priority on timestamp collision).
            setBars((prev) => {
                const existingT = new Set(prev.map((b) => b.time))
                const newOnes   = olderBars.filter((b) => !existingT.has(b.time))
                if (!newOnes.length) return prev
                return [...newOnes, ...prev].sort((a, b) => a.time - b.time)
            })

            return fresh
        } catch {
            // Silently ignore pagination errors — chart stays at current position.
            return []
        } finally {
            loadingMoreRef.current = false
        }
    }, [instrument, interval])

    // ── loadNewer ────────────────────────────────────────────────────────────
    /**
     * Fetch bars after the current newest bar and append them.
     *
     * Returns the newly added bars so ChartWidget can forward them to the
     * chart engine without resetting the viewport.
     *
     * When no newer data is found, sets hasReachedLatestEnd for 30 s to
     * prevent hammering the API.  Auto-resets so live data is re-checked later.
     */
    const loadNewer = useCallback(async (): Promise<Bar[]> => {
        if (loadingMoreRef.current || hasReachedLatestEndRef.current) return []

        const snapshot = barsRef.current
        if (!snapshot.length) return []

        loadingMoreRef.current = true
        try {
            // Request bars starting from (but NOT including) the newest bar.
            const newestBar = snapshot[snapshot.length - 1]
            const fromDt = new Date((newestBar.time + 1) * 1000)

            const newerBars = await chartSdk.getCandles(
                instrument, interval, 500, fromDt, undefined
            )

            if (!newerBars.length) {
                // No newer data — suppress for 30 s to avoid API spam.
                hasReachedLatestEndRef.current = true
                if (latestEndTimerRef.current) clearTimeout(latestEndTimerRef.current)
                latestEndTimerRef.current = setTimeout(() => {
                    hasReachedLatestEndRef.current = false
                }, 30_000)
                return []
            }

            // Reset the suppression if real data came back.
            hasReachedLatestEndRef.current = false

            const existingTimes = new Set(snapshot.map((b) => b.time))
            const fresh = newerBars.filter((b) => !existingTimes.has(b.time))

            if (!fresh.length) return []

            setBars((prev) => {
                const existingT = new Set(prev.map((b) => b.time))
                const newOnes   = newerBars.filter((b) => !existingT.has(b.time))
                if (!newOnes.length) return prev
                return [...prev, ...newOnes].sort((a, b) => a.time - b.time)
            })

            return fresh
        } catch {
            return []
        } finally {
            loadingMoreRef.current = false
        }
    }, [instrument, interval])

    return { bars, loading, error, loadOlder, loadNewer }
}

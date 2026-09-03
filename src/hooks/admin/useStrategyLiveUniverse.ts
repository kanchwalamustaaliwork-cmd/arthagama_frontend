/**
 * src/hooks/admin/useStrategyLiveUniverse.ts
 *
 * Consolidated hook for strategy Universe and real-time market data.
 *
 * Fetches the universe snapshot (universe name, constituents, active holdings,
 * initial LTP quotes) and maintains a live WebSocket connection to receive
 * tick-by-tick updates.
 */

import { useEffect, useState, useRef, useCallback } from 'react'
import { fetchStrategyLiveUniverse, fetchStrategyWSTicket } from '@/src/services/admin/adminApi'
import type { LiveUniverseResponse, LiveInstrumentItem, LTPRecord } from '@/src/types/admin'

export type LiveUniverseStatus = 'loading' | 'connected' | 'error' | 'empty'

export function useStrategyLiveUniverse(strategyId: string) {
    const [data, setData] = useState<LiveUniverseResponse | null>(null)
    const [itemsMap, setItemsMap] = useState<Record<string, LiveInstrumentItem>>({})
    const [status, setStatus] = useState<LiveUniverseStatus>('loading')
    const [reconnectCount, setReconnectCount] = useState(0)

    const socketRef = useRef<WebSocket | null>(null)
    const mountedRef = useRef(true)
    const itemsMapRef = useRef<Record<string, LiveInstrumentItem>>({})

    useEffect(() => {
        mountedRef.current = true
        return () => {
            mountedRef.current = false
            if (socketRef.current) {
                socketRef.current.close()
            }
        }
    }, [])

    itemsMapRef.current = itemsMap

    // 1. Initial REST fetch for snapshot
    const loadSnapshot = useCallback(async (isCurrent: { val: boolean }) => {
        try {
            const resp = await fetchStrategyLiveUniverse(strategyId)
            if (!isCurrent.val || !mountedRef.current) return resp

            setData(resp)
            const initialMap: Record<string, LiveInstrumentItem> = {}
            resp.items.forEach(item => {
                initialMap[item.ticker] = item
            })
            setItemsMap(initialMap)
            return resp
        } catch (err) {
            console.warn('Could not fetch live universe snapshot:', err)
            return null
        }
    }, [strategyId])

    // 2. WebSocket connection for streaming updates
    useEffect(() => {
        if (!strategyId) return
        const isCurrent = { val: true }
        setStatus('loading')

        async function init() {
            const snapshot = await loadSnapshot(isCurrent)
            if (!isCurrent.val || !mountedRef.current) return

            try {
                const ticket = await fetchStrategyWSTicket(strategyId)
                if (!isCurrent.val || !mountedRef.current) return

                let base = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''
                if (!base && typeof window !== 'undefined') {
                    base = `${window.location.protocol === 'https:' ? 'https:' : 'http:'}//${window.location.host}/api`
                }
                const wsProtocol = base.startsWith('https') ? 'wss:' : 'ws:'
                const cleanBase = base.replace(/^https?:\/\//i, '')
                const wsUrl = `${wsProtocol}//${cleanBase}/admin/strategies/${strategyId}/live-universe/ws?ticket=${ticket}`

                const ws = new WebSocket(wsUrl)
                socketRef.current = ws

                ws.onopen = () => {
                    if (!isCurrent.val || !mountedRef.current) { ws.close(); return }
                    setStatus('connected')
                    setReconnectCount(0)
                }

                ws.onmessage = (event) => {
                    if (!isCurrent.val || !mountedRef.current) return
                    try {
                        const msg = JSON.parse(event.data)
                        if (msg.type === 'snapshot' || msg.type === 'update') {
                            const rawRecords: LTPRecord[] = Array.isArray(msg.data) ? msg.data : []
                            if (rawRecords.length > 0) {
                                setItemsMap(prev => {
                                    const next = { ...prev }
                                    rawRecords.forEach(rec => {
                                        const existing = next[rec.ticker]
                                        if (existing) {
                                            const pnl = rec.pnl != null
                                                ? rec.pnl
                                                : existing.isHolding && existing.avgPrice > 0
                                                    ? roundPnl((rec.latestPrice - existing.avgPrice) * existing.quantity)
                                                    : existing.unrealizedPnl

                                            next[rec.ticker] = {
                                                ...existing,
                                                latestPrice: rec.latestPrice,
                                                timestamp: rec.timestamp || existing.timestamp,
                                                unrealizedPnl: pnl,
                                            }
                                        } else {
                                            // New ticker discovered via stream
                                            next[rec.ticker] = {
                                                ticker: rec.ticker,
                                                inUniverse: true,
                                                isHolding: Boolean(rec.isHolding),
                                                quantity: rec.quantity || 0,
                                                avgPrice: rec.avgPrice || 0,
                                                unrealizedPnl: rec.pnl,
                                                latestPrice: rec.latestPrice,
                                                timestamp: rec.timestamp,
                                            }
                                        }
                                    })
                                    return next
                                })
                            }
                            setStatus('connected')
                        }
                    } catch (err) {
                        console.error('Error parsing live universe WS tick:', err)
                    }
                }

                ws.onerror = () => {
                    if (!isCurrent.val || !mountedRef.current) return
                    setStatus('error')
                }

                ws.onclose = (event) => {
                    if (!isCurrent.val || !mountedRef.current) return
                    if (event.code === 1008) {
                        setStatus('empty')
                        return
                    }
                    if (reconnectCount < 3) {
                        const delay = Math.pow(2, reconnectCount) * 1000
                        setTimeout(() => {
                            if (mountedRef.current && isCurrent.val) {
                                setReconnectCount(c => c + 1)
                            }
                        }, delay)
                    } else {
                        if (Object.keys(itemsMapRef.current).length === 0) {
                            setStatus('empty')
                        }
                    }
                }
            } catch (err) {
                console.error('Failed to initialize live universe WebSocket:', err)
                if (snapshot && snapshot.items.length > 0) {
                    setStatus('connected') // Still show snapshot data
                } else {
                    setStatus('error')
                }
            }
        }

        init()

        return () => {
            isCurrent.val = false
            if (socketRef.current) {
                socketRef.current.close()
            }
        }
    }, [strategyId, loadSnapshot, reconnectCount])

    const items = Object.values(itemsMap).sort((a, b) => {
        if (a.isHolding !== b.isHolding) {
            return a.isHolding ? -1 : 1
        }
        return a.ticker.localeCompare(b.ticker)
    })

    const totalConstituents = data?.totalConstituents || items.length
    const activeHoldingsCount = items.filter(it => it.isHolding).length
    const watchingCount = items.length - activeHoldingsCount

    return {
        universe: data,
        items,
        status,
        isConnected: status === 'connected',
        totalConstituents,
        activeHoldingsCount,
        watchingCount,
        retry: () => setReconnectCount(c => c + 1),
    }
}

function roundPnl(val: number): number {
    return Math.round(val * 100) / 100
}

// Re-export useStrategyLTP for full backwards compatibility
export { useStrategyLTP } from './useStrategyLTP'

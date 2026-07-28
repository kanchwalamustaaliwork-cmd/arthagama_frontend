/**
 * src/hooks/admin/useStrategyLTP.ts
 *
 * Reusable hook that opens the LTP WebSocket for a given strategy and
 * maintains a map of ticker → LTPRecord (including the live `pnl` field).
 *
 * Both StrategyLtpTab and StrategyHoldingsTab consume this hook so the
 * WebSocket is only opened once per tab — no extra API calls are made.
 */

import { useEffect, useState, useRef } from 'react'
import { fetchStrategyWSTicket } from '@/src/services/admin/adminApi'
import type { LTPRecord } from '@/src/types/admin'

export type LTPStatus = 'loading' | 'connected' | 'error' | 'empty'

export function useStrategyLTP(strategyId: string) {
    const [ltpRecords, setLtpRecords] = useState<Record<string, LTPRecord>>({})
    const [status, setStatus] = useState<LTPStatus>('loading')
    const [reconnectCount, setReconnectCount] = useState(0)
    const socketRef = useRef<WebSocket | null>(null)
    const mountedRef = useRef(true)
    // Keep a ref to the latest ltpRecords for use inside onclose without stale closures
    const ltpRecordsRef = useRef<Record<string, LTPRecord>>({})

    useEffect(() => {
        mountedRef.current = true
        return () => {
            mountedRef.current = false
            if (socketRef.current) {
                socketRef.current.close()
            }
        }
    }, [])

    // Sync ref with state on every render
    ltpRecordsRef.current = ltpRecords

    useEffect(() => {
        let isCurrent = true
        setStatus('loading')

        async function connect() {
            try {
                const ticket = await fetchStrategyWSTicket(strategyId)
                if (!isCurrent || !mountedRef.current) return

                let base = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''
                if (!base && typeof window !== 'undefined') {
                    base = `${window.location.protocol === 'https:' ? 'https:' : 'http:'}//${window.location.host}/api`
                }
                const wsProtocol = base.startsWith('https') ? 'wss:' : 'ws:'
                const cleanBase = base.replace(/^https?:\/\//i, '')
                const wsUrl = `${wsProtocol}//${cleanBase}/admin/strategies/${strategyId}/ltp/ws?ticket=${ticket}`

                const ws = new WebSocket(wsUrl)
                socketRef.current = ws

                ws.onopen = () => {
                    if (!isCurrent || !mountedRef.current) { ws.close(); return }
                    setStatus('connected')
                    setReconnectCount(0)
                }

                ws.onmessage = (event) => {
                    if (!isCurrent || !mountedRef.current) return
                    try {
                        const msg = JSON.parse(event.data)
                        if (msg.type === 'snapshot') {
                            const initialRecords: Record<string, LTPRecord> = {}
                            if (msg.data && Array.isArray(msg.data)) {
                                msg.data.forEach((rec: LTPRecord) => {
                                    initialRecords[rec.ticker] = rec
                                })
                            }
                            setLtpRecords(initialRecords)
                            setStatus(Object.keys(initialRecords).length === 0 ? 'empty' : 'connected')
                        } else if (msg.type === 'update') {
                            setLtpRecords(prev => {
                                const next = { ...prev }
                                if (msg.data && Array.isArray(msg.data)) {
                                    msg.data.forEach((rec: LTPRecord) => {
                                        next[rec.ticker] = rec
                                    })
                                }
                                return next
                            })
                            setStatus('connected')
                        }
                    } catch (err) {
                        console.error('Error parsing WS message:', err)
                    }
                }

                ws.onerror = () => {
                    if (!isCurrent || !mountedRef.current) return
                    setStatus('error')
                }

                ws.onclose = (event) => {
                    if (!isCurrent || !mountedRef.current) return
                    if (event.code === 1008) {
                        setStatus('empty')
                        return
                    }
                    if (reconnectCount < 3) {
                        const delay = Math.pow(2, reconnectCount) * 1000
                        setTimeout(() => {
                            if (mountedRef.current && isCurrent) {
                                setReconnectCount(c => c + 1)
                            }
                        }, delay)
                    } else {
                        if (Object.keys(ltpRecordsRef.current).length === 0) {
                            setStatus('empty')
                        }
                    }
                }
            } catch (err) {
                console.error('Failed to initialize WebSocket connect:', err)
                if (isCurrent && mountedRef.current) {
                    setStatus('empty')
                }
            }
        }

        connect()

        return () => {
            isCurrent = false
            if (socketRef.current) {
                socketRef.current.close()
                socketRef.current = null
            }
        }
    }, [strategyId, reconnectCount])

    return { ltpRecords, status }
}

/**
 * src/hooks/stockdashboard/usePeerComparison.ts
 *
 * Hook for managing peer comparison data, peer additions/removals,
 * and metric category views for the Fundamentals tab.
 */

'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { PeerCompanyMetricData, PeerComparisonResponse } from '@/src/types/stockdashboard'
import { getPeers } from '@/src/lib/api/stockdashboard/fundamentals.api'

const MAX_COMPANIES = 6

export function usePeerComparison(exchange: string, symbol: string) {
    const [data, setData] = useState<PeerComparisonResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedPeerSymbols, setSelectedPeerSymbols] = useState<string[]>([])

    // Fetch peer comparison data
    const fetchPeers = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await getPeers(exchange, symbol)
            setData(res)
            setSelectedPeerSymbols(res.initialPeerSymbols)
        } catch (err: any) {
            setError(err?.message || 'Failed to load peer comparison data')
        } finally {
            setLoading(false)
        }
    }, [exchange, symbol])

    useEffect(() => {
        fetchPeers()
    }, [fetchPeers])

    // Current stock is ALWAYS first
    const displayedCompanies = useMemo<PeerCompanyMetricData[]>(() => {
        if (!data) return []
        const list: PeerCompanyMetricData[] = [data.currentStock]

        selectedPeerSymbols.forEach(sym => {
            const peer = data.availablePeers.find(p => p.symbol === sym)
            if (peer) {
                list.push(peer)
            }
        })

        return list
    }, [data, selectedPeerSymbols])

    // Unselected peers available to be added
    const availableToAdd = useMemo<PeerCompanyMetricData[]>(() => {
        if (!data) return []
        return data.availablePeers.filter(p => !selectedPeerSymbols.includes(p.symbol))
    }, [data, selectedPeerSymbols])

    // Add peer
    const addPeer = useCallback((peerSymbol: string) => {
        if (displayedCompanies.length >= MAX_COMPANIES) return
        if (selectedPeerSymbols.includes(peerSymbol)) return

        setSelectedPeerSymbols(prev => [...prev, peerSymbol])
    }, [displayedCompanies.length, selectedPeerSymbols])

    // Remove peer (current stock cannot be removed)
    const removePeer = useCallback((peerSymbol: string) => {
        if (data && peerSymbol === data.currentStock.symbol) return
        setSelectedPeerSymbols(prev => prev.filter(s => s !== peerSymbol))
    }, [data])

    const canAddMore = displayedCompanies.length < MAX_COMPANIES

    return {
        data,
        loading,
        error,
        displayedCompanies,
        availableToAdd,
        addPeer,
        removePeer,
        canAddMore,
        maxCompanies: MAX_COMPANIES,
    }
}

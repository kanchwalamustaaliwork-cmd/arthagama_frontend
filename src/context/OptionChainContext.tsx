'use client'

import React, { createContext, useContext, useState } from 'react'

interface OptionChainContextValue {
    // ── Strike Selection (renamed existing component) ─────────────────────
    isStrikeSelectionOpen: boolean
    openStrikeSelection: () => void
    closeStrikeSelection: () => void
    toggleStrikeSelection: () => void

    // Backward compatibility aliases for Strike Selection
    isOpen: boolean
    openChain: () => void
    closeChain: () => void
    toggleChain: () => void

    // ── New Option Chain (dedicated full-page feature) ────────────────────
    isOptionChainOpen: boolean
    openOptionChain: () => void
    closeOptionChain: () => void
    toggleOptionChain: () => void
}

const OptionChainContext = createContext<OptionChainContextValue>({
    isStrikeSelectionOpen: false,
    openStrikeSelection: () => {},
    closeStrikeSelection: () => {},
    toggleStrikeSelection: () => {},

    isOpen: false,
    openChain: () => {},
    closeChain: () => {},
    toggleChain: () => {},

    isOptionChainOpen: false,
    openOptionChain: () => {},
    closeOptionChain: () => {},
    toggleOptionChain: () => {},
})

export function OptionChainProvider({ children }: { children: React.ReactNode }) {
    const [isStrikeSelectionOpen, setIsStrikeSelectionOpen] = useState(false)
    const [isOptionChainOpen, setIsOptionChainOpen] = useState(false)

    const openStrikeSelection = () => setIsStrikeSelectionOpen(true)
    const closeStrikeSelection = () => setIsStrikeSelectionOpen(false)
    const toggleStrikeSelection = () => setIsStrikeSelectionOpen((prev) => !prev)

    const openOptionChain = () => setIsOptionChainOpen(true)
    const closeOptionChain = () => setIsOptionChainOpen(false)
    const toggleOptionChain = () => setIsOptionChainOpen((prev) => !prev)

    return (
        <OptionChainContext.Provider
            value={{
                isStrikeSelectionOpen,
                openStrikeSelection,
                closeStrikeSelection,
                toggleStrikeSelection,

                // Legacy aliases map to Strike Selection
                isOpen: isStrikeSelectionOpen,
                openChain: openStrikeSelection,
                closeChain: closeStrikeSelection,
                toggleChain: toggleStrikeSelection,

                // New Option Chain
                isOptionChainOpen,
                openOptionChain,
                closeOptionChain,
                toggleOptionChain,
            }}
        >
            {children}
        </OptionChainContext.Provider>
    )
}

export function useOptionChainContext() {
    return useContext(OptionChainContext)
}

// Named alias for cleaner readability
export const useStrikeSelectionContext = useOptionChainContext
export const StrikeSelectionProvider = OptionChainProvider

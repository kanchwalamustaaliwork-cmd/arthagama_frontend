'use client'

import React, { createContext, useContext, useState } from 'react'

interface OptionChainContextValue {
    isOpen: boolean
    openChain: () => void
    closeChain: () => void
    toggleChain: () => void
}

const OptionChainContext = createContext<OptionChainContextValue>({
    isOpen: false,
    openChain: () => {},
    closeChain: () => {},
    toggleChain: () => {},
})

export function OptionChainProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)

    const openChain = () => setIsOpen(true)
    const closeChain = () => setIsOpen(false)
    const toggleChain = () => setIsOpen((prev) => !prev)

    return (
        <OptionChainContext.Provider value={{ isOpen, openChain, closeChain, toggleChain }}>
            {children}
        </OptionChainContext.Provider>
    )
}

export function useOptionChainContext() {
    return useContext(OptionChainContext)
}

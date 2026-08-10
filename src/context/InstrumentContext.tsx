'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Instrument, InstrumentType } from '@/src/types/terminal'

const DEFAULT_INSTRUMENT: Instrument = {
    symbol: 'RELIANCE',
    displayName: 'RELIANCE',
    type: 'equity',
    exchange: 'NSE',
    name: 'Reliance Industries Ltd.',
}

interface InstrumentContextValue {
    instrument: Instrument
    setInstrument: (inst: Instrument) => void
    selectBySymbol: (symbol: string, type?: InstrumentType, name?: string) => void
}

const InstrumentContext = createContext<InstrumentContextValue | undefined>(undefined)

export function InstrumentProvider({ children }: { children: React.ReactNode }) {
    const [instrument, setInstrument] = useState<Instrument>(DEFAULT_INSTRUMENT)

    const selectBySymbol = (symbol: string, type: InstrumentType = 'equity', name?: string) => {
        const cleanSym = symbol.trim().toUpperCase()
        setInstrument({
            symbol: cleanSym,
            displayName: cleanSym,
            type,
            exchange: 'NSE',
            name: name || cleanSym,
        })
    }

    return (
        <InstrumentContext.Provider value={{ instrument, setInstrument, selectBySymbol }}>
            {children}
        </InstrumentContext.Provider>
    )
}

export function useInstrument() {
    const context = useContext(InstrumentContext)
    if (!context) {
        throw new Error('useInstrument must be used within an InstrumentProvider')
    }
    return context
}

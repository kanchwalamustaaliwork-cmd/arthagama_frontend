'use client'

import React from 'react'

export type InstrumentTypeFilter = 'all' | 'equity' | 'index' | 'futures' | 'options'
export type ExchangeFilter = 'all' | 'NSE' | 'BSE'

interface SearchFiltersProps {
    instrumentType: InstrumentTypeFilter
    exchange: ExchangeFilter
    onInstrumentTypeChange: (v: InstrumentTypeFilter) => void
    onExchangeChange: (v: ExchangeFilter) => void
}

const INSTRUMENT_TYPES: { value: InstrumentTypeFilter; label: string }[] = [
    { value: 'all',     label: 'All' },
    { value: 'equity',  label: 'EQ' },
    { value: 'index',   label: 'INDX' },
    { value: 'futures', label: 'FUT' },
    { value: 'options', label: 'OPT' },
]

const EXCHANGES: { value: ExchangeFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'NSE', label: 'NSE' },
    { value: 'BSE', label: 'BSE' },
]

export default function SearchFilters({
    instrumentType,
    exchange,
    onInstrumentTypeChange,
    onExchangeChange,
}: SearchFiltersProps) {
    const btnStyle = (active: boolean, color = '#a855f7'): React.CSSProperties => ({
        padding: '2px 8px',
        fontSize: '10px',
        fontWeight: 600,
        borderRadius: '4px',
        border: `1px solid ${active ? color : 'rgba(255,255,255,0.1)'}`,
        background: active ? `${color}22` : 'transparent',
        color: active ? color : '#7d848c',
        cursor: 'pointer',
        transition: 'all 0.15s',
    })

    return (
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', padding: '4px 0' }}>
            {/* Exchange filter */}
            <div style={{ display: 'flex', gap: '3px' }}>
                {EXCHANGES.map((e) => (
                    <button
                        key={e.value}
                        id={`search-filter-exchange-${e.value}`}
                        onClick={() => onExchangeChange(e.value)}
                        style={btnStyle(exchange === e.value, '#4a9fd4')}
                    >
                        {e.label}
                    </button>
                ))}
            </div>

            <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.08)' }} />

            {/* Instrument-type filter */}
            <div style={{ display: 'flex', gap: '3px' }}>
                {INSTRUMENT_TYPES.map((t) => (
                    <button
                        key={t.value}
                        id={`search-filter-type-${t.value}`}
                        onClick={() => onInstrumentTypeChange(t.value)}
                        style={btnStyle(instrumentType === t.value)}
                    >
                        {t.label}
                    </button>
                ))}
            </div>
        </div>
    )
}

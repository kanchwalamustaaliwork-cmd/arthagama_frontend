'use client'

import React from 'react'
import { ContractPickerResult, ContractItem, Instrument } from '@/src/types/terminal'

interface Props {
    result: ContractPickerResult
    activeIdx: number
    onSelect: (inst: Instrument) => void
    onHover: (idx: number) => void
}

export default function SearchResultContractPicker({ result, activeIdx, onSelect, onHover }: Props) {
    const toInstrument = (c: ContractItem): Instrument => ({
        symbol: c.symbol,
        tradingSymbol: c.trading_symbol,
        displayName: c.trading_symbol,
        type: (c.instrument_type.toLowerCase() === 'option' ? 'options' : c.instrument_type.toLowerCase()) as any,
        exchange: c.display_exchange,
        strike: c.strike ?? undefined,
        optionType: c.option_type ?? undefined,
        expiry: c.expiry ?? undefined,
        token: c.token,
        segment: c.segment,
        lotSize: c.lot_size,
    })

    return (
        <>
            {result.contracts.map((c, idx) => (
                <div
                    key={`${c.token}-${idx}`}
                    id={`contract-picker-${c.token}`}
                    onClick={() => onSelect(toInstrument(c))}
                    onMouseEnter={() => onHover(idx)}
                    style={{
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: idx === activeIdx ? 'rgba(168,85,247,0.18)' : 'transparent',
                        borderBottom: '1px solid rgba(255,255,255,0.03)',
                        cursor: 'pointer',
                    }}
                >
                    <div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#fff', fontFamily: 'Consolas, monospace' }}>
                            {c.trading_symbol}
                        </div>
                        <div style={{ fontSize: '10.5px', color: '#7d848c', marginTop: '1px' }}>
                            {c.display_exchange} · {c.expiry} · lot {c.lot_size}
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        {c.strike != null && (
                            <span style={{ fontSize: '11px', color: '#fff', fontFamily: 'Consolas, monospace' }}>
                                {c.strike}
                            </span>
                        )}
                        {c.option_type && (
                            <span style={{
                                fontSize: '10px', fontWeight: 700,
                                color: c.option_type === 'CE' ? '#26a65b' : '#e0524b',
                                background: c.option_type === 'CE' ? 'rgba(38,166,91,0.15)' : 'rgba(224,82,75,0.15)',
                                padding: '2px 6px', borderRadius: '4px',
                            }}>
                                {c.option_type}
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </>
    )
}

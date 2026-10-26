/**
 * src/components/stockdashboard/shared/CompanyDescriptionBox.tsx
 *
 * Compact square box displaying company background, sector, and key corporate
 * facts in the persistent StockHeader across all tabs.
 */

'use client'

import React from 'react'
import { Building2, MapPin, Calendar } from 'lucide-react'
import { CompanyProfile } from '@/src/types/stockdashboard'

interface CompanyDescriptionBoxProps {
    profile: CompanyProfile
}

export function CompanyDescriptionBox({ profile }: CompanyDescriptionBoxProps) {
    return (
        <div
            style={{
                background: 'var(--db-surface, #18282C)',
                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                borderRadius: '16px',
                padding: '18px 20px',
                marginBottom: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: 'calc(100% - 20px)',
                boxSizing: 'border-box',
            }}
        >
            {/* Top: Section Header & Description */}
            <div>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                        marginBottom: '10px',
                        paddingBottom: '10px',
                        borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.08))',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <Building2 size={14} color="var(--db-mint, #B8CEC2)" />
                        <h4
                            style={{
                                fontSize: '13px',
                                fontWeight: 700,
                                color: 'var(--db-mint, #B8CEC2)',
                                margin: 0,
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em',
                            }}
                        >
                            About {profile.symbol}
                        </h4>
                    </div>
                    {profile.sector && (
                        <span
                            style={{
                                fontSize: '10.5px',
                                padding: '2px 7px',
                                borderRadius: '4px',
                                background: 'rgba(184, 206, 194, 0.10)',
                                color: 'var(--db-mint, #B8CEC2)',
                                fontWeight: 600,
                            }}
                        >
                            {profile.sector}
                        </span>
                    )}
                </div>

                {/* Description Body with clean scrolling */}
                <div
                    style={{
                        fontSize: '12px',
                        lineHeight: 1.55,
                        color: 'var(--db-text-2, #A5B7B3)',
                        maxHeight: '130px',
                        overflowY: 'auto',
                        paddingRight: '4px',
                        scrollbarWidth: 'thin',
                    }}
                >
                    {profile.description || 'No corporate description available for this instrument.'}
                </div>
            </div>

            {/* Bottom: Compact corporate metadata pills */}
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    paddingTop: '12px',
                    marginTop: '12px',
                    borderTop: '1px solid var(--db-border, rgba(184, 206, 194, 0.08))',
                }}
            >
                {profile.ceo && (
                    <div
                        style={{
                            fontSize: '11px',
                            background: 'var(--db-elevated, #20353A)',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            border: '1px solid rgba(184, 206, 194, 0.08)',
                            color: 'var(--db-text-muted, #708482)',
                        }}
                    >
                        <span>CEO: </span>
                        <span style={{ color: 'var(--db-text, #F7FAF9)', fontWeight: 600 }}>{profile.ceo}</span>
                    </div>
                )}
                {profile.headquarters && (
                    <div
                        style={{
                            fontSize: '11px',
                            background: 'var(--db-elevated, #20353A)',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            border: '1px solid rgba(184, 206, 194, 0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                        }}
                    >
                        <MapPin size={10} color="var(--db-mint, #B8CEC2)" />
                        <span style={{ color: 'var(--db-text, #F7FAF9)', fontWeight: 500 }}>{profile.headquarters}</span>
                    </div>
                )}
                {profile.foundedYear && (
                    <div
                        style={{
                            fontSize: '11px',
                            background: 'var(--db-elevated, #20353A)',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            border: '1px solid rgba(184, 206, 194, 0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                        }}
                    >
                        <Calendar size={10} color="var(--db-mint, #B8CEC2)" />
                        <span style={{ color: 'var(--db-text, #F7FAF9)', fontWeight: 500 }}>Est. {profile.foundedYear}</span>
                    </div>
                )}
            </div>
        </div>
    )
}

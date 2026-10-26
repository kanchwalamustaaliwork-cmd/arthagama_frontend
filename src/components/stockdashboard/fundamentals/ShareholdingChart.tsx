/**
 * src/components/stockdashboard/fundamentals/ShareholdingChart.tsx
 *
 * Visual distribution of ownership among Promoters, FIIs, DIIs, and Public.
 */

'use client'

import React from 'react'

interface ShareholdingProps {
    trends: {
        quarter: string
        promoter: number
        fii: number
        dii: number
        public: number
    }[]
}

export function ShareholdingChart({ trends }: ShareholdingProps) {
    const latest = trends[trends.length - 1] || { promoter: 50, fii: 20, dii: 18, public: 12, quarter: "Q4 '24" }

    const slices = [
        { label: 'Promoter & Promoter Group', pct: latest.promoter, color: '#B8CEC2' },
        { label: 'Foreign Institutional (FII)', pct: latest.fii, color: '#5FAFD7' },
        { label: 'Domestic Institutional (DII)', pct: latest.dii, color: '#F3B84D' },
        { label: 'Public & Retail Shareholders', pct: latest.public, color: '#708482' },
    ]

    return (
        <div
            style={{
                background: 'var(--db-surface, #18282C)',
                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                borderRadius: '16px',
                padding: '24px',
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)', margin: 0 }}>
                    Shareholding Distribution ({latest.quarter})
                </h4>
                <span style={{ fontSize: '11px', color: 'var(--db-text-muted, #708482)' }}>Quarterly BSE / NSE Filings</span>
            </div>

            {/* Stacked Percentage Bar */}
            <div
                style={{
                    height: '24px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    display: 'flex',
                    marginBottom: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}
            >
                {slices.map(s => (
                    <div
                        key={s.label}
                        style={{
                            width: `${s.pct}%`,
                            background: s.color,
                            transition: 'width 0.4s ease',
                        }}
                        title={`${s.label}: ${s.pct}%`}
                    />
                ))}
            </div>

            {/* Legend & Metric Breakdown */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                }}
            >
                {slices.map(s => (
                    <div
                        key={s.label}
                        style={{
                            background: 'var(--db-elevated, #20353A)',
                            borderRadius: '10px',
                            padding: '12px 14px',
                            border: '1px solid var(--db-border, rgba(184, 206, 194, 0.08))',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: s.color }} />
                            <span style={{ fontSize: '12px', color: 'var(--db-text-muted, #708482)' }}>{s.label}</span>
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Consolas, monospace', color: 'var(--db-text, #F7FAF9)', marginLeft: '18px' }}>
                            {s.pct.toFixed(2)}%
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

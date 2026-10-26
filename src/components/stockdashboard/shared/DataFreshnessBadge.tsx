/**
 * src/components/stockdashboard/shared/DataFreshnessBadge.tsx
 *
 * Prominent badge & banner clearly identifying market figures as simulated mock data.
 * Complies with strict rule: "Never present static prices as live prices."
 */

'use client'

import React from 'react'
import { Info, Sparkles } from 'lucide-react'

export function DataFreshnessBadge({ compact = false }: { compact?: boolean }) {
    if (compact) {
        return (
            <span
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: 'rgba(184, 206, 194, 0.10)',
                    border: '1px solid var(--db-border, rgba(184, 206, 194, 0.15))',
                    fontSize: '11px',
                    color: 'var(--db-mint, #B8CEC2)',
                    fontWeight: 500,
                    letterSpacing: '0.02em',
                }}
            >
                <Sparkles size={11} color="var(--db-mint, #B8CEC2)" />
                Mock Demo Data
            </span>
        )
    }

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 14px',
                borderRadius: '8px',
                background: 'rgba(32, 53, 58, 0.65)',
                border: '1px solid rgba(184, 206, 194, 0.12)',
                marginBottom: '16px',
                fontSize: '12px',
                color: 'var(--db-text-2, #A5B7B3)',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Info size={14} color="var(--db-mint, #B8CEC2)" />
                <span>
                    <strong>Simulated Market Environment:</strong> Figures and financial metrics are static mock fixtures for admin evaluation.
                </span>
            </div>
            <span
                style={{
                    fontSize: '11px',
                    color: 'var(--db-mint-dim, rgba(184, 206, 194, 0.75))',
                    fontFamily: 'Consolas, monospace',
                }}
            >
                API: Mock Static Provider
            </span>
        </div>
    )
}

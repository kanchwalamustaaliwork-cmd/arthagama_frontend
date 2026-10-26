/**
 * app/admin/stockdashboard/layout.tsx
 *
 * Module-level layout for Admin Stock Research & Screening.
 * Wraps all 8 child pages with the shared navigation tabs.
 */

import React from 'react'
import type { Metadata } from 'next'
import { StockDashboardNav } from '@/src/components/stockdashboard/shared/StockDashboardNav'

export const metadata: Metadata = {
    title: 'Stock Research & Screener — Admin | Arthagama',
    description: 'Institutional-grade fundamental analysis, multi-stock comparison, and equity screening.',
}

export default function StockDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
            <StockDashboardNav />
            {children}
        </div>
    )
}

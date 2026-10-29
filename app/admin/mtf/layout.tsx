import React from 'react'
import type { Metadata } from 'next'
import { MtfNav } from '@/src/components/mtf/shared/MtfNav'

export const metadata: Metadata = {
  title: 'MTF Analytics & Margin Intelligence — Admin | Arthagama',
  description: 'Institutional-grade Margin Trading Facility intelligence, broker books, funding, and leverage risk analytics.',
}

export default function MtfLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', width: '100%', padding: '0 4px' }}>
      <MtfNav />
      {children}
    </div>
  )
}

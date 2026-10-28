import React from 'react'
import { MtfNav } from '@/src/components/mtf/shared/MtfNav'

export default function MtfLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <MtfNav />
      {children}
    </div>
  )
}

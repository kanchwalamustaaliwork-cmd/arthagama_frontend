import React from 'react'
import { formatDate } from '@/src/utils/mtf/formatters'

interface Props { asOf?: string | null; note?: string; className?: string }

export function AsOfBadge({ asOf, note, className }: Props) {
  return (
    <div className={`flex flex-wrap items-center gap-2 text-xs text-gray-500 ${className ?? ''}`}>
      {asOf && <span className="rounded-full bg-gray-100 px-2 py-0.5">Data as of <strong>{formatDate(asOf)}</strong></span>}
      <span className="rounded-full bg-gray-100 px-2 py-0.5">Source: NSE/BSE via mtf.trading</span>
      {note && <span className="text-amber-600">{note}</span>}
    </div>
  )
}

import React from 'react'
import { MTF_NOT_ADVICE, MTF_LICENCE_LINE, MTF_ATTRIBUTION } from '@/src/utils/mtf/formatters'

interface Props { className?: string; extraDisclaimer?: string }

export function SourceAttribution({ className, extraDisclaimer }: Props) {
  return (
    <div className={`mt-6 border-t pt-4 text-xs text-gray-500 space-y-1 ${className ?? ''}`}>
      {extraDisclaimer && <p className="text-amber-700">{extraDisclaimer}</p>}
      <p>{MTF_NOT_ADVICE}</p>
      <p>{MTF_ATTRIBUTION}</p>
      <p>{MTF_LICENCE_LINE}</p>
    </div>
  )
}

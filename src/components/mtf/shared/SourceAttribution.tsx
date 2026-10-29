import React from 'react'
import { MTF_NOT_ADVICE, MTF_LICENCE_LINE, MTF_ATTRIBUTION } from '@/src/utils/mtf/formatters'

interface Props {
  className?: string
  extraDisclaimer?: string
}

export function SourceAttribution({ className, extraDisclaimer }: Props) {
  return (
    <div
      style={{
        marginTop: '32px',
        borderTop: '1px solid var(--db-border, rgba(184, 206, 194, 0.08))',
        paddingTop: '16px',
        paddingBottom: '24px',
        fontSize: '11.5px',
        color: 'var(--db-text-muted, #708482)',
        lineHeight: 1.6,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}
      className={className}
    >
      {extraDisclaimer && (
        <p style={{ color: '#F59E0B', margin: 0 }}>{extraDisclaimer}</p>
      )}
      <p style={{ margin: 0 }}>{MTF_NOT_ADVICE}</p>
      <p style={{ margin: 0 }}>{MTF_ATTRIBUTION}</p>
      <p style={{ margin: 0 }}>{MTF_LICENCE_LINE}</p>
    </div>
  )
}

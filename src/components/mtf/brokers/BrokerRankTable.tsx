'use client'

import React from 'react'
import type { BrokerBookItem } from '@/src/types/mtf'
import { formatCr, formatPct, MTF_BROKER_CAVEAT } from '@/src/utils/mtf/formatters'
import { getBrokerName, getBrokerColor } from '@/src/utils/mtf/broker-meta'
import { TableSkeleton } from '@/src/components/stockdashboard/shared/Skeletons'
import { AlertCircle, ExternalLink } from 'lucide-react'

interface BrokerRankTableProps {
  items: BrokerBookItem[]
  isLoading?: boolean
  selectedBrokerId?: string | null
  onSelectBroker?: (brokerId: string | null) => void
  caveat?: string
}

export function BrokerRankTable({
  items,
  isLoading,
  selectedBrokerId,
  onSelectBroker,
  caveat = MTF_BROKER_CAVEAT,
}: BrokerRankTableProps) {
  if (isLoading) {
    return <TableSkeleton rows={8} cols={6} />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Required Caveat Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          borderRadius: '10px',
          padding: '12px 14px',
          fontSize: '12px',
          color: '#FCD34D',
          lineHeight: 1.5,
        }}
      >
        <AlertCircle size={16} color="#F59E0B" style={{ flexShrink: 0, marginTop: '2px' }} />
        <span>{caveat}</span>
      </div>

      {/* Table */}
      <div
        style={{
          borderRadius: '14px',
          border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
          background: 'var(--db-surface, #18282C)',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
            <thead>
              <tr
                style={{
                  background: 'var(--db-surface-2, #1E3438)',
                  borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--db-text-muted, #708482)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                <th style={{ padding: '12px 16px', width: '60px' }}>Rank</th>
                <th style={{ padding: '12px 16px' }}>Brokerage House</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Disclosed MTF Book</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Share of Disclosed</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Basis &amp; Source</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>As Of</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: '36px 16px',
                      textAlign: 'center',
                      color: 'var(--db-text-muted, #708482)',
                      fontSize: '13px',
                    }}
                  >
                    No broker ranking disclosures available.
                  </td>
                </tr>
              ) : (
                items.map((row, idx) => {
                  const isSelected = selectedBrokerId === row.broker_id
                  const brokerName = getBrokerName(row.broker_id)
                  const brokerColor = getBrokerColor(row.broker_id, idx)

                  return (
                    <tr
                      key={`${row.broker_id}-${idx}`}
                      onClick={() => onSelectBroker?.(isSelected ? null : row.broker_id)}
                      style={{
                        borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.06))',
                        background: isSelected ? 'rgba(184, 206, 194, 0.08)' : 'transparent',
                        cursor: onSelectBroker ? 'pointer' : 'default',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.background = 'rgba(184, 206, 194, 0.04)'
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      <td style={{ padding: '12px 16px', fontFamily: 'Consolas, monospace', color: 'var(--db-text-muted, #708482)' }}>
                        #{idx + 1}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              width: '9px',
                              height: '9px',
                              borderRadius: '50%',
                              background: brokerColor,
                              display: 'inline-block',
                              flexShrink: 0,
                            }}
                          />
                          <span style={{ fontWeight: 600, color: 'var(--db-text, #F7FAF9)' }}>
                            {brokerName}
                          </span>
                          {row.source_ref && (
                            <a
                              href={row.source_ref}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              title="View Filing Source"
                              style={{ color: 'var(--db-text-muted, #708482)', display: 'inline-flex', alignItems: 'center' }}
                            >
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: '12px 16px',
                          textAlign: 'right',
                          fontFamily: 'Consolas, monospace',
                          fontWeight: 700,
                          color: 'var(--db-mint, #B8CEC2)',
                        }}
                      >
                        {formatCr(row.book_cr)}
                      </td>
                      <td
                        style={{
                          padding: '12px 16px',
                          textAlign: 'right',
                          fontFamily: 'Consolas, monospace',
                          color: 'var(--db-text-2, #A5B7B3)',
                        }}
                      >
                        {row.share_of_disclosed_pct != null ? formatPct(row.share_of_disclosed_pct) : '—'}
                      </td>
                      <td
                        style={{
                          padding: '12px 16px',
                          textAlign: 'center',
                          fontSize: '11px',
                          color: 'var(--db-text-muted, #708482)',
                        }}
                      >
                        <span
                          style={{
                            background: 'var(--db-surface-2, #1E3438)',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontFamily: 'Consolas, monospace',
                          }}
                        >
                          {row.basis} &middot; {row.source_type}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: '12px 16px',
                          textAlign: 'right',
                          fontFamily: 'Consolas, monospace',
                          fontSize: '11.5px',
                          color: 'var(--db-text-muted, #708482)',
                        }}
                      >
                        {row.as_of ?? '—'}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

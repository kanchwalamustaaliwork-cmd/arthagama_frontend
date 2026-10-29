'use client'

import React from 'react'
import type { MtfDailyBreadth } from '@/src/types/mtf'
import { formatDate } from '@/src/utils/mtf/formatters'
import { Users } from 'lucide-react'

interface BreadthChartProps {
  data: MtfDailyBreadth[]
  loading?: boolean
}

export function BreadthChart({ data, loading }: BreadthChartProps) {
  const sorted = [...data].sort((a, b) => a.trade_date.localeCompare(b.trade_date))

  if (loading) {
    return (
      <div
        style={{
          height: '260px',
          borderRadius: '14px',
          border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
          background: 'var(--db-surface, #18282C)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          animation: 'pulse 1.8s infinite',
        }}
      >
        <div style={{ height: '18px', width: '40%', background: 'var(--db-surface-2, #1E3438)', borderRadius: '6px' }} />
        <div style={{ flex: 1, background: 'var(--db-surface-2, #1E3438)', borderRadius: '8px' }} />
      </div>
    )
  }

  if (sorted.length === 0) {
    return (
      <div
        style={{
          height: '260px',
          borderRadius: '14px',
          border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
          background: 'var(--db-surface, #18282C)',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '13px',
          color: 'var(--db-text-muted, #708482)',
        }}
      >
        No breadth data available
      </div>
    )
  }

  const counts = sorted.map((d) => d.stocks_funded_count ?? 0)
  const maxCount = Math.max(...counts, 100)
  const minCount = Math.min(...counts, 0)
  const range = maxCount - minCount || 1

  const width = 600
  const height = 220
  const padL = 40
  const padR = 12
  const padT = 20
  const padB = 30
  const plotW = width - padL - padR
  const plotH = height - padT - padB

  const points = sorted.map((d, i) => {
    const x = padL + (i / (sorted.length - 1 || 1)) * plotW
    const y = padT + plotH - (((d.stocks_funded_count ?? 0) - minCount) / range) * plotH
    return { x, y, count: d.stocks_funded_count }
  })

  const pathD = points.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '')
  const areaD = `${pathD} L ${points[points.length - 1].x} ${padT + plotH} L ${points[0].x} ${padT + plotH} Z`

  return (
    <div
      style={{
        borderRadius: '14px',
        border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
        background: 'var(--db-surface, #18282C)',
        padding: '20px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={15} color="#38BDF8" />
            <h3 style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)', margin: 0 }}>
              MTF Market Breadth
            </h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--db-text-muted, #708482)', margin: '3px 0 0 0' }}>
            Count of securities actively holding funded margin debt
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'Consolas, monospace', color: '#38BDF8' }}>
            {counts[counts.length - 1]} stocks
          </span>
          <p style={{ fontSize: '10px', color: 'var(--db-text-muted, #708482)', margin: '2px 0 0 0' }}>
            Current Breadth
          </p>
        </div>
      </div>

      <div style={{ width: '100%', overflow: 'hidden' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
          <defs>
            <linearGradient id="breadthGradCyan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          {/* Grid lines */}
          {[0, 0.5, 1].map((pct, idx) => {
            const y = padT + plotH * (1 - pct)
            const val = minCount + range * pct
            return (
              <g key={idx}>
                <line
                  x1={padL}
                  y1={y}
                  x2={width - padR}
                  y2={y}
                  stroke="rgba(184, 206, 194, 0.08)"
                  strokeDasharray="3 3"
                />
                <text
                  x={padL - 6}
                  y={y + 3}
                  textAnchor="end"
                  fill="var(--db-text-muted, #708482)"
                  fontSize="9.5"
                  fontFamily="Consolas, monospace"
                >
                  {Math.round(val)}
                </text>
              </g>
            )
          })}
          {/* Area & Line */}
          <path d={areaD} fill="url(#breadthGradCyan)" />
          <path d={pathD} fill="none" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" />
          {/* X Axis */}
          {points.length > 1 && (
            <>
              <text
                x={points[0].x}
                y={height - 8}
                textAnchor="start"
                fill="var(--db-text-muted, #708482)"
                fontSize="9.5"
                fontFamily="Consolas, monospace"
              >
                {formatDate(sorted[0].trade_date)}
              </text>
              <text
                x={points[points.length - 1].x}
                y={height - 8}
                textAnchor="end"
                fill="var(--db-text-muted, #708482)"
                fontSize="9.5"
                fontFamily="Consolas, monospace"
              >
                {formatDate(sorted[sorted.length - 1].trade_date)}
              </text>
            </>
          )}
        </svg>
      </div>
    </div>
  )
}

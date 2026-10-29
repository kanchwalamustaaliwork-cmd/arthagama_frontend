'use client'

import React, { useMemo } from 'react'
import type { MtfDailyTotal } from '@/src/types/mtf'
import { formatCr, formatDate, toNum } from '@/src/utils/mtf/formatters'
import { TrendingUp } from 'lucide-react'

interface BookTrendChartProps {
  data: MtfDailyTotal[]
  loading?: boolean
}

export function BookTrendChart({ data, loading }: BookTrendChartProps) {
  const combined = useMemo(() => {
    return data
      .filter((d) => d.exchange === 'COMBINED' || d.exchange === 'NSE')
      .sort((a, b) => a.trade_date.localeCompare(b.trade_date))
  }, [data])

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

  if (combined.length === 0) {
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
        No MTF book trend data available
      </div>
    )
  }

  // Coerce Decimal strings → numbers for arithmetic
  const values = combined.map((d) => toNum(d.outstanding_cr) ?? 0)
  const minVal = Math.min(...values)
  const maxVal = Math.max(...values)
  const range = maxVal - minVal || 1

  const width = 600
  const height = 220
  const padL = 48
  const padR = 16
  const padT = 20
  const padB = 30
  const plotW = width - padL - padR
  const plotH = height - padT - padB

  const points = combined.map((d, i) => {
    const val = toNum(d.outstanding_cr) ?? 0
    const x = padL + (i / (combined.length - 1 || 1)) * plotW
    const y = padT + plotH - ((val - minVal) / range) * plotH
    return { x, y, date: d.trade_date, val }
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
            <TrendingUp size={15} color="var(--db-mint, #B8CEC2)" />
            <h3 style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)', margin: 0 }}>
              Total MTF Book Trend
            </h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--db-text-muted, #708482)', margin: '3px 0 0 0' }}>
            Combined market margin debt over time
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'Consolas, monospace', color: 'var(--db-mint, #B8CEC2)' }}>
            {formatCr(values[values.length - 1])}
          </span>
          <p style={{ fontSize: '10px', color: 'var(--db-text-muted, #708482)', margin: '2px 0 0 0' }}>
            Latest Book
          </p>
        </div>
      </div>

      <div style={{ width: '100%', overflow: 'hidden' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
          <defs>
            <linearGradient id="bookGradMint" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B8CEC2" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#B8CEC2" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          {/* Y Axis Grid */}
          {[0, 0.5, 1].map((pct, idx) => {
            const y = padT + plotH * (1 - pct)
            const val = minVal + range * pct
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
                  {Math.round(val / 1000)}k Cr
                </text>
              </g>
            )
          })}
          {/* Area & Line */}
          <path d={areaD} fill="url(#bookGradMint)" />
          <path d={pathD} fill="none" stroke="#B8CEC2" strokeWidth="2.2" strokeLinecap="round" />
          {/* X Axis Labels */}
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
                {formatDate(points[0].date)}
              </text>
              <text
                x={points[points.length - 1].x}
                y={height - 8}
                textAnchor="end"
                fill="var(--db-text-muted, #708482)"
                fontSize="9.5"
                fontFamily="Consolas, monospace"
              >
                {formatDate(points[points.length - 1].date)}
              </text>
            </>
          )}
        </svg>
      </div>
    </div>
  )
}

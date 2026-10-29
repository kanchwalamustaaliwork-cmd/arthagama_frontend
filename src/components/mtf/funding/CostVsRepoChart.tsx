'use client'

import React from 'react'
import type { CostVsRepoPoint } from '@/src/types/mtf'
import { formatPct, formatDate } from '@/src/utils/mtf/formatters'
import { Percent } from 'lucide-react'

interface CostVsRepoChartProps {
  data: CostVsRepoPoint[]
  loading?: boolean
}

export function CostVsRepoChart({ data, loading }: CostVsRepoChartProps) {
  const sorted = [...data].sort((a, b) => a.as_of.localeCompare(b.as_of))

  if (loading) {
    return (
      <div
        style={{
          height: '240px',
          borderRadius: '14px',
          border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
          background: 'var(--db-surface, #18282C)',
          padding: '20px',
          animation: 'pulse 1.8s infinite',
        }}
      />
    )
  }

  if (sorted.length === 0) {
    return (
      <div
        style={{
          height: '240px',
          borderRadius: '14px',
          border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
          background: 'var(--db-surface, #18282C)',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12.5px',
          color: 'var(--db-text-muted, #708482)',
        }}
      >
        No borrowing cost vs repo rate data available
      </div>
    )
  }

  const costs = sorted.map((d) => d.borrowing_cost_pct ?? 0)
  const repos = sorted.map((d) => d.repo_rate_pct ?? 0)
  const minVal = Math.min(...costs, ...repos)
  const maxVal = Math.max(...costs, ...repos)
  const range = maxVal - minVal || 1

  const width = 550
  const height = 180
  const padL = 38
  const padR = 12
  const padT = 20
  const padB = 25
  const plotW = width - padL - padR
  const plotH = height - padT - padB

  const toPoints = (vals: (number | null)[]) =>
    sorted.map((d, i) => ({
      x: padL + (i / (sorted.length - 1 || 1)) * plotW,
      y: padT + plotH - (((vals[i] ?? 0) - minVal) / range) * plotH,
    }))

  const costPoints = toPoints(costs)
  const repoPoints = toPoints(repos)

  const toD = (pts: { x: number; y: number }[]) =>
    pts.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '')

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Percent size={15} color="#A78BFA" />
            <h3 style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)', margin: 0 }}>
              Borrowing Cost vs RBI Repo Rate
            </h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--db-text-muted, #708482)', margin: '3px 0 0 0' }}>
            Broker CP issuance yields vs policy repo rate
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#A78BFA' }}>
            <span style={{ width: '10px', height: '2px', background: '#A78BFA', display: 'inline-block' }} /> CP Yield
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--db-text-muted, #708482)' }}>
            <span style={{ width: '10px', height: '2px', background: 'var(--db-text-muted, #708482)', display: 'inline-block' }} /> Repo Rate
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        <path d={toD(costPoints)} fill="none" stroke="#A78BFA" strokeWidth="2.2" strokeLinecap="round" />
        <path
          d={toD(repoPoints)}
          fill="none"
          stroke="var(--db-text-muted, #708482)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />

        {pointsLabels(sorted, padL, width - padR, height - 6)}
      </svg>
    </div>
  )
}

function pointsLabels(sorted: CostVsRepoPoint[], startX: number, endX: number, y: number) {
  if (sorted.length <= 1) return null
  return (
    <>
      <text
        x={startX}
        y={y}
        textAnchor="start"
        fill="var(--db-text-muted, #708482)"
        fontSize="9.5"
        fontFamily="Consolas, monospace"
      >
        {formatDate(sorted[0].as_of)}
      </text>
      <text
        x={endX}
        y={y}
        textAnchor="end"
        fill="var(--db-text-muted, #708482)"
        fontSize="9.5"
        fontFamily="Consolas, monospace"
      >
        {formatDate(sorted[sorted.length - 1].as_of)}
      </text>
    </>
  )
}

'use client'

import React from 'react'
import type { MtfDailyFlow } from '@/src/types/mtf'
import { formatCr, formatDate, toNum } from '@/src/utils/mtf/formatters'
import { Activity } from 'lucide-react'

interface FlowChartProps {
  data: MtfDailyFlow[]
  loading?: boolean
}

export function FlowChart({ data, loading }: FlowChartProps) {
  const sorted = [...data].sort((a, b) => a.trade_date.localeCompare(b.trade_date)).slice(-60)

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
        No leverage flow data available
      </div>
    )
  }

  // Coerce Decimal strings → numbers
  const flows = sorted.map((d) => toNum(d.net_flow_cr) ?? 0)
  const maxAbs = Math.max(...flows.map(Math.abs), 10)

  const width = 600
  const height = 220
  const padL = 40
  const padR = 12
  const padT = 20
  const padB = 30
  const plotW = width - padL - padR
  const plotH = height - padT - padB
  const zeroY = padT + plotH / 2

  const barW = Math.max(3, plotW / sorted.length - 1.5)

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={15} color="var(--db-mint, #B8CEC2)" />
            <h3 style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)', margin: 0 }}>
              Daily Net Leverage Flow
            </h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--db-text-muted, #708482)', margin: '3px 0 0 0' }}>
            Fresh margin debt minus liquidations (last 60 sessions)
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--db-gain, #22C55E)', fontWeight: 500 }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--db-gain, #22C55E)', display: 'inline-block' }} />
            Net Inflow
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--db-loss, #E35D6A)', fontWeight: 500 }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--db-loss, #E35D6A)', display: 'inline-block' }} />
            Net Liquidation
          </span>
        </div>
      </div>

      <div style={{ width: '100%', overflow: 'hidden' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
          {/* Zero Line */}
          <line
            x1={padL}
            y1={zeroY}
            x2={width - padR}
            y2={zeroY}
            stroke="rgba(184, 206, 194, 0.2)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <text
            x={padL - 6}
            y={zeroY + 3}
            textAnchor="end"
            fill="var(--db-text-muted, #708482)"
            fontSize="9.5"
            fontFamily="Consolas, monospace"
          >
            0
          </text>

          {/* Max and Min Reference lines */}
          <text
            x={padL - 6}
            y={padT + 8}
            textAnchor="end"
            fill="var(--db-text-muted, #708482)"
            fontSize="9"
            fontFamily="Consolas, monospace"
          >
            +{Math.round(maxAbs)}
          </text>
          <text
            x={padL - 6}
            y={padT + plotH}
            textAnchor="end"
            fill="var(--db-text-muted, #708482)"
            fontSize="9"
            fontFamily="Consolas, monospace"
          >
            -{Math.round(maxAbs)}
          </text>

          {/* Flow Bars */}
          {sorted.map((d, i) => {
            const flow = toNum(d.net_flow_cr) ?? 0
            const x = padL + i * (plotW / sorted.length)
            const barH = (Math.abs(flow) / maxAbs) * (plotH / 2)
            const y = flow >= 0 ? zeroY - barH : zeroY
            const color = flow >= 0 ? 'var(--db-gain, #22C55E)' : 'var(--db-loss, #E35D6A)'

            return (
              <rect
                key={d.trade_date}
                x={x}
                y={y}
                width={barW}
                height={Math.max(1.5, barH)}
                fill={color}
                rx={1}
                opacity={0.9}
              >
                <title>{`${d.trade_date}: ${formatCr(flow)}`}</title>
              </rect>
            )
          })}

          {/* Date Axis */}
          {sorted.length > 1 && (
            <>
              <text
                x={padL}
                y={height - 8}
                textAnchor="start"
                fill="var(--db-text-muted, #708482)"
                fontSize="9.5"
                fontFamily="Consolas, monospace"
              >
                {formatDate(sorted[0].trade_date)}
              </text>
              <text
                x={width - padR}
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

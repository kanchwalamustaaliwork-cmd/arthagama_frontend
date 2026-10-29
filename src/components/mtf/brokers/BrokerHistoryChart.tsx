'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import type { BrokerBookItem } from '@/src/types/mtf'
import { formatCr, formatPct, toNum } from '@/src/utils/mtf/formatters'
import { getBrokerName, getBrokerColor } from '@/src/utils/mtf/broker-meta'
import { ArrowUpRight, BarChart2, Layers, CheckSquare } from 'lucide-react'

interface BrokerHistoryChartProps {
  items: BrokerBookItem[]
  loading?: boolean
  selectedBrokerId?: string | null
  onSelectBroker?: (brokerId: string | null) => void
  activeTab: 'active' | 'archive'
  onChangeTab: (tab: 'active' | 'archive') => void
}

export function BrokerHistoryChart({
  items,
  loading,
  selectedBrokerId,
  onSelectBroker,
  activeTab,
  onChangeTab,
}: BrokerHistoryChartProps) {
  const [viewMode, setViewMode] = useState<'value' | 'share'>('value')
  const [top10Only, setTop10Only] = useState(false)
  const [hoveredDate, setHoveredDate] = useState<string | null>(null)
  const [hoveredBroker, setHoveredBroker] = useState<string | null>(null)

  // 1. Group records by broker_id
  const { brokerMap, allDates, latestRanking } = useMemo(() => {
    const bMap = new Map<string, Map<string, { book_cr: number; share_pct: number }>>()
    const dateSet = new Set<string>()
    const latestBooks = new Map<string, number>()

    for (const item of items) {
      const val = toNum(item.book_cr) ?? 0
      const share = item.share_of_disclosed_pct ?? 0
      dateSet.add(item.as_of)

      if (!bMap.has(item.broker_id)) {
        bMap.set(item.broker_id, new Map())
      }
      bMap.get(item.broker_id)!.set(item.as_of, { book_cr: val, share_pct: share })

      // track latest
      latestBooks.set(item.broker_id, val)
    }

    const sortedDates = Array.from(dateSet).sort()
    const sortedRanking = Array.from(bMap.keys()).sort((a, b) => {
      const valA = latestBooks.get(a) ?? 0
      const valB = latestBooks.get(b) ?? 0
      return valB - valA
    })

    return { brokerMap: bMap, allDates: sortedDates, latestRanking: sortedRanking }
  }, [items])

  // Top brokers to display
  const displayBrokers = useMemo(() => {
    if (top10Only) return latestRanking.slice(0, 10)
    return latestRanking
  }, [latestRanking, top10Only])

  // Filter dates from 2020 onwards for clear visualization (or all if archive)
  const chartDates = useMemo(() => {
    if (allDates.length === 0) return []
    if (activeTab === 'archive') return allDates
    const filtered = allDates.filter(d => d >= '2020-01-01')
    return filtered.length >= 2 ? filtered : allDates
  }, [allDates, activeTab])

  // Calculate max value for Y axis
  const maxVal = useMemo(() => {
    let max = 0
    for (const bId of displayBrokers) {
      const dateMap = brokerMap.get(bId)
      if (!dateMap) continue
      for (const d of chartDates) {
        const pt = dateMap.get(d)
        if (!pt) continue
        const v = viewMode === 'value' ? pt.book_cr : pt.share_pct
        if (v > max) max = v
      }
    }
    return max > 0 ? max : (viewMode === 'value' ? 18000 : 40)
  }, [displayBrokers, brokerMap, chartDates, viewMode])

  if (loading) {
    return (
      <div
        style={{
          borderRadius: '16px',
          border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
          background: '#0B1315',
          padding: '24px',
          height: '420px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          animation: 'pulse 1.8s infinite',
        }}
      >
        <div style={{ height: '28px', width: '220px', background: 'rgba(184, 206, 194, 0.08)', borderRadius: '8px' }} />
        <div style={{ flex: 1, background: 'rgba(184, 206, 194, 0.04)', borderRadius: '12px' }} />
      </div>
    )
  }

  // Chart layout dimensions
  const svgW = 1000
  const svgH = 340
  const padL = 20
  const padR = 80 // Y axis on the right side
  const padT = 24
  const padB = 32
  const plotW = svgW - padL - padR
  const plotH = svgH - padT - padB

  // Y-axis ticks (e.g. 9 ticks)
  const yTicksCount = 9
  const yTicks = Array.from({ length: yTicksCount }, (_, i) => {
    const frac = i / (yTicksCount - 1)
    const val = maxVal * (1 - frac)
    const y = padT + frac * plotH
    return { val, y }
  })

  // Format Y tick label
  const formatYTick = (val: number) => {
    if (viewMode === 'share') return `${val.toFixed(0)}%`
    if (val >= 1000) return `₹${Math.round(val / 1000)} K Cr`
    return `₹${Math.round(val)} Cr`
  }

  // Format X tick label
  const formatXTick = (iso: string) => {
    const parts = iso.split('-')
    const yr = parts[0]
    const mo = parseInt(parts[1], 10)
    if (mo === 6 || mo === 7) return 'Jul'
    if (mo === 1 || mo === 3) return yr
    return yr
  }

  // X ticks: sample ~8-10 points
  const xStep = Math.max(1, Math.floor(chartDates.length / 9))
  const xTicks = chartDates.filter((_, idx) => idx % xStep === 0 || idx === chartDates.length - 1)

  // Pre-calculate line points for each broker
  const brokerLines = displayBrokers.map((bId, idx) => {
    const dateMap = brokerMap.get(bId)
    const pts: { x: number; y: number; d: string; val: number }[] = []
    if (!dateMap) return { bId, pts, color: getBrokerColor(bId, idx) }

    for (let i = 0; i < chartDates.length; i++) {
      const d = chartDates[i]
      const dataPoint = dateMap.get(d)
      if (dataPoint !== undefined) {
        const val = viewMode === 'value' ? dataPoint.book_cr : dataPoint.share_pct
        const x = padL + (i / (chartDates.length - 1 || 1)) * plotW
        const y = padT + plotH - (Math.min(val, maxVal) / maxVal) * plotH
        pts.push({ x, y, d, val })
      }
    }

    const color = getBrokerColor(bId, idx)
    return { bId, pts, color }
  })

  // Active highlighted broker
  const effectiveHighlight = hoveredBroker || selectedBrokerId

  return (
    <div
      style={{
        borderRadius: '16px',
        border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
        background: '#0B1315',
        padding: '24px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {/* Top Header Row with Tabs and Action Pills */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* Left Tabs: Active brokers (43) / NSE Archive */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '9999px',
            padding: '3px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <button
            type="button"
            onClick={() => onChangeTab('active')}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '12.5px',
              fontWeight: 600,
              background: activeTab === 'active' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'active' ? '#091012' : '#8E9E9C',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Active brokers (43)
          </button>
          <button
            type="button"
            onClick={() => onChangeTab('archive')}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '12.5px',
              fontWeight: 600,
              background: activeTab === 'archive' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'archive' ? '#091012' : '#8E9E9C',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            NSE Archive 2017-2021 (470)
          </button>
        </div>

        {/* Right Action Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setViewMode(v => v === 'value' ? 'share' : 'value')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              background: viewMode === 'share' ? 'rgba(56, 189, 248, 0.18)' : 'rgba(255, 255, 255, 0.04)',
              color: viewMode === 'share' ? '#38BDF8' : '#8E9E9C',
              border: '1px solid ' + (viewMode === 'share' ? 'rgba(56, 189, 248, 0.35)' : 'rgba(255, 255, 255, 0.08)'),
              cursor: 'pointer',
            }}
          >
            <BarChart2 size={13} />
            Market Share
          </button>

          <Link
            href="/admin/mtf/funding"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              background: 'rgba(255, 255, 255, 0.04)',
              color: '#8E9E9C',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              textDecoration: 'none',
            }}
          >
            <Layers size={13} />
            CP Funding
            <ArrowUpRight size={12} />
          </Link>

          <button
            type="button"
            onClick={() => setTop10Only(t => !t)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              background: top10Only ? 'rgba(184, 206, 194, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              color: top10Only ? '#B8CEC2' : '#8E9E9C',
              border: '1px solid ' + (top10Only ? 'rgba(184, 206, 194, 0.4)' : 'rgba(255, 255, 255, 0.08)'),
              cursor: 'pointer',
            }}
          >
            <BarChart2 size={13} />
            Top 10
          </button>

          <button
            type="button"
            onClick={() => onSelectBroker?.(null)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              background: selectedBrokerId ? 'rgba(245, 158, 11, 0.18)' : 'rgba(255, 255, 255, 0.04)',
              color: selectedBrokerId ? '#F59E0B' : '#8E9E9C',
              border: '1px solid ' + (selectedBrokerId ? 'rgba(245, 158, 11, 0.35)' : 'rgba(255, 255, 255, 0.08)'),
              cursor: 'pointer',
            }}
          >
            <CheckSquare size={13} />
            {selectedBrokerId ? 'Clear Filter' : 'Compare'}
          </button>
        </div>
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: '18px',
          fontWeight: 700,
          color: '#F7FAF9',
          margin: 0,
          letterSpacing: '-0.01em',
        }}
      >
        MTF book history &middot; per broker
      </h3>

      {/* SVG Multi-Line Chart Canvas */}
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
          onMouseLeave={() => {
            setHoveredDate(null)
            setHoveredBroker(null)
          }}
        >
          {/* Subtle Gridlines */}
          {yTicks.map((tick, i) => (
            <g key={i}>
              <line
                x1={padL}
                y1={tick.y}
                x2={svgW - padR}
                y2={tick.y}
                stroke="rgba(255, 255, 255, 0.05)"
                strokeDasharray="2 3"
              />
              {/* Right-aligned Y axis text */}
              <text
                x={svgW - padR + 10}
                y={tick.y + 3.5}
                textAnchor="start"
                fill="#556967"
                fontSize="10"
                fontFamily="Consolas, monospace"
              >
                {formatYTick(tick.val)}
              </text>
            </g>
          ))}

          {/* Zero baseline */}
          <line
            x1={padL}
            y1={padT + plotH}
            x2={svgW - padR}
            y2={padT + plotH}
            stroke="rgba(255, 255, 255, 0.12)"
          />

          {/* Broker Polyline Series */}
          {brokerLines.map(({ bId, pts, color }) => {
            if (pts.length < 2) return null
            const pathD = pts.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '')
            const isHighlighted = effectiveHighlight === bId
            const isDimmed = effectiveHighlight && !isHighlighted

            return (
              <g key={bId} style={{ transition: 'opacity 0.2s ease' }} opacity={isDimmed ? 0.15 : 1}>
                <path
                  d={pathD}
                  fill="none"
                  stroke={color}
                  strokeWidth={isHighlighted ? 3 : 1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredBroker(bId)}
                  onClick={() => onSelectBroker?.(selectedBrokerId === bId ? null : bId)}
                />
                {/* Last point dot for active lines */}
                {pts.length > 0 && !isDimmed && (
                  <circle
                    cx={pts[pts.length - 1].x}
                    cy={pts[pts.length - 1].y}
                    r={isHighlighted ? 4 : 2.5}
                    fill={color}
                  />
                )}
              </g>
            )
          })}

          {/* X Axis Date Labels */}
          {xTicks.map((d, i) => {
            const idx = chartDates.indexOf(d)
            const x = padL + (idx / (chartDates.length - 1 || 1)) * plotW
            return (
              <text
                key={i}
                x={x}
                y={svgH - 8}
                textAnchor="middle"
                fill="#617472"
                fontSize="10.5"
                fontFamily="Consolas, monospace"
              >
                {formatXTick(d)}
              </text>
            )
          })}
        </svg>
      </div>

      {/* Legend below the chart with colored lines matching screenshot */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px 16px',
          paddingTop: '12px',
          borderTop: '1px solid rgba(184, 206, 194, 0.08)',
        }}
      >
        {displayBrokers.map((bId, idx) => {
          const color = getBrokerColor(bId, idx)
          const name = getBrokerName(bId)
          const isSelected = selectedBrokerId === bId
          const isHovered = hoveredBroker === bId

          return (
            <button
              key={bId}
              type="button"
              onClick={() => onSelectBroker?.(isSelected ? null : bId)}
              onMouseEnter={() => setHoveredBroker(bId)}
              onMouseLeave={() => setHoveredBroker(null)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                background: isSelected ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                border: 'none',
                padding: '4px 6px',
                borderRadius: '4px',
                cursor: 'pointer',
                opacity: effectiveHighlight && effectiveHighlight !== bId ? 0.35 : 1,
                transition: 'all 0.15s ease',
              }}
            >
              {/* Colored horizontal bar marker */}
              <span
                style={{
                  width: '14px',
                  height: '2.5px',
                  borderRadius: '1px',
                  background: color,
                  display: 'inline-block',
                }}
              />
              <span
                style={{
                  fontSize: '11.5px',
                  color: isSelected || isHovered ? '#FFFFFF' : '#8E9E9C',
                  fontWeight: isSelected ? 600 : 400,
                  whiteSpace: 'nowrap',
                }}
              >
                {name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

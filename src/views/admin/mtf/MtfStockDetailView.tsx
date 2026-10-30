'use client'

import React, { useMemo } from 'react'
import { useMtfStock, useMtfStockHistory } from '@/src/hooks/mtf/useMtfStocks'
import { StockMtfCard } from '@/src/components/mtf/stocks/StockMtfCard'
import { AsOfBadge } from '@/src/components/mtf/shared/AsOfBadge'
import { SourceAttribution } from '@/src/components/mtf/shared/SourceAttribution'
import { formatPct, formatDate, formatCr, toNum } from '@/src/utils/mtf/formatters'
import LazyViewport from '@/src/components/shared/LazyViewport'
import { MetricCardsSkeleton, TableSkeleton } from '@/src/components/stockdashboard/shared/Skeletons'
import {
  ShieldAlert,
  History,
  TrendingUp,
  TrendingDown,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Database,
  Building2,
} from 'lucide-react'
import type { MtfStockDetail, MtfStockSnapshot } from '@/src/types/mtf'

interface Props {
  isin: string
}

export function MtfStockDetailView({ isin }: Props) {
  const { data: rawStock, loading: stockLoading } = useMtfStock(isin)
  const { data: history, loading: historyLoading } = useMtfStockHistory(isin)

  // 1. Resolve stock data whether the backend returned a flat object or { snapshot: {...} }
  const resolvedStock: MtfStockDetail | null = useMemo(() => {
    if (!rawStock) return null
    const snap = (rawStock as any)?.snapshot ?? rawStock
    return {
      ...snap,
      history_since: (rawStock as any)?.history_since ?? snap.history_since,
      as_of: (rawStock as any)?.as_of ?? snap.as_of ?? snap.snapshot_date,
      surveillance_flags: (rawStock as any)?.surveillance_flags ?? snap.surveillance_flags,
      pledge_history: (rawStock as any)?.pledge_history ?? snap.pledge_history,
    }
  }, [rawStock])

  // 2. Prepare sorted history items (latest first) and calculate Day-over-Day changes
  const { sortedItems, historyStats } = useMemo(() => {
    if (!history?.items || history.items.length === 0) {
      return { sortedItems: [], historyStats: null }
    }

    // Sort chronologically ascending to calculate day-over-day deltas correctly
    const asc = [...history.items].sort(
      (a, b) => new Date(a.snapshot_date).getTime() - new Date(b.snapshot_date).getTime()
    )

    const withDeltas = asc.map((item, idx) => {
      const prev = idx > 0 ? asc[idx - 1] : null
      const currentBook = toNum(item.book_cr)
      const prevBook = prev ? toNum(prev.book_cr) : null

      let dodDiffCr: number | null = null
      let dodPct: number | null = null

      if (currentBook != null && prevBook != null && prevBook > 0) {
        dodDiffCr = currentBook - prevBook
        dodPct = (dodDiffCr / prevBook) * 100
      }

      return {
        ...item,
        dodDiffCr,
        dodPct,
      }
    })

    // Now reverse to descending (newest on top) for table presentation
    const desc = [...withDeltas].reverse()

    // Aggregate stats across the history window
    const firstItem = asc[0]
    const latestItem = asc[asc.length - 1]
    const firstBook = toNum(firstItem.book_cr)
    const latestBook = toNum(latestItem.book_cr)
    const netDriftCr = latestBook != null && firstBook != null ? latestBook - firstBook : null
    const netDriftPct = netDriftCr != null && firstBook && firstBook > 0 ? (netDriftCr / firstBook) * 100 : null

    return {
      sortedItems: desc,
      historyStats: {
        totalSessions: asc.length,
        firstDate: firstItem.snapshot_date,
        latestDate: latestItem.snapshot_date,
        firstBook,
        latestBook,
        netDriftCr,
        netDriftPct,
      },
    }
  }, [history])

  // 3. If stock endpoint is empty or missing, fallback to the latest snapshot from history
  const activeStock: MtfStockDetail | null = useMemo(() => {
    if (resolvedStock && resolvedStock.symbol) return resolvedStock
    if (sortedItems.length > 0) {
      const latest = sortedItems[0]
      return {
        ...latest,
        snapshot_date: latest.snapshot_date,
        as_of: history?.as_of ?? latest.snapshot_date,
        history_since: historyStats?.firstDate,
      } as MtfStockDetail
    }
    return resolvedStock
  }, [resolvedStock, sortedItems, history, historyStats])

  const isLoading = stockLoading && historyLoading

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ height: '90px', background: 'var(--db-surface, #18282C)', borderRadius: '18px' }} />
        <MetricCardsSkeleton count={6} />
        <TableSkeleton rows={4} cols={6} />
      </div>
    )
  }

  if (!activeStock && sortedItems.length === 0) {
    return (
      <div
        style={{
          padding: '60px 24px',
          textAlign: 'center',
          background: 'var(--db-surface, #18282C)',
          borderRadius: '16px',
          border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
          color: 'var(--db-text-muted, #708482)',
          fontSize: '14px',
        }}
      >
        <Database size={32} style={{ margin: '0 auto 12px auto', opacity: 0.4 }} />
        <div style={{ color: 'var(--db-text, #F7FAF9)', fontWeight: 600, fontSize: '16px' }}>
          No MTF data found
        </div>
        <div style={{ marginTop: '4px', fontSize: '13px' }}>
          No MTF security snapshots or history available for ISIN: <code style={{ color: 'var(--db-mint, #B8CEC2)' }}>{isin}</code>
        </div>
      </div>
    )
  }

  const flags = activeStock?.surveillance_flags
  const activeFlags = flags ? (['asm', 'gsm', 'esm', 'ibc', 'ban'] as const).filter((k) => flags[k]) : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* ─── Header ─── */}
      <div
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(46, 85, 96, 0.32) 0%, rgba(15, 23, 25, 0.75) 85%)',
          borderRadius: '18px',
          padding: '24px 28px',
          border: '1px solid var(--db-border, rgba(184, 206, 194, 0.15))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <h1
              style={{
                fontSize: '26px',
                fontWeight: 700,
                color: 'var(--db-text, #F7FAF9)',
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              {activeStock?.symbol ?? isin}
            </h1>
            {activeStock?.exchange && (
              <span
                style={{
                  fontSize: '11px',
                  fontFamily: 'Consolas, monospace',
                  fontWeight: 700,
                  color: 'var(--db-mint, #B8CEC2)',
                  background: 'rgba(184, 206, 194, 0.12)',
                  border: '1px solid rgba(184, 206, 194, 0.25)',
                  borderRadius: '6px',
                  padding: '3px 9px',
                }}
              >
                {activeStock.exchange}
              </span>
            )}
            {activeStock?.asset_class && (
              <span
                style={{
                  fontSize: '11px',
                  fontFamily: 'Consolas, monospace',
                  fontWeight: 600,
                  color: 'var(--db-text-2, #A5B7B3)',
                  background: 'var(--db-surface-2, #1E3438)',
                  border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                  borderRadius: '6px',
                  padding: '3px 9px',
                }}
              >
                {activeStock.asset_class}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '12.5px',
                fontFamily: 'Consolas, monospace',
                color: 'var(--db-text-muted, #708482)',
              }}
            >
              ISIN: <span style={{ color: 'var(--db-mint, #B8CEC2)' }}>{isin}</span>
            </span>
          </div>
        </div>

        <AsOfBadge asOf={activeStock?.as_of ?? activeStock?.snapshot_date ?? history?.as_of} />
      </div>

      {/* ─── Current Metrics Strip ─── */}
      {activeStock && <StockMtfCard stock={activeStock} />}

      {/* ─── Surveillance Alerts Banner ─── */}
      {activeFlags.length > 0 && (
        <div
          style={{
            borderRadius: '14px',
            border: '1px solid rgba(227, 93, 106, 0.3)',
            background: 'rgba(227, 93, 106, 0.08)',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={16} color="var(--db-loss, #E35D6A)" />
            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--db-loss, #E35D6A)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Active Exchange Surveillance Measure
            </span>
            {flags?.severity && (
              <span style={{ fontSize: '11px', color: 'var(--db-text-muted, #708482)' }}>
                ({flags.severity} severity)
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {activeFlags.map((f) => (
              <span
                key={f}
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  background: 'rgba(227, 93, 106, 0.2)',
                  color: 'var(--db-loss, #E35D6A)',
                }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ─── Historical MTF Section ─── */}
      {sortedItems.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Historical Header Summary Strip */}
          <div
            style={{
              borderRadius: '16px',
              border: '1px solid var(--db-border, rgba(184, 206, 194, 0.14))',
              background: 'var(--db-surface, #18282C)',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(184, 206, 194, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(184, 206, 194, 0.18)',
                }}
              >
                <History size={18} color="var(--db-mint, #B8CEC2)" />
              </div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--db-text, #F7FAF9)', margin: 0 }}>
                  Historical Daily MTF Snapshots
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--db-text-muted, #708482)', margin: '3px 0 0 0' }}>
                  Coverage from {formatDate(historyStats?.firstDate)} to {formatDate(historyStats?.latestDate)}
                  {history?.note && ` · ${history.note}`}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              {historyStats?.netDriftCr != null && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: (historyStats.netDriftCr ?? 0) >= 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(227, 93, 106, 0.1)',
                    border: `1px solid ${(historyStats.netDriftCr ?? 0) >= 0 ? 'rgba(34, 197, 94, 0.25)' : 'rgba(227, 93, 106, 0.25)'}`,
                  }}
                >
                  {(historyStats.netDriftCr ?? 0) >= 0 ? (
                    <TrendingUp size={14} color="var(--db-gain, #22C55E)" />
                  ) : (
                    <TrendingDown size={14} color="var(--db-loss, #E35D6A)" />
                  )}
                  <span
                    style={{
                      fontSize: '12px',
                      fontFamily: 'Consolas, monospace',
                      fontWeight: 700,
                      color: (historyStats.netDriftCr ?? 0) >= 0 ? 'var(--db-gain, #22C55E)' : 'var(--db-loss, #E35D6A)',
                    }}
                  >
                    {(historyStats.netDriftCr ?? 0) >= 0 ? '+' : ''}
                    {formatCr(historyStats.netDriftCr)} ({formatPct(historyStats.netDriftPct)})
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--db-text-muted, #708482)' }}>net book drift</span>
                </div>
              )}

              <span
                style={{
                  fontSize: '12px',
                  fontFamily: 'Consolas, monospace',
                  fontWeight: 600,
                  color: 'var(--db-text, #F7FAF9)',
                  background: 'var(--db-surface-2, #1E3438)',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                }}
              >
                {sortedItems.length} {sortedItems.length === 1 ? 'day recorded' : 'daily snapshots'}
              </span>
            </div>
          </div>

          {/* Historical Data Table */}
          <LazyViewport minHeight="240px" fallback={<TableSkeleton rows={4} cols={7} />}>
            <div
              style={{
                borderRadius: '16px',
                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                background: 'var(--db-surface, #18282C)',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
              }}
            >
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr
                      style={{
                        background: 'var(--db-surface-2, #1E3438)',
                        borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.14))',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: 'var(--db-text-muted, #708482)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      <th style={{ padding: '14px 18px' }}>Snapshot Date</th>
                      <th style={{ padding: '14px 18px', textAlign: 'right' }}>MTF Margin Book</th>
                      <th style={{ padding: '14px 18px', textAlign: 'right' }}>Day Change</th>
                      <th style={{ padding: '14px 18px', textAlign: 'right' }}>Leverage %</th>
                      <th style={{ padding: '14px 18px', textAlign: 'right' }}>30D Drift</th>
                      <th style={{ padding: '14px 18px', textAlign: 'right' }}>Free Float Mcap</th>
                      <th style={{ padding: '14px 18px', textAlign: 'right' }}>Total Mcap</th>
                      <th style={{ padding: '14px 18px', textAlign: 'center' }}>Segment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedItems.map((item, index) => {
                      const isLatest = index === 0
                      const change30dNum = toNum(item.change_30d_pct)
                      const isPos30d = (change30dNum ?? 0) >= 0

                      return (
                        <tr
                          key={item.snapshot_date}
                          style={{
                            borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.07))',
                            background: isLatest ? 'rgba(184, 206, 194, 0.03)' : 'transparent',
                            transition: 'background 0.15s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(184, 206, 194, 0.06)')}
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = isLatest ? 'rgba(184, 206, 194, 0.03)' : 'transparent')
                          }
                        >
                          {/* Date */}
                          <td style={{ padding: '14px 18px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Calendar size={14} color="var(--db-mint, #B8CEC2)" style={{ opacity: 0.8 }} />
                              <span
                                style={{
                                  fontFamily: 'Consolas, monospace',
                                  fontWeight: 600,
                                  color: 'var(--db-text, #F7FAF9)',
                                }}
                              >
                                {formatDate(item.snapshot_date)}
                              </span>
                              {isLatest && (
                                <span
                                  style={{
                                    fontSize: '9.5px',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.04em',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    background: 'rgba(184, 206, 194, 0.15)',
                                    color: 'var(--db-mint, #B8CEC2)',
                                  }}
                                >
                                  Latest
                                </span>
                              )}
                            </div>
                          </td>

                          {/* MTF Book */}
                          <td
                            style={{
                              padding: '14px 18px',
                              textAlign: 'right',
                              fontFamily: 'Consolas, monospace',
                              fontWeight: 700,
                              color: 'var(--db-mint, #B8CEC2)',
                            }}
                          >
                            {formatCr(item.book_cr)}
                          </td>

                          {/* Day-over-Day delta */}
                          <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                            {item.dodDiffCr != null ? (
                              <div
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px',
                                  fontFamily: 'Consolas, monospace',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  color: item.dodDiffCr >= 0 ? 'var(--db-gain, #22C55E)' : 'var(--db-loss, #E35D6A)',
                                }}
                              >
                                {item.dodDiffCr >= 0 ? (
                                  <ArrowUpRight size={13} />
                                ) : (
                                  <ArrowDownRight size={13} />
                                )}
                                <span>
                                  {item.dodDiffCr >= 0 ? '+' : ''}
                                  {formatCr(item.dodDiffCr)}
                                </span>
                                <span style={{ opacity: 0.8, fontSize: '11px' }}>
                                  ({formatPct(item.dodPct)})
                                </span>
                              </div>
                            ) : (
                              <span style={{ color: 'var(--db-text-muted, #708482)', fontSize: '12px' }}>—</span>
                            )}
                          </td>

                          {/* Leverage % */}
                          <td
                            style={{
                              padding: '14px 18px',
                              textAlign: 'right',
                              fontFamily: 'Consolas, monospace',
                              fontWeight: 600,
                              color: (toNum(item.leverage_pct) ?? 0) > 3 ? '#FBBF24' : '#38BDF8',
                            }}
                          >
                            {formatPct(item.leverage_pct)}
                          </td>

                          {/* 30D Drift */}
                          <td
                            style={{
                              padding: '14px 18px',
                              textAlign: 'right',
                              fontFamily: 'Consolas, monospace',
                              fontWeight: 600,
                              color:
                                change30dNum != null
                                  ? isPos30d
                                    ? 'var(--db-gain, #22C55E)'
                                    : 'var(--db-loss, #E35D6A)'
                                  : 'var(--db-text-muted, #708482)',
                            }}
                          >
                            {change30dNum != null ? `${isPos30d ? '+' : ''}${formatPct(item.change_30d_pct)}` : '—'}
                          </td>

                          {/* Free Float Mcap */}
                          <td
                            style={{
                              padding: '14px 18px',
                              textAlign: 'right',
                              fontFamily: 'Consolas, monospace',
                              color: 'var(--db-text-2, #A5B7B3)',
                            }}
                          >
                            {formatCr(item.free_float_mcap_cr)}
                          </td>

                          {/* Total Mcap */}
                          <td
                            style={{
                              padding: '14px 18px',
                              textAlign: 'right',
                              fontFamily: 'Consolas, monospace',
                              color: 'var(--db-text-muted, #708482)',
                            }}
                          >
                            {formatCr(item.mcap_cr)}
                          </td>

                          {/* Segment / Asset Class */}
                          <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                            <span
                              style={{
                                fontSize: '11px',
                                fontFamily: 'Consolas, monospace',
                                fontWeight: 600,
                                padding: '2px 7px',
                                borderRadius: '4px',
                                background: 'var(--db-surface-2, #1E3438)',
                                color: 'var(--db-text-2, #A5B7B3)',
                                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.1))',
                              }}
                            >
                              {item.asset_class ?? '—'}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </LazyViewport>
        </div>
      )}

      {/* ─── Promoter Pledge History (if disclosed) ─── */}
      {activeStock?.pledge_history && activeStock.pledge_history.length > 0 && (
        <LazyViewport minHeight="220px" fallback={<TableSkeleton rows={4} cols={4} />}>
          <div
            style={{
              borderRadius: '16px',
              border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
              background: 'var(--db-surface, #18282C)',
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.1))',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Building2 size={16} color="var(--db-mint, #B8CEC2)" />
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)', margin: 0 }}>
                Promoter Pledge Disclosures
              </h3>
            </div>
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
                    }}
                  >
                    <th style={{ padding: '12px 16px' }}>Period</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Pledged %</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Pledged Shares</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Total Shares</th>
                  </tr>
                </thead>
                <tbody>
                  {activeStock.pledge_history.map((p) => (
                    <tr
                      key={p.period}
                      style={{ borderBottom: '1px solid var(--db-border, rgba(184, 206, 194, 0.06))' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(184, 206, 194, 0.04)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td
                        style={{
                          padding: '12px 16px',
                          fontFamily: 'Consolas, monospace',
                          fontWeight: 600,
                          color: 'var(--db-text, #F7FAF9)',
                        }}
                      >
                        {p.period}
                      </td>
                      <td
                        style={{
                          padding: '12px 16px',
                          textAlign: 'right',
                          fontFamily: 'Consolas, monospace',
                          fontWeight: 700,
                          color: 'var(--db-loss, #E35D6A)',
                        }}
                      >
                        {formatPct(p.pledged_pct)}
                      </td>
                      <td
                        style={{
                          padding: '12px 16px',
                          textAlign: 'right',
                          fontFamily: 'Consolas, monospace',
                          color: 'var(--db-text-2, #A5B7B3)',
                        }}
                      >
                        {p.pledged_shares != null ? Number(p.pledged_shares).toLocaleString('en-IN') : '—'}
                      </td>
                      <td
                        style={{
                          padding: '12px 16px',
                          textAlign: 'right',
                          fontFamily: 'Consolas, monospace',
                          color: 'var(--db-text-muted, #708482)',
                        }}
                      >
                        {p.total_shares != null ? Number(p.total_shares).toLocaleString('en-IN') : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </LazyViewport>
      )}

      {/* Attribution footer */}
      <SourceAttribution />
    </div>
  )
}

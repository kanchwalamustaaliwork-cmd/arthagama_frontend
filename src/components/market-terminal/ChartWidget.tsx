'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useInstrument } from '@/src/context/InstrumentContext'
import { useOptionChainContext } from '@/src/context/OptionChainContext'
import { useOHLCV } from '@/src/hooks/terminal/useOHLCV'
import { Interval } from '@/src/types/terminal'
import { Bar, CandleChart, ChartTool } from '@/src/lib/market-terminal/CandleChart'
import type { ChartInterval } from '@/src/lib/market-terminal/chartTimeAxis'
import IntervalSelector from './IntervalSelector'
import DrawingToolbar from './DrawingToolbar'
import IndicatorEditor from './IndicatorEditor'
import { runPine } from '@/src/lib/market-terminal/pine/pine'
import { Skeleton } from './Skeleton'

export default function ChartWidget() {
    const { instrument } = useInstrument()
    const { openStrikeSelection, openOptionChain } = useOptionChainContext()
    const [interval, setInterval] = useState<Interval>('1d')
    const { bars, loading, error, loadOlder, loadNewer } = useOHLCV(instrument, interval)

    const containerRef  = useRef<HTMLDivElement>(null)
    const chartRef      = useRef<CandleChart | null>(null)

    // Keep the latest loadOlder/loadNewer in a ref so the onReachLeft/Right
    // callbacks always see the current version without being recreated on
    // every render (avoids re-attaching to the CandleChart options object).
    const loadOlderRef = useRef(loadOlder)
    const loadNewerRef = useRef(loadNewer)
    useEffect(() => { loadOlderRef.current = loadOlder }, [loadOlder])
    useEffect(() => { loadNewerRef.current = loadNewer }, [loadNewer])

    // Per-render flags to prevent concurrent pagination requests from the
    // chart callbacks.  Separate from the hook-level guard so ChartWidget
    // can control UI-level feedback (e.g. loading indicator) independently.
    const isPaginatingRef = useRef(false)

    const [tool, setTool] = useState<ChartTool>('none')
    const [isEditorOpen, setIsEditorOpen] = useState(false)
    const [activeScript, setActiveScript] = useState<string | null>(null)

    // ── Track the previous bars array to determine what changed (prepend vs reset)
    const prevBarsRef = useRef<Bar[]>([])

    // ── Initialize CandleChart (once, on mount) ───────────────────────────────
    useEffect(() => {
        if (!containerRef.current) return

        const chart = new CandleChart(containerRef.current, {
            bg:       '#111417',
            grid:     '#1c2126',
            text:     '#7d848c',
            up:       '#26a65b',
            down:     '#e0524b',
            interval: interval as ChartInterval,

            // Left-edge pagination: user scrolled past the oldest loaded bar.
            onReachLeft: () => {
                if (isPaginatingRef.current) return
                isPaginatingRef.current = true

                loadOlderRef.current().then((addedBars) => {
                    // chart.prepend() keeps the current scroll position intact.
                    if (addedBars.length > 0 && chartRef.current) {
                        chartRef.current.prepend(addedBars)
                    }
                }).finally(() => {
                    isPaginatingRef.current = false
                })
            },

            // Right-edge pagination: user scrolled past the newest loaded bar.
            onReachRight: () => {
                if (isPaginatingRef.current) return
                isPaginatingRef.current = true

                loadNewerRef.current().then((addedBars) => {
                    // Append bars one-by-one via chart.update() so the right
                    // edge advances naturally without a full viewport reset.
                    if (addedBars.length > 0 && chartRef.current) {
                        // Sort ascending and update sequentially
                        const sorted = [...addedBars].sort((a, b) => a.time - b.time)
                        for (const bar of sorted) {
                            chartRef.current.update(bar)
                        }
                    }
                }).finally(() => {
                    isPaginatingRef.current = false
                })
            },
        })

        chartRef.current = chart

        return () => {
            chart.destroy()
            chartRef.current = null
            prevBarsRef.current = []
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])   // Chart engine is created once; callbacks read from refs

    // ── Sync interval label to chart X-axis (no data reload) ─────────────────
    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.setInterval(interval as ChartInterval)
        }
    }, [interval])

    // ── Sync data changes to chart ────────────────────────────────────────────
    // Strategy:
    //   - If bars[0] is OLDER than prevBars[0] → older bars were prepended.
    //     Use chart.prepend() to keep the viewport stable.
    //     (This path is a fallback; normally ChartWidget calls prepend() directly
    //      in the onReachLeft callback above.  It handles the case where the state
    //      updated before the callback returned.)
    //   - Otherwise (fresh load, interval change, newer append) → setData().
    useEffect(() => {
        if (!chartRef.current || bars.length === 0) {
            prevBarsRef.current = []
            return
        }

        const prev = prevBarsRef.current
        prevBarsRef.current = bars

        if (
            prev.length > 0 &&
            bars[0]?.time < (prev[0]?.time ?? Infinity)
        ) {
            // Older bars were prepended — use prepend() to preserve scroll position.
            const newOlder = bars.filter(
                (b) => b.time < (prev[0]?.time ?? Infinity)
            )
            if (newOlder.length > 0) {
                chartRef.current.prepend(newOlder)
            }
        } else {
            // Fresh load or right-side append — reset data (fitContent).
            chartRef.current.setData(bars)
            if (activeScript) {
                applyPineScript(activeScript)
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bars])

    // ── Drawing tool sync ─────────────────────────────────────────────────────
    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.setTool(tool)
        }
    }, [tool])

    // ── Pine Script application ───────────────────────────────────────────────
    const applyPineScript = useCallback((script: string) => {
        setActiveScript(script)
        if (!chartRef.current || !bars.length) return
        try {
            const res = runPine(script, bars as any)
            const overlays: any[] = []
            const panes:   any[] = []
            const shapes:  any[] = []

            for (const plot of res.plots) {
                if (plot.kind === 'line') {
                    if (res.overlay) {
                        overlays.push({ title: plot.title, color: plot.color, width: plot.width, values: plot.values })
                    } else {
                        panes.push({
                            title: res.title || plot.title,
                            lines: [{ title: plot.title, color: plot.color, width: plot.width, values: plot.values }],
                            hlines: [],
                        })
                    }
                } else if (plot.kind === 'shape') {
                    shapes.push({ color: plot.color, above: !!plot.above, values: plot.values })
                }
            }
            chartRef.current.setIndicators(overlays, panes, shapes)
        } catch {
            // Pine errors handled in IndicatorEditor
        }
    }, [bars])

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div
            data-lenis-prevent
            style={{
                borderRadius: '10px',
                background: '#111417',
                border: '1px solid var(--db-border, rgba(255,255,255,0.08))',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden',
            }}
        >
            {/* Top Toolbar */}
            <div
                style={{
                    padding: '8px 14px',
                    borderBottom: '1px solid var(--db-border, rgba(255,255,255,0.08))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    flexWrap: 'wrap',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <IntervalSelector interval={interval} onChange={setInterval} />
                    <button
                        onClick={() => setIsEditorOpen(true)}
                        style={{
                            padding: '4px 10px',
                            fontSize: '11px',
                            borderRadius: '4px',
                            border: '1px solid rgba(168,85,247,0.4)',
                            background: 'rgba(168,85,247,0.15)',
                            color: '#a855f7',
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        + Pine Indicator
                    </button>
                    {/* Strike Selection & Option Chain buttons — when viewing an option contract */}
                    {instrument.type === 'options' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <button
                                id="chart-open-strike-selection"
                                onClick={openStrikeSelection}
                                title="Open Strike Selection modal"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    padding: '4px 10px',
                                    fontSize: '11px',
                                    borderRadius: '4px',
                                    border: '1px solid rgba(168,85,247,0.4)',
                                    background: 'rgba(168,85,247,0.18)',
                                    color: '#a855f7',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.15s',
                                }}
                            >
                                <span style={{ fontSize: '10px' }}>🎯</span>
                                Strike Selection
                            </button>
                            <button
                                id="chart-open-option-chain"
                                onClick={openOptionChain}
                                title="Open full-page live Option Chain (FYERS)"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    padding: '4px 10px',
                                    fontSize: '11px',
                                    borderRadius: '4px',
                                    border: '1px solid rgba(59,130,246,0.4)',
                                    background: 'rgba(59,130,246,0.18)',
                                    color: '#60a5fa',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.15s',
                                }}
                            >
                                <span style={{ fontSize: '10px' }}>⛓</span>
                                Option Chain
                            </button>
                        </div>
                    )}
                </div>

                <DrawingToolbar
                    tool={tool}
                    onSelectTool={setTool}
                    onUndo={() => chartRef.current?.undoDrawing()}
                    onClear={() => chartRef.current?.clearDrawings()}
                />
            </div>

            {/* Chart Canvas Host */}
            <div style={{ flex: 1, position: 'relative', width: '100%' }}>
                {loading && (
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            zIndex: 10,
                            padding: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            background: '#111417',
                        }}
                    >
                        <Skeleton height="60%" borderRadius={4} />
                        <Skeleton height="15%" width="80%" borderRadius={3} />
                        <Skeleton height="15%" width="60%" borderRadius={3} />
                    </div>
                )}
                {!loading && error && (
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            zIndex: 10,
                            background: 'rgba(17,20,23,0.95)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            color: '#7d848c',
                        }}
                    >
                        <span style={{ fontSize: '24px', opacity: 0.4 }}>⊘</span>
                        <span style={{ fontSize: '12px', fontWeight: 500 }}>Chart Data Unavailable</span>
                        <span style={{ fontSize: '11px', color: '#555' }}>{error}</span>
                    </div>
                )}
                <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
            </div>

            <IndicatorEditor
                isOpen={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                onApplyScript={applyPineScript}
            />
        </div>
    )
}

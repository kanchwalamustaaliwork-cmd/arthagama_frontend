'use client'

import React, { useRef, useEffect, useState } from 'react'
import { useInstrument } from '@/src/context/InstrumentContext'
import { useOptionChainContext } from '@/src/context/OptionChainContext'
import { useOHLCV } from '@/src/hooks/terminal/useOHLCV'
import { Interval } from '@/src/types/terminal'
import { CandleChart, ChartTool } from '@/src/lib/market-terminal/CandleChart'
import type { ChartInterval } from '@/src/lib/market-terminal/chartTimeAxis'
import IntervalSelector from './IntervalSelector'
import DrawingToolbar from './DrawingToolbar'
import IndicatorEditor from './IndicatorEditor'
import { runPine } from '@/src/lib/market-terminal/pine/pine'
import { Skeleton } from './Skeleton'

export default function ChartWidget() {
    const { instrument } = useInstrument()
    const { openChain } = useOptionChainContext()
    const [interval, setInterval] = useState<Interval>('1d')
    const { bars, loading, error } = useOHLCV(instrument, interval)

    const containerRef = useRef<HTMLDivElement>(null)
    const chartRef = useRef<CandleChart | null>(null)

    const [tool, setTool] = useState<ChartTool>('none')
    const [isEditorOpen, setIsEditorOpen] = useState(false)
    const [activeScript, setActiveScript] = useState<string | null>(null)

    // Initialize Canvas Chart
    useEffect(() => {
        if (!containerRef.current) return

        const chart = new CandleChart(containerRef.current, {
            bg: '#111417',
            grid: '#1c2126',
            text: '#7d848c',
            up: '#26a65b',
            down: '#e0524b',
            interval: interval as ChartInterval,
        })
        chartRef.current = chart

        return () => {
            chart.destroy()
            chartRef.current = null
        }
    }, [])

    // Sync interval changes to chart (X-axis re-formats immediately)
    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.setInterval(interval as ChartInterval)
        }
    }, [interval])

    // Update data when bars change
    useEffect(() => {
        if (chartRef.current && bars.length > 0) {
            chartRef.current.setData(bars)
            if (activeScript) {
                applyPineScript(activeScript)
            }
        }
    }, [bars])

    // Update drawing tool
    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.setTool(tool)
        }
    }, [tool])

    const applyPineScript = (script: string) => {
        setActiveScript(script)
        if (!chartRef.current || !bars.length) return
        try {
            const res = runPine(script, bars as any)
            const overlays: any[] = []
            const panes: any[] = []
            const shapes: any[] = []

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
            // Pine error handled in editor
        }
    }

    return (
        <div
            style={{
                borderRadius: '10px',
                background: '#111417',
                border: '1px solid var(--db-border, rgba(255,255,255,0.08))',
                display: 'flex',
                flexDirection: 'column',
                height: '520px',
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
                    {/* Option Chain button — only when viewing an option contract */}
                    {instrument.type === 'options' && (
                        <button
                            id="chart-open-option-chain"
                            onClick={openChain}
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
                            <span style={{ fontSize: '10px' }}>⛓</span>
                            Option Chain
                        </button>
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

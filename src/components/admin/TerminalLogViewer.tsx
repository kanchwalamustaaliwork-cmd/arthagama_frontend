'use client'

import React, { useRef, useLayoutEffect, useState } from 'react'
import type { TerminalLogItem } from '@/src/types/admin'
import { Loader2, Search, X } from 'lucide-react'

interface TerminalLogViewerProps {
    logs: TerminalLogItem[]
    total: number
    hasNext: boolean
    hasPrevious: boolean
    status: 'loading' | 'ready' | 'error'
    search: string
    onSearchChange: (v: string) => void
    level: string
    onLevelChange: (v: string) => void
    loadNext: () => void
    loadPrevious: () => Promise<void>
    retry: () => void
}

export default function TerminalLogViewer({
    logs,
    total,
    hasNext,
    hasPrevious,
    status,
    search,
    onSearchChange,
    level,
    onLevelChange,
    loadNext,
    loadPrevious,
    retry,
}: TerminalLogViewerProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const prevScrollHeightRef = useRef(0)
    const prevScrollTopRef = useRef(0)
    const firstLogId = logs[0]?.id
    const prevFirstLogIdRef = useRef<string | undefined>(undefined)

    // Adjust scroll top when logs are prepended to avoid scroll jumping
    useLayoutEffect(() => {
        const container = containerRef.current
        if (!container) return

        if (prevFirstLogIdRef.current && firstLogId && prevFirstLogIdRef.current !== firstLogId) {
            const heightDiff = container.scrollHeight - prevScrollHeightRef.current
            container.scrollTop = prevScrollTopRef.current + heightDiff
        }

        prevFirstLogIdRef.current = firstLogId
    }, [logs, firstLogId])

    const handleScroll = () => {
        const container = containerRef.current
        if (!container) return

        const { scrollTop, scrollHeight, clientHeight } = container

        // Load previous logs (at the top)
        if (scrollTop <= 40 && hasPrevious && status !== 'loading') {
            prevScrollHeightRef.current = scrollHeight
            prevScrollTopRef.current = scrollTop
            loadPrevious()
        }

        // Load next logs (at the bottom)
        if (scrollTop + clientHeight >= scrollHeight - 40 && hasNext && status !== 'loading') {
            loadNext()
        }
    }

    const formatTimestamp = (iso: string) => {
        const d = new Date(iso)
        if (isNaN(d.getTime())) return iso.slice(0, 19).replace('T', ' ')
        const pad = (n: number) => String(n).padStart(2, '0')
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    }

    const getLevelColor = (lvl: string) => {
        const up = lvl.toUpperCase()
        if (up.includes('INFO')) return '#38bdf8' // Cyan
        if (up.includes('WARN')) return '#eab308' // Yellow
        if (up.includes('ERR')) return '#f43f5e'  // Red
        if (up.includes('DBG') || up.includes('DEBUG')) return '#94a3b8' // Gray
        return 'inherit'
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', minHeight: '520px' }}>
            <style>{`
                .terminal-window {
                    background: #090d16;
                    border: 1px solid #1e293b;
                    border-radius: 8px;
                    display: flex;
                    flex-direction: column;
                    height: calc(100vh - 320px);
                    min-height: 480px;
                    overflow: hidden;
                    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.5);
                }
                .terminal-header {
                    background: #0f172a;
                    border-bottom: 1px solid #1e293b;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 10px 16px;
                    user-select: none;
                }
                .terminal-dots {
                    display: flex;
                    gap: 6px;
                }
                .terminal-dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                }
                .terminal-body {
                    flex: 1;
                    overflow-y: auto;
                    padding: 16px 0;
                    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
                    font-size: 13px;
                    color: #cbd5e1;
                }
                /* Scrollbar */
                .terminal-body::-webkit-scrollbar {
                    width: 10px;
                }
                .terminal-body::-webkit-scrollbar-track {
                    background: #090d16;
                }
                .terminal-body::-webkit-scrollbar-thumb {
                    background: #1e293b;
                    border-radius: 5px;
                }
                .terminal-body::-webkit-scrollbar-thumb:hover {
                    background: #334155;
                }
                /* Lines styling */
                .terminal-line {
                    display: flex;
                    padding: 3px 20px;
                    line-height: 20px;
                    transition: background 0.1s;
                }
                .terminal-line:hover {
                    background: rgba(255, 255, 255, 0.03);
                }
                .terminal-time {
                    width: 180px;
                    color: #475569;
                    flex-shrink: 0;
                    user-select: none;
                }
                .terminal-level {
                    width: 80px;
                    flex-shrink: 0;
                    font-weight: 700;
                    user-select: none;
                }
                .terminal-msg {
                    flex: 1;
                    white-space: pre-wrap;
                    word-break: break-all;
                }
                .terminal-status-indicator {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 12px;
                    color: #64748b;
                    font-family: inherit;
                    font-size: 12px;
                }
                @media (max-width: 768px) {
                    .terminal-time {
                        width: 140px;
                    }
                }
                @media (max-width: 640px) {
                    .terminal-line {
                        font-size: 11.5px;
                        padding: 3px 10px;
                    }
                    .terminal-time {
                        width: 70px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    .terminal-level {
                        width: 60px;
                    }
                }
            `}</style>

            {/* Top Toolbar Controls */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--db-text-muted)', fontWeight: 500 }}>
                        Filtered: <strong>{total}</strong> log entries
                    </span>
                </div>
                
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {/* Level Pill Filters */}
                    <div style={{ display: 'flex', background: 'var(--db-elevated)', border: '1px solid var(--db-border)', borderRadius: 'var(--db-radius-md)', padding: '2px' }}>
                        {['all', 'INFO', 'WARNING', 'ERROR', 'DEBUG'].map(lvl => {
                            const isAct = level === lvl
                            return (
                                <button
                                    key={lvl}
                                    onClick={() => onLevelChange(lvl)}
                                    style={{
                                        border: 'none',
                                        background: isAct ? 'rgba(255,255,255,0.06)' : 'transparent',
                                        color: isAct ? 'var(--db-text)' : 'var(--db-text-muted)',
                                        fontSize: '11px',
                                        padding: '4px 10px',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontWeight: isAct ? 600 : 400,
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    {lvl === 'all' ? 'ALL' : lvl}
                                </button>
                            )
                        })}
                    </div>

                    {/* Search box */}
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <Search size={14} color="#64748b" style={{ position: 'absolute', left: '10px' }} />
                        <input
                            type="text"
                            placeholder="Filter message content..."
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            style={{
                                background: 'var(--db-elevated)',
                                border: '1px solid var(--db-border)',
                                borderRadius: 'var(--db-radius-md)',
                                color: 'var(--db-text)',
                                fontSize: '13px',
                                padding: '6px 10px 6px 30px',
                                width: '220px',
                                outline: 'none',
                            }}
                        />
                        {search && (
                            <button
                                onClick={() => onSearchChange('')}
                                style={{
                                    position: 'absolute',
                                    right: '8px',
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#64748b',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <X size={12} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Terminal Window */}
            <div className="terminal-window">
                {/* Header */}
                <div className="terminal-header">
                    <div className="terminal-dots">
                        <div className="terminal-dot" style={{ background: '#ef4444' }} />
                        <div className="terminal-dot" style={{ background: '#f59e0b' }} />
                        <div className="terminal-dot" style={{ background: '#22c55e' }} />
                    </div>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, fontFamily: 'monospace' }}>
                        strategy-log-viewer.sh
                    </span>
                    <div style={{ width: '42px' }} /> {/* Spacing spacer */}
                </div>

                {/* Body */}
                <div 
                    className="terminal-body" 
                    ref={containerRef}
                    onScroll={handleScroll}
                >
                    {/* Top Loader */}
                    {status === 'loading' && hasPrevious && (
                        <div className="terminal-status-indicator">
                            <Loader2 size={12} className="animate-spin" />
                            <span>Fetching previous events...</span>
                        </div>
                    )}

                    {status === 'error' && logs.length === 0 ? (
                        <div style={{ padding: '40px', color: '#f43f5e', fontFamily: 'inherit' }}>
                            <div>ERROR:</div>
                            <div style={{ marginTop: '8px', color: '#cbd5e1' }}>Unable to fetch logs from engine database. Click to retry.</div>
                            <button 
                                onClick={retry}
                                style={{
                                    marginTop: '16px',
                                    background: '#1e293b',
                                    border: '1px solid #334155',
                                    color: '#cbd5e1',
                                    fontFamily: 'inherit',
                                    fontSize: '12px',
                                    padding: '6px 12px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                }}
                            >
                                Retry Connection
                            </button>
                        </div>
                    ) : logs.length === 0 ? (
                        <div style={{ padding: '40px', color: '#64748b', fontFamily: 'inherit', fontStyle: 'italic' }}>
                            {status === 'loading' ? 'Establishing session...' : 'No logs available.'}
                        </div>
                    ) : (
                        logs.map(log => {
                            const timeStr = formatTimestamp(log.timestamp)
                            const levelStr = log.level.toUpperCase()
                            const levelColor = getLevelColor(levelStr)

                            return (
                                <div className="terminal-line" key={log.id}>
                                    <span className="terminal-time">{timeStr}</span>
                                    <span className="terminal-level" style={{ color: levelColor }}>
                                        {levelStr.padEnd(8)}
                                    </span>
                                    <span className="terminal-msg">{log.message}</span>
                                </div>
                            )
                        })
                    )}

                    {/* Bottom Loader */}
                    {status === 'loading' && (hasNext || logs.length === 0) && (
                        <div className="terminal-status-indicator">
                            <Loader2 size={12} className="animate-spin" />
                            <span>Loading additional logs...</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

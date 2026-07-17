'use client'

import React, { useRef, useEffect } from 'react'
import { Globe } from 'lucide-react'

interface UniverseMarqueeProps {
    symbols: string[]
    loading: boolean
    error: boolean
}

export default function UniverseMarquee({ symbols, loading, error }: UniverseMarqueeProps) {
    const viewportRef = useRef<HTMLDivElement>(null)
    const isHoveredRef = useRef(false)
    const isInteractingRef = useRef(false)

    const isDraggingRef = useRef(false)
    const startXRef = useRef(0)
    const scrollLeftRef = useRef(0)
    const interactionTimeoutRef = useRef<number | null>(null)

    // Repeat list if too short to ensure seamless scrolling loops
    let tickerList = [...symbols]
    if (symbols.length > 0 && symbols.length < 15) {
        const repeatCount = Math.ceil(15 / symbols.length)
        tickerList = Array(repeatCount).fill(symbols).flat()
    }

    const pauseThenResume = () => {
        isInteractingRef.current = true
        if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current)
        interactionTimeoutRef.current = window.setTimeout(() => {
            isInteractingRef.current = false
        }, 1200)
    }

    // Animation Loop — purely additive, no dependency on scroll events firing back
    useEffect(() => {
        const container = viewportRef.current
        if (!container || tickerList.length === 0) return

        let animationFrameId: number

        const tick = () => {
            if (!container) return

            if (!isHoveredRef.current && !isInteractingRef.current && !isDraggingRef.current) {
                container.scrollLeft += 0.8 // slow steady speed
            }

            animationFrameId = requestAnimationFrame(tick)
        }

        animationFrameId = requestAnimationFrame(tick)
        return () => {
            cancelAnimationFrame(animationFrameId)
            if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current)
        }
    }, [tickerList.length])

    // Boundary Wrap Handler ONLY (makes it infinite) — no interaction detection here.
    // This must stay free of side effects that pause auto-scroll, or every
    // programmatic scrollLeft change (including our own tick) re-triggers a pause.
    const handleScroll = () => {
        const container = viewportRef.current
        if (!container) return

        const W = container.scrollWidth / 2
        if (container.scrollLeft >= W) {
            container.scrollLeft -= W
        } else if (container.scrollLeft <= 0) {
            container.scrollLeft += W
        }
    }

    // Manual wheel/trackpad scroll — this is the correct place to detect
    // real user interaction and pause the marquee.
    const handleWheel = () => {
        pauseThenResume()
    }

    // Mouse Drag Handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!viewportRef.current) return
        isDraggingRef.current = true
        isInteractingRef.current = true
        startXRef.current = e.pageX - viewportRef.current.offsetLeft
        scrollLeftRef.current = viewportRef.current.scrollLeft

        if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current)
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDraggingRef.current || !viewportRef.current) return
        e.preventDefault()
        const x = e.pageX - viewportRef.current.offsetLeft
        const walk = (x - startXRef.current) * 1.5 // drag speed multiplier
        viewportRef.current.scrollLeft = scrollLeftRef.current - walk
    }

    const handleMouseUpOrLeave = () => {
        isDraggingRef.current = false
        pauseThenResume()
    }

    // Touch Swipe Handlers (Mobile)
    const handleTouchStart = (e: React.TouchEvent) => {
        if (!viewportRef.current) return
        isDraggingRef.current = true
        isInteractingRef.current = true
        startXRef.current = e.touches[0].pageX - viewportRef.current.offsetLeft
        scrollLeftRef.current = viewportRef.current.scrollLeft

        if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current)
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!viewportRef.current) return
        const x = e.touches[0].pageX - viewportRef.current.offsetLeft
        const walk = (x - startXRef.current) * 1.5
        viewportRef.current.scrollLeft = scrollLeftRef.current - walk
    }

    const handleTouchEnd = () => {
        isDraggingRef.current = false
        pauseThenResume()
    }

    if (error) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', background: 'var(--db-elevated)', border: '1px solid var(--db-border)', borderRadius: 'var(--db-radius-md)', color: 'var(--db-loss)', gap: '10px' }}>
                <Globe size={24} />
                <span style={{ fontSize: '13px', fontWeight: 500 }}>Failed to load strategy trading universe.</span>
            </div>
        )
    }

    if (!loading && symbols.length === 0) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', background: 'var(--db-elevated)', border: '1px solid var(--db-border)', borderRadius: 'var(--db-radius-md)', color: 'var(--db-text-muted)', gap: '10px' }}>
                <Globe size={24} />
                <span style={{ fontSize: '13px', fontWeight: 500 }}>No universe symbols available.</span>
            </div>
        )
    }

    return (
        <div
            style={{
                position: 'relative',
                background: 'var(--db-elevated)',
                border: '1px solid var(--db-border)',
                borderRadius: 'var(--db-radius-md)',
                padding: '16px 0',
                overflow: 'hidden',
                width: '100%',
                userSelect: 'none',
            }}
            onMouseEnter={() => { isHoveredRef.current = true }}
            onMouseLeave={() => {
                isHoveredRef.current = false
                handleMouseUpOrLeave()
            }}
        >
            <style>{`
                .ticker-viewport {
                    display: flex;
                    overflow-x: auto;
                    white-space: nowrap;
                    width: 100%;
                    scrollbar-width: none; /* Firefox */
                    cursor: grab;
                }
                .ticker-viewport::-webkit-scrollbar {
                    display: none; /* Safari / Chrome */
                }
                .ticker-viewport:active {
                    cursor: grabbing;
                }
                .ticker-track {
                    display: inline-flex;
                    gap: 16px;
                    padding: 0 8px;
                }
                .universe-chip {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 10px 22px;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid var(--db-border);
                    border-radius: var(--db-radius-md);
                    color: var(--db-text);
                    font-weight: 600;
                    font-size: 13px;
                    font-family: monospace;
                    letter-spacing: 0.04em;
                    cursor: pointer;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .universe-chip:hover {
                    transform: translateY(-2.5px);
                    background: rgba(255, 255, 255, 0.08);
                    border-color: var(--db-mint);
                    color: var(--db-mint);
                    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.3);
                }
                /* Fade Overlays */
                .ticker-fade-left {
                    position: absolute;
                    top: 0; left: 0; bottom: 0; width: 60px;
                    background: linear-gradient(to right, var(--db-elevated) 0%, transparent 100%);
                    pointer-events: none;
                    z-index: 2;
                }
                .ticker-fade-right {
                    position: absolute;
                    top: 0; right: 0; bottom: 0; width: 60px;
                    background: linear-gradient(to left, var(--db-elevated) 0%, transparent 100%);
                    pointer-events: none;
                    z-index: 2;
                }
                /* Shimmer */
                .shimmer-chip {
                    background: linear-gradient(90deg, rgba(255,255,255,0.01) 25%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.01) 75%);
                    background-size: 200% 100%;
                    animation: loading-shimmer 1.5s infinite;
                    border: 1px solid var(--db-border);
                    border-radius: var(--db-radius-md);
                    width: 120px;
                    height: 38px;
                }
                @keyframes loading-shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>

            {/* Edge fades */}
            <div className="ticker-fade-left" />
            <div className="ticker-fade-right" />

            {/* Scrolling track */}
            <div
                className="ticker-viewport"
                ref={viewportRef}
                onScroll={handleScroll}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {loading ? (
                    <div className="ticker-track">
                        {Array(10).fill(0).map((_, i) => (
                            <div className="shimmer-chip" key={i} />
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Track Copy 1 */}
                        <div className="ticker-track">
                            {tickerList.map((sym, idx) => (
                                <div className="universe-chip" key={`${sym}-c1-${idx}`}>
                                    {sym}
                                </div>
                            ))}
                        </div>
                        {/* Track Copy 2 (creates visual loop continuity) */}
                        <div className="ticker-track">
                            {tickerList.map((sym, idx) => (
                                <div className="universe-chip" key={`${sym}-c2-${idx}`}>
                                    {sym}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
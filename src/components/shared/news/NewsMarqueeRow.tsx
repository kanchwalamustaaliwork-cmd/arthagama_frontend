'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import type { NewsArticle } from '@/src/types/news'
import NewsMarqueeCard from './NewsMarqueeCard'

interface NewsMarqueeRowProps {
    articles: NewsArticle[]
    direction: 'left' | 'right'
    speed?: number // pixels per second
}

export default function NewsMarqueeRow({ articles, direction, speed = 40 }: NewsMarqueeRowProps) {
    const trackRef = useRef<HTMLDivElement>(null)

    const offsetRef = useRef(0)
    const setWidthRef = useRef(0)
    const animRef = useRef<number | null>(null)
    const lastTimeRef = useRef<number | null>(null)

    const isHoveringRef = useRef(false)
    const isDraggingRef = useRef(false)
    const dragStartXRef = useRef(0)
    const dragStartOffsetRef = useRef(0)
    const hasDraggedRef = useRef(false)

    const [isDraggingState, setIsDraggingState] = useState(false)

    // 3 copies gives enough buffer on both sides for the loop + manual dragging
    const loopArticles = articles.length > 0 ? [...articles, ...articles, ...articles] : []

    const measure = useCallback(() => {
        if (trackRef.current) {
            setWidthRef.current = trackRef.current.scrollWidth / 3
        }
    }, [])

    useEffect(() => {
        measure()
        window.addEventListener('resize', measure)
        return () => window.removeEventListener('resize', measure)
    }, [measure, articles])

    const wrapOffset = () => {
        const w = setWidthRef.current
        if (w <= 0) return
        if (offsetRef.current <= -2 * w) offsetRef.current += w
        else if (offsetRef.current >= 0) offsetRef.current -= w
    }

    useEffect(() => {
        const step = (time: number) => {
            if (lastTimeRef.current === null) lastTimeRef.current = time
            const dt = (time - lastTimeRef.current) / 1000
            lastTimeRef.current = time

            if (!isHoveringRef.current && !isDraggingRef.current && setWidthRef.current > 0) {
                const dir = direction === 'left' ? -1 : 1
                offsetRef.current += dir * speed * dt
                wrapOffset()
            }

            if (trackRef.current) {
                trackRef.current.style.transform = `translateX(${offsetRef.current}px)`
            }
            animRef.current = requestAnimationFrame(step)
        }
        animRef.current = requestAnimationFrame(step)
        return () => {
            if (animRef.current) cancelAnimationFrame(animRef.current)
            lastTimeRef.current = null
        }
    }, [direction, speed])

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        isDraggingRef.current = true
        hasDraggedRef.current = false
        setIsDraggingState(true)
        dragStartXRef.current = e.clientX
        dragStartOffsetRef.current = offsetRef.current
            ; (e.target as HTMLElement).setPointerCapture(e.pointerId)
    }

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDraggingRef.current) return
        const dx = e.clientX - dragStartXRef.current
        if (Math.abs(dx) > 3) hasDraggedRef.current = true
        offsetRef.current = dragStartOffsetRef.current + dx
        wrapOffset()
    }

    const endDrag = () => {
        isDraggingRef.current = false
        setIsDraggingState(false)
    }

    const handleClickCapture = (e: React.MouseEvent) => {
        // don't let a drag gesture also trigger the card's link navigation
        if (hasDraggedRef.current) {
            e.preventDefault()
            e.stopPropagation()
        }
    }

    return (
        <div
            className="news-marquee-row"
            onMouseEnter={() => { isHoveringRef.current = true }}
            onMouseLeave={() => { isHoveringRef.current = false; endDrag() }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onClickCapture={handleClickCapture}
            style={{ cursor: isDraggingState ? 'grabbing' : 'grab' }}
        >
            <div ref={trackRef} className="news-marquee-track">
                {loopArticles.map((article, i) => (
                    <NewsMarqueeCard key={`${article.url}-${i}`} article={article} />
                ))}
            </div>
        </div>
    )
}
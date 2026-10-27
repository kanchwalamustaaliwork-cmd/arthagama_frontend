'use client'

/**
 * src/hooks/useInViewport.ts
 *
 * Canonical shared viewport intersection observer hook.
 * Used across dashboard, stockdashboard, and indices for below-the-fold lazy data loading.
 */

import { useState, useEffect, useRef, RefObject } from 'react'

export interface UseInViewportOptions {
    rootMargin?: string
    threshold?: number | number[]
    freezeOnceVisible?: boolean
    triggerOnce?: boolean
}

export interface UseInViewportReturn<T extends HTMLElement> {
    ref: RefObject<T | null>
    isVisible: boolean
    inViewport: boolean
    hasBeenInViewport: boolean
}

export function useInViewport<T extends HTMLElement = HTMLDivElement>(
    options: UseInViewportOptions = {}
): UseInViewportReturn<T> {
    const {
        rootMargin = '100px',
        threshold = 0,
        freezeOnceVisible = true,
        triggerOnce = true,
    } = options

    const shouldFreeze = freezeOnceVisible || triggerOnce

    const ref = useRef<T | null>(null)
    const [isVisible, setIsVisible] = useState(false)
    const [hasBeenInViewport, setHasBeenInViewport] = useState(false)

    useEffect(() => {
        const element = ref.current
        if (!element) return

        if (typeof IntersectionObserver === 'undefined') {
            setIsVisible(true)
            setHasBeenInViewport(true)
            return
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry && entry.isIntersecting) {
                    setIsVisible(true)
                    setHasBeenInViewport(true)
                    if (shouldFreeze) {
                        observer.unobserve(element)
                    }
                } else if (!shouldFreeze) {
                    setIsVisible(false)
                }
            },
            { rootMargin, threshold }
        )

        observer.observe(element)
        return () => observer.disconnect()
    }, [rootMargin, threshold, shouldFreeze])

    return {
        ref,
        isVisible,
        inViewport: isVisible,
        hasBeenInViewport,
    }
}

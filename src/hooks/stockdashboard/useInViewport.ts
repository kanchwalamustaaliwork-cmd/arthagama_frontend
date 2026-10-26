/**
 * src/hooks/stockdashboard/useInViewport.ts
 *
 * Viewport intersection observer hook for below-the-fold lazy data loading.
 */

'use client'

import { useState, useEffect, useRef } from 'react'

interface UseInViewportOptions {
    rootMargin?: string
    threshold?: number | number[]
    freezeOnceVisible?: boolean
}

export function useInViewport<T extends HTMLElement = HTMLDivElement>(
    options: UseInViewportOptions = { freezeOnceVisible: true, rootMargin: '100px' }
) {
    const { freezeOnceVisible = true, rootMargin = '100px', threshold = 0 } = options
    const ref = useRef<T | null>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const element = ref.current
        if (!element) return

        if (typeof IntersectionObserver === 'undefined') {
            setIsVisible(true)
            return
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    if (freezeOnceVisible) {
                        observer.unobserve(element)
                    }
                } else if (!freezeOnceVisible) {
                    setIsVisible(false)
                }
            },
            { rootMargin, threshold }
        )

        observer.observe(element)
        return () => observer.disconnect()
    }, [rootMargin, threshold, freezeOnceVisible])

    return { ref, isVisible }
}

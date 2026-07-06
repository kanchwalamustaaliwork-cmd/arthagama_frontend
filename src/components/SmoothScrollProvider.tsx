"use client"

import { useEffect, useRef, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
    const lenisRef = useRef<Lenis | null>(null)
    const pathname = usePathname()

    useEffect(() => {
        const lenis = new Lenis({
            lerp: 0.08,
            smoothWheel: true,
        })
        lenisRef.current = lenis

        const rafCallback = (time: number) => {
            lenis.raf(time * 1000)
        }
        gsap.ticker.add(rafCallback)
        gsap.ticker.lagSmoothing(0)

        lenis.on('scroll', ScrollTrigger.update)

        return () => {
            lenis.destroy()
            gsap.ticker.remove(rafCallback)
        }
    }, [])

    useEffect(() => {
        // Reset scroll to top on route change.
        // We delay the scroll by 350ms to match the exit animation duration (0.35s)
        // avoiding jarring jumps while the old page exits.
        const timeout = setTimeout(() => {
            if (lenisRef.current) {
                lenisRef.current.scrollTo(0, { immediate: true })
            } else {
                window.scrollTo(0, 0)
            }
        }, 350)

        // REQUIRED: prevents double-scroll if user navigates twice within 350ms
        return () => clearTimeout(timeout)
    }, [pathname])

    return <>{children}</>
}

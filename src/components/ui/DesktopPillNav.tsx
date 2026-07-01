import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
    motion,
    useSpring,
    useVelocity,
    useTransform,
} from 'framer-motion'
import NavLogo from './NavLogo'
import SignUpButton from './SingUpButton'
import LoginButton from './LoginButton'

/* ────────────────────────────────────────────────────────────────────────
 * Desktop pill nav (original component, untouched logic/animation)
 * ──────────────────────────────────────────────────────────────────────── */
export default function DesktopPillNav({ navLinks, isActive }: { navLinks: { label: string; to: string }[]; isActive: (to: string) => boolean }) {
    const [scrolled, setScrolled] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])
    const location = useLocation()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 100)
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    /* ---------------------------------------------------------------------
     * Liquid blob indicator
     * x / width track the active tab's geometry. Wrapping them in springs
     * gives free interruptible retargeting — framer-motion smoothly
     * redirects an in-flight spring toward a new target with no snap.
     *
     * FIX: when none of navLinks matches the current route (e.g. on
     * /login or /signup), findIndex returns -1 and there's no element to
     * measure. Previously this caused an early return that left `box` (and
     * therefore the blob position) stuck on whatever tab was last active.
     * We now explicitly detect this case and collapse + fade the blob out
     * instead of leaving a stale highlight behind.
     * ------------------------------------------------------------------- */
    const [box, setBox] = useState({ left: 0, width: 0 })
    const [hasActiveTab, setHasActiveTab] = useState(true)

    const measure = useCallback(() => {
        const activeIdx = navLinks?.findIndex((l) => isActive(l.to))
        const container = containerRef.current
        if (!container) return

        if (activeIdx === -1) {
            // No nav link matches current route (e.g. /login, /signup) —
            // fade the blob out rather than leaving it on the old tab.
            setHasActiveTab(false)
            return
        }

        const el = linkRefs.current[activeIdx]
        if (!el) return

        const elRect = el.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()
        setHasActiveTab(true)
        setBox({ left: elRect.left - containerRect.left, width: elRect.width })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname])

    useEffect(() => {
        measure()
    }, [measure])

    useEffect(() => {
        const ro = new ResizeObserver(measure)
        if (containerRef.current) ro.observe(containerRef.current)
        window.addEventListener('resize', measure)
        return () => {
            ro.disconnect()
            window.removeEventListener('resize', measure)
        }
    }, [measure])

    // Underdamped spring -> natural overshoot + damped bounce, ~350-450ms feel
    const springConfig = { stiffness: 420, damping: 26, mass: 1 }
    const x = useSpring(box.left, springConfig)
    const width = useSpring(box.width, springConfig)
    const opacity = useSpring(hasActiveTab ? 1 : 0, { stiffness: 300, damping: 30 })

    // Velocity drives the "surface tension" stretch/squeeze — the blob
    // elongates along the direction of travel and thins vertically,
    // preserving the sense of volume, then relaxes to a circle/pill at rest.
    const xVelocity = useVelocity(x)
    const stretchX = useTransform(xVelocity, [-2200, 0, 2200], [1.5, 1, 1.5], { clamp: true })
    const squeezeY = useTransform(xVelocity, [-2200, 0, 2200], [0.72, 1, 0.72], { clamp: true })

    useEffect(() => {
        if (hasActiveTab) {
            x.set(box.left)
            width.set(box.width)
        }
        opacity.set(hasActiveTab ? 1 : 0)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [box, hasActiveTab])

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-3 sm:px-4">
            {/* Goo filter softens the blob's edges into an organic, liquid silhouette */}
            <svg className="absolute h-0 w-0" aria-hidden="true">
                <defs>
                    <filter id="liquid-goo">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
                        <feColorMatrix
                            in="blur"
                            mode="matrix"
                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
                            result="goo"
                        />
                    </filter>
                </defs>
            </svg>

            <div
                ref={containerRef}
                className={`relative inline-flex items-center gap-1 rounded-full backdrop-blur-md px-2 py-2 transition-shadow duration-300 max-w-full overflow-x-auto no-scrollbar ${scrolled ? 'shadow-lg shadow-[hsl(var(--teal-deep)/0.5)]' : ''
                    }`}
                style={{
                    background: 'hsl(var(--teal) / 0.55)',
                    boxShadow: 'inset 0 1px 1px hsl(var(--mint) / 0.15)',
                }}
            >
                {/* Liquid blob indicator, rendered behind the link labels */}
                <div className="pointer-events-none absolute inset-y-2 left-0 z-0" style={{ filter: 'url(#liquid-goo)' }}>
                    <motion.div
                        className="absolute top-0 h-full rounded-full"
                        style={{
                            x,
                            width,
                            scaleX: stretchX,
                            scaleY: squeezeY,
                            opacity,
                            originX: 0.5,
                            originY: 0.5,
                            background:
                                'linear-gradient(90deg, hsl(var(--mint)) 0%, hsl(var(--mint-soft)) 100%)',
                            boxShadow: '0 2px 10px hsl(var(--teal-deep) / 0.45)',
                        }}
                    />
                </div>

                {/* Logo */}
                <NavLogo />

                {/* Divider */}
                <div className="w-px h-5 mx-1 hidden sm:block" style={{ background: 'hsl(var(--mint) / 0.25)' }} />

                {/* Nav Links */}
                {navLinks.map((link, i) => (
                    <Link
                        key={link.label}
                        ref={(el) => {
                            linkRefs.current[i] = el
                        }}
                        to={link.to}
                        className={`relative z-10 text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-colors duration-200 whitespace-nowrap ${isActive(link.to)
                            ? 'text-[hsl(var(--teal-deep))] font-medium'
                            : 'text-[hsl(var(--mint)/0.75)] hover:text-[hsl(var(--mint-soft))]'
                            }`}
                    >
                        {link.label}
                    </Link>
                ))}

                {/* Divider */}
                <div className="w-px h-5 mx-1 hidden sm:block" style={{ background: 'hsl(var(--mint) / 0.25)' }} />

                {/* Auth Buttons */}
                <LoginButton />
                <SignUpButton />
            </div>
        </nav>
    )
}
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
    motion,
    AnimatePresence,
} from 'framer-motion'

/* ────────────────────────────────────────────────────────────────────────
 * Mobile menu — floating hamburger (top-right) + cloth-wrap panel
 * ──────────────────────────────────────────────────────────────────────── */
export default function MobileMenu({ navLinks, isActive }: { navLinks: { label: string; to: string }[]; isActive: (to: string) => boolean }) {
    const [open, setOpen] = useState(false)
    const location = useLocation()

    // Close automatically whenever the route changes (link tapped)
    useEffect(() => {
        setOpen(false)
    }, [location.pathname])

    // Lock body scroll while the cloth panel is unfurled
    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : ''
        return () => {
            document.body.style.overflow = ''
        }
    }, [open])

    return (
        <>
            {/* Floating hamburger button, fixed top-right corner */}
            <button
                type="button"
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="fixed top-4 right-4 z-[60] flex items-center justify-center w-11 h-11 rounded-full backdrop-blur-md transition-transform duration-200 active:scale-90"
                style={{
                    background: 'hsl(var(--teal) / 0.75)',
                    boxShadow: 'inset 0 1px 1px hsl(var(--mint) / 0.2), 0 4px 14px hsl(var(--teal-deep) / 0.5)',
                }}
            >
                {/* Hamburger lines morph into an X */}
                <span className="relative w-5 h-4 block">
                    <motion.span
                        className="absolute left-0 top-0 h-[2px] w-full rounded-full"
                        style={{ background: 'hsl(var(--mint-soft))' }}
                        animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                        transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
                    />
                    <motion.span
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] w-full rounded-full"
                        style={{ background: 'hsl(var(--mint-soft))' }}
                        animate={open ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                    />
                    <motion.span
                        className="absolute left-0 bottom-0 h-[2px] w-full rounded-full"
                        style={{ background: 'hsl(var(--mint-soft))' }}
                        animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                        transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
                    />
                </span>
            </button>

            <AnimatePresence>
                {open && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="backdrop"
                            className="fixed inset-0 z-50"
                            style={{ background: 'hsl(var(--teal-deep) / 0.55)' }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            onClick={() => setOpen(false)}
                        />

                        {/* ----------------------------------------------------------
             * Cloth-wrap panel
             * Anchored at its top edge (like fabric pinned at a rod),
             * it unfurls downward with a springy, slightly wavy motion
             * (scaleY + rotateX + a subtle skew flutter) rather than a
             * flat linear slide, then settles with a soft overshoot —
             * mimicking cloth dropping and catching air resistance.
             * All animated properties are transform/opacity only, so
             * the motion stays GPU-accelerated.
             * -------------------------------------------------------- */}
                        <motion.div
                            key="panel"
                            className="fixed top-[4.25rem] right-4 left-4 z-[55] rounded-3xl backdrop-blur-md overflow-hidden origin-top"
                            style={{
                                background: 'hsl(var(--teal) / 0.85)',
                                boxShadow:
                                    'inset 0 1px 1px hsl(var(--mint) / 0.2), 0 12px 30px hsl(var(--teal-deep) / 0.55)',
                                transformPerspective: 800,
                            }}
                            initial={{ scaleY: 0, rotateX: -18, opacity: 0, skewX: -2 }}
                            animate={{
                                scaleY: 1,
                                rotateX: 0,
                                opacity: 1,
                                skewX: [-2, 1.5, -0.6, 0],
                                transition: {
                                    scaleY: { type: 'spring', stiffness: 180, damping: 15, mass: 0.9 },
                                    rotateX: { type: 'spring', stiffness: 180, damping: 16 },
                                    opacity: { duration: 0.2 },
                                    skewX: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                                },
                            }}
                            exit={{
                                scaleY: 0,
                                rotateX: -12,
                                opacity: 0,
                                transition: { duration: 0.28, ease: [0.55, 0, 1, 0.45] },
                            }}
                        >
                            <div className="px-3 py-4">
                                {/* Links — alternate left/right entrance, one-by-one with a
                    millisecond stagger handled by each item's own `delay`. */}
                                <ul className="flex flex-col gap-1">
                                    {navLinks.map((link, i) => (
                                        <motion.li
                                            key={link.label}
                                            initial={{ opacity: 0, x: i % 2 === 0 ? -28 : 28 }}
                                            animate={{
                                                opacity: 1,
                                                x: 0,
                                                transition: {
                                                    delay: 0.12 + i * 0.07, // ~70ms stagger between items
                                                    type: 'spring',
                                                    stiffness: 320,
                                                    damping: 22,
                                                },
                                            }}
                                            exit={{ opacity: 0, x: i % 2 === 0 ? -16 : 16, transition: { duration: 0.15 } }}
                                        >
                                            <Link
                                                to={link.to}
                                                className={`block min-h-[44px] flex items-center rounded-2xl px-4 text-base transition-colors duration-200 ${isActive(link.to)
                                                    ? 'text-[hsl(var(--teal-deep))] font-medium'
                                                    : 'text-[hsl(var(--mint)/0.85)] hover:text-[hsl(var(--mint-soft))]'
                                                    }`}
                                                style={isActive(link.to) ? { background: 'hsl(var(--mint))' } : undefined}
                                            >
                                                {link.label}
                                            </Link>
                                        </motion.li>
                                    ))}
                                </ul>

                                {/* Divider */}
                                <motion.div
                                    className="h-px my-3 mx-2"
                                    style={{ background: 'hsl(var(--mint) / 0.25)' }}
                                    initial={{ opacity: 0, scaleX: 0 }}
                                    animate={{
                                        opacity: 1,
                                        scaleX: 1,
                                        transition: { delay: 0.12 + navLinks.length * 0.07, duration: 0.3 },
                                    }}
                                    exit={{ opacity: 0 }}
                                />

                                {/* Auth buttons — continue the alternating sequence */}
                                <div className="flex flex-col gap-2 px-2 pb-1">
                                    <motion.div
                                        initial={{ opacity: 0, x: -28 }}
                                        animate={{
                                            opacity: 1,
                                            x: 0,
                                            transition: {
                                                delay: 0.18 + navLinks.length * 0.07,
                                                type: 'spring',
                                                stiffness: 320,
                                                damping: 22,
                                            },
                                        }}
                                        exit={{ opacity: 0, x: -16, transition: { duration: 0.15 } }}
                                    >
                                        <Link
                                            to="/login"
                                            className="flex items-center justify-center min-h-[44px] w-full rounded-2xl text-base transition-colors duration-200"
                                            style={{
                                                border: '1px solid hsl(var(--mint) / 0.3)',
                                                color: 'hsl(var(--mint) / 0.85)',
                                            }}
                                        >
                                            Log in
                                        </Link>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: 28 }}
                                        animate={{
                                            opacity: 1,
                                            x: 0,
                                            transition: {
                                                delay: 0.25 + navLinks.length * 0.07,
                                                type: 'spring',
                                                stiffness: 320,
                                                damping: 22,
                                            },
                                        }}
                                        exit={{ opacity: 0, x: 16, transition: { duration: 0.15 } }}
                                    >
                                        <Link
                                            to="/signup"
                                            className="flex items-center justify-center gap-1 min-h-[44px] w-full rounded-2xl text-base transition-colors duration-200"
                                            style={{
                                                background: 'hsl(var(--mint))',
                                                color: 'hsl(var(--teal-deep))',
                                            }}
                                        >
                                            Become a Member <span>↗</span>
                                        </Link>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
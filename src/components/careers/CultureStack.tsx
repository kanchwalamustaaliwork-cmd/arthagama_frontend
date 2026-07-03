import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { CULTURE_POINTS } from '../../data/jobs'
import type { Point } from '../../types/careers'


const MAX_PEEK_DEPTH = 3 // how many stacked layers peek out behind the front card
const EXIT_Y = -150 // px the front card travels as it leaves
const EXIT_ROTATE = -5 // deg the front card rotates as it leaves

/**
 * Pure function: given a continuous "scroll position" (v) and a card's own
 * index, return that card's visual state.
 *
 *  v < index          -> card is still waiting in the stack (peeking behind)
 *  index <= v < i + 1  -> card is the active, front card and is mid-exit
 *  v >= index + 1      -> card has fully left
 */
function cardState(v: number, index: number) {
    if (v >= index + 1) {
        return { y: EXIT_Y, opacity: 0, scale: 0.92, rotate: EXIT_ROTATE }
    }
    if (v >= index) {
        const f = v - index
        return {
            y: f * EXIT_Y,
            opacity: 1 - f,
            scale: 1 - f * 0.08,
            rotate: f * EXIT_ROTATE,
        }
    }
    const depth = Math.min(index - v, MAX_PEEK_DEPTH)
    return {
        y: depth * 14,
        opacity: depth >= MAX_PEEK_DEPTH ? 0 : 1,
        scale: 1 - depth * 0.045,
        rotate: 0,
    }
}

function StackCard({
    point,
    index,
    total,
    isActive,
    currentFloat,
}: {
    point: Point
    index: number
    total: number
    isActive: boolean
    currentFloat: MotionValue<number>
}) {
    const y = useTransform(currentFloat, (v) => cardState(v, index).y)
    const opacity = useTransform(currentFloat, (v) => cardState(v, index).opacity)
    const scale = useTransform(currentFloat, (v) => cardState(v, index).scale)
    const rotate = useTransform(currentFloat, (v) => cardState(v, index).rotate)

    return (
        <motion.div
            style={{ y, opacity, scale, rotate, zIndex: total - index }}
            className="culture-card absolute inset-0 rounded-3xl p-10 sm:p-14"
            aria-hidden={!isActive}
        >
            <span className="text-sm font-medium tracking-wide text-[#244147]/50">
                {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>

            <h3 className="mt-4 text-2xl font-semibold text-[#1B3236] sm:text-3xl md:text-4xl">
                {point.title}
            </h3>

            <p className="mt-5 text-base leading-7 text-[#244147]/75 sm:text-lg md:text-xl">
                {point.body}
            </p>
        </motion.div>
    )
}

/**
 * Scroll-pinned stack of cards.
 *
 * The section is taller than the viewport (total * 85vh). Its inner content
 * is `position: sticky`, so the page visually "holds" on this section: the
 * user keeps scrolling but the screen doesn't move to whatever comes next
 * until they've scrolled through every card in the stack. Each unit of
 * scroll peels the front card away and reveals the next layer underneath —
 * all previous/upcoming cards stay visible, stacked and slightly offset,
 * the whole time. Works the same way on touch (native scroll) and desktop.
 */
export default function CultureStack() {
    const total = CULTURE_POINTS.length
    const containerRef = useRef<HTMLDivElement>(null)
    const [activeIndex, setActiveIndex] = useState(0)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    })

    // Maps overall scroll progress through this section (0-1) to a
    // continuous "card position" from 0 to total-1.
    const currentFloat = useTransform(scrollYProgress, [0, 1], [0, total - 1])

    useEffect(() => {
        const unsubscribe = currentFloat.on('change', (v) => {
            setActiveIndex(Math.min(total - 1, Math.max(0, Math.round(v))))
        })
        return unsubscribe
    }, [currentFloat, total])

    return (
        <div ref={containerRef} style={{ height: `${total * 85}vh` }} className="relative">
            <div className="sticky top-0 flex h-screen flex-col items-center justify-center px-5">
                <p className="mb-10 text-[11px] uppercase tracking-[0.25em] text-[#B8CEC2]/70">
                    Life at Arthagama
                </p>

                <div className="relative w-full max-w-xl sm:max-w-2xl" style={{ height: 340 }}>
                    {CULTURE_POINTS.map((point, i) => (
                        <StackCard
                            key={point.title}
                            point={point}
                            index={i}
                            total={total}
                            isActive={i === activeIndex}
                            currentFloat={currentFloat}
                        />
                    ))}
                </div>
            </div>

            <style>{`
        .culture-card {
          background: rgba(184, 206, 194, 0.9);
          border: 1px solid rgba(184, 206, 194, 1);
          box-shadow: 0 4px 18px rgba(18, 33, 36, 0.15);
          will-change: transform, opacity;
        }
      `}</style>
        </div>
    )
}
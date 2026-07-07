import { useEffect, useRef, useState } from 'react'
import { useScroll, useTransform } from 'framer-motion'
import { CULTURE_POINTS } from '../../data/jobs'
import { BRAND_ON_DARK } from '@/src/utils/brand'
import StackCard from './StackCard'


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
                    Life at <strong className={BRAND_ON_DARK}>ARTHAGAMA</strong>
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
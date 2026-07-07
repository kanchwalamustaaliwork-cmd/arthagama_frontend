import cardState from './CardState'
import { motion, useTransform, type MotionValue } from 'framer-motion'
import type { Point } from '../../types/careers'

export default function StackCard({
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
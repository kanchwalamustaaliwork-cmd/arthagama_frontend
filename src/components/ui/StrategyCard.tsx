import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import type { Strategy } from '../home/StrategiesSection'
import { useRef } from 'react'
import { viewMotion } from '../../constans/animation'

// ─── Tilt card: 3D perspective tilt + glass reflection + border beam ────────
export default function StrategyCard({
    strategy,
    index,
    isHovered,
    onEnter,
    onLeave,
}: {
    strategy: Strategy
    index: number
    isHovered: boolean
    onEnter: () => void
    onLeave: () => void
}) {
    const cardRef = useRef<HTMLDivElement>(null)

    const mouseX = useMotionValue(0.5)
    const mouseY = useMotionValue(0.5)

    const rotateX = useSpring(useTransform(mouseY, [0, 1], [8, -8]), { stiffness: 200, damping: 20 })
    const rotateY = useSpring(useTransform(mouseX, [0, 1], [-8, 8]), { stiffness: 200, damping: 20 })

    // reflection highlight follows cursor
    const glowX = useTransform(mouseX, (v) => `${v * 100}%`)
    const glowY = useTransform(mouseY, (v) => `${v * 100}%`)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = cardRef.current?.getBoundingClientRect()
        if (!rect) return
        mouseX.set((e.clientX - rect.left) / rect.width)
        mouseY.set((e.clientY - rect.top) / rect.height)
    }

    return (
        <motion.div
            {...viewMotion}
            transition={{ ...viewMotion.transition, delay: index * 0.08 }}
            style={{ perspective: 900 }}
        >
            <motion.div
                ref={cardRef}
                className="strategy-card-mint relative rounded-3xl p-6 sm:p-8 flex flex-col gap-4 overflow-hidden group cursor-pointer"
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                onMouseMove={handleMouseMove}
                onMouseEnter={onEnter}
                onMouseLeave={() => {
                    onLeave()
                    mouseX.set(0.5)
                    mouseY.set(0.5)
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
                {/* Glass reflection highlight, follows cursor — dark teal wash on hover */}
                <motion.div
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                        background: `radial-gradient(circle at ${glowX} ${glowY}, rgba(255,255,255,0.55), transparent 60%)`,
                    }}
                />

                {/* Border beam — rotating conic gradient ring, visible on hover */}
                <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <motion.div
                        className="absolute inset-0 rounded-3xl"
                        style={{
                            background:
                                'conic-gradient(from 0deg, transparent 0%, rgba(36,65,71,0.7) 10%, transparent 20%)',
                        }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    />
                    <div className="absolute inset-[1.5px] rounded-3xl bg-[#B8CEC2]/90" />
                </div>

                {/* Halftone dot texture — dark dots on light mint surface */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-[0.08] mix-blend-multiply pointer-events-none transition-opacity duration-500"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #244147 1px, transparent 1px)',
                        backgroundSize: '4px 4px',
                    }}
                />

                <div className="relative z-10 flex flex-col gap-4" style={{ transform: 'translateZ(30px)' }}>
                    {/* Number indicator */}
                    <div className="flex items-center justify-between">
                        <span className="font-display italic text-xl text-[#244147]/460 group-hover:text-[#1B3236] transition-colors duration-300">
                            {String(index + 1).padStart(2, '0')}
                        </span>
                        <div className="w-2 h-2 rounded-full bg-[#244147]/40 group-hover:bg-[#244147] transition-all duration-300" />
                    </div>

                    {/* Strategy Name */}
                    <h3 className="text-lg font-body font-semibold text-[#1B3236] mt-2">{strategy.name}</h3>

                    {/* Description */}
                    <p className="text-sm text-[#244147]/75 leading-relaxed font-body">{strategy.description}</p>
                </div>

                {/* Hover bottom line accent */}
                <div
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-transparent transition-all duration-300"
                    style={{ background: isHovered ? '#244147' : 'transparent' }}
                />
            </motion.div>
        </motion.div>
    )
}
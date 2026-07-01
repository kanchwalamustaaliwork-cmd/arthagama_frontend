import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import type { Broker } from "../home/BrokerIntegrationsSection";


interface ScrollColProps {
    brokers: Broker[]
    duration: number
    reversed?: boolean
}

export default function ScrollCol({ brokers, duration, reversed = false }: ScrollColProps) {
    const trackRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const track = trackRef.current
        if (!track) return

        const ctx = gsap.context(() => {
            gsap.fromTo(
                track,
                { yPercent: reversed ? -50 : 0 },
                {
                    yPercent: reversed ? 0 : -50,
                    duration,
                    ease: 'none',
                    repeat: -1,
                }
            )
        })

        return () => ctx.revert()
    }, [duration, reversed])

    const items = [...brokers, ...brokers]

    return (
        <div
            className="flex-1 overflow-hidden relative h-[320px] sm:h-[400px] md:h-[480px]"
            style={{
                // Fade edges to transparent (not to a color), only a short fade
                // so most of the column stays at full, readable opacity.
                WebkitMaskImage:
                    'linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
                maskImage:
                    'linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
            }}
        >
            <div ref={trackRef} className="flex flex-col gap-3 sm:gap-4 pt-2">
                {items.map((broker, i) => (
                    <motion.div
                        key={i}
                        className="broker-card-mint rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center gap-2 sm:gap-3 group cursor-pointer mx-1"
                        whileHover={{ y: -3, scale: 1.04 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                        <motion.div
                            className="text-[#244147]/70 group-hover:text-[#122124] transition-colors duration-300"
                            whileHover={{ rotate: 8, scale: 1.15 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 12 }}
                        >
                            {broker.logo}
                        </motion.div>
                        <span className="text-[10px] sm:text-xs font-body font-semibold text-[#1B3236] group-hover:text-[#122124] transition-colors duration-300 leading-tight">
                            {broker.name}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
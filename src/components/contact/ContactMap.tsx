import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const easing: [number, number, number, number] = [0.25, 0.1, 0.25, 1]

export default function ContactMap() {
    const cardRef = useRef<HTMLDivElement>(null)
    const mouseX = useMotionValue(0.5)
    const mouseY = useMotionValue(0.5)

    // Depth Hover — subtle tilt + parallax pin, much gentler than the strategy-card tilt
    const rotateX = useSpring(useTransform(mouseY, [0, 1], [3, -3]), { stiffness: 150, damping: 20 })
    const rotateY = useSpring(useTransform(mouseX, [0, 1], [-3, 3]), { stiffness: 150, damping: 20 })
    const pinX = useSpring(useTransform(mouseX, [0, 1], [-6, 6]), { stiffness: 150, damping: 20 })
    const pinY = useSpring(useTransform(mouseY, [0, 1], [-6, 6]), { stiffness: 150, damping: 20 })

    const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = cardRef.current?.getBoundingClientRect()
        if (!rect) return
        requestAnimationFrame(() => {
            mouseX.set((e.clientX - rect.left) / rect.width)
            mouseY.set((e.clientY - rect.top) / rect.height)
        })
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easing }}
            viewport={{ once: true, margin: '-80px' }}
            style={{ perspective: 1000 }}
        >
            <motion.div
                ref={cardRef}
                className="map-card relative overflow-hidden rounded-3xl"
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                onMouseMove={handleMove}
                onMouseLeave={() => { mouseX.set(0.5); mouseY.set(0.5) }}
            >
                <iframe
                    title="Arthagama office location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224.20651296696133!2d72.83394676667447!3d18.929597385341136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7d1c49a6c18cf%3A0x71863ed25762cd9f!2skhattau%20Buildings!5e1!3m2!1sen!2sin!4v1783054214237!5m2!1sen!2sin"
                    className="h-[320px] w-full grayscale-[15%] sm:h-[380px] md:h-[440px]"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />

                {/* Floating pin badge, parallaxed slightly against cursor */}
                <motion.div
                    className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
                    style={{ x: pinX, y: pinY }}
                >
                    <motion.span
                        className="h-3 w-3 rounded-full bg-[#B8CEC2]"
                        animate={{ scale: [1, 1.6, 1], opacity: [0.9, 0.3, 0.9] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </motion.div>

                <div className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-[#122124]/70 px-4 py-2 text-xs text-[#EAF1EC] backdrop-blur-sm">
                    Arthagama HQ · Grd Flr, Khatau BLg 8/10 A D Modi, Stock Exchange, Mumbai
                </div>
            </motion.div>

            <style>{`
        .map-card {
          border: 1px solid rgba(184, 206, 194, 0.3);
          box-shadow: 0 20px 55px -20px rgba(18, 33, 36, 0.45);
        }
      `}</style>
        </motion.div>
    )
}
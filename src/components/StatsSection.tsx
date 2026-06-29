import { useEffect, useRef } from 'react'
import { motion, useInView, useMotionValue, useSpring, type Transition } from 'framer-motion'

interface Stat {
  numericValue: number
  suffix: string
  label: string
}

const STATS: Stat[] = [
  { numericValue: 20, suffix: '+', label: 'Years Experience' },
  { numericValue: 95, suffix: '+', label: 'Projects Done' },
  { numericValue: 200, suffix: '%', label: 'Satisfied Clients' },
]

const easing: [number, number, number, number] = [0.25, 0.1, 0.25, 1]
const viewTransition: Transition = { duration: 1, ease: easing }
const viewMotion = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: viewTransition,
  viewport: { once: true as const, margin: '-100px' },
}

function AnimatedNumber({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const motionVal = useMotionValue(0)
  const spring = useSpring(motionVal, { stiffness: 60, damping: 20 })

  useEffect(() => {
    if (inView) motionVal.set(target)
  }, [inView, target, motionVal])

  useEffect(() => {
    return spring.on('change', (v) => {
      if (ref.current) {
        ref.current.textContent = `${Math.round(v)}${suffix}`
      }
    })
  }, [spring, suffix])

  return (
    <span ref={ref}>
      0{suffix}
    </span>
  )
}

export default function StatsSection() {
  return (
    <section id="stats" className="bg-bg py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Top divider */}
        <div className="w-full h-px bg-stroke mb-16 md:mb-24" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              className="flex flex-col gap-3"
              {...viewMotion}
              transition={{
                ...viewMotion.transition,
                delay: i * 0.15,
              }}
            >
              {/* Number */}
              <div className="text-5xl md:text-6xl font-display italic text-text-primary">
                <AnimatedNumber target={stat.numericValue} suffix={stat.suffix} />
              </div>
              {/* Label */}
              <p className="text-sm text-muted uppercase tracking-[0.2em]">{stat.label}</p>
              {/* Accent line */}
              <div className="w-12 h-[2px] accent-gradient mt-1" />
            </motion.div>
          ))}
        </div>

        {/* Bottom divider */}
        <div className="w-full h-px bg-stroke mt-16 md:mt-24" />
      </div>
    </section>
  )
}

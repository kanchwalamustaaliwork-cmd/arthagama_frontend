import { useEffect, useRef } from 'react'
import { motion, useInView, useMotionValue, useSpring, type Transition } from 'framer-motion'

interface StatItem {
  value: number
  suffix: string
  decimals: number
  label: string
}

const STATS: StatItem[] = [
  { value: 25, suffix: '+', decimals: 0, label: 'Strategies Deployed' },
  { value: 8, suffix: '', decimals: 0, label: 'Markets Traded' },
  { value: 5, suffix: '+', decimals: 0, label: 'Years of Research' },
  { value: 99.9, suffix: '%', decimals: 1, label: 'System Uptime' },
]


// Pop In: overshoot scale spring
const popIn = {
  initial: { opacity: 0, scale: 0.7, y: 20 },
  whileInView: { opacity: 1, scale: 1, y: 0 },
  viewport: { once: true as const, margin: '-100px' },
}

const popTransition = (delay: number): Transition => ({
  type: 'spring',
  stiffness: 260,
  damping: 16,
  delay,
})

function AnimatedNumber({ target, suffix, decimals }: { target: number; suffix: string; decimals: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const motionVal = useMotionValue(0)
  const spring = useSpring(motionVal, { stiffness: 50, damping: 18 })

  useEffect(() => {
    if (inView) motionVal.set(target)
  }, [inView, target, motionVal])

  useEffect(() => {
    return spring.on('change', (v) => {
      if (ref.current) {
        ref.current.textContent = `${v.toFixed(decimals)}${suffix}`
      }
    })
  }, [spring, suffix, decimals])

  return <span ref={ref}>0{suffix}</span>
}

export default function BasicStatsSection() {
  return (
    <section id="basic-stats" className="relative py-12 sm:py-14 md:py-16 overflow-hidden">
      {/* Mint-toned backing panel replaces solid bg — video shows through as a soft light-mint wash */}
      <div className="section-backing-mint absolute inset-x-4 inset-y-4 -z-10 rounded-3xl sm:inset-x-6" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-5 sm:px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              className="stat-card-mint relative rounded-2xl p-5 sm:p-6 md:p-8 flex flex-col gap-2 sm:gap-3 overflow-hidden group cursor-default"
              {...popIn}
              transition={popTransition(i * 0.1)}
              whileHover={{
                y: -4,
                boxShadow: '0 14px 40px rgba(36, 65, 71, 0.25)',
                transition: { duration: 0.3 },
              }}
            >
              {/* Gentle continuous float, offset per card so it isn't synchronized */}
              <motion.div
                className="absolute inset-0"
                animate={{ y: [0, -4, 0] }}
                transition={{
                  duration: 4 + i * 0.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.3,
                }}
              />

              {/* Halftone dot hover texture — dark dots on light mint surface */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-[0.08] mix-blend-multiply pointer-events-none transition-opacity duration-500"
                style={{
                  backgroundImage: 'radial-gradient(circle, #244147 1px, transparent 1px)',
                  backgroundSize: '4px 4px',
                }}
              />

              <div className="relative z-10 flex flex-col gap-2 sm:gap-3 flex-1">
                {/* Number — dark teal on mint for strong contrast */}
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display italic text-[#1B3236]">
                  <AnimatedNumber target={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
                </div>

                {/* Label */}
                <p className="text-[11px] sm:text-xs md:text-sm text-[#244147]/70 uppercase tracking-[0.15em] font-body mt-auto">
                  {stat.label}
                </p>

                {/* Accent highlight */}
                <div className="w-8 h-[2px] bg-[#244147]/30 group-hover:bg-[#244147] transition-all duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        /* Soft light-mint wash behind the whole stat row */
        .section-backing-mint {
          background: rgba(184, 206, 194, 0.16);
          backdrop-filter: blur(30px) saturate(1.05);
          -webkit-backdrop-filter: blur(30px) saturate(1.05);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15),
            inset 0 1px 1px rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(184, 206, 194, 0.2);
        }

        /* Near-opaque mint glass card — dark text sits on top */
        .stat-card-mint {
          background: rgba(184, 206, 194, 0.82);
          backdrop-filter: blur(14px) saturate(1.1);
          -webkit-backdrop-filter: blur(14px) saturate(1.1);
          border: 1px solid rgba(184, 206, 194, 0.9);
          box-shadow: 0 2px 14px rgba(18, 33, 36, 0.2);
          transition: background 0.3s ease, border-color 0.3s ease;
        }
        .stat-card-mint:hover {
          background: rgba(196, 216, 205, 0.92);
          border-color: rgba(255, 255, 255, 0.6);
        }
      `}</style>
    </section>
  )
}
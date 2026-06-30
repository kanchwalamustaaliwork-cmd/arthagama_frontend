// import { useEffect, useRef } from 'react'
// import { motion, useInView, useMotionValue, useSpring, type Transition } from 'framer-motion'

// interface StatItem {
//   value: number
//   suffix: string
//   decimals: number
//   label: string
// }

// const STATS: StatItem[] = [
//   { value: 25, suffix: '+', decimals: 0, label: 'Strategies Deployed' },
//   { value: 8, suffix: '', decimals: 0, label: 'Markets Traded' },
//   { value: 5, suffix: '+', decimals: 0, label: 'Years of Research' },
//   { value: 99.9, suffix: '%', decimals: 1, label: 'System Uptime' },
// ]

// const easing: [number, number, number, number] = [0.25, 0.1, 0.25, 1]
// const viewTransition: Transition = { duration: 0.8, ease: easing }
// const viewMotion = {
//   initial: { opacity: 0, y: 30 },
//   whileInView: { opacity: 1, y: 0 },
//   transition: viewTransition,
//   viewport: { once: true as const, margin: '-100px' },
// }

// function AnimatedNumber({ target, suffix, decimals }: { target: number; suffix: string; decimals: number }) {
//   const ref = useRef<HTMLSpanElement>(null)
//   const inView = useInView(ref, { once: true, margin: '-100px' })
//   const motionVal = useMotionValue(0)
//   const spring = useSpring(motionVal, { stiffness: 50, damping: 18 })

//   useEffect(() => {
//     if (inView) motionVal.set(target)
//   }, [inView, target, motionVal])

//   useEffect(() => {
//     return spring.on('change', (v) => {
//       if (ref.current) {
//         ref.current.textContent = `${v.toFixed(decimals)}${suffix}`
//       }
//     })
//   }, [spring, suffix, decimals])

//   return (
//     <span ref={ref}>
//       0{suffix}
//     </span>
//   )
// }

// export default function BasicStatsSection() {
//   return (
//     <section id="basic-stats" className="bg-bg py-12 md:py-16">
//       <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
//           {STATS.map((stat, i) => (
//             <motion.div
//               key={i}
//               className="bg-surface border border-stroke rounded-2xl p-6 md:p-8 flex flex-col gap-3 relative overflow-hidden group hover:border-white/20 transition-all duration-300"
//               {...viewMotion}
//               transition={{
//                 ...viewMotion.transition,
//                 delay: i * 0.1,
//               }}
//             >
//               {/* Halftone / Dot background effect on card hover */}
//               <div
//                 className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] mix-blend-overlay pointer-events-none transition-opacity duration-500"
//                 style={{
//                   backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
//                   backgroundSize: '4px 4px',
//                 }}
//               />

//               {/* Number */}
//               <div className="text-4xl md:text-5xl lg:text-6xl font-display italic text-text-primary">
//                 <AnimatedNumber target={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
//               </div>

//               {/* Label */}
//               <p className="text-xs md:text-sm text-muted uppercase tracking-[0.15em] font-body mt-auto">
//                 {stat.label}
//               </p>

//               {/* Accent highlight */}
//               <div className="w-8 h-[2px] bg-stroke group-hover:accent-gradient transition-all duration-300" />
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }

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

const easing: [number, number, number, number] = [0.25, 0.1, 0.25, 1]
const viewTransition: Transition = { duration: 0.8, ease: easing }
const viewMotion = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: viewTransition,
  viewport: { once: true as const, margin: '-100px' },
}

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

  return (
    <span ref={ref}>
      0{suffix}
    </span>
  )
}

export default function BasicStatsSection() {
  return (
    <section id="basic-stats" className="bg-[#244147] py-12 sm:py-14 md:py-16">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              className="bg-[#B8CEC2]/[0.06] border border-[#B8CEC2]/15 rounded-2xl p-5 sm:p-6 md:p-8 flex flex-col gap-2 sm:gap-3 relative overflow-hidden group hover:border-[#B8CEC2]/35 transition-all duration-300"
              {...viewMotion}
              transition={{
                ...viewMotion.transition,
                delay: i * 0.1,
              }}
            >
              {/* Halftone / Dot background effect on card hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-[0.06] mix-blend-overlay pointer-events-none transition-opacity duration-500"
                style={{
                  backgroundImage: 'radial-gradient(circle, #B8CEC2 1px, transparent 1px)',
                  backgroundSize: '4px 4px',
                }}
              />

              {/* Number */}
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display italic text-[#B8CEC2]">
                <AnimatedNumber target={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
              </div>

              {/* Label */}
              <p className="text-[11px] sm:text-xs md:text-sm text-[#B8CEC2]/60 uppercase tracking-[0.15em] font-body mt-auto">
                {stat.label}
              </p>

              {/* Accent highlight */}
              <div className="w-8 h-[2px] bg-[#B8CEC2]/30 group-hover:bg-[#B8CEC2] transition-all duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
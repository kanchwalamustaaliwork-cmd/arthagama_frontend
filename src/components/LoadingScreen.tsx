// import { useState, useEffect } from 'react'
// import { AnimatePresence, motion } from 'framer-motion'

// const LETTERS = ['R', 'T', 'H', 'A', 'G', 'A', 'M', 'A']
// const LOGO_SRC = '/assets/arthagama_logo.png'
// const easing: [number, number, number, number] = [0.25, 0.1, 0.25, 1]

// interface LoadingScreenProps {
//   onComplete: () => void
// }

// type Phase = 'intro' | 'glide' | 'reveal' | 'hold' | 'exit'

// export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
//   const [phase, setPhase] = useState<Phase>('intro')
//   const [revealCount, setRevealCount] = useState(0)
//   const [visible, setVisible] = useState(true)

//   // Phase 1 -> Phase 2: after the logo settles, pause briefly, then glide left.
//   useEffect(() => {
//     const t = setTimeout(() => setPhase('glide'), 1300)
//     return () => clearTimeout(t)
//   }, [])

//   // Phase 2 -> Phase 3: once the glide (layout) transition has resolved, start typing.
//   useEffect(() => {
//     if (phase !== 'glide') return
//     const t = setTimeout(() => setPhase('reveal'), 800)
//     return () => clearTimeout(t)
//   }, [phase])

//   // Phase 3: reveal letters one at a time, then move on once finished.
//   useEffect(() => {
//     if (phase !== 'reveal') return
//     if (revealCount >= LETTERS.length) {
//       const t = setTimeout(() => setPhase('hold'), 400)
//       return () => clearTimeout(t)
//     }
//     const t = setTimeout(() => setRevealCount((c) => c + 1), 70)
//     return () => clearTimeout(t)
//   }, [phase, revealCount])

//   // Phase 4: hold the completed lockup briefly, then crossfade out.
//   useEffect(() => {
//     if (phase !== 'hold') return
//     const t = setTimeout(() => setPhase('exit'), 400)
//     return () => clearTimeout(t)
//   }, [phase])

//   // Exit: notify the parent immediately so main content can fade in
//   // underneath at the same time this overlay fades out — a true crossfade.
//   useEffect(() => {
//     if (phase !== 'exit') return
//     onComplete()
//     setVisible(false)
//   }, [phase, onComplete])

//   const showWord = phase === 'glide' || phase === 'reveal' || phase === 'hold' || phase === 'exit'

//   return (
//     <AnimatePresence>
//       {visible && (
//         <motion.div
//           className="fixed inset-0 z-[9999] bg-[#244147] flex items-center justify-center overflow-hidden"
//           exit={{ opacity: 0, transition: { duration: 0.6, ease: easing } }}
//         >
//           {/* Subtle depth behind the lockup, kept within the two-color palette */}
//           <div
//             className="absolute inset-0 pointer-events-none"
//             style={{
//               background:
//                 'radial-gradient(circle at 50% 50%, rgba(184,206,194,0.06) 0%, transparent 60%)',
//             }}
//           />

//           <div className="relative flex items-center select-none">
//             {/* The "A" — logo doubles as the first letter of ARTHAGAMA */}
//             <motion.img
//               src={LOGO_SRC}
//               alt="Arthagama"
//               draggable={false}
//               layout
//               className="h-9 sm:h-11 md:h-13 lg:h-16 w-auto object-contain"
//               initial={{ opacity: 0, scale: 0.7 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.85, ease: easing }}
//             />

//             {/* Remaining letters — reserved in the DOM (invisible) the moment
//                 showWord flips true, so the row's width changes instantly and
//                 the logo's `layout` animation glides it into place. */}
//             {showWord && (
//               <div className="flex">
//                 {LETTERS.map((letter, i) => (
//                   <motion.span
//                     key={i}
//                     className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display italic text-[#B8CEC2] tracking-tight"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: i < revealCount ? 1 : 0 }}
//                     transition={{ duration: 0.22, ease: 'easeOut' }}
//                   >
//                     {letter}
//                   </motion.span>
//                 ))}
//               </div>
//             )}
//           </div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   )
// }


import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const NAME_SRC = '/assets/arthagama_name.png'
const easing: [number, number, number, number] = [0.25, 0.1, 0.25, 1]

interface LoadingScreenProps {
  onComplete: () => void
}

type Phase = 'intro' | 'hold' | 'curtain' | 'exit'

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [phase, setPhase] = useState<Phase>('intro')
  const [visible, setVisible] = useState(true)

  // Let the logo scale in, then hold the completed lockup briefly.
  useEffect(() => {
    const t = setTimeout(() => setPhase('hold'), 1200)
    return () => clearTimeout(t)
  }, [])

  // After the hold, sweep a curtain across the logo, left to right, to hide it.
  useEffect(() => {
    if (phase !== 'hold') return
    const t = setTimeout(() => setPhase('curtain'), 500)
    return () => clearTimeout(t)
  }, [phase])

  // Once the logo is fully hidden, fade the background out to reveal the page.
  useEffect(() => {
    if (phase !== 'curtain') return
    const t = setTimeout(() => setPhase('exit'), 700)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (phase !== 'exit') return
    onComplete()
    const t = setTimeout(() => setVisible(false), 400)
    return () => clearTimeout(t)
  }, [phase, onComplete])

  if (!visible) return null

  const logoHidden = phase === 'curtain' || phase === 'exit'

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-[#244147] flex items-center justify-center overflow-hidden"
      animate={{ opacity: phase === 'exit' ? 0 : 1 }}
      transition={{ duration: 0.4, ease: easing }}
    >
      <motion.img
        src={NAME_SRC}
        alt="Arthagama"
        draggable={false}
        className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto object-contain select-none"
        initial={{ opacity: 0, scale: 0.6, clipPath: 'inset(0 0 0 0%)' }}
        animate={{
          opacity: 1,
          scale: 1,
          clipPath: logoHidden ? 'inset(0 0 0 100%)' : 'inset(0 0 0 0%)',
        }}
        transition={{
          opacity: { duration: 0.85, ease: easing },
          scale: { duration: 0.85, ease: easing },
          clipPath: { duration: 0.7, ease: easing },
        }}
      />
    </motion.div>
  )
}
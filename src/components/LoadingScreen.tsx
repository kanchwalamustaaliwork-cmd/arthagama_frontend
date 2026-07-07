"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { easing } from '../constans/animation'

const NAME_SRC = '/assets/arthagama_name.png'

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
        alt="ARTHAGAMA"
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
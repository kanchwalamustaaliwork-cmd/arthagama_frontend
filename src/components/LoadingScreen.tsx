import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const WORDS = ['Design', 'Create', 'Inspire']

interface LoadingScreenProps {
  onComplete: () => void
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [count, setCount] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const startTime = useRef<number | null>(null)
  const rafRef = useRef<number>(0)
  const completedRef = useRef(false)

  useEffect(() => {
    const duration = 2700

    const tick = (timestamp: number) => {
      if (startTime.current === null) startTime.current = timestamp
      const elapsed = timestamp - startTime.current
      const progress = Math.min(elapsed / duration, 1)
      const currentCount = Math.floor(progress * 100)
      setCount(currentCount)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        if (!completedRef.current) {
          completedRef.current = true
          setTimeout(() => {
            setVisible(false)
            setTimeout(onComplete, 400)
          }, 400)
        }
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [onComplete])

  // Cycle words every 900ms
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex(i => (i + 1) % WORDS.length)
    }, 900)
    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-bg flex flex-col overflow-hidden"
          exit={{ opacity: 0, y: -20, transition: { duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] } }}
        >
          {/* Top-left label */}
          <motion.div
            className="absolute top-8 left-8 md:top-12 md:left-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } }}
          >
            <span className="text-xs text-muted uppercase tracking-[0.3em]">Portfolio</span>
          </motion.div>

          {/* Center: Rotating Words */}
          <div className="flex-1 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIndex}
                className="text-4xl md:text-6xl lg:text-7xl font-display italic text-text-primary/80 select-none"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }}
                exit={{ opacity: 0, y: -20, transition: { duration: 0.25, ease: 'easeIn' } }}
              >
                {WORDS[wordIndex]}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Bottom-right: Counter */}
          <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12">
            <span className="text-6xl md:text-8xl lg:text-9xl font-display text-text-primary tabular-nums select-none">
              {String(count).padStart(3, '0')}
            </span>
          </div>

          {/* Bottom Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-stroke/50">
            <motion.div
              className="h-full accent-gradient origin-left"
              style={{
                scaleX: count / 100,
                boxShadow: '0 0 8px rgba(137, 170, 204, 0.35)',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

import { useState, useEffect, useRef } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import LoadingScreen from './components/LoadingScreen'
import Navbar from './components/Navbar'
import GlobalBackground from './components/backgrounds/GlobalBackground'
import AnimatedRoutes from './routes/AnimatedRoutes'
import FooterSection from './components/FooterSection'

gsap.registerPlugin(ScrollTrigger)


// ─── Main App ────────────────────────────────────────────────────────────────
function AppContent() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
    })
    lenisRef.current = lenis

    const rafCallback = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(rafCallback)
    gsap.ticker.lagSmoothing(0)

    lenis.on('scroll', ScrollTrigger.update)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(rafCallback)
    }
  }, [])

  return (
    <>
      <GlobalBackground />
      <Navbar />
      <AnimatedRoutes />
      <FooterSection />
    </>
  )
}

// ─── Root ────────────────────────────────────────────────────────────────────
function App() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen
            key="loading"
            onComplete={() => setIsLoading(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isLoading && (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.6 } }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
          >
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default App

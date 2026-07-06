"use client"

import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthProvider } from '../../auth/AuthContext'
import SmoothScrollProvider from '../SmoothScrollProvider'
import LoadingScreen from '../LoadingScreen'

export default function AppProviders({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(true)

    return (
        <AuthProvider>
            <AnimatePresence mode="wait">
                {isLoading && (
                    <LoadingScreen key="loading" onComplete={() => setIsLoading(false)} />
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
                        <SmoothScrollProvider>
                            {children}
                        </SmoothScrollProvider>
                    </motion.div>
                )}
            </AnimatePresence>
        </AuthProvider>
    )
}

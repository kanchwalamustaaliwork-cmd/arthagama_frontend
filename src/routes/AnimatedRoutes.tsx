import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

// Lazy imports — each becomes its own JS chunk, fetched only when visited
const HomePage = lazy(() => import('../pages/HomePage'))
const AboutPage = lazy(() => import('../pages/AboutPage'))
const ContactPage = lazy(() => import('../pages/ContactPage'))
const CareersPage = lazy(() => import('../pages/CareersPage'))
const LoginPage = lazy(() => import('../pages/LoginPage'))
const SignUpPage = lazy(() => import('../pages/SignUpPage'))
const ServicePage = lazy(() => import('../pages/ServicePage'))
const PrivacyPolicyPage = lazy(() => import('../pages/PrivacyPolicy'))
const TermsConditionsPage = lazy(() => import('../pages/TermsAndCondition'))

export default function AnimatedRoutes() {
    const location = useLocation()

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } }}
                exit={{ opacity: 0, y: -16, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } }}
            >
                {/* Suspense fallback covers the brief moment while the chunk downloads */}
                <Suspense fallback={<div className="min-h-screen" />}>
                    <Routes location={location}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/careers" element={<CareersPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignUpPage />} />
                        <Route path="/services" element={<ServicePage />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                        <Route path="/terms-conditions" element={<TermsConditionsPage />} />
                    </Routes>
                </Suspense>
            </motion.div>
        </AnimatePresence>
    )
}

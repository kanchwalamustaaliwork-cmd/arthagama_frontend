import { AnimatePresence, motion } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router'
import HomePage from '../pages/HomePage'
import AboutPage from '../pages/AboutPage'
import ContactPage from '../pages/ContactPage'
import CareersPage from '../pages/CareersPage'
import LoginPage from '../pages/LoginPage'
import SignUpPage from '../pages/SignUpPage'
import ServicePage from '../pages/ServicePage'
import PrivacyPolicyPage from '../pages/PrivacyPolicy'
import TermsConditionsPage from '../pages/TermsAndCondition'

// ─── Page transition wrapper ────────────────────────────────────────────────

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
                <Routes location={location}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/careers" element={<CareersPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/services" element={<ServicePage />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                    <Route path="/terms-and-conditions" element={<TermsConditionsPage />} />
                </Routes>
            </motion.div>
        </AnimatePresence>
    )
}

"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaUser, FaEnvelope, FaLock, FaArrowLeft } from 'react-icons/fa6'
import TiltImage from '../components/ui/TiltImage'
import { BRAND_ON_DARK } from '@/src/utils/brand'
import BrandPanel from '../components/ui/BrandPanel'

export default function SignUpPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{
    fullName?: string
    email?: string
    password?: string
    confirmPassword?: string
    api?: string
  }>({})

  // Form field validation logic
  const validateForm = () => {
    const newErrors: typeof errors = {}

    // Name Validation
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters'
    }

    // Email Validation
    if (!email) {
      newErrors.email = 'Email address is required'
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        newErrors.email = 'Please enter a valid email address'
      }
    }

    // Password Validation
    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    // Confirm Password Validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setErrors(prev => ({ ...prev, api: undefined }))

    try {
      // Simulate network request latency (1.5 seconds)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulated backend rejection for testing
      if (email.toLowerCase() === 'taken@example.com') {
        throw new Error('This email address is already registered.')
      }

      // Success - Route to Home (or dashboard)
      router.push('/')

    } catch (err: any) {
      setErrors(prev => ({
        ...prev,
        api: err.message || 'Registration failed. Please try again.'
      }))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col lg:flex-row overflow-hidden bg-transparent">
      {/* Back Button */}
      <Link
        href="/"
        scroll={false}
        className="absolute top-12 md:top-24 left-6 z-50 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[hsl(var(--mint)/0.6)] hover:text-[hsl(var(--mint))] transition-colors duration-200"
      >
        <FaArrowLeft className="w-3.5 h-3.5" />
        Back to Home
      </Link>

      {/* ===================== LEFT SIDE PANEL — Brand & Tilt Image ===================== */}
      <div className="relative flex w-full lg:w-[48%] flex-col justify-center items-center px-6 pt-24 pb-12 lg:py-0">
        <BrandPanel />
      </div>

      {/* ===================== RIGHT SIDE PANEL — Signup Form ===================== */}
      <div className="relative flex w-full lg:w-[52%] flex-col justify-center items-center px-6 py-12 pt-28 pb-12 lg:pt-32 lg:pb-16">
        <div className="w-full max-w-md liquid-glass-strong p-8 md:p-10 rounded-3xl relative z-10 shadow-2xl">

          {/* Header */}
          <div className="mb-8 text-center">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[hsl(var(--mint)/0.5)] mb-2 block">
              Join <strong className={BRAND_ON_DARK}>ARTHAGAMA</strong>
            </span>
            <h2 className="font-body text-3xl font-light text-[hsl(var(--mint-soft))] tracking-tight">
              Become a <span className="font-display italic text-[hsl(var(--mint-soft))]">Member</span>
            </h2>
            <p className="text-xs text-[hsl(var(--mint)/0.6)] mt-2">
              Create an account and start managing wealth systematic trading.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignUp} className="space-y-2">

            {/* Global API Error */}
            {errors.api && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/10 text-rose-400 text-xs leading-relaxed"
              >
                {errors.api}
              </motion.div>
            )}

            {/* Name Field */}
            <div className="space-y-1.5">
              <label htmlFor="fullName" className="block text-xs uppercase tracking-wider text-[hsl(var(--mint)/0.7)] font-medium">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--mint)/0.4)] pointer-events-none">
                  <FaUser className="w-4 h-4" />
                </span>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value)
                    if (errors.fullName) setErrors(prev => ({ ...prev, fullName: undefined }))
                  }}
                  disabled={isLoading}
                  placeholder="John Doe"
                  className={`w-full bg-[rgba(184,206,194,0.03)] border rounded-xl py-2.5 pl-11 pr-4 text-sm text-[hsl(var(--mint-soft))] placeholder-[hsl(var(--mint)/0.35)] outline-none transition-all duration-300 ${errors.fullName
                    ? 'border-red-500/40 focus:border-red-500/70 focus:ring-1 focus:ring-red-500/70'
                    : 'border-[hsl(var(--mint)/0.15)] focus:border-[hsl(var(--mint)/0.65)] focus:ring-1 focus:ring-[hsl(var(--mint)/0.65)]'
                    }`}
                />
              </div>
              {errors.fullName && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-rose-400 text-xs"
                >
                  {errors.fullName}
                </motion.p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs uppercase tracking-wider text-[hsl(var(--mint)/0.7)] font-medium">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--mint)/0.4)] pointer-events-none">
                  <FaEnvelope className="w-4 h-4" />
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) setErrors(prev => ({ ...prev, email: undefined }))
                  }}
                  disabled={isLoading}
                  placeholder="name@example.com"
                  className={`w-full bg-[rgba(184,206,194,0.03)] border rounded-xl py-2.5 pl-11 pr-4 text-sm text-[hsl(var(--mint-soft))] placeholder-[hsl(var(--mint)/0.35)] outline-none transition-all duration-300 ${errors.email
                    ? 'border-red-500/40 focus:border-red-500/70 focus:ring-1 focus:ring-red-500/70'
                    : 'border-[hsl(var(--mint)/0.15)] focus:border-[hsl(var(--mint)/0.65)] focus:ring-1 focus:ring-[hsl(var(--mint)/0.65)]'
                    }`}
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-rose-400 text-xs"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs uppercase tracking-wider text-[hsl(var(--mint)/0.7)] font-medium">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--mint)/0.4)] pointer-events-none">
                  <FaLock className="w-4 h-4" />
                </span>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors(prev => ({ ...prev, password: undefined }))
                  }}
                  disabled={isLoading}
                  placeholder="••••••••"
                  className={`w-full bg-[rgba(184,206,194,0.03)] border rounded-xl py-2.5 pl-11 pr-4 text-sm text-[hsl(var(--mint-soft))] placeholder-[hsl(var(--mint)/0.35)] outline-none transition-all duration-300 ${errors.password
                    ? 'border-red-500/40 focus:border-red-500/70 focus:ring-1 focus:ring-red-500/70'
                    : 'border-[hsl(var(--mint)/0.15)] focus:border-[hsl(var(--mint)/0.65)] focus:ring-1 focus:ring-[hsl(var(--mint)/0.65)]'
                    }`}
                />
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-rose-400 text-xs"
                >
                  {errors.password}
                </motion.p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="block text-xs uppercase tracking-wider text-[hsl(var(--mint)/0.7)] font-medium">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--mint)/0.4)] pointer-events-none">
                  <FaLock className="w-4 h-4" />
                </span>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: undefined }))
                  }}
                  disabled={isLoading}
                  placeholder="••••••••"
                  className={`w-full bg-[rgba(184,206,194,0.03)] border rounded-xl py-2.5 pl-11 pr-4 text-sm text-[hsl(var(--mint-soft))] placeholder-[hsl(var(--mint)/0.35)] outline-none transition-all duration-300 ${errors.confirmPassword
                    ? 'border-red-500/40 focus:border-red-500/70 focus:ring-1 focus:ring-red-500/70'
                    : 'border-[hsl(var(--mint)/0.15)] focus:border-[hsl(var(--mint)/0.65)] focus:ring-1 focus:ring-[hsl(var(--mint)/0.65)]'
                    }`}
                />
              </div>
              {errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-rose-400 text-xs"
                >
                  {errors.confirmPassword}
                </motion.p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full overflow-hidden rounded-full py-3 bg-[hsl(var(--mint))] text-[hsl(var(--teal-deep))] font-semibold text-sm hover:shadow-[0_0_25px_hsl(var(--mint)/0.35)] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none mt-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-[hsl(var(--teal-deep))] border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : (
                'Register & Continue'
              )}
            </button>

            {/* Bottom transition link */}
            <div className="pt-4 text-center border-t border-[hsl(var(--mint)/0.08)]">
              <span className="text-xs text-[hsl(var(--mint)/0.55)]">
                Already a member?{' '}
                <Link
                  href="/login"
                  scroll={false}
                  className="text-[hsl(var(--mint))] font-medium hover:underline transition-all duration-200"
                >
                  Log In ↗
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>

      {/* ---------------- Scoped Glass styles ---------------- */}
      <style>{`
        .liquid-glass-strong {
          background: rgba(36, 65, 71, 0.16);
          background-blend-mode: luminosity;
          backdrop-filter: blur(50px);
          -webkit-backdrop-filter: blur(50px);
          border: none;
          box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.15),
            inset 0 1px 1px rgba(184, 206, 194, 0.25);
          position: relative;
          overflow: hidden;
        }
        .liquid-glass-strong::before {
          content: '';
          position: absolute;
          inset: 0;
          padding: 1.4px;
          border-radius: inherit;
          background: linear-gradient(
            180deg,
            rgba(184, 206, 194, 0.45) 0%,
            rgba(184, 206, 194, 0.15) 20%,
            transparent 40%,
            transparent 60%,
            rgba(184, 206, 194, 0.15) 80%,
            rgba(184, 206, 194, 0.45) 100%
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}

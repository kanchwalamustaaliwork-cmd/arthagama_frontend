"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaUser, FaEnvelope, FaLock, FaPhone, FaArrowLeft } from 'react-icons/fa6'
import { useAuth } from '../auth/AuthContext'
import BrandPanel from '../components/ui/BrandPanel'
import { BRAND_ON_DARK } from '@/src/utils/brand'

export default function SignUpPage() {
  const { signup, pendingRedirect, setPendingRedirect } = useAuth()
  const router = useRouter()

  // ── Form State ──────────────────────────────────────────────────────────────
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{
    firstName?: string
    lastName?: string
    email?: string
    phoneNumber?: string
    password?: string
    confirmPassword?: string
    api?: string
  }>({})

  // ── Validation ──────────────────────────────────────────────────────────────
  const validateForm = () => {
    const newErrors: typeof errors = {}

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required'
    } else if (firstName.trim().length < 1) {
      newErrors.firstName = 'First name must be at least 1 character'
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    } else if (lastName.trim().length < 1) {
      newErrors.lastName = 'Last name must be at least 1 character'
    }

    if (!email) {
      newErrors.email = 'Email address is required'
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        newErrors.email = 'Please enter a valid email address'
      }
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required'
    } else {
      const cleaned = phoneNumber.trim().replace(/^\+/, '')
      if (!/^\d+$/.test(cleaned)) {
        newErrors.phoneNumber = 'Phone number must contain only digits (optionally starting with +)'
      } else if (phoneNumber.trim().length < 7 || phoneNumber.trim().length > 15) {
        newErrors.phoneNumber = 'Phone number must be between 7 and 15 digits'
      }
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Password must contain at least one uppercase letter'
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = 'Password must contain at least one lowercase letter'
    } else if (!/\d/.test(password)) {
      newErrors.password = 'Password must contain at least one digit'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ── Submit Handler ───────────────────────────────────────────────────────────
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setErrors(prev => ({ ...prev, api: undefined }))

    try {
      await signup({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email,
        phone_number: phoneNumber.trim(),
        password,
      })

      const destination = pendingRedirect || '/'
      setPendingRedirect(null)
      router.replace(destination)
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Registration failed. Please try again.'
      setErrors(prev => ({ ...prev, api: message }))
    } finally {
      setIsLoading(false)
    }
  }

  // ── Shared input class helper ────────────────────────────────────────────────
  const inputClass = (hasError: boolean) =>
    `w-full bg-[rgba(184,206,194,0.03)] border rounded-xl py-2.5 pl-11 pr-4 text-sm text-[hsl(var(--mint-soft))] placeholder-[hsl(var(--mint)/0.35)] outline-none transition-all duration-300 ${hasError
      ? 'border-red-500/40 focus:border-red-500/70 focus:ring-1 focus:ring-red-500/70'
      : 'border-[hsl(var(--mint)/0.15)] focus:border-[hsl(var(--mint)/0.65)] focus:ring-1 focus:ring-[hsl(var(--mint)/0.65)]'
    }`

  const ErrorMsg = ({ msg }: { msg?: string }) =>
    msg ? (
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-400 text-xs">
        {msg}
      </motion.p>
    ) : null

  return (
    <div className="relative min-h-screen w-full flex flex-col lg:flex-row overflow-hidden bg-transparent">
      {/* Back Button */}
      <Link
        href="/careers"
        scroll={false}
        className="absolute top-12 md:top-24 left-6 z-50 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[hsl(var(--mint)/0.6)] hover:text-[hsl(var(--mint))] transition-colors duration-200"
      >
        <FaArrowLeft className="w-3.5 h-3.5" />
        Back
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
              Create an account and start managing wealth through systematic trading.
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

            {/* Name Row — First + Last */}
            <div className="grid grid-cols-2 gap-3">
              {/* First Name */}
              <div className="space-y-1.5">
                <label htmlFor="firstName" className="block text-xs uppercase tracking-wider text-[hsl(var(--mint)/0.7)] font-medium">
                  First Name
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--mint)/0.4)] pointer-events-none">
                    <FaUser className="w-3.5 h-3.5" />
                  </span>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value)
                      if (errors.firstName) setErrors(prev => ({ ...prev, firstName: undefined }))
                    }}
                    disabled={isLoading}
                    placeholder="John"
                    className={inputClass(!!errors.firstName)}
                  />
                </div>
                <ErrorMsg msg={errors.firstName} />
              </div>

              {/* Last Name */}
              <div className="space-y-1.5">
                <label htmlFor="lastName" className="block text-xs uppercase tracking-wider text-[hsl(var(--mint)/0.7)] font-medium">
                  Last Name
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--mint)/0.4)] pointer-events-none">
                    <FaUser className="w-3.5 h-3.5" />
                  </span>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value)
                      if (errors.lastName) setErrors(prev => ({ ...prev, lastName: undefined }))
                    }}
                    disabled={isLoading}
                    placeholder="Doe"
                    className={inputClass(!!errors.lastName)}
                  />
                </div>
                <ErrorMsg msg={errors.lastName} />
              </div>
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
                  className={inputClass(!!errors.email)}
                />
              </div>
              <ErrorMsg msg={errors.email} />
            </div>

            {/* Phone Number Field */}
            <div className="space-y-1.5">
              <label htmlFor="phoneNumber" className="block text-xs uppercase tracking-wider text-[hsl(var(--mint)/0.7)] font-medium">
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--mint)/0.4)] pointer-events-none">
                  <FaPhone className="w-4 h-4" />
                </span>
                <input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value)
                    if (errors.phoneNumber) setErrors(prev => ({ ...prev, phoneNumber: undefined }))
                  }}
                  disabled={isLoading}
                  placeholder="+1234567890"
                  className={inputClass(!!errors.phoneNumber)}
                />
              </div>
              <ErrorMsg msg={errors.phoneNumber} />
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
                  placeholder="Min 8 chars, upper + lower + digit"
                  className={inputClass(!!errors.password)}
                />
              </div>
              <ErrorMsg msg={errors.password} />
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
                  className={inputClass(!!errors.confirmPassword)}
                />
              </div>
              <ErrorMsg msg={errors.confirmPassword} />
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

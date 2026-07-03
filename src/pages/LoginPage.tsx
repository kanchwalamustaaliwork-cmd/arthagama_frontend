import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaEnvelope, FaLock, FaArrowLeft } from 'react-icons/fa6'
import TiltImage from '../components/ui/TiltImage'
import { useAuth } from '../auth/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; api?: string }>({})

  // Form field validations
  const validateForm = () => {
    const newErrors: typeof errors = {}

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

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setErrors(prev => ({ ...prev, api: undefined }))

    try {
      /* ────────────────────────────────────────────────────────────────────────
       * BACKEND API CONNECTIVITY HOOK
       * Replace this simulation block with your real backend call.
       *
       * Example Fetch integration:
       * 
       * const response = await fetch('/api/auth/login', {
       *   method: 'POST',
       *   headers: {
       *     'Content-Type': 'application/json'
       *   },
       *   body: JSON.stringify({ email, password })
       * })
       * 
       * const data = await response.json()
       * if (!response.ok) {
       *   throw new Error(data.message || 'Failed to authenticate')
       * }
       * 
       * // Save token or state, then navigate:
       * localStorage.setItem('token', data.token)
       * navigate('/')
       * ──────────────────────────────────────────────────────────────────────── */

      await login(email, password)
      navigate(from, { replace: true })

    } catch (err: any) {
      setErrors(prev => ({
        ...prev,
        api: err.message || 'Authentication failed. Please verify your credentials and try again.'
      }))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col lg:flex-row overflow-hidden bg-transparent">
      {/* Back Button */}
      <Link
        to="/"
        className="absolute top-12 md:top-24 left-6 z-50 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[hsl(var(--mint)/0.6)] hover:text-[hsl(var(--mint))] transition-colors duration-200"
      >
        <FaArrowLeft className="w-3.5 h-3.5" />
        Back to Home
      </Link>

      {/* ===================== LEFT SIDE PANEL — Brand & Tilt Image ===================== */}
      <div className="relative flex w-full lg:w-[48%] flex-col justify-center items-center px-6 pt-24 pb-12 lg:py-0">
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <div className="mb-6 pointer-events-auto">
            <TiltImage
              src="/assets/arthagama_name.png"
              alt="Arthagama"
              className="w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[440px] drop-shadow-[0_20px_50px_rgba(184,206,194,0.15)]"
            />
          </div>

          <div className="w-12 h-px bg-[hsl(var(--mint)/0.3)] mb-4" />

          <p className="max-w-md text-xs uppercase tracking-[0.35em] text-[hsl(var(--mint)/0.5)]">
            Artha · Wealth + Āgama · Inflow
          </p>
        </div>
      </div>

      {/* ===================== RIGHT SIDE PANEL — Login Form ===================== */}
      <div className="relative flex w-full lg:w-[52%] flex-col justify-center items-center px-6 py-12 pt-28 pb-12 lg:pt-32 lg:pb-16">
        <div className="w-full max-w-md liquid-glass-strong p-8 md:p-10 rounded-3xl relative z-10 shadow-2xl">

          {/* Header */}
          <div className="mb-8 text-center">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[hsl(var(--mint)/0.5)] mb-2 block">
              Secure Gateway
            </span>
            <h2 className="font-body text-3xl font-light text-[hsl(var(--mint-soft))] tracking-tight">
              Welcome <span className="font-display italic text-[hsl(var(--mint-soft))]">back</span>
            </h2>
            <p className="text-xs text-[hsl(var(--mint)/0.6)] mt-2">
              Enter your credentials below to access your account dashboard.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">

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

            {/* Email Field */}
            <div className="space-y-2">
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
                  className={`w-full bg-[rgba(184,206,194,0.03)] border rounded-xl py-3 pl-11 pr-4 text-sm text-[hsl(var(--mint-soft))] placeholder-[hsl(var(--mint)/0.35)] outline-none transition-all duration-300 ${errors.email
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
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-xs uppercase tracking-wider text-[hsl(var(--mint)/0.7)] font-medium">
                  Password
                </label>
                <a href="#" className="text-[10px] uppercase tracking-wider text-[hsl(var(--mint)/0.5)] hover:text-[hsl(var(--mint))] transition-colors duration-200">
                  Forgot Password?
                </a>
              </div>
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
                  className={`w-full bg-[rgba(184,206,194,0.03)] border rounded-xl py-3 pl-11 pr-4 text-sm text-[hsl(var(--mint-soft))] placeholder-[hsl(var(--mint)/0.35)] outline-none transition-all duration-300 ${errors.password
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full overflow-hidden rounded-full py-3.5 bg-[hsl(var(--mint))] text-[hsl(var(--teal-deep))] font-semibold text-sm hover:shadow-[0_0_25px_hsl(var(--mint)/0.35)] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-[hsl(var(--teal-deep))] border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                'Access Portal'
              )}
            </button>

            {/* Bottom transition link */}
            <div className="pt-4 text-center border-t border-[hsl(var(--mint)/0.08)]">
              <span className="text-xs text-[hsl(var(--mint)/0.55)]">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="text-[hsl(var(--mint))] font-medium hover:underline transition-all duration-200"
                >
                  Become a Member ↗
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

import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Careers', to: '/careers' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (to: string) => {
    if (to === '/') return location.pathname === '/'
    return location.pathname.startsWith(to.split('#')[0]) && to.split('#')[0] !== '/'
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4">
      <div
        className={`inline-flex items-center gap-1 rounded-full backdrop-blur-md border border-white/10 bg-surface px-2 py-2 transition-shadow duration-300 ${scrolled ? 'shadow-md shadow-black/40' : ''
          }`}
      >
        {/* Logo */}
        <NavLogo />

        {/* Divider */}
        <div className="w-px h-5 bg-stroke mx-1 hidden sm:block" />

        {/* Nav Links */}
        {NAV_LINKS.map((link) => (
          <Link
            key={link.label}
            to={link.to}
            className={`text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-all duration-200 whitespace-nowrap ${isActive(link.to)
              ? 'text-text-primary bg-stroke/50'
              : 'text-muted hover:text-text-primary hover:bg-stroke/50'
              }`}
          >
            {link.label}
          </Link>
        ))}

        {/* Divider */}
        <div className="w-px h-5 bg-stroke mx-1 hidden sm:block" />

        {/* Auth Buttons */}
        <LoginButton />
        <SignUpButton />
      </div>
    </nav>
  )
}

/* ── Logo ────────────────────────────────────────────────────────────────── */
function NavLogo() {
  const [hovered, setHovered] = useState(false)

  return (
    <Link to="/" aria-label="Home">
      <div
        className="w-10 h-10 rounded-full p-[2px] transition-transform duration-300 hover:scale-110"
        style={{
          background: hovered
            ? 'linear-gradient(270deg, #89AACC 0%, #4E85BF 100%)'
            : 'linear-gradient(90deg, #89AACC 0%, #4E85BF 100%)',
          transition: 'background 0.4s ease, transform 0.3s ease',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="w-full h-full rounded-full bg-bg flex items-center justify-center overflow-hidden">
          <img
            src="/favicon/favicon-96x96.png"
            alt="AG Logo"
            className="w-7 h-7 object-contain select-none"
          />
        </div>
      </div>
    </Link>
  )
}

/* ── Login Button ────────────────────────────────────────────────────────── */
function LoginButton() {
  return (
    <Link
      to="/login"
      className="text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 border border-stroke text-muted hover:text-text-primary hover:border-white/20 transition-all duration-200 whitespace-nowrap"
    >
      Log in
    </Link>
  )
}

/* ── Sign Up Button ──────────────────────────────────────────────────────── */
function SignUpButton() {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Gradient border ring */}
      <span
        className="absolute inset-[-2px] rounded-full accent-gradient transition-opacity duration-300 pointer-events-none"
        style={{ opacity: hovered ? 1 : 0 }}
      />
      <Link
        to="/signup"
        className="relative z-10 flex items-center gap-1 text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 bg-surface backdrop-blur-md text-text-primary transition-all duration-200 whitespace-nowrap"
      >
        Become a Member <span className="text-muted">↗</span>
      </Link>
    </div>
  )
}

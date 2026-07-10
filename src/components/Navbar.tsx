"use client"

import { usePathname } from 'next/navigation'
import MobileMenu from './ui/MobileMenu'
import DesktopPillNav from './ui/DesktopPillNav'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Careers', to: '/careers' },
  { label: 'Contact', to: '/contact' },
]

// Dark Teal #244147 -> hsl(193 33% 21%)
// Mint      #B8CEC2 -> hsl(135 14% 78%)
const THEME_VARS = {
  '--teal': '193 33% 21%',
  '--teal-deep': '193 38% 13%',
  '--teal-soft': '193 28% 28%',
  '--mint': '135 14% 78%',
  '--mint-soft': '135 14% 88%',
} as React.CSSProperties

const AUTH_ROUTES = ['/login', '/signup']

export default function Navbar() {
  const pathname = usePathname()

  // Hide navbar on auth pages
  if (AUTH_ROUTES.includes(pathname)) return null

  const isActive = (to: string) => {
    if (to === '/') return pathname === '/'
    return pathname.startsWith(to.split('#')[0]) && to.split('#')[0] !== '/'
  }

  return (
    <div style={THEME_VARS}>
      {/* ============================================================
       * DESKTOP / TABLET PILL — unchanged liquid-blob nav, now only
       * rendered from `md` (≥768px) upward. Below that, the hamburger
       * takes over entirely so the floating pill never has to fight
       * for space on phones.
       * ========================================================== */}
      <div className="hidden min-[769px]:block">
        <DesktopPillNav navLinks={NAV_LINKS} isActive={isActive} />
      </div>

      {/* ============================================================
       * MOBILE — floating hamburger, top-right, with a cloth-wrap
       * open/close panel. Only rendered below `md`.
       * ========================================================== */}
      <div className="min-[769px]:hidden">
        <MobileMenu navLinks={NAV_LINKS} isActive={isActive} />
      </div>
    </div>
  )
}

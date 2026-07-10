'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Home, Layers, FlaskConical, BarChart2, BookOpen } from 'lucide-react'

// 6 items — all navigation destinations shown on mobile
// (Compare Stocks accessible on mobile via this bottom nav)
const MOBILE_NAV_ITEMS = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Home', href: '/dashboard/home', icon: Home },
    { label: 'Strategies', href: '/dashboard/my-strategies', icon: Layers },
    { label: 'Backtest', href: '/dashboard/backtest', icon: FlaskConical },
    { label: 'Compare', href: '/dashboard/compare-stocks', icon: BarChart2 },
    { label: 'Reports', href: '/dashboard/research-reports', icon: BookOpen },
]

export default function DashboardMobileNav() {
    const pathname = usePathname()

    const isActive = (href: string) =>
        href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)

    return (
        <nav className="db-mobile-nav" style={{ display: 'none' }} id="db-mobile-nav">
            {MOBILE_NAV_ITEMS.map(({ label, href, icon: Icon }) => (
                <Link
                    key={href}
                    href={href}
                    className={`db-mobile-nav-item ${isActive(href) ? 'active' : ''}`}
                >
                    <Icon size={18} />
                    <span>{label}</span>
                </Link>
            ))}
            <style>{`
              @media (max-width: 1023px) {
                #db-mobile-nav { display: flex !important; }
                .db-sidebar { display: none !important; }
              }
            `}</style>
        </nav>
    )
}

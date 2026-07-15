'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Bell, Search, ChevronDown, User, Settings, LogOut, Shield } from 'lucide-react'
import { useAuth } from '@/src/auth/AuthContext'
import { ADMIN_PAGE_TITLES } from '@/src/data/admin/admin-mock'

export default function AdminTopbar() {
    const pathname = usePathname()
    const router = useRouter()
    const { user, logout } = useAuth()
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [loggingOut, setLoggingOut] = useState(false)
    const [searchVal, setSearchVal] = useState('')

    // Match page title — check prefix for dynamic routes
    const title = Object.entries(ADMIN_PAGE_TITLES)
        .sort(([a], [b]) => b.length - a.length) // longest match first
        .find(([key]) => pathname === key || pathname.startsWith(key + '/'))?.[1]
        ?? 'Admin Panel'

    const handleLogout = async () => {
        setLoggingOut(true)
        await logout()
        router.replace('/login')
    }

    return (
        <header className="db-topbar" style={{ left: 0, paddingLeft: 0, paddingRight: '20px', gap: '12px' }}>
            {/* Page title */}
            <div style={{ flex: 1, paddingLeft: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--db-text)', letterSpacing: '0.01em' }}>{title}</h1>
                {/* Admin role badge */}
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '999px', background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.25)', fontSize: '10px', fontWeight: 600, color: '#a855f7', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    <Shield size={9} />
                    Admin
                </span>
            </div>

            {/* Search */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', color: 'var(--db-text-muted)', pointerEvents: 'none' }} />
                <input value={searchVal} onChange={e => setSearchVal(e.target.value)} placeholder="Search customers, strategies…" className="db-input" style={{ paddingLeft: '32px', width: '220px', height: '34px', fontSize: '12.5px' }} />
            </div>

            {/* Notification bell */}
            <button style={{ position: 'relative', width: '36px', height: '36px', borderRadius: 'var(--db-radius-md)', background: 'var(--db-elevated)', border: '1px solid var(--db-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--db-text-2)', transition: 'all var(--db-transition)', flexShrink: 0 }} aria-label="Notifications">
                <Bell size={15} />
                <span style={{ position: 'absolute', top: '7px', right: '7px', width: '7px', height: '7px', borderRadius: '50%', background: '#a855f7', border: '1.5px solid var(--db-navbar)' }} />
            </button>

            {/* User dropdown */}
            <div style={{ position: 'relative' }}>
                <button onClick={() => setDropdownOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--db-elevated)', border: '1px solid rgba(168,85,247,0.25)', borderRadius: 'var(--db-radius-md)', padding: '5px 10px 5px 6px', cursor: 'pointer', color: 'var(--db-text)', transition: 'border-color var(--db-transition)' }} aria-label="User menu">
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'linear-gradient(135deg,#2E1A47 0%,#4A1A6E 100%)', border: '1.5px solid rgba(168,85,247,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600, color: '#a855f7', flexShrink: 0 }}>
                        {user?.firstName?.[0]?.toUpperCase() ?? 'A'}
                    </div>
                    <span style={{ fontSize: '12.5px', fontWeight: 500, display: 'none' }} className="admin-user-name">{user?.firstName}</span>
                    <ChevronDown size={12} style={{ color: 'var(--db-text-muted)' }} />
                </button>

                {dropdownOpen && (
                    <>
                        <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setDropdownOpen(false)} />
                        <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: '190px', background: 'var(--db-elevated)', border: '1px solid var(--db-border)', borderRadius: 'var(--db-radius-lg)', padding: '6px', zIndex: 50, boxShadow: 'var(--db-shadow-lg)' }}>
                            <div style={{ padding: '8px 10px', marginBottom: '4px' }}>
                                <div style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--db-text)' }}>{user?.firstName} {user?.lastName}</div>
                                <div style={{ fontSize: '10px', color: '#a855f7', fontWeight: 600, letterSpacing: '0.06em', marginTop: '2px' }}>ADMINISTRATOR</div>
                            </div>
                            <div className="db-divider" style={{ margin: '6px 0' }} />
                            {[{ label: 'Profile', icon: User }, { label: 'Settings', icon: Settings }].map(({ label, icon: Icon }) => (
                                <button key={label} onClick={() => setDropdownOpen(false)} className="db-nav-link" style={{ width: '100%', fontSize: '13px', marginBottom: '2px' }}>
                                    <Icon size={14} /><span>{label}</span>
                                </button>
                            ))}
                            <div className="db-divider" style={{ margin: '6px 0' }} />
                            <button onClick={handleLogout} disabled={loggingOut} className="db-nav-link" style={{ width: '100%', color: 'var(--db-loss)', fontSize: '13px', opacity: loggingOut ? 0.5 : 1 }}>
                                <LogOut size={14} /><span>{loggingOut ? 'Signing out…' : 'Log out'}</span>
                            </button>
                        </div>
                    </>
                )}
            </div>

            <style>{`
              @media (min-width: 1024px) {
                .db-topbar { left: var(--db-sidebar-actual, var(--db-sidebar-w)) !important; }
                .admin-user-name { display: block !important; }
              }
            `}</style>
        </header>
    )
}

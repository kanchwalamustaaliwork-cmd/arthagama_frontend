'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react'
import { useAuth } from '@/src/auth/AuthContext'
import { PAGE_TITLES } from '@/src/data/dashboard/dashboard-mock'
import SearchBar from '@/src/components/dashboard/ui/SearchBar'

export default function DashboardTopbar() {
    const pathname = usePathname()
    const router = useRouter()
    const { user, logout } = useAuth()
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [loggingOut, setLoggingOut] = useState(false)
    const [searchVal, setSearchVal] = useState('')

    const title = PAGE_TITLES[pathname] ?? 'Dashboard'

    const handleLogout = async () => {
        setLoggingOut(true)
        await logout()
        router.replace('/login')
    }

    return (
        <header className="db-topbar" style={{ left: 0, paddingLeft: 0, paddingRight: '20px', gap: '12px' }}>
            {/* Sidebar width offset on desktop */}
            <div style={{ width: 'var(--db-sidebar-w)', flexShrink: 0, display: 'none' }} className="lg-sidebar-offset" />

            {/* Page title */}
            <div style={{ flex: 1, paddingLeft: '20px' }}>
                <h1 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--db-text)', letterSpacing: '0.01em' }}>
                    {title}
                </h1>
            </div>

            {/* Search */}
            <SearchBar
                value={searchVal}
                onChange={setSearchVal}
                placeholder="Search…"
                width="180px"
                inputStyle={{ height: '34px', fontSize: '12.5px' }}
            />

            {/* Notification bell */}
            <button
                style={{
                    position: 'relative',
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--db-radius-md)',
                    background: 'var(--db-elevated)',
                    border: '1px solid var(--db-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--db-text-2)',
                    transition: 'all var(--db-transition)',
                    flexShrink: 0,
                }}
                aria-label="Notifications"
            >
                <Bell size={15} />
                <span
                    style={{
                        position: 'absolute',
                        top: '7px',
                        right: '7px',
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        background: 'var(--db-loss)',
                        border: '1.5px solid var(--db-navbar)',
                    }}
                />
            </button>

            {/* User avatar + dropdown */}
            <div style={{ position: 'relative' }}>
                <button
                    onClick={() => setDropdownOpen(o => !o)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'var(--db-elevated)',
                        border: '1px solid var(--db-border)',
                        borderRadius: 'var(--db-radius-md)',
                        padding: '5px 10px 5px 6px',
                        cursor: 'pointer',
                        color: 'var(--db-text)',
                        transition: 'border-color var(--db-transition)',
                    }}
                    aria-label="User menu"
                >
                    <div
                        style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg,#244147 0%,#2E5560 100%)',
                            border: '1.5px solid rgba(184,206,194,0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: 600,
                            color: '#B8CEC2',
                            flexShrink: 0,
                        }}
                    >
                        {user?.firstName?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                    <span style={{ fontSize: '12.5px', fontWeight: 500, display: 'none' }}
                        className="user-name-topbar"
                    >
                        {user?.firstName}
                    </span>
                    <ChevronDown size={12} style={{ color: 'var(--db-text-muted)' }} />
                </button>

                {dropdownOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                            onClick={() => setDropdownOpen(false)}
                        />
                        {/* Menu */}
                        <div
                            style={{
                                position: 'absolute',
                                top: 'calc(100% + 8px)',
                                right: 0,
                                width: '180px',
                                background: 'var(--db-elevated)',
                                border: '1px solid var(--db-border)',
                                borderRadius: 'var(--db-radius-lg)',
                                padding: '6px',
                                zIndex: 50,
                                boxShadow: 'var(--db-shadow-lg)',
                            }}
                        >
                            <div style={{ padding: '8px 10px', marginBottom: '4px' }}>
                                <div style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--db-text)' }}>
                                    {user?.firstName} {user?.lastName}
                                </div>
                                <div style={{ fontSize: '11px', color: 'var(--db-text-muted)', marginTop: '2px' }}>
                                    {user?.email}
                                </div>
                            </div>
                            <div className="db-divider" style={{ margin: '6px 0' }} />
                            {[
                                { label: 'Profile', icon: User },
                                { label: 'Settings', icon: Settings },
                            ].map(({ label, icon: Icon }) => (
                                <button
                                    key={label}
                                    onClick={() => setDropdownOpen(false)}
                                    className="db-nav-link"
                                    style={{ width: '100%', fontSize: '13px', marginBottom: '2px' }}
                                >
                                    <Icon size={14} />
                                    <span>{label}</span>
                                </button>
                            ))}
                            <div className="db-divider" style={{ margin: '6px 0' }} />
                            <button
                                onClick={handleLogout}
                                disabled={loggingOut}
                                className="db-nav-link"
                                style={{ width: '100%', color: 'var(--db-loss)', fontSize: '13px', opacity: loggingOut ? 0.5 : 1 }}
                            >
                                <LogOut size={14} />
                                <span>{loggingOut ? 'Signing out…' : 'Log out'}</span>
                            </button>
                        </div>
                    </>
                )}
            </div>

            <style>{`
              @media (min-width: 1024px) {
                .db-topbar { left: var(--db-sidebar-actual, var(--db-sidebar-w)) !important; }
                .user-name-topbar { display: block !important; }
              }
            `}</style>
        </header>
    )
}

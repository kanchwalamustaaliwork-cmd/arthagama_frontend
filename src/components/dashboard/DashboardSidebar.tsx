'use client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
    LogOut,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react'
import { useAuth } from '@/src/auth/AuthContext'
import { useSidebar } from './SidebarContext'
import { NAV_ITEMS } from '@/src/data/dashboard/dashboard-mock'

export default function DashboardSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const { user, logout } = useAuth()
    const { collapsed, toggle: toggleCollapsed } = useSidebar()
    const [loggingOut, setLoggingOut] = useState(false)

    const isActive = (href: string) =>
        href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)

    const handleLogout = async () => {
        setLoggingOut(true)
        await logout()
        router.replace('/login')
    }

    return (
        <aside
            className="db-sidebar"
            style={{ overflow: 'visible' }}
        >
            {/* Logo */}
            <div
                style={{
                    padding: collapsed ? '20px 12px' : '20px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    borderBottom: '1px solid var(--db-border)',
                    minHeight: 'var(--db-topbar-h)',
                }}
            >
                <div
                    style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '8px',
                        background: 'var(--db-teal)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        border: '1px solid rgba(184,206,194,0.2)',
                    }}
                >
                    <Image src="/assets/arthagama_logo.png" alt="Logo" width={30} height={30} />
                </div>
                {!collapsed && (
                    <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--db-text)', letterSpacing: '0.04em', lineHeight: 1.2 }}>
                            ARTHAGAMA
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--db-text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                            Member Portal
                        </div>
                    </div>
                )}
            </div>

            {/* Nav Links */}
            <nav style={{ flex: 1, padding: collapsed ? '12px 8px' : '12px 10px', overflowY: 'auto', overflowX: 'hidden' }}>
                {!collapsed && <p className="db-section-label" style={{ marginBottom: '8px', marginTop: '4px' }}>Navigation</p>}
                {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
                    <Link
                        key={href}
                        href={href}
                        className={`db-nav-link ${isActive(href) ? 'active' : ''}`}
                        style={{
                            marginBottom: '2px',
                            justifyContent: collapsed ? 'center' : undefined,
                            padding: collapsed ? '9px 0' : undefined,
                        }}
                        title={collapsed ? label : undefined}
                    >
                        <Icon size={16} style={{ flexShrink: 0 }} />
                        {!collapsed && <span>{label}</span>}
                    </Link>
                ))}
            </nav>

            {/* Bottom: user + logout */}
            <div
                style={{
                    borderTop: '1px solid var(--db-border)',
                    padding: collapsed ? '12px 8px' : '12px 10px',
                }}
            >
                {!collapsed && user && (
                    <div
                        style={{
                            padding: '10px 12px',
                            borderRadius: 'var(--db-radius-md)',
                            background: 'var(--db-elevated)',
                            marginBottom: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                        }}
                    >
                        <div
                            style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #244147 0%, #2E5560 100%)',
                                border: '1.5px solid rgba(184,206,194,0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                fontWeight: 600,
                                color: '#B8CEC2',
                                flexShrink: 0,
                            }}
                        >
                            {user.firstName?.[0]?.toUpperCase() ?? 'U'}
                        </div>
                        <div style={{ overflow: 'hidden', flex: 1 }}>
                            <div style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--db-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user.firstName} {user.lastName}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--db-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user.email}
                            </div>
                        </div>
                    </div>
                )}

                <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="db-nav-link"
                    style={{
                        width: '100%',
                        justifyContent: collapsed ? 'center' : undefined,
                        padding: collapsed ? '9px 0' : undefined,
                        color: 'var(--db-loss)',
                        opacity: loggingOut ? 0.5 : 1,
                    }}
                    title={collapsed ? 'Log out' : undefined}
                >
                    <LogOut size={16} style={{ flexShrink: 0 }} />
                    {!collapsed && <span>{loggingOut ? 'Signing out…' : 'Log out'}</span>}
                </button>
            </div>

            {/* Collapse toggle */}
            <button
                onClick={toggleCollapsed}
                style={{
                    position: 'absolute',
                    top: '50%',
                    right: '-12px',
                    transform: 'translateY(-50%)',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'var(--db-elevated)',
                    border: '1px solid var(--db-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 70,
                    color: 'var(--db-text-muted)',
                    transition: 'all var(--db-transition)',
                }}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
                {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
            </button>
        </aside>
    )
}

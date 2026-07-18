'use client'

import { usePathname } from 'next/navigation'
import { Shield } from 'lucide-react'
import { ADMIN_PAGE_TITLES } from '@/src/data/admin/admin-mock'

export default function AdminTopbar() {
    const pathname = usePathname()

    // Match page title — check prefix for dynamic routes
    const title = Object.entries(ADMIN_PAGE_TITLES)
        .sort(([a], [b]) => b.length - a.length) // longest match first
        .find(([key]) => pathname === key || pathname.startsWith(key + '/'))?.[1]
        ?? 'Admin Panel'

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

            <style>{`
              @media (min-width: 1024px) {
                .db-topbar { left: var(--db-sidebar-actual, var(--db-sidebar-w)) !important; }
                .admin-user-name { display: block !important; }
              }
            `}</style>
        </header>
    )
}

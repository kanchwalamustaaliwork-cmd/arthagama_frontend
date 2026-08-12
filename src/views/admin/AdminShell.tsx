'use client'

import AdminGuard from '@/src/components/admin/AdminGuard'
import AdminSidebar from '@/src/components/admin/AdminSidebar'
import AdminTopbar from '@/src/components/admin/AdminTopbar'
import { SidebarProvider, useSidebar } from '@/src/components/dashboard/SidebarContext'
import { usePathname } from 'next/navigation'

function AdminContent({ children }: { children: React.ReactNode }) {
    const { sidebarW } = useSidebar()
    const pathname = usePathname()
    const isTerminal = pathname === '/admin/terminal'

    return (
        <div
            className="db-root"
            style={{
                '--db-sidebar-actual': sidebarW,
                ...(isTerminal ? { height: '100vh', overflow: 'hidden' } : {}),
            } as React.CSSProperties}
        >
            <AdminSidebar />
            <AdminTopbar />
            <main
                className="db-main"
                style={{
                    padding: isTerminal
                        ? 'var(--db-topbar-h) 0 0 0'
                        : 'calc(var(--db-topbar-h) + 24px) 24px 80px 24px',
                    ...(isTerminal ? { height: '100vh', overflow: 'hidden', boxSizing: 'border-box' } : {}),
                }}
            >
                {children}
            </main>
        </div>
    )
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
    return (
        <AdminGuard>
            <SidebarProvider>
                <AdminContent>{children}</AdminContent>
            </SidebarProvider>
        </AdminGuard>
    )
}

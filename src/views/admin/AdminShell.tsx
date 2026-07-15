'use client'

import AdminGuard from '@/src/components/admin/AdminGuard'
import AdminSidebar from '@/src/components/admin/AdminSidebar'
import AdminTopbar from '@/src/components/admin/AdminTopbar'
import { SidebarProvider, useSidebar } from '@/src/components/dashboard/SidebarContext'

function AdminContent({ children }: { children: React.ReactNode }) {
    const { sidebarW } = useSidebar()
    return (
        <div className="db-root" style={{ '--db-sidebar-actual': sidebarW } as React.CSSProperties}>
            <AdminSidebar />
            <AdminTopbar />
            <main className="db-main" style={{ padding: 'calc(var(--db-topbar-h) + 24px) 24px 80px 24px' }}>
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

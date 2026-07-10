'use client'

import DashboardGuard from '@/src/components/dashboard/DashboardGuard'
import DashboardSidebar from '@/src/components/dashboard/DashboardSidebar'
import DashboardTopbar from '@/src/components/dashboard/DashboardTopbar'
import DashboardMobileNav from '@/src/components/dashboard/DashboardMobileNav'
import { SidebarProvider, useSidebar } from '@/src/components/dashboard/SidebarContext'

/* Inner component — must be a child of SidebarProvider to call useSidebar() */
function DashboardContent({ children }: { children: React.ReactNode }) {
    const { sidebarW } = useSidebar()

    return (
        /*
         * --db-sidebar-actual is set here so every CSS rule that references it
         * (topbar `left`, main `margin-left`, sidebar `width`) updates in sync.
         * The 250ms transition on those CSS rules gives the smooth reflow.
         */
        <div
            className="db-root"
            style={{ '--db-sidebar-actual': sidebarW } as React.CSSProperties}
        >
            <DashboardSidebar />
            <DashboardTopbar />
            <main
                className="db-main"
                style={{ padding: 'calc(var(--db-topbar-h) + 24px) 24px 80px 24px' }}
            >
                {children}
            </main>
            <DashboardMobileNav />
        </div>
    )
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
    return (
        <DashboardGuard>
            <SidebarProvider>
                <DashboardContent>{children}</DashboardContent>
            </SidebarProvider>
        </DashboardGuard>
    )
}

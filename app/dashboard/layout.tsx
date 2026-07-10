import type { Metadata } from 'next'
import DashboardShell from '@/src/views/dashboard/DashboardShell'
import './dashboard.css'

export const metadata: Metadata = {
    title: 'Member Dashboard — ARTHAGAMA',
    description: 'Your personal trading workspace. Manage strategies, run backtests, compare stocks, and access research.',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardShell>
            {children}
        </DashboardShell>
    )
}

import type { Metadata } from 'next'
import AdminShell from '@/src/views/admin/AdminShell'
import '@/app/dashboard/dashboard.css'

export const metadata: Metadata = {
    title: 'Admin Panel — Arthagama',
    description: 'Arthagama administration and operations panel.',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminShell>
            {children}
        </AdminShell>
    )
}

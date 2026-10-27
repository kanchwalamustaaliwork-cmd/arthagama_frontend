'use client'

import dynamic from 'next/dynamic'
import { IndexTableSkeleton } from '@/src/components/indices/skeletons/IndexTableSkeleton'

const AdminIndicesView = dynamic(
    () => import('@/src/views/admin/indices/AdminIndicesView'),
    {
        loading: () => <IndexTableSkeleton rows={6} />,
        ssr: false,
    }
)

export default function AdminIndicesPage() {
    return <AdminIndicesView />
}

'use client'

import dynamic from 'next/dynamic'
import { IndexTableSkeleton } from '@/src/components/indices/skeletons/IndexTableSkeleton'

const IndicesListView = dynamic(
    () => import('@/src/views/dashboard/indices/IndicesListView'),
    {
        loading: () => <IndexTableSkeleton rows={7} />,
        ssr: false,
    }
)

export default function DashboardIndicesPage() {
    return <IndicesListView />
}

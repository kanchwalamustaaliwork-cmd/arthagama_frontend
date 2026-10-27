'use client'

import { use } from 'react'
import dynamic from 'next/dynamic'
import { IndexDetailSkeleton } from '@/src/components/indices/skeletons/IndexDetailSkeleton'

const IndexDetailsView = dynamic(
    () => import('@/src/views/dashboard/indices/IndexDetailsView'),
    {
        loading: () => <IndexDetailSkeleton />,
        ssr: false,
    }
)

interface PageProps {
    params: Promise<{ indexId: string }>
}

export default function IndexDetailPage({ params }: PageProps) {
    const resolvedParams = use(params)
    const indexId = parseInt(resolvedParams.indexId, 10)

    return <IndexDetailsView indexId={indexId} />
}

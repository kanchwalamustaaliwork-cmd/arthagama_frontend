'use client'

import { use } from 'react'
import dynamic from 'next/dynamic'

const EditIndexView = dynamic(
    () => import('@/src/views/admin/indices/EditIndexView'),
    {
        loading: () => (
            <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="db-skeleton" style={{ height: '36px', width: '280px' }} />
                <div className="db-card" style={{ height: '450px' }} />
            </div>
        ),
        ssr: false,
    }
)

interface PageProps {
    params: Promise<{ indexId: string }>
}

export default function EditIndexPage({ params }: PageProps) {
    const resolvedParams = use(params)
    const indexId = parseInt(resolvedParams.indexId, 10)

    return <EditIndexView indexId={indexId} />
}

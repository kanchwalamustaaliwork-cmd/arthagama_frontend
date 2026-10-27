'use client'

import dynamic from 'next/dynamic'

const CreateIndexView = dynamic(
    () => import('@/src/views/admin/indices/CreateIndexView'),
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

export default function CreateIndexPage() {
    return <CreateIndexView />
}

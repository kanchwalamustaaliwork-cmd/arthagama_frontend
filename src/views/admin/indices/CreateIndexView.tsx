'use client'

/**
 * src/views/admin/indices/CreateIndexView.tsx
 *
 * Admin view to create a new Arthagama Index.
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import BackButton from '@/src/components/dashboard/ui/BackButton'
import PageHeader from '@/src/components/admin/PageHeader'
import IndexForm from '@/src/components/indices/IndexForm'
import { useAdminIndices } from '@/src/hooks/indices/useAdminIndices'
import { CreateIndexRequest } from '@/src/types/indices'

export default function CreateIndexView() {
    const router = useRouter()
    const { indices, createIndex } = useAdminIndices()
    const [submitting, setSubmitting] = useState(false)

    const handleCreate = async (payload: CreateIndexRequest) => {
        setSubmitting(true)
        try {
            await createIndex(payload)
            router.push('/admin/indices')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '860px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <BackButton onClick={() => router.push('/admin/indices')} title="Back to Index Management" />
                <PageHeader
                    title="Create Arthagama Index"
                    subtitle="Configure index parameters, baseline dates, and constituent instrument basket"
                    icon={Plus}
                />
            </div>

            {/* Form */}
            <IndexForm
                mode="create"
                existingIndices={indices}
                onSubmit={handleCreate}
                isSubmitting={submitting}
            />
        </div>
    )
}

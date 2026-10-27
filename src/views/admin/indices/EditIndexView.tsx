'use client'

/**
 * src/views/admin/indices/EditIndexView.tsx
 *
 * Admin view to edit an existing Arthagama Index and its constituent weights.
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Edit2 } from 'lucide-react'
import BackButton from '@/src/components/dashboard/ui/BackButton'
import PageHeader from '@/src/components/admin/PageHeader'
import IndexForm from '@/src/components/indices/IndexForm'
import { useAdminIndices } from '@/src/hooks/indices/useAdminIndices'
import { getAdminIndex } from '@/src/lib/api/indices/indices.api'
import { CreateIndexRequest, ArthagamaIndex, IndexConstituent } from '@/src/types/indices'
import EmptyState from '@/src/components/dashboard/ui/EmptyState'

interface EditIndexViewProps {
    indexId: number
}

export default function EditIndexView({ indexId }: EditIndexViewProps) {
    const router = useRouter()
    const { indices, updateIndex } = useAdminIndices()

    const [indexData, setIndexData] = useState<{
        index: ArthagamaIndex
        constituents: IndexConstituent[]
    } | null>(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        let isMounted = true
        async function load() {
            setLoading(true)
            try {
                const res = await getAdminIndex(indexId)
                if (isMounted) setIndexData(res)
            } finally {
                if (isMounted) setLoading(false)
            }
        }
        load()
        return () => {
            isMounted = false
        }
    }, [indexId])

    const handleUpdate = async (payload: CreateIndexRequest) => {
        setSubmitting(true)
        try {
            await updateIndex(indexId, payload)
            router.push('/admin/indices')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="db-skeleton" style={{ height: '40px', width: '300px' }} />
                <div className="db-card" style={{ height: '400px' }} />
            </div>
        )
    }

    if (!indexData) {
        return (
            <div style={{ maxWidth: '600px', margin: '60px auto' }}>
                <EmptyState
                    title="Index Not Found"
                    description={`Could not find index #${indexId} for editing.`}
                    actionLabel="Back to Index Management"
                    onAction={() => router.push('/admin/indices')}
                />
            </div>
        )
    }

    const { index, constituents } = indexData

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '860px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <BackButton onClick={() => router.push('/admin/indices')} title="Back to Index Management" />
                <PageHeader
                    title={`Edit: ${index.indexName}`}
                    subtitle={`Index ID #${index.indexId} • Sector: ${index.sector}`}
                    icon={Edit2}
                />
            </div>

            {/* Form */}
            <IndexForm
                mode="edit"
                currentIndexId={indexId}
                existingIndices={indices}
                initialData={{
                    indexName: index.indexName,
                    indexSymbol: index.indexSymbol || '',
                    sector: index.sector,
                    description: index.description || '',
                    baseDate: index.baseDate,
                    baseValue: index.baseValue,
                    status: index.status,
                    constituentsWithData: constituents.map(c => ({
                        instrumentId: c.instrumentId,
                        weight: c.weight,
                        instrument: c.instrument,
                    })),
                }}
                onSubmit={handleUpdate}
                isSubmitting={submitting}
            />
        </div>
    )
}

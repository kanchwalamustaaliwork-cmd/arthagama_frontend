import { IndexTableSkeleton } from '@/src/components/indices/skeletons/IndexTableSkeleton'

export default function Loading() {
    return (
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="db-skeleton" style={{ height: '36px', width: '260px', borderRadius: '8px' }} />
            <div className="db-skeleton" style={{ height: '48px', width: '100%', borderRadius: '8px' }} />
            <IndexTableSkeleton rows={6} />
        </div>
    )
}

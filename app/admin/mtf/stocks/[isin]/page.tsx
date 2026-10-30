import { use } from 'react'
import { MtfStockDetailView } from '@/src/views/admin/mtf/MtfStockDetailView'

interface PageProps {
  params: Promise<{ isin: string }>
}

export default function MtfStockDetailPage({ params }: PageProps) {
  const { isin } = use(params)
  return <MtfStockDetailView isin={isin} />
}
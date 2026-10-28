import { MtfStockDetailView } from '@/src/views/admin/mtf/MtfStockDetailView'
export default function MtfStockDetailPage({ params }: { params: { isin: string } }) {
  return <MtfStockDetailView isin={params.isin} />
}


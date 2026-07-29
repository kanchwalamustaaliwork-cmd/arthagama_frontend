import ProtectedRoute from '@/src/routes/ProtectedRoute'
import CompareStocksPage from '@/src/views/services/CompareStocksPage'
import { getService } from '@/src/lib/cms/services'

export default async function Page() {
  const cmsService = await getService('compare-stocks')
  return (
    <ProtectedRoute>
      <CompareStocksPage cmsService={cmsService} />
    </ProtectedRoute>
  )
}
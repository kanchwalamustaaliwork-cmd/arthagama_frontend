import ProtectedRoute from '@/src/routes/ProtectedRoute'
import TradeWithUsPage from '@/src/views/services/TradeWithUsPage'
import { getService } from '@/src/lib/cms/services'

export default async function Page() {
  const cmsService = await getService('trade-with-us')
  return (
    <ProtectedRoute>
      <TradeWithUsPage cmsService={cmsService} />
    </ProtectedRoute>
  )
}

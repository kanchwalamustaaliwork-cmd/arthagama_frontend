import ProtectedRoute from '@/src/routes/ProtectedRoute'
import BacktestPage from '@/src/views/services/BacktestPage'
import { getService } from '@/src/lib/cms/services'

export default async function Page() {
  const cmsService = await getService('backtest')
  return (
    <ProtectedRoute>
      <BacktestPage cmsService={cmsService} />
    </ProtectedRoute>
  )
}

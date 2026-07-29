import ProtectedRoute from '@/src/routes/ProtectedRoute'
import CustomStrategyBuilderPage from '@/src/views/services/CustomStrategyBuilderPage'
import { getService } from '@/src/lib/cms/services'

export default async function Page() {
  const cmsService = await getService('custom-strategy-builder')
  return (
    <ProtectedRoute>
      <CustomStrategyBuilderPage cmsService={cmsService} />
    </ProtectedRoute>
  )
}

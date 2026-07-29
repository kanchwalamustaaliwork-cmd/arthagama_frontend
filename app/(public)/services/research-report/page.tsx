import ProtectedRoute from '@/src/routes/ProtectedRoute'
import ResearchReportPage from '@/src/views/services/ResearchReportPage'
import { getService } from '@/src/lib/cms/services'

export default async function Page() {
  const cmsService = await getService('research-report')
  return (
    <ProtectedRoute>
      <ResearchReportPage cmsService={cmsService} />
    </ProtectedRoute>
  )
}

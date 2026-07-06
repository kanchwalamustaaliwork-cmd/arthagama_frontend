import ProtectedRoute from '@/src/routes/ProtectedRoute'
import ResearchReportPage from '@/src/views/services/ResearchReportPage'

export default function Page() {
  return (
    <ProtectedRoute>
      <ResearchReportPage />
    </ProtectedRoute>
  )
}

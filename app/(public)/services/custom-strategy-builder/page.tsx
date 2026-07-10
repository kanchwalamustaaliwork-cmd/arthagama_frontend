import ProtectedRoute from '@/src/routes/ProtectedRoute'
import CustomStrategyBuilderPage from '@/src/views/services/CustomStrategyBuilderPage'

export default function Page() {
  return (
    <ProtectedRoute>
      <CustomStrategyBuilderPage />
    </ProtectedRoute>
  )
}

import ProtectedRoute from '@/src/routes/ProtectedRoute'
import BacktestPage from '@/src/views/services/BacktestPage'

export default function Page() {
  return (
    <ProtectedRoute>
      <BacktestPage />
    </ProtectedRoute>
  )
}

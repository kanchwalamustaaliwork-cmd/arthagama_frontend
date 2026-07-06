import ProtectedRoute from '@/src/routes/ProtectedRoute'
import TradeWithUsPage from '@/src/views/services/TradeWithUsPage'

export default function Page() {
  return (
    <ProtectedRoute>
      <TradeWithUsPage />
    </ProtectedRoute>
  )
}

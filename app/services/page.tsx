import ProtectedRoute from '@/src/routes/ProtectedRoute'
import ServicePage from '@/src/views/ServicePage'

export default function Page() {
  return (
    <ProtectedRoute>
      <ServicePage />
    </ProtectedRoute>
  )
}

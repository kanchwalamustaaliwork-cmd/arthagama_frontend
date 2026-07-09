import ProtectedRoute from '@/src/routes/ProtectedRoute'
import HomePage from '@/src/views/HomePage'

export default function Page() {
  return (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  )
}

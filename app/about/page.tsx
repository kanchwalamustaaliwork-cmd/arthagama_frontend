import ProtectedRoute from '@/src/routes/ProtectedRoute'
import AboutPage from '@/src/views/AboutPage'

export default function Page() {
  return (
    <ProtectedRoute>
      <AboutPage />
    </ProtectedRoute>
  )
}

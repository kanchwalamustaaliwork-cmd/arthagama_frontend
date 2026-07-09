import ProtectedRoute from '@/src/routes/ProtectedRoute'
import PrivacyPolicy from '@/src/views/PrivacyPolicy'

export default function Page() {
  return (
    <ProtectedRoute>
      <PrivacyPolicy />
    </ProtectedRoute>
  )
}

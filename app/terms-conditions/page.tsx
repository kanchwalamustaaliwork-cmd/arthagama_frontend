import ProtectedRoute from '@/src/routes/ProtectedRoute'
import TermsAndCondition from '@/src/views/TermsAndCondition'

export default function Page() {
  return (
    <ProtectedRoute>
      <TermsAndCondition />
    </ProtectedRoute>
  )
}

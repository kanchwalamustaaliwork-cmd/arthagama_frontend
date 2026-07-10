import ProtectedRoute from '@/src/routes/ProtectedRoute'
import CompareStocksPage from '@/src/views/services/CompareStocksPage'

export default function Page() {
    return (
        <ProtectedRoute>
            <CompareStocksPage />
        </ProtectedRoute>
    )
}
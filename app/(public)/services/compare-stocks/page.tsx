import type { Metadata } from 'next'
import ProtectedRoute from '@/src/routes/ProtectedRoute'
import CompareStocksPage from '@/src/views/services/CompareStocksPage'

export const metadata: Metadata = {
  title: 'Compare Stocks — Arthagama',
  description: 'Side-by-side performance and risk metrics comparison for up to 3 stocks.',
  openGraph: {
    title: 'Compare Stocks — Arthagama',
    description: 'Side-by-side performance and risk metrics comparison for up to 3 stocks.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compare Stocks — Arthagama',
    description: 'Side-by-side performance and risk metrics comparison for up to 3 stocks.',
  },
}

export default function Page() {
  return (
    <ProtectedRoute>
      <CompareStocksPage />
    </ProtectedRoute>
  )
}
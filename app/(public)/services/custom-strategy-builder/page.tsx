import type { Metadata } from 'next'
import ProtectedRoute from '@/src/routes/ProtectedRoute'
import CustomStrategyBuilderPage from '@/src/views/services/CustomStrategyBuilderPage'

export const metadata: Metadata = {
  title: 'Custom Strategy Builder — Arthagama',
  description: 'Design, backtest, and deploy custom quantitative trading strategies tailored to your capital and risk appetite.',
  openGraph: {
    title: 'Custom Strategy Builder — Arthagama',
    description: 'Design, backtest, and deploy custom quantitative trading strategies tailored to your capital and risk appetite.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Custom Strategy Builder — Arthagama',
    description: 'Design, backtest, and deploy custom quantitative trading strategies tailored to your capital and risk appetite.',
  },
}

export default function Page() {
  return (
    <ProtectedRoute>
      <CustomStrategyBuilderPage />
    </ProtectedRoute>
  )
}

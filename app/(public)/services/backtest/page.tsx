import type { Metadata } from 'next'
import ProtectedRoute from '@/src/routes/ProtectedRoute'
import BacktestPage from '@/src/views/services/BacktestPage'

export const metadata: Metadata = {
  title: 'Backtest Strategy — Arthagama',
  description: 'Stress-test quantitative trading strategies against years of historical market data.',
  openGraph: {
    title: 'Backtest Strategy — Arthagama',
    description: 'Stress-test quantitative trading strategies against years of historical market data.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Backtest Strategy — Arthagama',
    description: 'Stress-test quantitative trading strategies against years of historical market data.',
  },
}

export default function Page() {
  return (
    <ProtectedRoute>
      <BacktestPage />
    </ProtectedRoute>
  )
}

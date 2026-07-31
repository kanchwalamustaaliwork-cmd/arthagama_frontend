import type { Metadata } from 'next'
import ProtectedRoute from '@/src/routes/ProtectedRoute'
import TradeWithUsPage from '@/src/views/services/TradeWithUsPage'

export const metadata: Metadata = {
  title: 'Trade With Us — Arthagama',
  description: 'Automated execution pipeline integrated directly with your broker.',
  openGraph: {
    title: 'Trade With Us — Arthagama',
    description: 'Automated execution pipeline integrated directly with your broker.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trade With Us — Arthagama',
    description: 'Automated execution pipeline integrated directly with your broker.',
  },
}

export default function Page() {
  return (
    <ProtectedRoute>
      <TradeWithUsPage />
    </ProtectedRoute>
  )
}

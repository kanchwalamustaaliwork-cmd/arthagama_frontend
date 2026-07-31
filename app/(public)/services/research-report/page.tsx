import type { Metadata } from 'next'
import ProtectedRoute from '@/src/routes/ProtectedRoute'
import ResearchReportPage from '@/src/views/services/ResearchReportPage'

export const metadata: Metadata = {
  title: 'Research Report — Arthagama',
  description: 'Data-driven quantitative research reports on market regimes and factor performance.',
  openGraph: {
    title: 'Research Report — Arthagama',
    description: 'Data-driven quantitative research reports on market regimes and factor performance.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Research Report — Arthagama',
    description: 'Data-driven quantitative research reports on market regimes and factor performance.',
  },
}

export default function Page() {
  return (
    <ProtectedRoute>
      <ResearchReportPage />
    </ProtectedRoute>
  )
}

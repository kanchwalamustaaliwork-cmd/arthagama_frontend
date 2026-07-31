import type { Metadata } from 'next'
import ComingSoonPage from '@/src/views/ComingSoonPage'

export const metadata: Metadata = {
  title: 'Coming Soon — Arthagama',
  description: 'Feature in active development. Stay tuned.',
  openGraph: {
    title: 'Coming Soon — Arthagama',
    description: 'Feature in active development. Stay tuned.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Coming Soon — Arthagama',
    description: 'Feature in active development. Stay tuned.',
  },
}

export default function Page() {
  return <ComingSoonPage />
}

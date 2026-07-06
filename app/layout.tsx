import type { Metadata } from 'next'
import AppProviders from '@/src/components/providers/AppProviders'
import GlobalBackground from '@/src/components/backgrounds/GlobalBackground'
import Navbar from '@/src/components/Navbar'
import FooterSection from '@/src/components/FooterSection'
import './globals.css'

export const metadata: Metadata = {
  title: 'Arthagama - Algo Trading Company',
  description: 'Precision built systems for modern markets. Quantitative research and algorithmic execution strategies.',
  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
      { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/favicon/apple-touch-icon.png',
  },
  manifest: '/favicon/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <GlobalBackground />
          <Navbar />
          {children}
          <FooterSection />
        </AppProviders>
      </body>
    </html>
  )
}

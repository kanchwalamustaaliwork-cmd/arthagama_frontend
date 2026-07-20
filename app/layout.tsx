import type { Metadata } from 'next'
import AppProviders from '@/src/components/providers/AppProviders'
import './globals.css'
import { TooltipProvider } from '@/src/components/ui/Tooltip'

export const metadata: Metadata = {
  title: 'ARTHAGAMA - Algo Trading Company',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </AppProviders>
      </body>
    </html>
  )
}

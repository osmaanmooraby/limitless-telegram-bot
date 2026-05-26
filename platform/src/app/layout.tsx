import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: '10X Limitless Intelligence | Where Real Traders Are Made',
  description: 'Premium institutional-grade crypto market intelligence platform. EMA confluence signals, multi-exchange scanner, real-time alerts, and educational trading insights.',
  keywords: 'crypto trading, EMA signals, market scanner, institutional trading, confluence strategy',
  authors: [{ name: 'Osmaan Mooraby' }],
  openGraph: {
    title: '10X Limitless Intelligence',
    description: 'Premium institutional-grade crypto market intelligence platform.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#080808] text-white antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(15,15,15,0.95)',
              color: '#fff',
              border: '1px solid rgba(212,175,55,0.2)',
              backdropFilter: 'blur(10px)',
            },
            success: { iconTheme: { primary: '#D4AF37', secondary: '#000' } },
          }}
        />
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Osmaan Mooraby | Building Wealth Beyond Trading',
  description: 'Crypto Trader, Digital Strategist, Future Founder, and Builder of 10x Limitless. Explore the journey of wealth creation, trading mastery, and empire building.',
  keywords: ['Osmaan Mooraby', '10x Limitless', 'crypto trading', 'wealth building', 'trading education'],
  authors: [{ name: 'Osmaan Mooraby' }],
  openGraph: {
    title: 'Osmaan Mooraby | Building Wealth Beyond Trading',
    description: 'Crypto Trader, Digital Strategist, Future Founder, and Builder of 10x Limitless.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Osmaan Mooraby | Building Wealth Beyond Trading',
    description: 'Crypto Trader, Digital Strategist, Future Founder, and Builder of 10x Limitless.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans bg-background text-offwhite antialiased">
        {children}
      </body>
    </html>
  )
}

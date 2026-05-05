import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Poppins, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { MotionSystem } from '@/components/MotionSystem'
import { CommerceProvider } from '@/components/commerce/CommerceProvider'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://ausgifthampers.com'),
  title: 'Aus Gift Hampers',
  description: 'Premium gift hampers crafted with elegance',
  keywords: 'gift hampers, luxury hampers, gift baskets, hampers Australia, corporate gifts, premium hampers, gift delivery',
  authors: [{ name: 'Aus Gift Hampers' }],
  openGraph: {
    title: 'Aus Gift Hampers',
    description: 'Premium gift hampers crafted with elegance',
    url: 'https://ausgifthampers.com',
    siteName: 'Aus Gift Hampers',
    type: 'website',
    images: ['/icon.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aus Gift Hampers',
    description: 'Premium gift hampers crafted with elegance',
    images: ['/icon.png'],
  },
  generator: 'v0.app',
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#C8A96A',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth" style={{ ...playfair.style, ...poppins.style, ...inter.style }}>
      <body className="bg-background text-foreground font-sans antialiased">
        <CommerceProvider>
          <MotionSystem />
          {children}
        </CommerceProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

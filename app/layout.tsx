import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from '@/components/providers'
import { ChatWidgetLoader } from '@/components/chat-widget-loader'
import './globals.css'

export const metadata: Metadata = {
  title: 'Riphah International College | Shaping Future Leaders',
  description: 'Experience the future of education with Riphah International College. Apply now for admissions and explore our world-class programs.',
  keywords: ['riphah', 'college', 'education', 'admissions', 'scholarships', 'campus', 'lahore'],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1E3A8A',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Poppins:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased overflow-x-hidden">
        <Providers>
          {children}
        </Providers>
        <ChatWidgetLoader />
        <Analytics />
      </body>
    </html>
  )
}

import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Flake Development - Premium FiveM Scripts',
  description: 'The most popular premium scripts for your FiveM server by Flake Development. Compatible with QBCore, Qbox & ESX.',
  icons: {
    icon: [
      { url: '/fd-favicon.svg', type: 'image/svg+xml' },
      { url: '/fd-favicon.png', type: 'image/png' },
    ],
    apple: '/fd-favicon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark bg-black">
      <head>
        <script
          src="https://checkout.tebex.io/v1/tebex.js"
          async
        ></script>
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-black text-white min-h-screen`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

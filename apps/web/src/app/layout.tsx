import './globals.css'

import type { Metadata } from 'next'

import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Create Next App',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  if (typeof window === 'undefined') {
    // Polyfill localStorage for SSR if it's missing or invalid
    if (
      typeof global.localStorage === 'undefined' ||
      typeof global.localStorage.getItem === 'undefined'
    ) {
      Object.defineProperty(global, 'localStorage', {
        value: {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
          clear: () => {},
          length: 0,
          key: () => null,
        },
        writable: true,
      })
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

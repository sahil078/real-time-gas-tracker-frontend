import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Real-Time Gas Tracker',
  description: 'Track gas prices across multiple chains in real-time',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

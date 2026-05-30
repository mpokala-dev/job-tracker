import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import SessionProvider from '@/components/SessionProvider'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Job Tracker',
  description: 'Track your job applications',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-slate-950 antialiased`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
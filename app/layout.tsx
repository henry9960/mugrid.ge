import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import NavbarWrapper from '@/components/NavbarWrapper'
import CustomCursor from '@/components/CustomCursor'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
})

export const metadata: Metadata = {
  title: 'Harry Mugridge',
  description: 'Welcome to my corner on the internet to build and share ideas.',
  openGraph: {
    title: 'Harry Mugridge',
    description: 'Welcome to my corner on the internet to build and share ideas.',
    url: 'https://harry.mugrid.ge',
    siteName: 'Harry Mugridge',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Harry Mugridge',
    description: 'Welcome to my corner on the internet to build and share ideas.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} font-sans`}>
        <CustomCursor />
        <NavbarWrapper />
        {children}
      </body>
    </html>
  )
}

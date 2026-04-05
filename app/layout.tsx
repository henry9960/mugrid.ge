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
  description: 'Product Manager & Student at Royal Holloway. Previously at Microsoft, Amazon and Spotify.',
  openGraph: {
    title: 'Harry Mugridge',
    description: 'Product Manager & Student at Royal Holloway. Previously at Microsoft, Amazon and Spotify.',
    url: 'https://harry.mugrid.ge',
    siteName: 'Harry Mugridge',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Harry Mugridge',
    description: 'Product Manager & Student at Royal Holloway. Previously at Microsoft, Amazon and Spotify.',
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

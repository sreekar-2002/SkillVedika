import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import './cursor-styles.css'
import "aos/dist/aos.css"
import Header from '@/components/header'
import Footer from '@/components/footer'
import CookieConsent from '@/components/CookieConsent'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Skill Vedika',
  description: 'Created with v0',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <Header />
        <main>
          {children}
        </main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  )
}

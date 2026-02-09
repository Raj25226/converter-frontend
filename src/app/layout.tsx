import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Free File Converter - Convert PDF, Images, Videos & More',
  description: 'Convert your files online for free. PDF to Word, JPG to PNG, MP4 to MP3, Excel to PDF. Fast, secure, and easy to use. No registration required.',
  keywords: 'file converter, pdf to word, jpg to png, mp4 to mp3, excel to pdf, free converter, online converter',
  authors: [{ name: 'File Converter' }],
  openGraph: {
    title: 'Free File Converter',
    description: 'Convert your files online for free',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}
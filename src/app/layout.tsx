import type { Metadata } from 'next'
import './globals.css'
import Script from 'next/script'

export const metadata: Metadata = {
  title: {
    default: 'FileConvert Pro – Free Online File Converter',
    template: '%s | FileConvert Pro',
  },
  description: 'Convert PDF, images, videos and documents online for free. Fast, secure, and private. No registration required for basic conversions.',
  keywords: 'file converter, pdf to word, jpg to png, mp4 to mp3, excel to pdf, free converter, online converter, heic to jpg, webp converter',
  authors: [{ name: 'FileConvert Pro' }],
  creator: 'FileConvert Pro',
  metadataBase: new URL('https://fileconvert.pro'),
  openGraph: {
    title: 'FileConvert Pro – Free Online File Converter',
    description: 'Convert PDF, images, videos and documents online for free.',
    type: 'website',
    locale: 'en_US',
    siteName: 'FileConvert Pro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FileConvert Pro – Free Online File Converter',
    description: 'Convert PDF, images, videos and documents online for free.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@600;700;800&display=swap" rel="stylesheet" />
        {/* Theme init script - prevents flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme = saved || (prefersDark ? 'dark' : 'light');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased" style={{ background: 'rgb(var(--bg))', color: 'rgb(var(--fg))' }}>
        {children}
      </body>
    </html>
  )
}

import type { Metadata } from 'next';
import './globals.css';
import VisitTracker from '@/components/VisitTracker';

export const metadata: Metadata = {
    title: {
        default: 'UniMorpher – Free Online File Converter',
        template: '%s | UniMorpher',
    },
    description:
        'Convert PDF, images, videos and documents online for free. Fast, secure, and private. No registration required for basic conversions.',
    keywords:
        'file converter, pdf to word, jpg to png, mp4 to mp3, excel to pdf, free converter, online converter, unimorpher',
    authors: [{ name: 'UniMorpher' }],
    creator: 'UniMorpher',
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    ),
    openGraph: {
        title: 'UniMorpher – Free Online File Converter',
        description:
            'Convert PDF, images, videos and documents online for free.',
        type: 'website',
        locale: 'en_US',
        siteName: 'UniMorpher',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'UniMorpher – Free Online File Converter',
        description:
            'Convert PDF, images, videos and documents online for free.',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
    manifest: '/site.webmanifest',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {/* SVG favicon — works in Chrome, Firefox, Edge, Safari 12+
            Place favicon.svg in your /public folder.
            Do NOT use icon.tsx — next/og breaks on Windows (drive letter URL bug). */}
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
                {/* Theme init — prevents flash of wrong theme */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(){try{var s=localStorage.getItem('theme'),d=window.matchMedia('(prefers-color-scheme: dark)').matches,t=s||(d?'dark':'light');document.documentElement.classList.toggle('dark',t==='dark')}catch(e){}})();`,
                    }}
                />
            </head>
            <body
                className="min-h-screen flex flex-col antialiased"
                style={{
                    background: 'rgb(var(--bg))',
                    color: 'rgb(var(--fg))',
                }}
            >
                <VisitTracker />
                {children}
            </body>
        </html>
    );
}

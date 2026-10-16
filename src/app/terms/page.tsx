import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
    title: 'Terms of Service | unimorpher',
    description: 'unimorpher terms of service and usage policies.',
};

export default function TermsPage() {
    return (
        <>
            <Navbar />
            <div
                className="min-h-screen py-16"
                style={{ background: 'rgb(var(--bg))' }}
            >
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1
                        className="text-4xl font-bold mb-2"
                        style={{ fontFamily: 'inherit' }}
                    >
                        Terms of Service
                    </h1>
                    <p
                        className="mb-10 text-sm"
                        style={{ color: 'rgb(var(--muted))' }}
                    >
                        Last updated: January 1, 2026
                    </p>

                    <div className="space-y-8">
                        {[
                            {
                                title: '1. Acceptance of Terms',
                                content:
                                    'By using unimorpher, you agree to these Terms of Service. If you do not agree, please do not use our service.',
                            },
                            {
                                title: '2. Service Usage',
                                content:
                                    'unimorpher provides online file conversion services. Guest users may perform up to 2 conversions per day. Registered free users may perform up to 10 conversions per day. These limits may change over time.',
                            },
                            {
                                title: '3. Prohibited Uses',
                                content:
                                    'You may not use unimorpher to convert or process illegal content, copyrighted material you do not have rights to, malware or malicious files, or content that violates applicable laws. We reserve the right to terminate accounts that violate these policies.',
                            },
                            {
                                title: '4. Intellectual Property',
                                content:
                                    'You retain full ownership of your uploaded files and converted outputs. By uploading files, you grant us a temporary license to process your files solely for the purpose of conversion. This license expires when your files are deleted (within 30 minutes).',
                            },
                            {
                                title: '5. Disclaimer of Warranties',
                                content:
                                    "unimorpher is provided 'as is' without warranties of any kind. We do not guarantee that conversions will be perfect, that the service will be uninterrupted, or that files will be retained for the full 30-minute period (though this is our aim).",
                            },
                            {
                                title: '6. Limitation of Liability',
                                content:
                                    'unimorpher shall not be liable for any indirect, incidental, or consequential damages arising from use of the service, including loss of data or files.',
                            },
                            {
                                title: '7. Changes to Terms',
                                content:
                                    'We may update these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.',
                            },
                            {
                                title: '8. Contact',
                                content:
                                    'For questions about these terms, contact us at support@fileconvert.pro.',
                            },
                        ].map((section) => (
                            <div key={section.title}>
                                <h2
                                    className="text-xl font-bold mb-3"
                                    style={{ fontFamily: 'inherit' }}
                                >
                                    {section.title}
                                </h2>
                                <p
                                    className="leading-relaxed"
                                    style={{ color: 'rgb(var(--muted))' }}
                                >
                                    {section.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

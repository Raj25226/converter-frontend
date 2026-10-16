import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield, Zap, Users, Globe } from 'lucide-react';

export const metadata: Metadata = {
    title: 'About unimorpher',
    description:
        'Learn about unimorpher, our mission, and our commitment to privacy and security.',
};

export default function AboutPage() {
    return (
        <>
            <Navbar />
            <div
                className="min-h-screen"
                style={{ background: 'rgb(var(--bg))' }}
            >
                <div
                    className="py-16"
                    style={{
                        background: 'rgb(var(--card))',
                        borderBottom: '1px solid rgb(var(--card-border))',
                    }}
                >
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1
                            className="text-3xl sm:text-4xl font-bold mb-4"
                            style={{ fontFamily: 'inherit' }}
                        >
                            About unimorpher
                        </h1>
                        <p
                            className="text-lg"
                            style={{ color: 'rgb(var(--muted))' }}
                        >
                            Fast, free, and private file conversion for everyone
                        </p>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="card p-8 mb-8">
                        <h2
                            className="text-2xl font-bold mb-4"
                            style={{ fontFamily: 'inherit' }}
                        >
                            Our Mission
                        </h2>
                        <p
                            className="leading-relaxed mb-4"
                            style={{ color: 'rgb(var(--muted))' }}
                        >
                            unimorpher was built with one goal: make file
                            conversion accessible to everyone. We believe you
                            shouldn&apos;t need to install software, pay
                            subscriptions, or sacrifice your privacy just to
                            convert a document.
                        </p>
                        <p
                            className="leading-relaxed"
                            style={{ color: 'rgb(var(--muted))' }}
                        >
                            Our platform supports the most common file
                            conversion needs — PDF, images, audio, and video —
                            with a clean, fast interface that works on any
                            device.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        {[
                            {
                                icon: Shield,
                                title: 'Privacy First',
                                desc: 'Files are auto-deleted 30 minutes after conversion. We never store or sell your data.',
                                color: 'text-emerald-500',
                                bg: 'bg-emerald-500/10',
                            },
                            {
                                icon: Zap,
                                title: 'Lightning Fast',
                                desc: 'Our optimized conversion engine processes files in seconds, not minutes.',
                                color: 'accent',
                                bg: 'surface-subtle',
                            },
                            {
                                icon: Users,
                                title: 'For Everyone',
                                desc: 'No registration required for basic use. Free accounts unlock more daily conversions.',
                                color: 'accent',
                                bg: 'surface-subtle',
                            },
                            {
                                icon: Globe,
                                title: 'Always Available',
                                desc: 'Web-based tool available 24/7 on any device — desktop, tablet, or mobile.',
                                color: 'text-orange-500',
                                bg: 'surface-subtle',
                            },
                        ].map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <div key={i} className="card p-5">
                                    <div
                                        className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center mb-3`}
                                    >
                                        <Icon
                                            className={`w-5 h-5 ${item.color}`}
                                        />
                                    </div>
                                    <h3 className="font-bold mb-2">
                                        {item.title}
                                    </h3>
                                    <p
                                        className="text-sm"
                                        style={{ color: 'rgb(var(--muted))' }}
                                    >
                                        {item.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="card p-8">
                        <h2
                            className="text-2xl font-bold mb-4"
                            style={{ fontFamily: 'inherit' }}
                        >
                            Contact Us
                        </h2>
                        <p
                            className="mb-4"
                            style={{ color: 'rgb(var(--muted))' }}
                        >
                            Have questions, feedback, or need help? We&apos;d
                            love to hear from you.
                        </p>
                        <a
                            href="mailto:support@fileconvert.pro"
                            className="inline-flex items-center gap-2 accent font-medium hover:underline"
                        >
                            support@fileconvert.pro
                        </a>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

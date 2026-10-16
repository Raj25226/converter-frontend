import { articles } from '@/lib/articles';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
    return articles.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const article = articles.find((item) => item.slug === slug);
    return { title: article?.title, description: article?.excerpt };
}
export default async function Article({ params }: Props) {
    const { slug } = await params;
    const article = articles.find((item) => item.slug === slug);
    if (!article) notFound();
    return (
        <>
            <Navbar />
            <main className="max-w-3xl mx-auto px-6 py-14 min-h-[70vh]">
                <Link href="/blog" className="nav-link">
                    ← All guides
                </Link>
                <p className="accent text-sm font-semibold mt-8 mb-3">
                    {article.category}
                </p>
                <h1 className="text-4xl font-bold mb-5">{article.title}</h1>
                <p
                    className="text-lg mb-8"
                    style={{ color: 'rgb(var(--muted))' }}
                >
                    {article.excerpt}
                </p>
                <div className="space-y-6 leading-relaxed">
                    {article.paragraphs.map((text) => (
                        <p key={text}>{text}</p>
                    ))}
                </div>
                <Link
                    href={article.tool}
                    className="btn btn-primary px-6 py-3 mt-10"
                >
                    Open converter →
                </Link>
            </main>
            <Footer />
        </>
    );
}

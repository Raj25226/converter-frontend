import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Calendar, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog – File Conversion Tips & Guides | unimorpher",
  description: "Tips, tutorials, and guides for file conversion. Learn how to convert PDF, images, video, and audio files.",
};

import { articles as posts } from "@/lib/articles";

const categoryColors: Record<string, string> = {
  PDF: "badge-blue",
  Images: "badge-green",
  Audio: "badge-purple",
  Documents: "badge-orange",
};

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen" style={{ background: "rgb(var(--bg))" }}>
        <div className="py-16" style={{ background: "rgb(var(--card))", borderBottom: "1px solid rgb(var(--card-border))" }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "inherit" }}>
              File Conversion Blog
            </h1>
            <p className="text-lg" style={{ color: "rgb(var(--muted))" }}>
              Tips, guides, and best practices for file conversion
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid gap-6">
            {posts.map((post) => (
              <article key={post.slug} className="card p-6 card-hover group">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`badge ${categoryColors[post.category] || "badge-blue"}`}>{post.category}</span>
                      <div className="flex items-center gap-3 text-xs" style={{ color: "rgb(var(--muted))" }}>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                      </div>
                    </div>
                    <h2 className="text-xl font-bold mb-2 group-hover:text-[rgb(var(--primary))] transition-colors">{post.title}</h2>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: "rgb(var(--muted))" }}>{post.excerpt}</p>
                    <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold accent hover:text-[rgb(var(--primary))] transition-colors">
                      Read more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Calendar, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog – File Conversion Tips & Guides | unimorpher",
  description: "Tips, tutorials, and guides for file conversion. Learn how to convert PDF, images, video, and audio files.",
};

const posts = [
  { slug: "pdf-to-word-guide", title: "How to Convert PDF to Word Without Losing Formatting", excerpt: "A complete guide to converting PDF files to editable Word documents while preserving your original formatting, fonts, and images.", date: "2026-01-15", readTime: "5 min read", category: "PDF" },
  { slug: "compress-images-web", title: "Best Practices for Compressing Images for the Web", excerpt: "Learn how to reduce image file sizes without sacrificing quality. We cover WebP, JPEG, and PNG optimization techniques.", date: "2026-01-10", readTime: "7 min read", category: "Images" },
  { slug: "heic-to-jpg", title: "What is HEIC? How to Convert iPhone Photos to JPG", excerpt: "HEIC is Apple's image format used on iPhone and iPad. Learn what it is and how to convert HEIC files to JPG for wider compatibility.", date: "2026-01-05", readTime: "4 min read", category: "Images" },
  { slug: "extract-audio-video", title: "How to Extract Audio from Video Files (MP4 to MP3)", excerpt: "Step-by-step guide to extracting high-quality audio from any video format. Perfect for creating podcasts or music files.", date: "2025-12-28", readTime: "6 min read", category: "Audio" },
  { slug: "excel-to-pdf-tips", title: "Converting Excel to PDF: Tips for Perfect Results", excerpt: "Avoid common issues when converting Excel spreadsheets to PDF. Learn how to handle large sheets, charts, and formatting.", date: "2025-12-20", readTime: "5 min read", category: "Documents" },
  { slug: "webp-format-guide", title: "WebP Format Explained: Why You Should Use It", excerpt: "WebP is Google's modern image format that delivers smaller file sizes with better quality. Here's everything you need to know.", date: "2025-12-15", readTime: "6 min read", category: "Images" },
];

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
            <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
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
                    <h2 className="text-xl font-bold mb-2 group-hover:text-blue-500 transition-colors">{post.title}</h2>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: "rgb(var(--muted))" }}>{post.excerpt}</p>
                    <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-500 hover:text-blue-600 transition-colors">
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

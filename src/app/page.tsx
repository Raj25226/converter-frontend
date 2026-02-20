"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText, Image, Music, FileSpreadsheet, ArrowRight, Zap, Shield, Smartphone,
  Clock, Presentation, FileImage, FileArchive, Scissors,
} from "lucide-react";
import Analytics from "@/components/Analytics";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { isAdmin } from "@/lib/auth";

const converters = [
  { title: "PDF to Word", description: "Convert PDFs to editable Word files", icon: FileText, url: "/pdf-to-word", gradient: "from-blue-500 to-blue-600", badge: "Popular" },
  { title: "Word to PDF", description: "Convert Word docs to PDF format", icon: FileText, url: "/word-to-pdf", gradient: "from-indigo-500 to-blue-600", badge: "Essential" },
  { title: "JPG to PNG", description: "Convert JPG images to PNG", icon: Image, url: "/jpg-to-png", gradient: "from-emerald-500 to-green-600", badge: "Fast" },
  { title: "PNG to JPG", description: "Convert PNG images to JPG", icon: Image, url: "/png-to-jpg", gradient: "from-teal-500 to-cyan-600", badge: "Quality" },
  { title: "JPG to WebP", description: "Convert JPG to modern WebP format", icon: Image, url: "/jpg-to-webp", gradient: "from-sky-500 to-blue-600", badge: "Modern" },
  { title: "MP4 to MP3", description: "Extract audio from video files", icon: Music, url: "/mp4-to-mp3", gradient: "from-violet-500 to-purple-600", badge: "HD Audio" },
  { title: "Excel to PDF", description: "Convert spreadsheets to PDF", icon: FileSpreadsheet, url: "/excel-to-pdf", gradient: "from-orange-500 to-amber-600", badge: "Pro" },
  { title: "PDF to Excel", description: "Extract tables from PDF to Excel", icon: FileSpreadsheet, url: "/pdf-to-excel", gradient: "from-green-600 to-emerald-600", badge: "Smart" },
  { title: "PPT to PDF", description: "Convert PowerPoint to PDF", icon: Presentation, url: "/ppt-to-pdf", gradient: "from-red-500 to-rose-600", badge: "Pro" },
  { title: "HEIC to JPG", description: "Convert iPhone HEIC images", icon: FileImage, url: "/heic-to-jpg", gradient: "from-indigo-500 to-violet-600", badge: "iOS" },
  { title: "WebP to PNG", description: "Convert WebP to PNG format", icon: Image, url: "/webp-to-png", gradient: "from-cyan-500 to-blue-600", badge: "Modern" },
  { title: "MP4 to GIF", description: "Convert video clips to GIF", icon: Music, url: "/mp4-to-gif", gradient: "from-pink-500 to-rose-600", badge: "Fun" },
  { title: "WAV to MP3", description: "Convert WAV audio to MP3", icon: Music, url: "/wav-to-mp3", gradient: "from-violet-600 to-indigo-600", badge: "Audio" },
  { title: "ZIP Extract", description: "Extract ZIP archives online", icon: FileArchive, url: "/zip-extract", gradient: "from-amber-500 to-orange-600", badge: "Utility" },
  { title: "File Compress", description: "Compress and reduce file size", icon: Scissors, url: "/file-compress", gradient: "from-slate-600 to-gray-700", badge: "Save space" },
];

const categories = [
  { name: "Documents", tools: converters.filter(c => ["pdf-to-word","word-to-pdf","pdf-to-excel","ppt-to-pdf","excel-to-pdf"].some(t => c.url.includes(t))) },
  { name: "Images", tools: converters.filter(c => ["jpg","png","webp","heic"].some(t => c.url.includes(t))) },
  { name: "Media & Utilities", tools: converters.filter(c => ["mp4","wav","zip","compress","gif"].some(t => c.url.includes(t))) },
];

const features = [
  { icon: Zap, title: "Lightning Fast", description: "Convert files in seconds with our optimized engine", color: "text-blue-500", bg: "bg-blue-500/10" },
  { icon: Shield, title: "Secure & Private", description: "Files auto-deleted after 30 minutes. Zero permanent storage.", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { icon: Smartphone, title: "Mobile Friendly", description: "Works perfectly on any device — desktop, tablet, or mobile", color: "text-violet-500", bg: "bg-violet-500/10" },
  { icon: Clock, title: "No Registration", description: "Start converting instantly. No account needed for basic use.", color: "text-orange-500", bg: "bg-orange-500/10" },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Is unimorpher free?", acceptedAnswer: { "@type": "Answer", text: "Yes! Guests get 2 free conversions per day. Sign in for 10 per day." } },
    { "@type": "Question", name: "Are my files secure?", acceptedAnswer: { "@type": "Answer", text: "Absolutely. Files are encrypted in transit and automatically deleted 30 minutes after conversion." } },
    { "@type": "Question", name: "What is the file size limit?", acceptedAnswer: { "@type": "Answer", text: "Free users can upload files up to 50MB. Pro users get higher limits." } },
  ],
};

export default function Home() {
  // Check admin status client-side (localStorage is only available in browser)
  const [adminUser, setAdminUser] = useState(false);

  useEffect(() => {
    setAdminUser(isAdmin());
  }, []);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-24" style={{ background: "rgb(var(--bg))" }}>
        {/* Blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10 animate-blob" style={{ background: "radial-gradient(circle, #3b82f6, #8b5cf6)" }} />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-10 animate-blob animation-delay-2000" style={{ background: "radial-gradient(circle, #10b981, #3b82f6)" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in" style={{ background: "rgb(var(--card))", border: "1px solid rgb(var(--card-border))" }}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span style={{ color: "rgb(var(--muted))" }}>Free for everyone · No signup required</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight animate-slide-up" style={{ fontFamily: "Syne, sans-serif" }}>
            Convert Files
            <span className="block bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Instantly & Free
            </span>
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 animate-slide-up" style={{ color: "rgb(var(--muted))" }}>
            PDF, images, videos, audio — convert any file format with ease. Fast, secure, and private.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
            <Link href="#converters" className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-semibold hover:shadow-xl hover:-translate-y-0.5 transition-all">
              Start Converting <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/signup" className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold transition-all hover:-translate-y-0.5" style={{ background: "rgb(var(--card))", border: "1px solid rgb(var(--card-border))" }}>
              Get 10 free/day →
            </Link>
          </div>
        </div>
      </section>

      {/* Analytics — admin only, completely hidden from guests and regular users */}
      {adminUser && (
        <section className="py-10" style={{ background: "rgb(var(--card))", borderTop: "1px solid rgb(var(--card-border))", borderBottom: "1px solid rgb(var(--card-border))" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Analytics />
          </div>
        </section>
      )}

      {/* Converters by category */}
      <section id="converters" className="py-16" style={{ background: "rgb(var(--bg))" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {categories.map((cat, ci) => (
            <div key={cat.name} className={ci > 0 ? "mt-14" : ""}>
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "Syne, sans-serif" }}>{cat.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {cat.tools.map((c, i) => {
                  const Icon = c.icon;
                  return (
                    <Link key={c.url} href={c.url} className="group animate-scale-in" style={{ animationDelay: `${i * 40}ms` }}>
                      <div className="card card-hover h-full p-5 relative overflow-hidden">
                        <div className="absolute top-3 right-3">
                          <span className="badge badge-blue text-xs">{c.badge}</span>
                        </div>
                        <div className={`w-11 h-11 bg-gradient-to-br ${c.gradient} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-bold text-sm mb-1 group-hover:text-blue-500 transition-colors">{c.title}</h3>
                        <p className="text-xs leading-relaxed mb-3" style={{ color: "rgb(var(--muted))" }}>{c.description}</p>
                        <div className="flex items-center text-blue-500 font-semibold text-xs">
                          Convert <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} opacity-0 group-hover:opacity-5 transition-opacity rounded-2xl`} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16" style={{ background: "rgb(var(--card))", borderTop: "1px solid rgb(var(--card-border))" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "Syne, sans-serif" }}>Why unimorpher?</h2>
            <p style={{ color: "rgb(var(--muted))" }}>Built for speed, privacy, and simplicity</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="card p-6 text-center card-hover animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className={`${f.bg} w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`w-6 h-6 ${f.color}`} />
                  </div>
                  <h3 className="font-bold mb-2">{f.title}</h3>
                  <p className="text-sm" style={{ color: "rgb(var(--muted))" }}>{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16" style={{ background: "rgb(var(--bg))" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "Syne, sans-serif" }}>How It Works</h2>
            <p style={{ color: "rgb(var(--muted))" }}>Three simple steps to convert your files</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { n: "1", title: "Upload", desc: "Select or drag & drop your file. Supported formats shown on each converter page." },
              { n: "2", title: "Convert", desc: "Click convert and our engine processes your file in seconds." },
              { n: "3", title: "Download", desc: "Download your converted file instantly. It auto-deletes after 30 minutes." },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-lg" style={{ fontFamily: "Syne, sans-serif" }}>
                  {step.n}
                </div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-sm" style={{ color: "rgb(var(--muted))" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ background: "rgb(var(--card))", borderTop: "1px solid rgb(var(--card-border))" }}>
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "Syne, sans-serif" }}>Sign up for more conversions</h2>
          <p className="mb-8" style={{ color: "rgb(var(--muted))" }}>Free accounts get 10 conversions/day. No credit card needed.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-semibold hover:shadow-xl hover:-translate-y-0.5 transition-all">
              Create Free Account
            </Link>
            <Link href="/login" className="px-8 py-4 rounded-xl font-semibold transition-all" style={{ background: "rgb(var(--bg))", border: "1px solid rgb(var(--card-border))" }}>
              Already have an account?
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16" style={{ background: "rgb(var(--bg))" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ fontFamily: "Syne, sans-serif" }}>FAQ</h2>
          <div className="space-y-4">
            {[
              { q: "Is unimorpher free?", a: "Yes! Guests get 2 free conversions per day. Create a free account to get 10 per day. No credit card required." },
              { q: "Are my files safe?", a: "Absolutely. All file transfers are encrypted (SSL). Files are automatically deleted 30 minutes after conversion and never shared or used for training." },
              { q: "What file size limit applies?", a: "Free users can upload files up to 50MB. Pro plan users enjoy higher size limits." },
              { q: "What formats are supported?", a: "We support PDF, DOCX, XLSX, PPTX, JPG, PNG, WEBP, HEIC, MP4, MP3, WAV, GIF, and ZIP formats." },
              { q: "Do I need to install software?", a: "No! unimorpher works entirely in your browser. No downloads or installations required." },
            ].map((item, i) => (
              <div key={i} className="card p-5">
                <p className="font-semibold mb-2">{item.q}</p>
                <p className="text-sm" style={{ color: "rgb(var(--muted))" }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
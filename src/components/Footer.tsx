"use client";
import Link from "next/link";
import { Shield, Clock, Zap, Mail, Github, Twitter } from "lucide-react";

const converterLinks = [
  { label: "PDF to Word", href: "/pdf-to-word" },
  { label: "Word to PDF", href: "/word-to-pdf" },
  { label: "PDF to Excel", href: "/pdf-to-excel" },
  { label: "PPT to PDF", href: "/ppt-to-pdf" },
  { label: "Excel to PDF", href: "/excel-to-pdf" },
];

const imageLinks = [
  { label: "JPG to PNG", href: "/jpg-to-png" },
  { label: "PNG to JPG", href: "/png-to-jpg" },
  { label: "JPG to WebP", href: "/jpg-to-webp" },
  { label: "HEIC to JPG", href: "/heic-to-jpg" },
  { label: "WebP to PNG", href: "/webp-to-png" },
];

const mediaLinks = [
  { label: "MP4 to MP3", href: "/mp4-to-mp3" },
  { label: "MP4 to GIF", href: "/mp4-to-gif" },
  { label: "WAV to MP3", href: "/wav-to-mp3" },
  { label: "ZIP Extract", href: "/zip-extract" },
  { label: "File Compress", href: "/file-compress" },
];

export default function Footer() {
  return (
    <footer style={{ background: "rgb(var(--card))", borderTop: "1px solid rgb(var(--card-border))" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">FC</span>
              </div>
              <span className="font-bold text-lg" style={{ fontFamily: "Syne, sans-serif" }}>
                FileConvert Pro
              </span>
            </div>
            <p className="text-sm mb-6" style={{ color: "rgb(var(--muted))" }}>
              Professional file conversion for everyone. Fast, secure, and private. No file is ever stored permanently.
            </p>
            <div className="space-y-2">
              {[
                { icon: Shield, text: "256-bit SSL Encryption" },
                { icon: Clock, text: "Auto-delete after 30 minutes" },
                { icon: Zap, text: "GDPR & Privacy Compliant" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-xs" style={{ color: "rgb(var(--muted))" }}>
                  <Icon className="w-3.5 h-3.5 text-blue-500" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-6">
              <a href="mailto:support@fileconvert.pro" className="p-2 rounded-lg transition-colors hover:text-blue-500" style={{ color: "rgb(var(--muted))", border: "1px solid rgb(var(--card-border))" }}>
                <Mail className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg transition-colors hover:text-blue-500" style={{ color: "rgb(var(--muted))", border: "1px solid rgb(var(--card-border))" }}>
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg transition-colors hover:text-blue-500" style={{ color: "rgb(var(--muted))", border: "1px solid rgb(var(--card-border))" }}>
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Document converters */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Documents</h4>
            <ul className="space-y-2.5">
              {converterLinks.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm transition-colors hover:text-blue-500" style={{ color: "rgb(var(--muted))" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Image converters */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Images</h4>
            <ul className="space-y-2.5">
              {imageLinks.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm transition-colors hover:text-blue-500" style={{ color: "rgb(var(--muted))" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Media & Company */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Media & Utilities</h4>
            <ul className="space-y-2.5 mb-6">
              {mediaLinks.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm transition-colors hover:text-blue-500" style={{ color: "rgb(var(--muted))" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="font-semibold text-sm mb-3">Company</h4>
            <ul className="space-y-2.5">
              {[
                { label: "About", href: "/about" },
                { label: "Blog", href: "/blog" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Contact", href: "/contact" },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm transition-colors hover:text-blue-500" style={{ color: "rgb(var(--muted))" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-3" style={{ borderTop: "1px solid rgb(var(--card-border))" }}>
          <p className="text-xs" style={{ color: "rgb(var(--muted))" }}>
            &copy; {new Date().getFullYear()} FileConvert Pro. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs hover:text-blue-500 transition-colors" style={{ color: "rgb(var(--muted))" }}>Privacy</Link>
            <Link href="/terms" className="text-xs hover:text-blue-500 transition-colors" style={{ color: "rgb(var(--muted))" }}>Terms</Link>
            <Link href="/sitemap.xml" className="text-xs hover:text-blue-500 transition-colors" style={{ color: "rgb(var(--muted))" }}>Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

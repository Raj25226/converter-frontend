"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Home, ArrowLeft, FileQuestion, Search } from "lucide-react";

// Popular tools to suggest on 404
const POPULAR_TOOLS = [
  { label: "PDF → Word", href: "/pdf-to-word" },
  { label: "Word → PDF", href: "/word-to-pdf" },
  { label: "JPG → PNG", href: "/jpg-to-png" },
  { label: "MP4 → MP3", href: "/mp4-to-mp3" },
  { label: "Image Compress", href: "/compress-image" },
  { label: "ZIP Extract", href: "/zip-extract" },
];

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "rgb(var(--bg))", color: "rgb(var(--fg))" }}
    >
      {/* Simple top bar */}
      <nav
        className="border-b px-6 py-4 flex items-center justify-between"
        style={{ borderColor: "rgb(var(--card-border))" }}
      >
        <Link href="/" className="flex items-center gap-2 font-bold text-lg" style={{ fontFamily: "Syne, sans-serif" }}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">FC</span>
          </div>
          FileConvert <span className="text-blue-500 ml-1">Pro</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </nav>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full text-center">

          {/* Animated 404 graphic */}
          <div className="relative mb-8 flex items-center justify-center">
            <div
              className="w-40 h-40 rounded-3xl flex items-center justify-center relative"
              style={{ background: "rgb(var(--card))", border: "2px dashed rgb(var(--card-border))" }}
            >
              <FileQuestion
                className="w-20 h-20"
                style={{ color: "rgb(var(--muted))", opacity: 0.5 }}
              />
              {/* Floating badge */}
              <div className="absolute -top-3 -right-3 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-xs font-bold">!</span>
              </div>
            </div>
          </div>

          {/* Error code */}
          <div className="mb-3">
            <span
              className="text-8xl font-black bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              404
            </span>
          </div>

          {/* Heading */}
          <h1
            className="text-2xl md:text-3xl font-bold mb-3"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Page Not Found
          </h1>

          {/* Message */}
          <p className="text-base md:text-lg mb-2" style={{ color: "rgb(var(--muted))" }}>
            Looks like this page got lost during conversion! 😄
          </p>
          <p className="text-sm mb-8" style={{ color: "rgb(var(--muted))" }}>
            The page you're looking for doesn't exist, may have been moved, or the link might be broken.
            Don't worry — all your favourite conversion tools are just one click away.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <Home className="w-4 h-4" />
              Go to Homepage
            </Link>
            <Link
              href="/#converters"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-xl transition-all duration-200"
              style={{
                background: "rgb(var(--card))",
                border: "1px solid rgb(var(--card-border))",
                color: "rgb(var(--fg))",
              }}
            >
              <Search className="w-4 h-4" />
              Browse All Tools
            </Link>
          </div>

          {/* Popular tools */}
          <div
            className="rounded-2xl p-6"
            style={{ background: "rgb(var(--card))", border: "1px solid rgb(var(--card-border))" }}
          >
            <p className="text-sm font-semibold mb-4" style={{ color: "rgb(var(--muted))" }}>
              POPULAR TOOLS YOU MIGHT NEED
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {POPULAR_TOOLS.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="px-3 py-2 text-sm font-medium rounded-lg text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-center"
                >
                  {tool.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Help text */}
          <p className="mt-8 text-sm" style={{ color: "rgb(var(--muted))" }}>
            If you believe this is a mistake, please{" "}
            <Link href="/contact" className="text-blue-500 hover:underline">
              contact us
            </Link>{" "}
            or report the broken link.
          </p>
        </div>
      </main>
    </div>
  );
}
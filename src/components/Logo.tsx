"use client";

import React from "react";

interface LogoProps {
  size?: number;
  showWordmark?: boolean;
  animated?: boolean;
  className?: string;
}

export default function Logo({
  size = 36,
  showWordmark = true,
  animated = true,
  className = "",
}: LogoProps) {
  // Unique ID per instance so multiple logos on a page don't clash
  const uid = React.useId().replace(/:/g, "u");

  return (
    <span
      className={`inline-flex items-center gap-2.5 select-none ${className}`}
      aria-label="UniMorpher"
    >
      {/* ── SVG Icon Mark ── */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <defs>
          <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#6366f1" />
            <stop offset="50%"  stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>

          <linearGradient id={`shine-${uid}`} x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#fff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>

          {animated && (
            <style>{`
              @keyframes umArrowR-${uid} {
                0%,100% { transform: translateX(0px); opacity: 1; }
                40%     { transform: translateX(4px);  opacity: 0; }
                41%     { transform: translateX(-4px); opacity: 0; }
                80%     { transform: translateX(0px);  opacity: 1; }
              }
              @keyframes umArrowL-${uid} {
                0%,100% { transform: translateX(0px); opacity: 1; }
                40%     { transform: translateX(-4px); opacity: 0; }
                41%     { transform: translateX(4px);  opacity: 0; }
                80%     { transform: translateX(0px);  opacity: 1; }
              }
              .um-r-${uid} { animation: umArrowR-${uid} 2.6s ease-in-out infinite; }
              .um-l-${uid} { animation: umArrowL-${uid} 2.6s ease-in-out 0.13s infinite; }
            `}</style>
          )}
        </defs>

        {/* Background pill */}
        <rect width="64" height="64" rx="16" fill={`url(#bg-${uid})`} />
        <rect width="64" height="64" rx="16" fill={`url(#shine-${uid})`} />

        {/* Left document */}
        <rect x="9" y="14" width="20" height="26" rx="3" fill="white" fillOpacity="0.25" />
        {/* dog-ear corner */}
        <path d="M23 14 L29 20 H23 V14Z" fill="white" fillOpacity="0.4" />
        {/* document lines */}
        <rect x="12" y="24" width="11" height="2"   rx="1" fill="white" fillOpacity="0.75" />
        <rect x="12" y="28.5" width="8" height="2"  rx="1" fill="white" fillOpacity="0.5" />
        <rect x="12" y="33" width="10" height="2"   rx="1" fill="white" fillOpacity="0.5" />

        {/* Right document */}
        <rect x="35" y="24" width="20" height="26" rx="3" fill="white" fillOpacity="0.25" />
        <path d="M49 24 L55 30 H49 V24Z" fill="white" fillOpacity="0.4" />
        <rect x="38" y="34" width="11" height="2"   rx="1" fill="white" fillOpacity="0.75" />
        <rect x="38" y="38.5" width="8" height="2"  rx="1" fill="white" fillOpacity="0.5" />
        <rect x="38" y="43" width="10" height="2"   rx="1" fill="white" fillOpacity="0.5" />

        {/* Conversion arrows */}
        <g className={animated ? `um-r-${uid}` : ""}>
          <line x1="28" y1="29" x2="36" y2="29" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
          <polyline points="33,26 36.5,29 33,32" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
        <g className={animated ? `um-l-${uid}` : ""}>
          <line x1="28" y1="36" x2="36" y2="36" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
          <polyline points="31,33 27.5,36 31,39" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
      </svg>

      {/* ── Wordmark ── */}
      {showWordmark && (
        <span
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: size * 0.5,
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          <span style={{ color: "rgb(var(--fg))" }}>uni</span>
          <span
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            morpher
          </span>
        </span>
      )}
    </span>
  );
}
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Moon, Sun, LogIn, LogOut, User, LayoutDashboard, Menu, X, Shield } from "lucide-react";
import { getUser, logout, User as UserType } from "@/lib/auth";
import { getInitialTheme, applyTheme, Theme } from "@/lib/theme";
import { getRemainingQuota } from "@/lib/quota";

export default function Navbar() {
  const [user, setUser] = useState<UserType | null>(null);
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [quota, setQuota] = useState({ remaining: 0, limit: 0 });

  useEffect(() => {
    setMounted(true);
    const u = getUser();
    setUser(u);
    const t = getInitialTheme();
    setTheme(t);
    applyTheme(t);
    const q = getRemainingQuota(!!u);
    setQuota({ remaining: q.remaining, limit: q.limit });
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    applyTheme(next);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    window.location.href = "/";
  };

  if (!mounted) return null;

  return (
    <nav
      className="sticky top-0 z-50 border-b backdrop-blur-xl"
      style={{
        background: "rgba(var(--bg), 0.85)",
        borderColor: "rgb(var(--card-border))",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">FC</span>
            </div>
            <span className="font-bold text-lg" style={{ fontFamily: "Syne, sans-serif" }}>
              FileConvert <span className="text-blue-500">Pro</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/#converters" className="nav-link">Tools</Link>
            <Link href="/blog" className="nav-link">Blog</Link>
            <Link href="/about" className="nav-link">About</Link>

            {/* Quota indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "rgb(var(--card))", border: "1px solid rgb(var(--card-border))" }}>
              <span className="text-xs" style={{ color: "rgb(var(--muted))" }}>
                {quota.remaining}/{quota.limit} conversions left
              </span>
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-colors"
              style={{ background: "rgb(var(--card))", border: "1px solid rgb(var(--card-border))" }}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4" style={{ color: "rgb(var(--muted))" }} />
              )}
            </button>

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-2">
                {user.role === "admin" && (
                  <Link href="/admin" className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-amber-600 dark:text-amber-400 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors">
                    <Shield className="w-4 h-4" /> Admin
                  </Link>
                )}
                <Link href="/dashboard" className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors nav-link">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <Link href="/profile" className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg" style={{ background: "rgb(var(--card))", border: "1px solid rgb(var(--card-border))" }}>
                  {user.picture ? (
                    <img src={user.picture} alt={user.firstName} className="w-5 h-5 rounded-full" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  <span style={{ color: "rgb(var(--fg))" }}>{user.firstName}</span>
                </Link>
                <button onClick={handleLogout} className="p-2 rounded-lg transition-colors nav-link" title="Logout">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="px-4 py-2 text-sm font-medium rounded-xl transition-all nav-link">
                  Log in
                </Link>
                <Link href="/signup" className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <button onClick={toggleTheme} className="p-2 rounded-lg" style={{ background: "rgb(var(--card))" }} aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" style={{ color: "rgb(var(--muted))" }} />}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-lg" style={{ background: "rgb(var(--card))" }}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t" style={{ borderColor: "rgb(var(--card-border))" }}>
            <div className="flex flex-col gap-2">
              <Link href="/#converters" className="px-3 py-2 text-sm nav-link" onClick={() => setMenuOpen(false)}>Tools</Link>
              <Link href="/blog" className="px-3 py-2 text-sm nav-link" onClick={() => setMenuOpen(false)}>Blog</Link>
              <Link href="/about" className="px-3 py-2 text-sm nav-link" onClick={() => setMenuOpen(false)}>About</Link>
              {user ? (
                <>
                  <Link href="/dashboard" className="px-3 py-2 text-sm nav-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                  <Link href="/profile" className="px-3 py-2 text-sm nav-link" onClick={() => setMenuOpen(false)}>Profile</Link>
                  <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="px-3 py-2 text-sm text-left nav-link">Logout</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="px-3 py-2 text-sm nav-link" onClick={() => setMenuOpen(false)}>Log in</Link>
                  <Link href="/signup" className="mx-3 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl text-center" onClick={() => setMenuOpen(false)}>Sign up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

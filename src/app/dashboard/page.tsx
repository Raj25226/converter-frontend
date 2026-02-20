"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Download, Trash2, Clock, FileCheck, ArrowLeft, AlertCircle, BarChart3, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getUser, getConversionHistory, deleteConversionRecord, clearConversionHistory, ConversionRecord } from "@/lib/auth";
import { getRemainingQuota } from "@/lib/quota";

function timeLeft(expiresAt: number): string {
  const diff = expiresAt - Date.now();
  if (diff <= 0) return "Expired";
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "< 1 min";
  return `${mins} min${mins !== 1 ? "s" : ""}`;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString();
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [history, setHistory] = useState<ConversionRecord[]>([]);
  const [quota, setQuota] = useState({ used: 0, limit: 0, remaining: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const u = getUser();
    setUser(u);
    const h = getConversionHistory();
    setHistory(h);
    const q = getRemainingQuota(!!u);
    setQuota(q);
    // Refresh every minute
    const interval = setInterval(() => {
      setHistory(getConversionHistory());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = (id: string) => {
    deleteConversionRecord(id);
    setHistory(getConversionHistory());
  };

  const handleClearAll = () => {
    if (confirm("Clear all conversion history?")) {
      clearConversionHistory();
      setHistory([]);
    }
  };

  if (!mounted) return null;

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
          <Lock className="w-12 h-12 text-blue-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "Syne, sans-serif" }}>Login Required</h1>
          <p className="mb-6" style={{ color: "rgb(var(--muted))" }}>Sign in to view your conversion dashboard</p>
          <div className="flex gap-3">
            <Link href="/login" className="btn btn-primary px-6 py-3">Log in</Link>
            <Link href="/signup" className="btn btn-secondary px-6 py-3">Sign up</Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const quotaPct = quota.limit > 0 ? (quota.used / quota.limit) * 100 : 0;

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-10" style={{ background: "rgb(var(--bg))" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-sm mb-4 nav-link">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "Syne, sans-serif" }}>
              Welcome, {user.firstName} 👋
            </h1>
            <p style={{ color: "rgb(var(--muted))" }}>Manage your conversions and account</p>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                </div>
                <span className="font-semibold text-sm">Daily Usage</span>
              </div>
              <div className="text-3xl font-bold mb-2" style={{ fontFamily: "Syne, sans-serif" }}>{quota.used}/{quota.limit}</div>
              <div className="quota-bar mb-1">
                <div className="quota-bar-fill" style={{ width: `${quotaPct}%` }} />
              </div>
              <p className="text-xs" style={{ color: "rgb(var(--muted))" }}>{quota.remaining} conversions left today</p>
            </div>
            <div className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <FileCheck className="w-5 h-5 text-emerald-500" />
                </div>
                <span className="font-semibold text-sm">Total Conversions</span>
              </div>
              <div className="text-3xl font-bold" style={{ fontFamily: "Syne, sans-serif" }}>{history.length}</div>
              <p className="text-xs" style={{ color: "rgb(var(--muted))" }}>In your history</p>
            </div>
            <div className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-violet-500" />
                </div>
                <span className="font-semibold text-sm">Account Plan</span>
              </div>
              <div className="text-xl font-bold mb-1" style={{ fontFamily: "Syne, sans-serif" }}>Free</div>
              <Link href="#" className="text-xs text-blue-500 hover:underline">Upgrade to Pro →</Link>
            </div>
          </div>

          {/* Conversion history */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg" style={{ fontFamily: "Syne, sans-serif" }}>Conversion History</h2>
              {history.length > 0 && (
                <button onClick={handleClearAll} className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1">
                  <Trash2 className="w-3.5 h-3.5" /> Clear All
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="text-center py-16">
                <FileCheck className="w-12 h-12 mx-auto mb-3" style={{ color: "rgb(var(--card-border))" }} />
                <p className="font-medium mb-1">No conversions yet</p>
                <p className="text-sm" style={{ color: "rgb(var(--muted))" }}>
                  Your recent conversions will appear here
                </p>
                <Link href="/#converters" className="inline-block mt-4 text-sm text-blue-500 hover:underline">
                  Start converting →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map(record => (
                  <div key={record.id} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: "rgb(var(--bg))", border: "1px solid rgb(var(--card-border))" }}>
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileCheck className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{record.fileName}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs" style={{ color: "rgb(var(--muted))" }}>{formatDate(record.timestamp)}</span>
                        <span className="badge badge-blue text-xs">{record.type}</span>
                        <span className="text-xs flex items-center gap-0.5" style={{ color: "rgb(var(--muted))" }}>
                          <Clock className="w-3 h-3" /> {timeLeft(record.expiresAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {record.downloadUrl && timeLeft(record.expiresAt) !== "Expired" && (
                        <a href={record.downloadUrl} className="p-2 rounded-lg hover:text-blue-500 transition-colors" style={{ color: "rgb(var(--muted))" }} title="Download">
                          <Download className="w-4 h-4" />
                        </a>
                      )}
                      <button onClick={() => handleDelete(record.id)} className="p-2 rounded-lg hover:text-red-500 transition-colors" style={{ color: "rgb(var(--muted))" }} title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info banner */}
          <div className="mt-4 p-4 rounded-xl flex items-start gap-3" style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)" }}>
            <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs" style={{ color: "rgb(var(--muted))" }}>
              Converted files are automatically deleted from our servers 30 minutes after conversion. Download links expire accordingly.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

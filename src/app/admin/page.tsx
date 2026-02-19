"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, FileCheck, Globe, TrendingUp, Shield, ArrowLeft, BarChart3, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getUser, getToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const u = getUser();
    if (!u || u.role !== "admin") { router.push("/"); return; }
    setUser(u);
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        fetch("/api/admin/stats", { headers: { Authorization: `Bearer ${getToken()}` } }),
        fetch("/api/admin/users?limit=20", { headers: { Authorization: `Bearer ${getToken()}` } }),
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (usersRes.ok) setUsers((await usersRes.json()).users || []);
    } catch {}
    finally { setLoading(false); }
  };

  if (!mounted) return null;

  if (!user || user.role !== "admin") {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
          <Shield className="w-12 h-12 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="mb-6" style={{ color: "rgb(var(--muted))" }}>Admin access required</p>
          <Link href="/" className="btn btn-primary px-6 py-3">Go Home</Link>
        </div>
        <Footer />
      </>
    );
  }

  const statCards = [
    { icon: Globe, label: "Total Visits", value: stats?.totalVisits ?? "—", color: "text-blue-500", bg: "bg-blue-500/10" },
    { icon: FileCheck, label: "Total Conversions", value: stats?.totalConversions ?? "—", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { icon: Users, label: "Registered Users", value: stats?.totalUsers ?? "—", color: "text-violet-500", bg: "bg-violet-500/10" },
    { icon: TrendingUp, label: "Conversion Rate", value: stats ? `${stats.conversionRate?.toFixed(1)}%` : "—", color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  const toolStats = stats?.toolStats || [
    { tool: "pdf-to-word", count: 0 },
    { tool: "jpg-to-png", count: 0 },
    { tool: "mp4-to-mp3", count: 0 },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-10" style={{ background: "rgb(var(--bg))" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link href="/" className="inline-flex items-center gap-2 text-sm mb-3 nav-link">
                <ArrowLeft className="w-4 h-4" /> Back to Home
              </Link>
              <h1 className="text-3xl font-bold flex items-center gap-2" style={{ fontFamily: "Syne, sans-serif" }}>
                <Shield className="w-7 h-7 text-amber-500" /> Admin Dashboard
              </h1>
            </div>
            <span className="badge badge-orange">Admin</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[1,2,3,4].map(i => <div key={i} className="card p-6 animate-pulse h-24" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statCards.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="card p-5">
                    <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                      <Icon className={`w-5 h-5 ${s.color}`} />
                    </div>
                    <div className="text-2xl font-bold mb-0.5" style={{ fontFamily: "Syne, sans-serif" }}>{typeof s.value === "number" ? s.value.toLocaleString() : s.value}</div>
                    <div className="text-xs" style={{ color: "rgb(var(--muted))" }}>{s.label}</div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Tool usage */}
            <div className="card p-6">
              <h2 className="font-bold mb-5 flex items-center gap-2" style={{ fontFamily: "Syne, sans-serif" }}>
                <BarChart3 className="w-5 h-5 text-blue-500" /> Tool Usage
              </h2>
              {toolStats.length === 0 ? (
                <p className="text-sm" style={{ color: "rgb(var(--muted))" }}>No data yet</p>
              ) : (
                <div className="space-y-3">
                  {toolStats.map((t: any, i: number) => {
                    const maxCount = Math.max(...toolStats.map((x: any) => x.count), 1);
                    const pct = Math.round((t.count / maxCount) * 100);
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="font-medium">{t.tool}</span>
                          <span style={{ color: "rgb(var(--muted))" }}>{t.count}</span>
                        </div>
                        <div className="quota-bar">
                          <div className="quota-bar-fill" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent users */}
            <div className="card p-6">
              <h2 className="font-bold mb-5 flex items-center gap-2" style={{ fontFamily: "Syne, sans-serif" }}>
                <Users className="w-5 h-5 text-violet-500" /> Recent Users
              </h2>
              {users.length === 0 ? (
                <p className="text-sm" style={{ color: "rgb(var(--muted))" }}>No users yet or API unavailable</p>
              ) : (
                <div className="space-y-2">
                  {users.slice(0, 8).map((u: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: "rgb(var(--bg))" }}>
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{u.firstName?.[0] || "?"}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{u.firstName} {u.lastName}</p>
                        <p className="text-xs truncate" style={{ color: "rgb(var(--muted))" }}>{u.email}</p>
                      </div>
                      <span className={`badge ${u.role === "admin" ? "badge-orange" : "badge-blue"} text-xs`}>{u.role}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* System info */}
          <div className="card p-6">
            <h2 className="font-bold mb-4" style={{ fontFamily: "Syne, sans-serif" }}>System Configuration</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              {[
                { label: "Guest Limit", value: "2/day" },
                { label: "User Limit", value: "10/day" },
                { label: "Max File Size", value: "50 MB" },
                { label: "Auto-delete", value: "30 min" },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-lg" style={{ background: "rgb(var(--bg))", border: "1px solid rgb(var(--card-border))" }}>
                  <p className="text-xs mb-1" style={{ color: "rgb(var(--muted))" }}>{item.label}</p>
                  <p className="font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg flex items-start gap-2" style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)" }}>
              <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs" style={{ color: "rgb(var(--muted))" }}>
                Admin data is fetched from your backend API. Make sure the API is running and the admin endpoints are properly configured.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

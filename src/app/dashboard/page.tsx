"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Download, Trash2, Clock, FileCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getToken } from "@/lib/auth";

interface Conversion { id: number; converterType: string; originalFileName: string; convertedFileName: string; downloadUrl?: string; createdAt: string; expiresAt: string; expired: boolean; }
interface History { conversions: Conversion[]; usedToday: number; dailyLimit: number; remaining: number; page: number; size: number; hasNext: boolean; hasPrevious: boolean; }
export default function DashboardPage() {
  const [page, setPage] = useState(0);
  const [revision, setRevision] = useState(0);
  const [now, setNow] = useState(0);
  const [history, setHistory] = useState<History | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signedOut, setSignedOut] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  useEffect(() => {
    let disposed = false;
    let pending = false;
    const controller = new AbortController();
    const load = async () => {
      if (pending || disposed) return;
      pending = true;
      setNow(Date.now());
      const token = getToken();
      if (!token) { setSignedOut(true); setHistory(null); setLoading(false); pending = false; return; }
      try {
        const response = await fetch(`/api/user/history?page=${page}&size=20`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store", signal: controller.signal });
        if (disposed) return;
        if (response.status === 401) { setSignedOut(true); setHistory(null); return; }
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Unable to load history.");
        if (!disposed) { setHistory(data); setSignedOut(false); setError(null); }
      } catch (error) {
        if (!disposed) setError(error instanceof Error ? error.message : "Unable to connect.");
      } finally { pending = false; if (!disposed) setLoading(false); }
    };
    setLoading(true);
    void load();
    const onVisible = () => { if (document.visibilityState === "visible") void load(); };
    const timer = setInterval(onVisible, 60000);
    document.addEventListener("visibilitychange", onVisible);
    return () => { disposed = true; controller.abort(); clearInterval(timer); document.removeEventListener("visibilitychange", onVisible); };
  }, [page, revision]);
  const remove = async (id: number) => {
    setDeleting(id);
    try {
      const response = await fetch(`/api/user/history/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
      if (!response.ok) throw new Error("Unable to delete this conversion.");
      if (history?.conversions.length === 1 && page > 0) setPage(page - 1);
      else setRevision(value => value + 1);
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to delete."); }
    finally { setDeleting(null); }
  };
  return <><Navbar /><main className="app-container py-12 min-h-[75vh]">
    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8"><div><p className="text-sm accent font-semibold mb-2">YOUR WORKSPACE</p><h1 className="text-4xl font-bold mb-2">Conversion history</h1><p style={{ color: "rgb(var(--muted))" }}>Your recent work, available across devices.</p></div><Link className="btn btn-primary px-6 py-3 self-start" href="/#converters">New conversion</Link></div>
    {loading && <p role="status" className="card p-8">Loading your conversions…</p>}
    {signedOut && <div className="card p-10 text-center"><h2 className="text-2xl font-bold mb-4">Sign in to view your history</h2><Link className="btn btn-primary px-6 py-3" href="/login">Sign in</Link></div>}
    {error && <div role="alert" className="alert-error mb-6"><p>{error}</p><button className="underline" onClick={() => setRevision(value => value + 1)}>Retry</button></div>}
    {history && !signedOut && <>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">{[["Used today", history.usedToday], ["Daily limit", history.dailyLimit], ["Remaining", history.remaining]].map(([label, value]) => <div className="card p-6" key={label}><p className="text-sm mb-2" style={{ color: "rgb(var(--muted))" }}>{label}</p><p className="text-3xl font-bold">{value}</p></div>)}</div>
      <p className="text-sm mb-5" style={{ color: "rgb(var(--muted))" }}>Limits reset at midnight UTC. Attempts count toward your quota. History is retained for 30 days; download links expire sooner.</p>
      {history.conversions.length === 0 ? <div className="card p-12 text-center"><FileCheck className="w-12 h-12 mx-auto accent mb-4" /><h2 className="text-xl font-bold mb-2">Your first conversion starts here</h2><p className="mb-5" style={{ color: "rgb(var(--muted))" }}>Pick a format and turn your file into something useful.</p><Link href="/#converters" className="accent font-semibold">Browse tools →</Link></div> :
        <div className="space-y-3">{history.conversions.map(item => {
          const expired = item.expired || Date.parse(item.expiresAt) <= now;
          return <article key={item.id} className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0"><p className="font-semibold truncate">{item.convertedFileName}</p><p className="text-sm" style={{ color: "rgb(var(--muted))" }}>{item.converterType.replaceAll("-", " ")} · {new Date(item.createdAt).toLocaleString()}</p><p className="text-xs mt-2 flex items-center gap-1" style={{ color: "rgb(var(--muted))" }}><Clock className="w-3 h-3" />{expired ? "Download expired" : `Available until ${new Date(item.expiresAt).toLocaleTimeString()}`}</p></div>
            <div className="flex items-center gap-3">{!expired && item.downloadUrl && <a href={item.downloadUrl} className="btn btn-secondary px-4 py-2"><Download className="w-4 h-4 mr-2" />Download</a>}<button disabled={deleting !== null} onClick={() => remove(item.id)} className="btn btn-secondary p-3" aria-label={`Delete ${item.convertedFileName}`}><Trash2 className="w-4 h-4" /></button></div>
          </article>;
        })}</div>}
      <nav aria-label="History pages" className="flex items-center justify-between mt-6 text-sm">
        <button className="btn btn-secondary px-4" disabled={loading || deleting !== null || !history.hasPrevious} onClick={() => setPage(value => value - 1)}>Previous</button>
        <span>Page {history.page + 1}</span>
        <button className="btn btn-secondary px-4" disabled={loading || deleting !== null || !history.hasNext} onClick={() => setPage(value => value + 1)}>Next</button>
      </nav>
    </>}
  </main><Footer /></>;
}

"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AccountTokenForm({ reset = false }: { reset?: boolean }) {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("token") || "";
    setToken(value);
    if (!value) setError("This link is missing its token. Request a new email.");
    window.history.replaceState(null, "", window.location.pathname);
  }, []);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reset && password !== confirmation) { setError("Passwords do not match."); return; }
    setBusy(true); setError(null);
    try {
      const response = await fetch(reset ? "/api/auth/reset-password" : `/api/auth/verify-email?token=${encodeURIComponent(token)}`, reset ? {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, newPassword: password }),
      } : { method: "GET", cache: "no-store" });
      const data = await response.json();
      if (!response.ok || data.status !== "success") throw new Error(data.message || "Unable to complete your request.");
      setSuccess(true); setPassword(""); setConfirmation("");
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to connect. Please try again."); }
    finally { setBusy(false); }
  };
  return <main className="min-h-[75vh] flex items-center justify-center p-6">
    <div className="card p-8 w-full max-w-md">
      <Link className="nav-link" href="/">← Unimorpher</Link>
      <h1 className="text-3xl font-bold mt-6 mb-3">{reset ? "Set a new password" : "Verify your email"}</h1>
      {success ? <div role="status"><p className="mb-6">{reset ? "Your password has been reset." : "Your email is verified."}</p><Link className="btn btn-primary px-6 py-3" href="/login">Continue to sign in</Link></div> :
        <form onSubmit={submit} className="space-y-5">
          <p style={{ color: "rgb(var(--muted))" }}>{reset ? "Choose a password with at least 8 characters." : "Confirm your email address to start using your account."}</p>
          {reset && <><label className="block">New password<input className="input-field mt-2" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={e => setPassword(e.target.value)} /></label><label className="block">Confirm password<input className="input-field mt-2" type="password" autoComplete="new-password" minLength={8} required value={confirmation} onChange={e => setConfirmation(e.target.value)} /></label></>}
          {error && <p role="alert" className="text-red-600">{error}</p>}
          <button disabled={busy || !token} className="btn btn-primary px-6 py-3 w-full">{busy ? "Please wait…" : reset ? "Reset password" : "Verify email"}</button>
          <Link className="nav-link block" href={reset ? "/forgot-password" : "/login"}>Request a new email</Link>
        </form>}
    </div>
  </main>;
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, UserPlus, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", ok: password.length >= 8 },
    { label: "Uppercase", ok: /[A-Z]/.test(password) },
    { label: "Number", ok: /\d/.test(password) },
    { label: "Special char", ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const colors = ["", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-emerald-500"];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1.5">
        {[1,2,3,4].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= score ? colors[score] : "bg-gray-200 dark:bg-gray-700"}`} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <p className={`text-xs font-medium ${score >= 3 ? "text-emerald-500" : score === 2 ? "text-yellow-500" : "text-red-500"}`}>
          {labels[score]}
        </p>
        <div className="flex gap-2">
          {checks.map(c => (
            <span key={c.label} className={`text-xs ${c.ok ? "text-emerald-500" : ""}`} style={{ color: c.ok ? undefined : "rgb(var(--muted))" }}>
              {c.ok ? "✓" : "·"} {c.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    if (form.password !== form.confirmPassword) { setError("Passwords do not match"); setLoading(false); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters"); setLoading(false); return; }
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setError(data.message || "Signup failed. Please try again.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12" style={{ background: "rgb(var(--bg))" }}>
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-2 text-sm mb-8 nav-link">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <div className="card p-8 sm:p-10">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <UserPlus className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "Syne, sans-serif" }}>Create Account</h2>
              <p className="text-sm" style={{ color: "rgb(var(--muted))" }}>Get 10 free conversions per day</p>
            </div>

            {error && (
              <div className="alert-error mb-5 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            {success && (
              <div className="alert-success mb-5 animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Account created!</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-300">Check your email to verify. Redirecting to login...</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgb(var(--muted))" }}>First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgb(var(--muted))" }} />
                    <input name="firstName" type="text" required value={form.firstName} onChange={handleChange} className="input-field pl-10" placeholder="John" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgb(var(--muted))" }}>Last Name</label>
                  <input name="lastName" type="text" required value={form.lastName} onChange={handleChange} className="input-field" placeholder="Doe" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgb(var(--muted))" }}>Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgb(var(--muted))" }} />
                  <input name="email" type="email" required value={form.email} onChange={handleChange} className="input-field pl-10" placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgb(var(--muted))" }}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgb(var(--muted))" }} />
                  <input name="password" type="password" required value={form.password} onChange={handleChange} className="input-field pl-10" placeholder="••••••••" minLength={8} />
                </div>
                <PasswordStrength password={form.password} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgb(var(--muted))" }}>Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgb(var(--muted))" }} />
                  <input name="confirmPassword" type="password" required value={form.confirmPassword} onChange={handleChange} className="input-field pl-10" placeholder="••••••••" />
                </div>
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
                )}
              </div>
              <p className="text-xs" style={{ color: "rgb(var(--muted))" }}>
                By signing up, you agree to our{" "}
                <Link href="/terms" className="text-blue-500 hover:underline">Terms</Link> and{" "}
                <Link href="/privacy" className="text-blue-500 hover:underline">Privacy Policy</Link>
              </p>
              <button type="submit" disabled={loading || success} className="w-full btn btn-primary py-3.5">
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />Creating...</>
                ) : success ? (
                  <><CheckCircle2 className="w-4 h-4 mr-2" />Account Created!</>
                ) : (
                  <><UserPlus className="w-4 h-4 mr-2" />Create Free Account</>
                )}
              </button>
            </form>

            <p className="text-center text-sm mt-6" style={{ color: "rgb(var(--muted))" }}>
              Already have an account?{" "}
              <Link href="/login" className="text-blue-500 hover:underline font-semibold">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

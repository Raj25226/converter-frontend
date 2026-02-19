"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, User, Mail, Lock, Save, CheckCircle2, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getUser, getToken, logout } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const u = getUser();
    if (!u) { router.push("/login"); return; }
    setUser(u);
    setForm({ firstName: u.firstName, lastName: u.lastName, email: u.email });
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(""); setSuccess("");
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        const updated = { ...user, ...form };
        localStorage.setItem("user", JSON.stringify(updated));
        setUser(updated);
        setSuccess("Profile updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Failed to update profile");
      }
    } catch {
      setError("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { setError("Passwords don't match"); return; }
    if (passwordForm.newPassword.length < 8) { setError("Password must be at least 8 characters"); return; }
    setSaving(true); setError(""); setSuccess("");
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setSuccess("Password changed successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Failed to change password");
      }
    } catch {
      setError("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (!mounted || !user) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-10" style={{ background: "rgb(var(--bg))" }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm mb-6 nav-link">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: "Syne, sans-serif" }}>Profile Settings</h1>

          {success && (
            <div className="alert-success mb-6 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <p className="text-sm text-emerald-700 dark:text-emerald-400">{success}</p>
            </div>
          )}
          {error && (
            <div className="alert-error mb-6 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Profile info */}
          <div className="card p-6 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
                {user.picture ? (
                  <img src={user.picture} alt={user.firstName} className="w-full h-full rounded-2xl object-cover" />
                ) : (
                  <span className="text-white text-2xl font-bold">{user.firstName?.[0]}</span>
                )}
              </div>
              <div>
                <h2 className="font-bold">{user.firstName} {user.lastName}</h2>
                <p className="text-sm" style={{ color: "rgb(var(--muted))" }}>{user.email}</p>
                <span className="badge badge-blue text-xs mt-1">{user.role === "admin" ? "Admin" : "Free Plan"}</span>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2 text-sm mb-3">
                <User className="w-4 h-4" /> Personal Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgb(var(--muted))" }}>First Name</label>
                  <input type="text" value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} className="input-field" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgb(var(--muted))" }}>Last Name</label>
                  <input type="text" value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} className="input-field" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgb(var(--muted))" }}>Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgb(var(--muted))" }} />
                  <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="input-field pl-10" required />
                </div>
              </div>
              <button type="submit" disabled={saving} className="btn btn-primary px-6 py-2.5 text-sm">
                {saving ? "Saving..." : <><Save className="w-4 h-4 mr-2" />Save Changes</>}
              </button>
            </form>
          </div>

          {/* Change password */}
          <div className="card p-6">
            <h3 className="font-semibold flex items-center gap-2 text-sm mb-4">
              <Lock className="w-4 h-4" /> Change Password
            </h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              {[
                { label: "Current Password", key: "currentPassword" },
                { label: "New Password", key: "newPassword" },
                { label: "Confirm New Password", key: "confirmPassword" },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgb(var(--muted))" }}>{field.label}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgb(var(--muted))" }} />
                    <input
                      type="password"
                      value={(passwordForm as any)[field.key]}
                      onChange={e => setPasswordForm(p => ({ ...p, [field.key]: e.target.value }))}
                      className="input-field pl-10"
                      placeholder="••••••••"
                      minLength={field.key !== "currentPassword" ? 8 : undefined}
                    />
                  </div>
                </div>
              ))}
              <button type="submit" disabled={saving} className="btn btn-primary px-6 py-2.5 text-sm">
                {saving ? "Updating..." : "Change Password"}
              </button>
            </form>
          </div>

          {/* Danger zone */}
          <div className="card p-6 mt-6" style={{ borderColor: "rgba(239,68,68,0.2)" }}>
            <h3 className="font-semibold text-red-500 text-sm mb-3">Danger Zone</h3>
            <p className="text-sm mb-4" style={{ color: "rgb(var(--muted))" }}>Once you log out, you'll need your credentials to sign back in.</p>
            <button
              onClick={() => { logout(); router.push("/"); }}
              className="btn btn-danger px-6 py-2.5 text-sm"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

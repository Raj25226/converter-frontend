'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            if (res.ok) setSuccess(true);
            else {
                const d = await res.json();
                setError(d.message || 'Failed to send reset email');
            }
        } catch {
            setError('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div
                className="min-h-[calc(100vh-68px)] flex items-center justify-center px-4 py-12"
                style={{ background: 'rgb(var(--bg))' }}
            >
                <div className="w-full max-w-md">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-sm mb-8 nav-link"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Login
                    </Link>
                    <div className="card p-8 sm:p-10">
                        <div className="text-center mb-8">
                            <h1
                                className="text-2xl font-semibold mb-2"
                                style={{ fontFamily: 'inherit' }}
                            >
                                Forgot Password?
                            </h1>
                            <p
                                className="text-sm"
                                style={{ color: 'rgb(var(--muted))' }}
                            >
                                Enter your email and we&apos;ll send a reset
                                link
                            </p>
                        </div>

                        {success ? (
                            <div className="alert-success animate-fade-in">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                                        Reset email sent!
                                    </p>
                                    <p className="text-xs text-emerald-600 dark:text-emerald-300">
                                        Check your inbox for the password reset
                                        link.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && (
                                    <div className="alert-error animate-fade-in">
                                        <AlertCircle className="w-4 h-4 text-red-500" />
                                        <p className="text-sm text-red-700 dark:text-red-400">
                                            {error}
                                        </p>
                                    </div>
                                )}
                                <div>
                                    <label
                                        htmlFor="recovery-email"
                                        className="block text-xs font-semibold mb-1.5"
                                        style={{ color: 'rgb(var(--muted))' }}
                                    >
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail
                                            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                                            style={{
                                                color: 'rgb(var(--muted))',
                                            }}
                                        />
                                        <input
                                            id="recovery-email"
                                            autoComplete="email"
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            className="input-field pl-10"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn btn-primary py-3.5"
                                >
                                    {loading ? 'Sending...' : 'Send Reset Link'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

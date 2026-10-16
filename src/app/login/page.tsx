'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Mail,
    Lock,
    LogIn,
    ArrowLeft,
    AlertCircle,
    CheckCircle2,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import GoogleSignIn from '@/components/GoogleSignIn';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [needsVerification, setNeedsVerification] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setNeedsVerification(false);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                if (data.emailVerified === false) {
                    setNeedsVerification(true);
                    setError('Please verify your email before logging in.');
                } else {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    router.push('/dashboard');
                }
            } else {
                setError(
                    data.message ||
                        'Login failed. Please check your credentials.',
                );
            }
        } catch {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendVerification = async () => {
        try {
            const res = await fetch('/api/auth/resend-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            if (res.ok) {
                setVerificationSent(true);
                setTimeout(() => setVerificationSent(false), 5000);
            }
        } catch {
            /* Keep sign-in available if the resend request cannot connect. */
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
                        href="/"
                        className="inline-flex items-center gap-2 text-sm mb-8 nav-link"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>

                    <div className="card p-8 sm:p-10">
                        <div className="text-center mb-8">
                            <h1
                                className="text-2xl font-semibold mb-2"
                                style={{ fontFamily: 'inherit' }}
                            >
                                Sign in
                            </h1>
                            <p
                                className="text-sm"
                                style={{ color: 'rgb(var(--muted))' }}
                            >
                                Continue to your conversion workspace.
                            </p>
                        </div>

                        {error && (
                            <div className="alert-error mb-5 animate-fade-in">
                                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                                <p className="text-sm text-red-700 dark:text-red-400">
                                    {error}
                                </p>
                            </div>
                        )}

                        {needsVerification && (
                            <div
                                className="mb-5 p-4 rounded-xl"
                                style={{
                                    background: 'rgba(245,158,11,0.1)',
                                    border: '1px solid rgba(245,158,11,0.3)',
                                }}
                            >
                                <p className="text-sm text-amber-700 dark:text-amber-400 mb-2">
                                    Email verification required.
                                </p>
                                <button
                                    onClick={handleResendVerification}
                                    disabled={verificationSent}
                                    className="text-xs font-semibold text-amber-800 dark:text-amber-300 underline"
                                >
                                    {verificationSent
                                        ? 'Sent! Check your inbox'
                                        : 'Resend verification email'}
                                </button>
                            </div>
                        )}

                        {verificationSent && (
                            <div className="alert-success mb-5 animate-fade-in">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <p className="text-sm text-emerald-700 dark:text-emerald-400">
                                    Verification email sent!
                                </p>
                            </div>
                        )}

                        <GoogleSignIn />
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label
                                    htmlFor="login-email"
                                    className="block text-xs font-semibold mb-1.5"
                                    style={{ color: 'rgb(var(--muted))' }}
                                >
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                                        style={{ color: 'rgb(var(--muted))' }}
                                    />
                                    <input
                                        id="login-email"
                                        name="email"
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
                            <div>
                                <label
                                    htmlFor="login-password"
                                    className="block text-xs font-semibold mb-1.5"
                                    style={{ color: 'rgb(var(--muted))' }}
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                                        style={{ color: 'rgb(var(--muted))' }}
                                    />
                                    <input
                                        id="login-password"
                                        name="password"
                                        autoComplete="current-password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        className="input-field pl-10"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-end text-xs">
                                <Link
                                    href="/forgot-password"
                                    className="accent hover:underline font-medium"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn btn-primary py-3.5"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />{' '}
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="w-4 h-4 mr-2" /> Sign
                                        in
                                    </>
                                )}
                            </button>
                        </form>

                        <p
                            className="text-center text-sm mt-6"
                            style={{ color: 'rgb(var(--muted))' }}
                        >
                            Don&apos;t have an account?{' '}
                            <Link
                                href="/signup"
                                className="accent hover:underline font-semibold"
                            >
                                Sign up free
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

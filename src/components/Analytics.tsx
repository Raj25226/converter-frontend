'use client';

import { useEffect, useState } from 'react';
import {
    TrendingUp,
    FileCheck,
    Users,
    Globe,
    BarChart3,
    Shield,
    Lock,
    ArrowLeft,
    Activity,
    Zap,
    AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { getUser, getToken, isAdmin } from '@/lib/auth';

// ── Types ─────────────────────────────────────────────────────
interface AnalyticsData {
    totalVisits: number;
    totalConversions: number;
    uniqueVisitors: number;
    conversionRate: number;
    todayVisits?: number;
    todayConversions?: number;
    topTools?: { name: string; count: number }[];
    recentActivity?: { time: string; action: string; details: string }[];
}

// ── Admin-only Analytics Dashboard ───────────────────────────
export default function AnalyticsPage() {
    const [authorized, setAuthorized] = useState<boolean | null>(null); // null = loading
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    // Guard: check admin role on mount
    async function fetchAnalytics() {
        try {
            const response = await fetch('/api/analytics/stats', {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            const data = await response.json();
            if (data.status === 'success') {
                setAnalytics(data.data);
            } else {
                throw new Error('API error');
            }
        } catch {
            setAnalytics(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const user = getUser();
        if (!user) {
            setAuthorized(false);
            return;
        }
        if (!isAdmin()) {
            setAuthorized(false);
            return;
        }
        setAuthorized(true);
        fetchAnalytics();
    }, []);

    const formatNumber = (num: number) => {
        if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
        if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
        return num.toLocaleString();
    };

    // ── Loading state ─────────────────────────────────────────
    if (authorized === null) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{ background: 'rgb(var(--bg))' }}
            >
                <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // ── Access denied ─────────────────────────────────────────
    if (!authorized) {
        return (
            <div
                className="min-h-screen flex items-center justify-center px-4"
                style={{
                    background: 'rgb(var(--bg))',
                    color: 'rgb(var(--fg))',
                }}
            >
                <div className="max-w-md w-full text-center">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 rounded-2xl bg-red-500/10 flex items-center justify-center">
                            <Lock className="w-12 h-12 text-red-500" />
                        </div>
                    </div>

                    <h1
                        className="text-3xl font-black mb-3"
                        style={{ fontFamily: 'inherit' }}
                    >
                        Access Restricted
                    </h1>
                    <p className="mb-2" style={{ color: 'rgb(var(--muted))' }}>
                        This page is only available to administrators.
                    </p>
                    <p
                        className="text-sm mb-8"
                        style={{ color: 'rgb(var(--muted))' }}
                    >
                        If you believe you should have access, please contact
                        the site owner.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 font-semibold text-[rgb(var(--on-primary))] bg-[rgb(var(--primary))]   rounded-xl hover:shadow-none  transition-all"
                        >
                            <ArrowLeft className="w-4 h-4" /> Go to Homepage
                        </Link>
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 font-semibold rounded-xl transition-all"
                            style={{
                                background: 'rgb(var(--card))',
                                border: '1px solid rgb(var(--card-border))',
                                color: 'rgb(var(--fg))',
                            }}
                        >
                            Log In
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // ── Admin dashboard ───────────────────────────────────────
    const statCards = [
        {
            icon: Globe,
            label: 'Total Visits',
            value: formatNumber(analytics?.totalVisits ?? 0),
            sub: `${formatNumber(analytics?.todayVisits ?? 0)} today`,
            color: 'accent',
            bg: 'surface-subtle',
        },
        {
            icon: FileCheck,
            label: 'Files Converted',
            value: formatNumber(analytics?.totalConversions ?? 0),
            sub: `${formatNumber(analytics?.todayConversions ?? 0)} today`,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
        },
        {
            icon: Users,
            label: 'Unique Visitors',
            value: formatNumber(analytics?.uniqueVisitors ?? 0),
            sub: 'All time',
            color: 'accent',
            bg: 'surface-subtle',
        },
        {
            icon: TrendingUp,
            label: 'Conversion Rate',
            value: (analytics?.conversionRate ?? 0).toFixed(1) + '%',
            sub: 'Visitors who convert',
            color: 'text-orange-500',
            bg: 'surface-subtle',
        },
    ];

    return (
        <div
            className="min-h-screen"
            style={{ background: 'rgb(var(--bg))', color: 'rgb(var(--fg))' }}
        >
            {/* Header */}
            <div
                className="border-b px-6 py-5"
                style={{ borderColor: 'rgb(var(--card-border))' }}
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                            <h1
                                className="font-bold text-lg"
                                style={{ fontFamily: 'inherit' }}
                            >
                                Analytics Dashboard
                            </h1>
                            <p
                                className="text-xs"
                                style={{ color: 'rgb(var(--muted))' }}
                            >
                                Admin view — visible only to administrators
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                            <Shield className="w-3 h-3" /> Admin Only
                        </span>
                        <Link
                            href="/"
                            className="flex items-center gap-1.5 text-sm nav-link"
                            style={{ color: 'rgb(var(--muted))' }}
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Stat cards */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="card p-6 animate-pulse"
                                style={{ height: '120px' }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {statCards.map((card, i) => {
                            const Icon = card.icon;
                            return (
                                <div
                                    key={i}
                                    className="card p-5 group hover:shadow-none transition-all duration-300"
                                >
                                    <div
                                        className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                                    >
                                        <Icon
                                            className={`w-5 h-5 ${card.color}`}
                                        />
                                    </div>
                                    <div
                                        className="text-2xl font-bold mb-0.5"
                                        style={{ fontFamily: 'inherit' }}
                                    >
                                        {card.value}
                                    </div>
                                    <div
                                        className="text-xs font-medium"
                                        style={{ color: 'rgb(var(--fg))' }}
                                    >
                                        {card.label}
                                    </div>
                                    <div
                                        className="text-xs mt-0.5"
                                        style={{ color: 'rgb(var(--muted))' }}
                                    >
                                        {card.sub}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Bottom row: Top Tools + Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Tools */}
                    <div className="card p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <BarChart3 className="w-5 h-5 accent" />
                            <h2
                                className="font-bold"
                                style={{ fontFamily: 'inherit' }}
                            >
                                Top Conversion Tools
                            </h2>
                        </div>
                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div
                                        key={i}
                                        className="h-8 rounded animate-pulse"
                                        style={{
                                            background:
                                                'rgb(var(--card-border))',
                                        }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {(analytics?.topTools ?? []).map((tool, i) => {
                                    const max =
                                        analytics?.topTools?.[0]?.count ?? 1;
                                    const pct = Math.round(
                                        (tool.count / max) * 100,
                                    );
                                    return (
                                        <div key={i}>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-medium">
                                                    {tool.name}
                                                </span>
                                                <span
                                                    className="text-sm"
                                                    style={{
                                                        color: 'rgb(var(--muted))',
                                                    }}
                                                >
                                                    {formatNumber(tool.count)}
                                                </span>
                                            </div>
                                            <div className="quota-bar">
                                                <div
                                                    className="quota-bar-fill"
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Recent Activity */}
                    <div className="card p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <Activity className="w-5 h-5 accent" />
                            <h2
                                className="font-bold"
                                style={{ fontFamily: 'inherit' }}
                            >
                                Recent Activity
                            </h2>
                        </div>
                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div
                                        key={i}
                                        className="h-10 rounded animate-pulse"
                                        style={{
                                            background:
                                                'rgb(var(--card-border))',
                                        }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {(analytics?.recentActivity ?? []).map(
                                    (item, i) => (
                                        <div
                                            key={i}
                                            className="flex items-start gap-3 py-2 border-b last:border-0"
                                            style={{
                                                borderColor:
                                                    'rgb(var(--card-border))',
                                            }}
                                        >
                                            <div className="w-8 h-8 rounded-lg surface-subtle flex items-center justify-center shrink-0 mt-0.5">
                                                <Zap className="w-4 h-4 accent" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium truncate">
                                                    {item.details}
                                                </div>
                                                <div
                                                    className="text-xs"
                                                    style={{
                                                        color: 'rgb(var(--muted))',
                                                    }}
                                                >
                                                    {item.action} · {item.time}
                                                </div>
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Disclaimer */}
                <div
                    className="flex items-start gap-3 rounded-xl p-4"
                    style={{
                        background: 'rgb(var(--card))',
                        border: '1px solid rgb(var(--card-border))',
                    }}
                >
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <p
                        className="text-sm"
                        style={{ color: 'rgb(var(--muted))' }}
                    >
                        <strong style={{ color: 'rgb(var(--fg))' }}>
                            Note:
                        </strong>{' '}
                        Statistics shown are pulled from{' '}
                        <code>/api/analytics/stats</code>. Connect your backend
                        to see live data. Sample data is displayed when the API
                        is unavailable.
                    </p>
                </div>
            </div>
        </div>
    );
}

// ── Inline public analytics strip (for homepage) ──────────────
// This is a lightweight version safe to show to everyone.

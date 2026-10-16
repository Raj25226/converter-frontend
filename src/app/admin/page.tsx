'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Users,
    FileCheck,
    Globe,
    TrendingUp,
    Shield,
    ArrowLeft,
    BarChart3,
    AlertCircle,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getUser, getToken, type User as AuthUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface AdminStats {
    totalVisits: number;
    totalConversions: number;
    totalUsers: number;
    conversionRate: number;
    toolStats: { tool: string; count: number }[];
    systemConfiguration?: {
        guestDailyLimit: number;
        userDailyLimit: number;
        maxFileSizeMb: number;
        expiryMinutes: number;
    };
}
interface AdminUser extends Omit<AuthUser, 'id'> {
    id: number;
    isActive: boolean;
}

export default function AdminPage() {
    const router = useRouter();
    const [user, setUser] = useState<AuthUser | null>(null);
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);
    const [offset, setOffset] = useState(0);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [mounted, setMounted] = useState(false);

    async function fetchAdminData(pageOffset = 0, query = '') {
        setError(null);
        try {
            const [statsRes, usersRes] = await Promise.all([
                fetch('/api/admin/stats', {
                    headers: { Authorization: `Bearer ${getToken()}` },
                }),
                fetch(
                    `/api/admin/users?limit=20&offset=${pageOffset}&search=${encodeURIComponent(query)}`,
                    { headers: { Authorization: `Bearer ${getToken()}` } },
                ),
            ]);
            if (!statsRes.ok || !usersRes.ok)
                throw new Error(
                    'Unable to load admin data. Check your session and try again.',
                );
            setStats(await statsRes.json());
            const data = await usersRes.json();
            setUsers(data.users || []);
            setTotal(data.total);
            setOffset(pageOffset);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Unable to connect.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setMounted(true);
        const u = getUser();
        if (!u || u.role !== 'admin') {
            router.push('/');
            return;
        }
        setUser(u);
        fetchAdminData();
    }, [router]);

    const updateUser = async (
        id: number,
        update?: { role?: string; isActive?: boolean },
    ) => {
        if (
            !update &&
            !confirm(
                'Delete this account and its conversion history? This cannot be undone.',
            )
        )
            return;
        setBusy(true);
        setError(null);
        try {
            const response = await fetch(`/api/admin/users/${id}`, {
                method: update ? 'PATCH' : 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: update ? JSON.stringify(update) : undefined,
            });
            const data = await response.json();
            if (!response.ok)
                throw new Error(data.message || 'Unable to update this user.');
            await fetchAdminData(offset, search);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Unable to update user.');
        } finally {
            setBusy(false);
        }
    };

    if (!mounted) return null;

    if (!user || user.role !== 'admin') {
        return (
            <>
                <Navbar />
                <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
                    <Shield className="w-12 h-12 text-red-500 mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
                    <p className="mb-6" style={{ color: 'rgb(var(--muted))' }}>
                        Admin access required
                    </p>
                    <Link href="/" className="btn btn-primary px-6 py-3">
                        Go Home
                    </Link>
                </div>
                <Footer />
            </>
        );
    }

    const statCards = [
        {
            icon: Globe,
            label: 'Total Visits',
            value: stats?.totalVisits ?? '—',
            color: 'accent',
            bg: 'surface-subtle',
        },
        {
            icon: FileCheck,
            label: 'Total Conversions',
            value: stats?.totalConversions ?? '—',
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
        },
        {
            icon: Users,
            label: 'Registered Users',
            value: stats?.totalUsers ?? '—',
            color: 'accent',
            bg: 'surface-subtle',
        },
        {
            icon: TrendingUp,
            label: 'Conversion Rate',
            value: stats ? `${stats.conversionRate?.toFixed(1)}%` : '—',
            color: 'text-orange-500',
            bg: 'surface-subtle',
        },
    ];

    const toolStats = stats?.toolStats || [
        { tool: 'pdf-to-word', count: 0 },
        { tool: 'jpg-to-png', count: 0 },
        { tool: 'mp4-to-mp3', count: 0 },
    ];

    return (
        <>
            <Navbar />
            <div
                className="min-h-screen py-10"
                style={{ background: 'rgb(var(--bg))' }}
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 text-sm mb-3 nav-link"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back to Home
                            </Link>
                            <h1
                                className="text-3xl font-bold flex items-center gap-2"
                                style={{ fontFamily: 'inherit' }}
                            >
                                <Shield className="w-7 h-7 text-amber-500" />{' '}
                                Admin Dashboard
                            </h1>
                        </div>
                        <span className="badge badge-orange">Admin</span>
                    </div>

                    {error && (
                        <p role="alert" className="alert-error mb-6">
                            {error}
                        </p>
                    )}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="card p-6 animate-pulse h-24"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            {statCards.map((s, i) => {
                                const Icon = s.icon;
                                return (
                                    <div key={i} className="card p-5">
                                        <div
                                            className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}
                                        >
                                            <Icon
                                                className={`w-5 h-5 ${s.color}`}
                                            />
                                        </div>
                                        <div
                                            className="text-2xl font-bold mb-0.5"
                                            style={{ fontFamily: 'inherit' }}
                                        >
                                            {typeof s.value === 'number'
                                                ? s.value.toLocaleString()
                                                : s.value}
                                        </div>
                                        <div
                                            className="text-xs"
                                            style={{
                                                color: 'rgb(var(--muted))',
                                            }}
                                        >
                                            {s.label}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Tool usage */}
                        <div className="card p-6">
                            <h2
                                className="font-bold mb-5 flex items-center gap-2"
                                style={{ fontFamily: 'inherit' }}
                            >
                                <BarChart3 className="w-5 h-5 accent" /> Tool
                                Usage
                            </h2>
                            {toolStats.length === 0 ? (
                                <p
                                    className="text-sm"
                                    style={{ color: 'rgb(var(--muted))' }}
                                >
                                    No data yet
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {toolStats.map((t, i) => {
                                        const maxCount = Math.max(
                                            ...toolStats.map((x) => x.count),
                                            1,
                                        );
                                        const pct = Math.round(
                                            (t.count / maxCount) * 100,
                                        );
                                        return (
                                            <div key={i}>
                                                <div className="flex items-center justify-between text-sm mb-1">
                                                    <span className="font-medium">
                                                        {t.tool}
                                                    </span>
                                                    <span
                                                        style={{
                                                            color: 'rgb(var(--muted))',
                                                        }}
                                                    >
                                                        {t.count}
                                                    </span>
                                                </div>
                                                <div className="quota-bar">
                                                    <div
                                                        className="quota-bar-fill"
                                                        style={{
                                                            width: `${pct}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Users */}
                        <div className="card p-6">
                            <h2
                                className="font-bold mb-5 flex items-center gap-2"
                                style={{ fontFamily: 'inherit' }}
                            >
                                <Users className="w-5 h-5 accent" /> Manage
                                Users
                            </h2>
                            <form
                                className="flex gap-2 mb-5"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    fetchAdminData(0, search);
                                }}
                            >
                                <input
                                    aria-label="Search users by name or email"
                                    className="input-field"
                                    placeholder="Name or email"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <button className="btn btn-secondary px-4">
                                    Search
                                </button>
                            </form>
                            {users.length === 0 ? (
                                <p
                                    className="text-sm"
                                    style={{ color: 'rgb(var(--muted))' }}
                                >
                                    No users yet or API unavailable
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {users.map((u, i) => (
                                        <div
                                            key={i}
                                            className="flex flex-wrap items-center gap-3 p-2 rounded-lg"
                                            style={{
                                                background: 'rgb(var(--bg))',
                                            }}
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-[rgb(var(--primary))]   flex items-center justify-center shrink-0">
                                                <span className="text-[rgb(var(--on-primary))] text-xs font-bold">
                                                    {u.firstName?.[0] || '?'}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">
                                                    {u.firstName} {u.lastName}
                                                </p>
                                                <p
                                                    className="text-xs truncate"
                                                    style={{
                                                        color: 'rgb(var(--muted))',
                                                    }}
                                                >
                                                    {u.email}
                                                </p>
                                            </div>
                                            <select
                                                aria-label={`Role for ${u.email}`}
                                                value={u.role}
                                                disabled={
                                                    busy ||
                                                    String(u.id) ===
                                                        String(user.id)
                                                }
                                                onChange={(e) =>
                                                    updateUser(u.id, {
                                                        role: e.target.value,
                                                    })
                                                }
                                                className="input-field !w-auto !py-1"
                                            >
                                                <option value="user">
                                                    User
                                                </option>
                                                <option value="admin">
                                                    Admin
                                                </option>
                                            </select>
                                            <button
                                                disabled={
                                                    busy ||
                                                    String(u.id) ===
                                                        String(user.id)
                                                }
                                                className="btn btn-secondary px-2 py-1 text-xs"
                                                onClick={() =>
                                                    updateUser(u.id, {
                                                        isActive: !u.isActive,
                                                    })
                                                }
                                            >
                                                {u.isActive
                                                    ? 'Suspend'
                                                    : 'Activate'}
                                            </button>
                                            <button
                                                disabled={
                                                    busy ||
                                                    String(u.id) ===
                                                        String(user.id)
                                                }
                                                className="btn btn-danger px-2 py-1 text-xs"
                                                onClick={() => updateUser(u.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="flex items-center justify-between mt-5 text-xs">
                                <button
                                    className="btn btn-secondary px-3 py-2"
                                    disabled={offset === 0 || busy}
                                    onClick={() =>
                                        fetchAdminData(
                                            Math.max(0, offset - 20),
                                            search,
                                        )
                                    }
                                >
                                    Previous
                                </button>
                                <span>{total} users</span>
                                <button
                                    className="btn btn-secondary px-3 py-2"
                                    disabled={offset + 20 >= total || busy}
                                    onClick={() =>
                                        fetchAdminData(offset + 20, search)
                                    }
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* System info */}
                    <div className="card p-6">
                        <h2
                            className="font-bold mb-4"
                            style={{ fontFamily: 'inherit' }}
                        >
                            System Configuration
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                            {[
                                {
                                    label: 'Guest Limit',
                                    value: stats?.systemConfiguration
                                        ? `${stats.systemConfiguration.guestDailyLimit}/day`
                                        : '—',
                                },
                                {
                                    label: 'User Limit',
                                    value: stats?.systemConfiguration
                                        ? `${stats.systemConfiguration.userDailyLimit}/day`
                                        : '—',
                                },
                                {
                                    label: 'Max File Size',
                                    value: stats?.systemConfiguration
                                        ? `${stats.systemConfiguration.maxFileSizeMb} MB`
                                        : '—',
                                },
                                {
                                    label: 'Auto-delete',
                                    value: stats?.systemConfiguration
                                        ? `${stats.systemConfiguration.expiryMinutes} min`
                                        : '—',
                                },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="p-3 rounded-lg"
                                    style={{
                                        background: 'rgb(var(--bg))',
                                        border: '1px solid rgb(var(--card-border))',
                                    }}
                                >
                                    <p
                                        className="text-xs mb-1"
                                        style={{ color: 'rgb(var(--muted))' }}
                                    >
                                        {item.label}
                                    </p>
                                    <p className="font-semibold">
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div
                            className="mt-4 p-3 rounded-lg flex items-start gap-2"
                            style={{
                                background: 'rgb(var(--subtle))',
                                border: '1px solid rgb(var(--card-border))',
                            }}
                        >
                            <AlertCircle className="w-4 h-4 accent shrink-0 mt-0.5" />
                            <p
                                className="text-xs"
                                style={{ color: 'rgb(var(--muted))' }}
                            >
                                Admin data is fetched from your backend API.
                                Make sure the API is running and the admin
                                endpoints are properly configured.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

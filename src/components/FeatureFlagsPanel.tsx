'use client';
import { useCallback, useEffect, useState } from 'react';
import { getToken } from '@/lib/auth';
import { useFeatures } from './FeatureProvider';
interface FlagState {
    key: string;
    enabled: boolean;
    defaultEnabled: boolean;
    overridden: boolean;
    updatedAt?: string;
    updatedBy?: number;
}
interface Administration {
    source: string;
    editable: boolean;
    flags: FlagState[];
}
export default function FeatureFlagsPanel() {
    const [configuration, setConfiguration] = useState<Administration | null>(
        null,
    );
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);
    const { refresh } = useFeatures();
    const load = useCallback(async () => {
        try {
            const response = await fetch('/api/admin/features', {
                headers: { Authorization: `Bearer ${getToken()}` },
                cache: 'no-store',
            });
            if (!response.ok) throw new Error('Unable to load feature flags.');
            const data: Administration = await response.json();
            if (
                !Array.isArray(data.flags) ||
                typeof data.editable !== 'boolean'
            )
                throw new Error('Invalid feature flag configuration.');
            setConfiguration(data);
            setError(null);
        } catch (failure) {
            setError(
                failure instanceof Error
                    ? failure.message
                    : 'Unable to load feature flags.',
            );
        }
    }, []);
    useEffect(() => {
        void load();
    }, [load]);
    async function update(key: string, enabled?: boolean) {
        setBusy(true);
        setError(null);
        try {
            const response = await fetch(
                `/api/admin/features/${encodeURIComponent(key)}`,
                {
                    method: enabled === undefined ? 'DELETE' : 'PATCH',
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                        'Content-Type': 'application/json',
                    },
                    body:
                        enabled === undefined
                            ? undefined
                            : JSON.stringify({ enabled }),
                },
            );
            const data = await response.json();
            if (!response.ok)
                throw new Error(
                    data.message || 'Unable to update feature flag.',
                );
            setConfiguration(data);
            await refresh();
        } catch (failure) {
            setError(
                failure instanceof Error
                    ? failure.message
                    : 'Unable to update feature flag.',
            );
        } finally {
            setBusy(false);
        }
    }
    return (
        <section className="card p-6 mt-6" aria-label="Feature flags">
            <h2 className="font-bold mb-3">Feature flags</h2>
            <p className="text-sm muted mb-4">
                Changes apply to new actions. Running conversions can finish.
                Disabling login prevents new sign-ins, including administrators;
                existing sessions remain valid.
            </p>
            {configuration && (
                <p className="text-sm muted mb-4">
                    Managed by {configuration.source}.{' '}
                    {configuration.editable
                        ? 'Reset removes the database override and restores the environment default.'
                        : 'Update the environment and restart to change these values.'}
                </p>
            )}
            {error && (
                <p role="alert" className="text-red-600 mb-3">
                    {error} <button onClick={() => void load()}>Retry</button>
                </p>
            )}
            {!configuration && !error && <p>Loading feature flags…</p>}
            <div className="grid sm:grid-cols-2 gap-3">
                {configuration?.flags.map((flag) => (
                    <div
                        className="surface-subtle rounded-lg p-3"
                        key={flag.key}
                    >
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={flag.enabled}
                                disabled={busy || !configuration.editable}
                                onChange={(event) =>
                                    void update(flag.key, event.target.checked)
                                }
                            />
                            <span className="text-sm font-medium">
                                {flag.key.replaceAll('-', ' ')}
                            </span>
                        </label>
                        <p className="text-xs muted mt-2">
                            Default:{' '}
                            {flag.defaultEnabled ? 'enabled' : 'disabled'}
                            {flag.overridden ? ' · Database override' : ''}
                        </p>
                        {flag.updatedAt && (
                            <p className="text-xs muted">
                                Updated{' '}
                                {new Date(flag.updatedAt).toLocaleString()} by
                                administrator {flag.updatedBy}
                            </p>
                        )}
                        {flag.overridden && configuration.editable && (
                            <button
                                className="text-xs underline mt-2"
                                disabled={busy}
                                onClick={() => void update(flag.key)}
                            >
                                Reset to default
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}

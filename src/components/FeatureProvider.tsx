'use client';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    useRef,
} from 'react';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import Navbar from './Navbar';
type Features = Record<string, boolean>;
interface FeatureContextValue {
    flags: Features | null;
    ready: boolean;
    error: string | null;
    enabled: (key: string) => boolean;
    refresh: () => Promise<void>;
}
const FeatureContext = createContext<FeatureContextValue | null>(null);
export function requiredFeature(path: string): string | undefined {
    return (
        {
            '/image-compressor': 'conversion-image-compressor',
            '/login': 'login',
            '/signup': 'signup',
            '/forgot-password': 'password-reset',
            '/reset-password': 'password-reset',
            '/verify-email': 'email-verification',
            '/profile': 'profile',
            '/dashboard': 'history',
        } as Record<string, string>
    )[path];
}
export function FeatureProvider({ children }: { children: React.ReactNode }) {
    const revision = useRef(0);
    const [flags, setFlags] = useState<Features | null>(null);
    const [ready, setReady] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const refresh = useCallback(async () => {
        const current = ++revision.current;
        try {
            const response = await fetch('/api/features', {
                cache: 'no-store',
                signal: AbortSignal.timeout(10000),
            });
            if (!response.ok)
                throw new Error('Unable to load feature availability.');
            const data: unknown = await response.json();
            if (
                !data ||
                typeof data !== 'object' ||
                Object.values(data).some((value) => typeof value !== 'boolean')
            )
                throw new Error('Invalid feature availability response.');
            if (current !== revision.current) return;
            setFlags(data as Features);
            setError(null);
        } catch {
            if (current !== revision.current) return;
            setFlags(null);
            setError('Feature availability could not be loaded. Please retry.');
        } finally {
            if (current === revision.current) setReady(true);
        }
    }, []);
    useEffect(() => {
        void refresh();
        const update = () => {
            if (document.visibilityState === 'visible') void refresh();
        };
        const timer = window.setInterval(update, 15000);
        window.addEventListener('focus', update);
        document.addEventListener('visibilitychange', update);
        return () => {
            window.clearInterval(timer);
            window.removeEventListener('focus', update);
            document.removeEventListener('visibilitychange', update);
        };
    }, [refresh]);
    const value = useMemo(
        () => ({
            flags,
            ready,
            error,
            enabled: (key: string) => flags?.[key] === true,
            refresh,
        }),
        [flags, ready, error, refresh],
    );
    return (
        <FeatureContext.Provider value={value}>
            {children}
        </FeatureContext.Provider>
    );
}
export function useFeatures() {
    const value = useContext(FeatureContext);
    if (!value) throw new Error('FeatureProvider is missing.');
    return value;
}
export function Feature({
    name,
    children,
}: {
    name: string;
    children: React.ReactNode;
}) {
    const { enabled } = useFeatures();
    return enabled(name) ? children : null;
}
export function FeatureAccess({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { enabled, ready, error, refresh } = useFeatures();
    const required = requiredFeature(pathname);
    if (
        !required ||
        (enabled(required) &&
            (pathname !== '/image-compressor' || enabled('conversions')))
    )
        return children;
    return (
        <>
            <Navbar />
            <main className="app-container py-12">
                <h1 className="text-2xl font-semibold">
                    {ready ? 'Feature unavailable' : 'Loading availability…'}
                </h1>
                <p className="muted mt-3">
                    {error ||
                        (ready
                            ? 'This feature is currently disabled.'
                            : 'Checking availability.')}
                </p>
                {error && (
                    <button
                        className="btn btn-secondary px-4 mt-4"
                        onClick={() => void refresh()}
                    >
                        Retry
                    </button>
                )}
                <NextLink className="btn btn-primary px-4 mt-4 ml-3" href="/">
                    Browse tools
                </NextLink>
            </main>
        </>
    );
}

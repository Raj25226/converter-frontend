'use client';
import { useCallback, useRef, useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';

declare global {
    interface Window {
        google?: {
            accounts: {
                id: {
                    initialize(options: {
                        client_id: string;
                        callback: (response: { credential: string }) => void;
                    }): void;
                    renderButton(
                        element: HTMLElement,
                        options: {
                            theme: string;
                            size: string;
                            text: string;
                            width: number;
                        },
                    ): void;
                };
            };
        };
    }
}
interface Props {
    text?: 'signin_with' | 'signup_with' | 'continue_with';
    className?: string;
}
export default function GoogleSignIn({
    text = 'continue_with',
    className = '',
}: Props) {
    const router = useRouter();
    const button = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const credential = useCallback(
        async (response: { credential: string }) => {
            setError(null);
            try {
                const res = await fetch('/api/auth/google', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(response),
                });
                const data = await res.json();
                if (!res.ok || !data.token || !data.user)
                    throw new Error(data.message || 'Google sign-in failed.');
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                router.push('/dashboard');
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Unable to sign in.');
            }
        },
        [router],
    );
    const initialize = () => {
        if (!window.google || !button.current || !clientId) return;
        window.google.accounts.id.initialize({
            client_id: clientId,
            callback: credential,
        });
        window.google.accounts.id.renderButton(button.current, {
            theme: 'outline',
            size: 'large',
            text,
            width: 300,
        });
    };
    if (!clientId) return null;
    return (
        <div className={className}>
            <Script
                src="https://accounts.google.com/gsi/client"
                onReady={initialize}
                onError={() =>
                    setError(
                        'Google sign-in could not load. Use email sign-in below.',
                    )
                }
            />
            <div ref={button} className="flex justify-center" />
            {error && (
                <p role="alert" className="text-sm text-red-600 mt-3">
                    {error}
                </p>
            )}
            <p
                className="text-center text-xs my-5"
                style={{ color: 'rgb(var(--muted))' }}
            >
                or continue with email
            </p>
        </div>
    );
}

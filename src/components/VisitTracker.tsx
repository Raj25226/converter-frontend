'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
export default function VisitTracker() {
    const pathname = usePathname();
    useEffect(() => {
        try {
            let sessionId = sessionStorage.getItem('visit_session_id');
            if (!sessionId) {
                sessionId = crypto.randomUUID();
                sessionStorage.setItem('visit_session_id', sessionId);
            }
            fetch('/api/analytics/track-visit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId, page: pathname }),
            }).catch(() => {});
        } catch {
            /* Analytics does not prevent conversion when storage is unavailable. */
        }
    }, [pathname]);
    return null;
}

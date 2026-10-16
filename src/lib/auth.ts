export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'user' | 'admin';
    picture?: string;
    emailVerified?: boolean;
}

export function getUser(): User | null {
    if (typeof window === 'undefined') return null;
    try {
        const raw = localStorage.getItem('user');
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
}

export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

export function isLoggedIn(): boolean {
    return !!getToken();
}

export function isAdmin(): boolean {
    const user = getUser();
    return user?.role === 'admin';
}

// Conversion history stored locally until backend is available
export interface ConversionRecord {
    id: string;
    type: string;
    fileName: string;
    downloadUrl?: string;
    timestamp: number;
    expiresAt: number; // 30 mins
}

export function saveConversionHistory(
    record: Omit<ConversionRecord, 'id' | 'expiresAt'>,
) {
    if (typeof window === 'undefined') return;
    try {
        const history = getConversionHistory();
        const newRecord: ConversionRecord = {
            ...record,
            id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
            expiresAt: Date.now() + 30 * 60 * 1000,
        };
        history.unshift(newRecord);
        // Keep last 50 records
        const trimmed = history.slice(0, 50);
        localStorage.setItem('fc_history', JSON.stringify(trimmed));
    } catch {
        /* History is optional when browser storage is unavailable. */
    }
}

export function getConversionHistory(): ConversionRecord[] {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem('fc_history');
        if (!raw) return [];
        const all: ConversionRecord[] = JSON.parse(raw);
        // Filter expired
        const now = Date.now();
        return all.filter((r) => r.expiresAt > now);
    } catch {
        return [];
    }
}

export function deleteConversionRecord(id: string) {
    const history = getConversionHistory();
    const filtered = history.filter((r) => r.id !== id);
    localStorage.setItem('fc_history', JSON.stringify(filtered));
}

export function clearConversionHistory() {
    localStorage.removeItem('fc_history');
}

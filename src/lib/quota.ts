// Client-side quota tracking
// All limits are configurable via environment variables in .env.local

// ── Read limits from env (with safe fallbacks) ──────────────
export const LIMITS = {
  /** Max conversions/day for unauthenticated guests */
  GUEST_DAILY: parseInt(process.env.NEXT_PUBLIC_GUEST_DAILY_LIMIT ?? '2', 10),

  /** Max conversions/day for logged-in free users */
  USER_DAILY: parseInt(process.env.NEXT_PUBLIC_USER_DAILY_LIMIT ?? '10', 10),

  /** Max conversions/day for Pro subscribers */
  PRO_DAILY: parseInt(process.env.NEXT_PUBLIC_PRO_DAILY_LIMIT ?? '100', 10),

  /** Max file size in bytes for guests */
  GUEST_MAX_FILE_BYTES:
    parseInt(process.env.NEXT_PUBLIC_GUEST_MAX_FILE_SIZE_MB ?? '10', 10) * 1024 * 1024,

  /** Max file size in bytes for free logged-in users */
  USER_MAX_FILE_BYTES:
    parseInt(process.env.NEXT_PUBLIC_USER_MAX_FILE_SIZE_MB ?? '50', 10) * 1024 * 1024,

  /** Max file size in bytes for Pro users */
  PRO_MAX_FILE_BYTES:
    parseInt(process.env.NEXT_PUBLIC_PRO_MAX_FILE_SIZE_MB ?? '500', 10) * 1024 * 1024,

  /** Converted file expiry in milliseconds */
  FILE_EXPIRY_MS:
    parseInt(process.env.NEXT_PUBLIC_FILE_EXPIRY_MINUTES ?? '30', 10) * 60 * 1000,

  /** Max history records stored per user */
  MAX_HISTORY: parseInt(process.env.NEXT_PUBLIC_MAX_HISTORY_RECORDS ?? '50', 10),
} as const;

// ── Human-readable helpers ───────────────────────────────────
export const LIMIT_LABELS = {
  guestMaxFileMB: parseInt(process.env.NEXT_PUBLIC_GUEST_MAX_FILE_SIZE_MB ?? '10', 10),
  userMaxFileMB: parseInt(process.env.NEXT_PUBLIC_USER_MAX_FILE_SIZE_MB ?? '50', 10),
  proMaxFileMB: parseInt(process.env.NEXT_PUBLIC_PRO_MAX_FILE_SIZE_MB ?? '500', 10),
  fileExpiryMinutes: parseInt(process.env.NEXT_PUBLIC_FILE_EXPIRY_MINUTES ?? '30', 10),
} as const;

// ── Internal ─────────────────────────────────────────────────
const QUOTA_KEY = 'fc_quota';

interface QuotaData {
  count: number;
  date: string; // YYYY-MM-DD
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function getQuotaData(): QuotaData {
  if (typeof window === 'undefined') return { count: 0, date: getToday() };
  try {
    const raw = localStorage.getItem(QUOTA_KEY);
    if (!raw) return { count: 0, date: getToday() };
    const data: QuotaData = JSON.parse(raw);
    // Reset if new day
    if (data.date !== getToday()) {
      return { count: 0, date: getToday() };
    }
    return data;
  } catch {
    return { count: 0, date: getToday() };
  }
}

export function incrementQuota() {
  const data = getQuotaData();
  data.count += 1;
  data.date = getToday();
  localStorage.setItem(QUOTA_KEY, JSON.stringify(data));
}

export type UserTier = 'guest' | 'user' | 'pro';

function getDailyLimit(tier: UserTier): number {
  switch (tier) {
    case 'pro':  return LIMITS.PRO_DAILY;
    case 'user': return LIMITS.USER_DAILY;
    default:     return LIMITS.GUEST_DAILY;
  }
}

export function getMaxFileSize(tier: UserTier): number {
  switch (tier) {
    case 'pro':  return LIMITS.PRO_MAX_FILE_BYTES;
    case 'user': return LIMITS.USER_MAX_FILE_BYTES;
    default:     return LIMITS.GUEST_MAX_FILE_BYTES;
  }
}

/** @deprecated Use canConvertTiered instead */
export function canConvert(isLoggedIn: boolean): boolean {
  return canConvertTiered(isLoggedIn ? 'user' : 'guest');
}

export function canConvertTiered(tier: UserTier): boolean {
  const { count } = getQuotaData();
  return count < getDailyLimit(tier);
}

/** @deprecated Use getRemainingQuotaTiered instead */
export function getRemainingQuota(
  isLoggedIn: boolean
): { used: number; limit: number; remaining: number } {
  return getRemainingQuotaTiered(isLoggedIn ? 'user' : 'guest');
}

export function getRemainingQuotaTiered(
  tier: UserTier
): { used: number; limit: number; remaining: number } {
  const { count } = getQuotaData();
  const limit = getDailyLimit(tier);
  return { used: count, limit, remaining: Math.max(0, limit - count) };
}
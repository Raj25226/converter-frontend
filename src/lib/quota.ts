// Client-side quota tracking
// Guest: 2/day, Logged in: 10/day

const GUEST_LIMIT = 2;
const USER_LIMIT = 10;
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

export function canConvert(isLoggedIn: boolean): boolean {
  const { count } = getQuotaData();
  const limit = isLoggedIn ? USER_LIMIT : GUEST_LIMIT;
  return count < limit;
}

export function getRemainingQuota(isLoggedIn: boolean): { used: number; limit: number; remaining: number } {
  const { count } = getQuotaData();
  const limit = isLoggedIn ? USER_LIMIT : GUEST_LIMIT;
  return { used: count, limit, remaining: Math.max(0, limit - count) };
}

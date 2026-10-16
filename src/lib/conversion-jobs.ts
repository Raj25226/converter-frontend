import { getUser } from "./auth";

export interface ConversionResult {
  downloadUrl: string; fileName: string; expiresAt: string; fileSize: number; warnings?: string[];
}
export interface ConversionJob {
  jobId: string; requestId: string; status: "uploading" | "queued" | "running" | "succeeded" | "failed" | "cancelled" | "expired";
  tool: string; originalFileName: string; createdAt: string; updatedAt: string;
  result?: ConversionResult; error?: string;
}
export interface PendingConversion { requestId: string; jobId?: string; }
const key = (endpoint: string) => `conversion-job:${getUser()?.id ?? "guest"}:${endpoint}`;
export function readPending(endpoint: string): PendingConversion | null {
  try {
    const value = JSON.parse(localStorage.getItem(key(endpoint)) || "null");
    return value && typeof value.requestId === "string" && /^[a-zA-Z0-9-]{16,64}$/.test(value.requestId)
      && (!value.jobId || /^[a-f0-9]{32}$/.test(value.jobId)) ? value : null;
  } catch { return null; }
}
export function savePending(endpoint: string, pending: PendingConversion) {
  try { localStorage.setItem(key(endpoint), JSON.stringify(pending)); } catch { /* Jobs remain recoverable by signed-in accounts. */ }
}
export function clearPending(endpoint: string) { try { localStorage.removeItem(key(endpoint)); } catch { } }
export const isActiveJob = (job: ConversionJob) => ["uploading", "queued", "running"].includes(job.status);
export function downloadPath(url: string) {
  const path = new URL(url, window.location.origin).pathname;
  if (!/^\/api\/download\/[a-f0-9]{32}$/.test(path)) throw new Error("Invalid download response.");
  return path;
}

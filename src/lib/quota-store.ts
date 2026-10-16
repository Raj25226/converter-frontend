"use client";

import { useEffect, useSyncExternalStore } from "react";
import { getToken } from "./auth";

interface Quota { remaining: number; limit: number; used: number; }
interface Snapshot { quota: Quota | null; error: string | null; }
const empty: Snapshot = { quota: null, error: null };
let snapshot = empty;
let identity: string | null | undefined;
let fetchedAt = 0;
let fetchedDay = "";
let generation = 0;
let pending: { token: string | null; promise: Promise<void> } | null = null;
let consumers = 0;
let refreshAfterPending = false;
const listeners = new Set<() => void>();
function publish(value: Snapshot) { snapshot = value; listeners.forEach(listener => listener()); }
function subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; }

export function refreshQuota(force = false): Promise<void> {
  const token = getToken();
  const day = new Date().toISOString().slice(0, 10);
  if (identity !== token) { identity = token; generation++; pending = null; refreshAfterPending = false; fetchedAt = 0; publish(empty); }
  if (pending?.token === token) { refreshAfterPending ||= force; return pending.promise; }
  if (!force && snapshot.quota && day === fetchedDay && Date.now() - fetchedAt < 30000) return Promise.resolve();
  const currentGeneration = generation;
  const promise = (async () => {
    try {
      const response = await fetch("/api/convert/quota", { headers: token ? { Authorization: `Bearer ${token}` } : {}, cache: "no-store" });
      if (!response.ok) throw new Error("Unable to load daily allowance.");
      const quota = await response.json() as Quota;
      if (typeof quota.remaining !== "number" || typeof quota.limit !== "number") throw new Error("Invalid allowance response.");
      if (generation === currentGeneration) { fetchedAt = Date.now(); fetchedDay = day; publish({ quota, error: null }); }
    } catch {
      if (generation === currentGeneration) publish({ quota: snapshot.quota, error: "Unable to load daily allowance." });
    } finally { if (generation === currentGeneration && pending?.token === token) {
        pending = null;
        if (refreshAfterPending) { refreshAfterPending = false; void refreshQuota(true); }
      } }
  })();
  pending = { token, promise };
  return promise;
}
function invalidate() { fetchedAt = 0; void refreshQuota(true); }
function onFocus() { if (document.visibilityState === "visible") void refreshQuota(); }
export function useQuota() {
  const state = useSyncExternalStore(subscribe, () => snapshot, () => empty);
  useEffect(() => {
    if (consumers++ === 0) {
      window.addEventListener("conversion-quota-changed", invalidate);
      window.addEventListener("storage", invalidate);
      window.addEventListener("focus", onFocus);
    }
    void refreshQuota();
    return () => {
      if (--consumers === 0) {
        window.removeEventListener("conversion-quota-changed", invalidate);
        window.removeEventListener("storage", invalidate);
        window.removeEventListener("focus", onFocus);
      }
    };
  }, []);
  return state;
}

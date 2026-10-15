"use client";
// Case state kept on this device: evidence collected (A–T), UV torch, sound, dials. One tiny external store.
import { useSyncExternalStore } from "react";

export type Dials = { energy: 1 | 2 | 3; rhythm: 1 | 2 | 3; motion: 1 | 2 | 3 };
export type CaseState = { evidence: string[]; uv: boolean; sound: boolean; soundAsked: boolean; dials: Dials; seen: string[] };

const KEY = "motomation-case-v1";
const initial: CaseState = { evidence: [], uv: false, sound: false, soundAsked: false, dials: { energy: 2, rhythm: 2, motion: 2 }, seen: [] };
let state: CaseState = initial;
let loaded = false;
const subs = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = { ...initial, ...JSON.parse(raw), uv: false };
  } catch { /* private mode: state stays in memory */ }
}
function save() { try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ } }

export function setCase(patch: Partial<CaseState> | ((s: CaseState) => Partial<CaseState>)) {
  load();
  const p = typeof patch === "function" ? patch(state) : patch;
  state = { ...state, ...p };
  save();
  subs.forEach((f) => f());
}
export function getCase() { load(); return state; }
export function useCase<T>(pick: (s: CaseState) => T): T {
  return useSyncExternalStore(
    (f) => { subs.add(f); return () => subs.delete(f); },
    () => pick(getCase()),
    () => pick(initial),
  );
}
export function collect(letter: string) {
  setCase((s) => (s.evidence.includes(letter) ? {} : { evidence: [...s.evidence, letter].sort() }));
}
export function markSeen(ids: string[]) {
  setCase((s) => { const add = ids.filter((i) => !s.seen.includes(i)); return add.length ? { seen: [...s.seen, ...add] } : {}; });
}

"use client";
// Context dimension: decide whether a device should get the live WebGL scene or its designed poster.
export function lowEnd(): boolean {
  if (typeof navigator === "undefined") return false;
  const n = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean; effectiveType?: string } };
  if (n.connection?.saveData) return true;
  if (n.connection?.effectiveType && /(^|-)2g$/.test(n.connection.effectiveType)) return true;
  if (typeof n.deviceMemory === "number" && n.deviceMemory < 4) return true;
  if (typeof n.hardwareConcurrency === "number" && n.hardwareConcurrency < 4) return true;
  return false;
}
export function webglOK(): boolean {
  try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch { return false; }
}
export const dpr = (cap = 1.75) => Math.min(cap, typeof window === "undefined" ? 1 : window.devicePixelRatio || 1);
export function hourOfDay() { return new Date().getHours(); }

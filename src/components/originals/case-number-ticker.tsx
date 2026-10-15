"use client";
// @motomation-component
// id: case-number-ticker
// name: Case Number Ticker
// family: micro
// tier: 1
// deps: react
// what: A time-on-file counter (hh:mm:ss since this device first opened the case) that sits beside the case number.
// use-when: The concept is an investigation, a log or a shift; one per site, in the frame, never in content.
// avoid-when: Slop when used as a fake "live" stat, a countdown to nothing, or a number that pretends to be data.
// reduced-motion: Same: it is a number that changes once a second; no animation is added.
// touch: Same as desktop.
// a11y: role="timer" with aria-live off, so screen readers are not interrupted every second.
// status: candidate to contribute back to the skill (examples/components/micro)
import { useEffect, useState } from "react";

const KEY = "motomation-opened";
export function CaseTicker() {
  const [t, setT] = useState<string>("00:00:00");
  useEffect(() => {
    let start = Date.now();
    try { const s = localStorage.getItem(KEY); if (s) start = +s; else localStorage.setItem(KEY, String(start)); } catch { /* private mode */ }
    const tick = () => {
      const s = Math.floor((Date.now() - start) / 1000);
      const hh = Math.floor(s / 3600) % 100, mm = Math.floor(s / 60) % 60, ss = s % 60;
      setT([hh, mm, ss].map((n) => String(n).padStart(2, "0")).join(":"));
    };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);
  return <time role="timer" aria-live="off" aria-label="Time on file" style={{ fontVariantNumeric: "tabular-nums" }}>{t}</time>;
}

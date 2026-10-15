"use client";
// Web Audio, synthesised. Nothing loads, nothing plays until the visitor turns sound on.
import { getCase } from "./store";

let ctx: AudioContext | null = null;
function ac() {
  if (!getCase().sound) return null;
  if (!ctx) { const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext; ctx = new C(); }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}
type Voice = "tick" | "thud" | "blip" | "snip" | "chime" | "hiss" | "seal" | "pop";
export function sfx(v: Voice = "tick", gain = 0.08) {
  const a = ac(); if (!a) return;
  const t = a.currentTime; const g = a.createGain(); g.connect(a.destination);
  const env = (dur: number, peak = gain) => { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); };
  if (v === "hiss" || v === "snip") {
    const len = v === "hiss" ? 0.35 : 0.06; const buf = a.createBuffer(1, a.sampleRate * len, a.sampleRate); const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const s = a.createBufferSource(); s.buffer = buf; const f = a.createBiquadFilter(); f.type = "highpass"; f.frequency.value = v === "hiss" ? 3000 : 5000;
    s.connect(f).connect(g); env(len, gain * 0.7); s.start(t); return;
  }
  const o = a.createOscillator(); o.connect(g);
  const map: Record<string, [OscillatorType, number, number, number]> = {
    tick: ["square", 1800, 1200, 0.03], thud: ["sine", 120, 50, 0.18], blip: ["square", 660, 990, 0.09],
    chime: ["sine", 1320, 1320, 0.9], seal: ["triangle", 220, 90, 0.25], pop: ["sine", 400, 900, 0.08],
  };
  const [type, f0, f1, dur] = map[v] ?? map.tick;
  o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
  env(dur); o.start(t); o.stop(t + dur + 0.02);
}
export function buzz(ms = 8) { try { if (getCase().sound && "vibrate" in navigator) navigator.vibrate(ms); } catch { /* unsupported */ } }

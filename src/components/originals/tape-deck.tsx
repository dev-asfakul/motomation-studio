"use client";
// @motomation-component
// id: tape-deck
// name: Tape Deck
// family: scroll
// tier: 3
// deps: react
// what: Transport controls (rewind, play, pause, fast-forward) with two SVG reels and a timecode counter that drive the page's scroll inside one section. The reels spin at the real scroll speed, so scrolling by hand turns them too.
// use-when: A scrubbed scroll story (a reel, a tape, a timeline) where giving the visitor transport buttons makes the scroll position feel like media.
// avoid-when: Slop on a normal page with no timeline, or autoplaying on load.
// reduced-motion: Buttons jump between chapter marks instead of rolling; reels do not spin.
// touch: 48px buttons; the deck never captures scroll.
// a11y: A labelled toolbar; buttons have aria-pressed for the active mode; the counter is a timer with aria-live off.
// status: candidate to contribute back to the skill (examples/components/scroll)
import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { useReducedMotion } from "@/lib/motion";
import { sfx } from "@/lib/sound";

type Mode = "stop" | "play" | "rew" | "ff";
type Props = { section: RefObject<HTMLElement | null>; seconds: number; marks: number[]; fps?: number; onMode?: (m: Mode) => void; className?: string; style?: CSSProperties };
const SPEED: Record<Mode, number> = { stop: 0, play: 1, rew: -6, ff: 6 };
const tc = (s: number, fps: number) => { const f = Math.floor((s % 1) * fps); const t = Math.floor(s); return `${String(Math.floor(t / 3600)).padStart(2, "0")}:${String(Math.floor(t / 60) % 60).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}:${String(f).padStart(2, "0")}`; };

export function TapeDeck({ section, seconds, marks, fps = 24, onMode, className, style }: Props) {
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<Mode>("stop");
  const counter = useRef<HTMLSpanElement>(null); const reels = useRef<SVGGElement[]>([]);
  const geo = () => { const el = section.current!; const top = el.getBoundingClientRect().top + scrollY; const run = el.offsetHeight - innerHeight; return { top, run }; };
  const go = (y: number) => { const l = window.__lenis; if (l) l.scrollTo(y, { immediate: true }); else window.scrollTo(0, y); };
  useEffect(() => {
    let raf = 0, last = 0, rot = 0, lastY = scrollY;
    const tick = (t: number) => {
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 0; last = t; const { top, run } = geo();
      if (mode !== "stop" && run > 0) { const p = (scrollY - top) / run; const np = p + (SPEED[mode] * dt) / seconds; if (np >= 1 || np <= 0) { go(top + Math.max(0, Math.min(1, np)) * run); setMode("stop"); onMode?.("stop"); sfx("thud", 0.03); } else go(top + np * run); }
      const p = run > 0 ? Math.max(0, Math.min(1, (scrollY - top) / run)) : 0;
      if (counter.current) counter.current.textContent = tc(p * seconds, fps);
      const v = scrollY - lastY; lastY = scrollY; if (!reduce) { rot += v * 0.6; reels.current.forEach((g, i) => g?.setAttribute("transform", `rotate(${rot * (i ? 1.3 : 1)} 30 30)`)); }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [mode, seconds, fps, reduce]); // eslint-disable-line react-hooks/exhaustive-deps
  const press = (m: Mode) => {
    sfx(m === "stop" ? "thud" : "tick", 0.04);
    if (reduce && (m === "rew" || m === "ff")) { const { top, run } = geo(); const p = (scrollY - top) / run; const to = m === "ff" ? marks.find((k) => k > p + 0.01) ?? 1 : [...marks].reverse().find((k) => k < p - 0.01) ?? 0; go(top + to * run + 2); return; }
    const nm = mode === m ? "stop" : m; setMode(nm); onMode?.(nm);
  };
  const reel = (i: number) => (
    <svg viewBox="0 0 60 60" className="td-reel" aria-hidden="true"><circle cx="30" cy="30" r="27" fill="none" stroke="currentColor" strokeWidth="2" />
      <g ref={(el) => { if (el) reels.current[i] = el; }}>{[0, 120, 240].map((a) => <path key={a} d="M30 30 L30 8 A22 22 0 0 1 49 19 Z" transform={`rotate(${a} 30 30)`} fill="currentColor" opacity="0.5" />)}<circle cx="30" cy="30" r="5" fill="currentColor" /></g></svg>
  );
  const B = ({ m, label, glyph }: { m: Mode; label: string; glyph: string }) => <button type="button" aria-label={label} aria-pressed={mode === m} onClick={() => press(m)}><span aria-hidden="true">{glyph}</span></button>;
  return (
    <div className={`td ${className ?? ""}`} style={style} role="toolbar" aria-label="Tape deck: drives this reel">
      <div className="td-window">{reel(0)}<span className="td-tc" role="timer" aria-live="off" aria-label="Timecode"><span ref={counter}>00:00:00:00</span></span>{reel(1)}</div>
      <div className="td-keys"><B m="rew" label="Rewind" glyph="◀◀" /><B m="play" label="Play" glyph="▶" /><B m="stop" label="Pause" glyph="❚❚" /><B m="ff" label="Fast forward" glyph="▶▶" /></div>
    </div>
  );
}

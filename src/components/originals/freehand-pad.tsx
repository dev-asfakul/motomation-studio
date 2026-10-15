"use client";
// @motomation-component
// id: freehand-pad
// name: Freehand Pad
// family: cursor
// tier: 2
// deps: react
// what: Draw on the page with a mouse, pen or finger. Stroke width follows speed and pen pressure (thin when fast, heavier when slow or pressed), strokes are smoothed with quadratic curves and saved to this device, with Undo and Clear.
// use-when: Notebook, sketch or feedback pages where the visitor's own marks belong on the page.
// avoid-when: Slop as a full-page doodle layer that steals scrolling, or anywhere drawings would be sent somewhere without saying so.
// reduced-motion: Same; it has no animation of its own.
// touch: touch-action none on the pad only; the rest of the page scrolls.
// a11y: The pad is a labelled image region; Undo and Clear are buttons; drawing is optional to every task.
// status: candidate to contribute back to the skill (examples/components/cursor)
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { sfx } from "@/lib/sound";
type Pt = [number, number, number]; type Props = { storageKey: string; ink: string; label: string; className?: string; style?: CSSProperties };
export function FreehandPad({ storageKey, ink, label, className, style }: Props) {
  const cv = useRef<HTMLCanvasElement>(null); const strokes = useRef<Pt[][]>([]); const [n, setN] = useState(0);
  const redraw = () => {
    const c = cv.current; const g = c?.getContext("2d"); if (!c || !g) return; const k = c.width / c.clientWidth; g.setTransform(k, 0, 0, k, 0, 0); g.clearRect(0, 0, c.clientWidth, c.clientHeight);
    g.strokeStyle = ink; g.lineCap = "round"; g.lineJoin = "round";
    for (const s of strokes.current) for (let i = 1; i < s.length; i++) { const a = s[i - 1], b = s[i]; const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; g.lineWidth = b[2]; g.beginPath(); g.moveTo(a[0], a[1]); g.quadraticCurveTo(a[0], a[1], m[0], m[1]); g.lineTo(b[0], b[1]); g.stroke(); }
  };
  useEffect(() => {
    try { strokes.current = JSON.parse(localStorage.getItem(storageKey) || "[]"); } catch { strokes.current = []; } setN(strokes.current.length);
    const c = cv.current!; const ro = new ResizeObserver(() => { const k = Math.min(2, devicePixelRatio || 1); c.width = c.clientWidth * k; c.height = c.clientHeight * k; redraw(); }); ro.observe(c); return () => ro.disconnect();
  }, [storageKey]); // eslint-disable-line react-hooks/exhaustive-deps
  const save = () => { try { localStorage.setItem(storageKey, JSON.stringify(strokes.current.slice(-80))); } catch { /* storage full or blocked */ } setN(strokes.current.length); };
  const down = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = e.currentTarget; c.setPointerCapture(e.pointerId); const r = c.getBoundingClientRect(); let last = { x: e.clientX, y: e.clientY, t: performance.now() };
    const s: Pt[] = [[e.clientX - r.left, e.clientY - r.top, 2]]; strokes.current.push(s); sfx("hiss", 0.015);
    const mv = (m: PointerEvent) => { const now = performance.now(); const v = Math.hypot(m.clientX - last.x, m.clientY - last.y) / Math.max(1, now - last.t); const pr = m.pressure && m.pointerType === "pen" ? m.pressure : 0.5; const w = Math.max(0.8, Math.min(4.2, (2.8 - v * 1.4) * (0.6 + pr))); s.push([m.clientX - r.left, m.clientY - r.top, w]); last = { x: m.clientX, y: m.clientY, t: now }; redraw(); };
    const up = () => { c.removeEventListener("pointermove", mv); c.removeEventListener("pointerup", up); save(); };
    c.addEventListener("pointermove", mv); c.addEventListener("pointerup", up);
  };
  return (
    <div className={`fp ${className ?? ""}`} style={style}>
      <canvas ref={cv} role="img" aria-label={`${label}. ${n} stroke${n === 1 ? "" : "s"} saved on this device.`} onPointerDown={down} style={{ touchAction: "none", width: "100%", height: "100%", display: "block" }} />
      <div className="fp-ctrl"><button type="button" onClick={() => { strokes.current.pop(); redraw(); save(); }} disabled={!n}>Undo</button><button type="button" onClick={() => { strokes.current = []; redraw(); save(); }} disabled={!n}>Clear page</button><span>{n ? `${n} stroke${n === 1 ? "" : "s"}, kept on this device` : "Notes stay on this device"}</span></div>
    </div>
  );
}

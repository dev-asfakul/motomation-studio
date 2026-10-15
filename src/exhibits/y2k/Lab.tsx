"use client";
import { useMemo, useRef, useState } from "react";
import { TiltCard } from "@/vendor/motomation/components/cursor/tilt-card";
import { useReducedMotion } from "@/lib/motion";
import { sfx } from "@/lib/sound";
import type { Exhibit } from "@/content/exhibits";

// Spring tuner: stiffness and damping retune the pop; the curve is the same integration the window runs.
function curve(k: number, c: number) { const pts: number[] = []; let x = 0, v = 0; for (let i = 0; i < 90; i++) { const a = k * (1 - x) - c * v; v += a / 60; x += v / 60; pts.push(x); } return pts; }
export default function Lab({ e }: { e: Exhibit }) {
  void e;
  const reduce = useReducedMotion();
  const [k, setK] = useState(180); const [c, setC] = useState(12);
  const win = useRef<HTMLDivElement>(null);
  const pts = useMemo(() => curve(k, c), [k, c]);
  const peak = Math.max(...pts);
  const pop = () => {
    sfx("pop", 0.05); const el = win.current; if (!el || reduce) return;
    el.getAnimations().forEach((a) => a.cancel());
    el.animate(pts.map((p) => ({ transform: `scale(${(0.6 + 0.4 * p).toFixed(3)})`, opacity: Math.min(1, p * 2) })), { duration: 1500, easing: "linear" });
  };
  const d = pts.map((p, i) => `${i ? "L" : "M"}${(i / 89) * 300} ${110 - p * 70}`).join(" ");
  return (
    <div className="e-lab">
      <div className="e-ctrl">
        <label>Stiffness <b>{k}</b><input type="range" min={40} max={400} value={k} onChange={(ev) => setK(+ev.target.value)} /></label>
        <label>Damping <b>{c}</b><input type="range" min={2} max={40} value={c} onChange={(ev) => setC(+ev.target.value)} /></label>
        <svg viewBox="0 0 300 130" className="e-curve" role="img" aria-label={`Spring curve, overshoot ${Math.round((peak - 1) * 100)} percent`}><path d="M0 40H300" className="e-target" /><path d={d} /></svg>
        <p className="x-k">Overshoot {Math.max(0, Math.round((peak - 1) * 100))}%</p>
        <button type="button" className="e-pop" onClick={pop}>Pop the window</button>
      </div>
      <div className="e-stage">
        <div ref={win} className="sw-win e-demo"><header className="sw-bar"><span>spring_test.exe</span></header><div className="sw-body"><p>k {k} · c {c}</p></div></div>
        <TiltCard max={14}><div className="e-cd e-cd-lab" role="img" aria-label="The CD, tilt it"><span>MOTOMATION_<br />FINAL_v2</span></div></TiltCard>
      </div>
    </div>
  );
}

"use client";
// @motomation-component
// id: rain-glass
// name: Rain Glass
// family: backgrounds
// tier: 2
// deps: react
// what: Rain on a window at night, on a 2D canvas: falling streaks behind, and droplets on the glass that bead, merge and run down with a short trail. Neon from the palette is reflected in each drop.
// use-when: Night, noir, cyberpunk or weather pages that need one atmospheric layer behind content that sits on its own solid panels.
// avoid-when: Slop behind body text, or as a permanent loop on a page about something else.
// reduced-motion: Rain stops: one still frame of drops on the glass.
// touch: Same; it never captures input.
// a11y: Decorative, aria-hidden. Pauses off screen and in hidden tabs.
// status: candidate to contribute back to the skill (examples/components/backgrounds)
import { useEffect, useRef, type CSSProperties } from "react";
import { useReducedMotion, useFrameLoop } from "@/lib/motion";

type Props = { neon: string[]; className?: string; style?: CSSProperties; density?: number };
type Drop = { x: number; y: number; r: number; v: number; c: string };
export function RainGlass({ neon, className, style, density = 1 }: Props) {
  const reduce = useReducedMotion();
  const cv = useRef<HTMLCanvasElement>(null);
  const st = useRef({ drops: [] as Drop[], streaks: [] as { x: number; y: number; l: number; v: number }[], w: 0, h: 0 });
  const seed = (w: number, h: number) => {
    const s = st.current; s.w = w; s.h = h;
    s.drops = Array.from({ length: Math.round(((w * h) / 9000) * density) }, () => ({ x: Math.random() * w, y: Math.random() * h, r: 1 + Math.random() * 3.5, v: 0, c: neon[(Math.random() * neon.length) | 0] }));
    s.streaks = Array.from({ length: Math.round((w / 6) * density) }, () => ({ x: Math.random() * w, y: Math.random() * h, l: 8 + Math.random() * 22, v: 9 + Math.random() * 9 }));
  };
  const draw = (move: boolean) => {
    const c = cv.current; const g = c?.getContext("2d"); if (!c || !g) return; const s = st.current;
    g.clearRect(0, 0, s.w, s.h); g.strokeStyle = "rgba(238,238,236,0.18)"; g.lineWidth = 1; g.beginPath();
    for (const k of s.streaks) { if (move) { k.y += k.v; if (k.y > s.h) { k.y = -k.l; k.x = Math.random() * s.w; } } g.moveTo(k.x, k.y); g.lineTo(k.x - 1.5, k.y + k.l); }
    g.stroke();
    for (const d of s.drops) {
      if (move) { if (d.r > 3 && Math.random() < 0.02) d.v = 1.5 + d.r * 0.4; d.y += d.v; d.v *= 0.97; if (d.v > 0.3) { g.fillStyle = "rgba(238,238,236,0.12)"; g.fillRect(d.x - 0.5, d.y - 14, 1, 14); } if (d.y > s.h + 10) { d.y = -10; d.x = Math.random() * s.w; d.r = 1 + Math.random() * 3; d.v = 0; } if (Math.random() < 0.003) d.r = Math.min(5, d.r + 0.4); }
      const gr = g.createRadialGradient(d.x - d.r * 0.3, d.y - d.r * 0.3, 0, d.x, d.y, d.r); gr.addColorStop(0, "rgba(255,255,255,0.7)"); gr.addColorStop(0.6, d.c + "66"); gr.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = gr; g.beginPath(); g.arc(d.x, d.y, d.r, 0, Math.PI * 2); g.fill();
    }
  };
  useEffect(() => {
    const c = cv.current!; const ro = new ResizeObserver(([e]) => { const { width: w, height: h } = e.contentRect; const k = Math.min(1.5, devicePixelRatio || 1); c.width = w * k; c.height = h * k; c.getContext("2d")!.setTransform(k, 0, 0, k, 0, 0); seed(w, h); draw(false); });
    ro.observe(c); return () => ro.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useFrameLoop(cv, () => draw(true), !reduce);
  return <canvas ref={cv} className={className} aria-hidden="true" style={{ width: "100%", height: "100%", display: "block", ...style }} />;
}

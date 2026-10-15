"use client";
// @motomation-component
// id: heat-field
// name: Heat Field
// family: backgrounds
// tier: 2
// deps: react
// what: A low-resolution thermal field on a 2D canvas: heat diffuses and cools on a grid, the pointer is a warm source, and a colour ramp maps temperature to the palette. Scaled up and blurred by the browser, it reads as living colour under glass.
// use-when: Under frosted glass or behind a single specimen, where the colour should feel alive and respond to presence.
// avoid-when: Slop as a generic "animated gradient" behind text that must be read; text sits on glass, never on the field.
// reduced-motion: One still frame of the field with three fixed warm spots; no simulation.
// touch: Touch points are warm sources too; the canvas never blocks scroll.
// a11y: Decorative, aria-hidden.
// status: candidate to contribute back to the skill (examples/components/backgrounds)
import { useEffect, useRef, type CSSProperties } from "react";
import { useReducedMotion, useFrameLoop } from "@/lib/motion";

type Props = { ramp: string[]; className?: string; style?: CSSProperties };
const W = 72, H = 44;
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
export function HeatField({ ramp, className, style }: Props) {
  const reduce = useReducedMotion();
  const cv = useRef<HTMLCanvasElement>(null);
  const s = useRef({ a: new Float32Array(W * H), b: new Float32Array(W * H), px: -1, py: -1, img: null as ImageData | null });
  const lut = useRef<number[][]>([]);
  useEffect(() => {
    const cols = ramp.map(hex); const out: number[][] = [];
    for (let i = 0; i < 256; i++) { const t = (i / 255) * (cols.length - 1); const k = Math.floor(t), f = t - k; const a = cols[k], b = cols[Math.min(cols.length - 1, k + 1)]; out.push([0, 1, 2].map((j) => a[j] + (b[j] - a[j]) * f)); }
    lut.current = out;
    const st = s.current; [[0.25, 0.4], [0.7, 0.3], [0.5, 0.75]].forEach(([x, y]) => { for (let j = -6; j <= 6; j++) for (let i = -6; i <= 6; i++) { const X = Math.round(x * W) + i, Y = Math.round(y * H) + j; if (X >= 0 && Y >= 0 && X < W && Y < H) st.a[Y * W + X] = Math.max(0, 1 - Math.hypot(i, j) / 7); } });
    paint();
    const mv = (e: PointerEvent) => { const r = cv.current?.getBoundingClientRect(); if (!r) return; st.px = ((e.clientX - r.left) / r.width) * W; st.py = ((e.clientY - r.top) / r.height) * H; };
    window.addEventListener("pointermove", mv, { passive: true }); return () => window.removeEventListener("pointermove", mv);
  }, [ramp]); // eslint-disable-line react-hooks/exhaustive-deps
  const paint = () => {
    const g = cv.current?.getContext("2d"); if (!g) return; const st = s.current; st.img ||= g.createImageData(W, H); const d = st.img.data;
    for (let i = 0; i < W * H; i++) { const c = lut.current[Math.max(0, Math.min(255, Math.round(st.a[i] * 255)))]; d[i * 4] = c[0]; d[i * 4 + 1] = c[1]; d[i * 4 + 2] = c[2]; d[i * 4 + 3] = 255; }
    g.putImageData(st.img, 0, 0);
  };
  useFrameLoop(cv, (t) => {
    const st = s.current; const { a, b } = st;
    const src = [[W * (0.5 + 0.3 * Math.sin(t * 0.21)), H * (0.5 + 0.3 * Math.cos(t * 0.17))], [W * (0.5 + 0.35 * Math.cos(t * 0.13)), H * (0.45 + 0.3 * Math.sin(t * 0.19))]];
    if (st.px >= 0) src.push([st.px, st.py]);
    for (const [x, y] of src) for (let j = -2; j <= 2; j++) for (let i = -2; i <= 2; i++) { const X = Math.round(x) + i, Y = Math.round(y) + j; if (X >= 0 && Y >= 0 && X < W && Y < H) a[Y * W + X] = Math.min(1, a[Y * W + X] + 0.12); }
    for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) { const i = y * W + x; b[i] = ((a[i - 1] + a[i + 1] + a[i - W] + a[i + W]) * 0.25 * 0.6 + a[i] * 0.4) * 0.992; }
    st.a = b; st.b = a; paint();
  }, !reduce);
  return <canvas ref={cv} width={W} height={H} className={className} aria-hidden="true" style={{ width: "100%", height: "100%", filter: "blur(18px) saturate(1.2)", transform: "scale(1.1)", ...style }} />;
}

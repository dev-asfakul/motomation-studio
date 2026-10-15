"use client";
// @motomation-component
// id: benday-canvas
// name: Ben-Day Canvas
// family: backgrounds
// tier: 2
// deps: react
// what: A real halftone on canvas: a drawn source is sampled on a rotated dot grid and every dot's radius follows the source's darkness. Dots near the pointer swell (Proximity Weight applied to dots), then settle back.
// use-when: Pop-art, print and comic pages that need images in the page's own ink, responsive to presence.
// avoid-when: Slop as a dotted overlay on photographs, or dots that animate on their own.
// reduced-motion: Static halftone, no swell.
// touch: The swell follows a finger while it is down; scroll is never blocked.
// a11y: The canvas has the subject's alt text.
// status: candidate to contribute back to the skill (examples/components/backgrounds)
import { useEffect, useRef, type CSSProperties } from "react";
import { useReducedMotion } from "@/lib/motion";

type Props = { draw: (g: CanvasRenderingContext2D, w: number, h: number) => void; alt: string; ink: string; paper: string; cell?: number; angle?: number; className?: string; style?: CSSProperties };
export function BendayCanvas({ draw, alt, ink, paper, cell = 9, angle = 15, className, style }: Props) {
  const reduce = useReducedMotion();
  const cv = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = cv.current!; const g = c.getContext("2d")!; let W = 0, H = 0, lum: Uint8ClampedArray | null = null, mx = -999, my = -999, raf = 0, k = 1;
    const sample = () => { const s = document.createElement("canvas"); s.width = W; s.height = H; const sg = s.getContext("2d")!; draw(sg, W, H); lum = sg.getImageData(0, 0, W, H).data; };
    const paint = () => {
      raf = 0; if (!lum) return; g.setTransform(k, 0, 0, k, 0, 0); g.fillStyle = paper; g.fillRect(0, 0, W, H); g.fillStyle = ink;
      const a = (angle * Math.PI) / 180, ca = Math.cos(a), sa = Math.sin(a); const R = Math.hypot(W, H);
      for (let v = -R; v < R; v += cell) for (let u = -R; u < R; u += cell) {
        const x = W / 2 + u * ca - v * sa, y = H / 2 + u * sa + v * ca; if (x < -cell || y < -cell || x > W + cell || y > H + cell) continue;
        const i = (Math.min(H - 1, Math.max(0, y | 0)) * W + Math.min(W - 1, Math.max(0, x | 0))) * 4;
        const d = 1 - (lum[i] * 0.3 + lum[i + 1] * 0.59 + lum[i + 2] * 0.11) / 255;
        const near = reduce ? 0 : Math.max(0, 1 - Math.hypot(x - mx, y - my) / 140);
        const r = (cell / 2) * Math.sqrt(Math.min(1, d + near * 0.45)) * (1 + near * 0.25);
        if (r > 0.3) { g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); }
      }
    };
    const ro = new ResizeObserver(([e]) => { W = Math.round(e.contentRect.width); H = Math.round(e.contentRect.height); k = Math.min(2, devicePixelRatio || 1); c.width = W * k; c.height = H * k; sample(); paint(); });
    ro.observe(c);
    const mv = (e: PointerEvent) => { const r = c.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; if (!raf) raf = requestAnimationFrame(paint); };
    const lv = () => { mx = my = -999; if (!raf) raf = requestAnimationFrame(paint); };
    if (!reduce) { c.addEventListener("pointermove", mv); c.addEventListener("pointerleave", lv); }
    return () => { ro.disconnect(); c.removeEventListener("pointermove", mv); c.removeEventListener("pointerleave", lv); cancelAnimationFrame(raf); };
  }, [draw, ink, paper, cell, angle, reduce]);
  return <canvas ref={cv} role="img" aria-label={alt} className={className} style={{ width: "100%", height: "100%", display: "block", ...style }} />;
}

"use client";
// Shared Tier 4 harness: lazy-load three only when the scene nears the viewport, cap DPR, pause off screen and in
// hidden tabs, resize with the box, dispose on unmount. Low-end devices, no WebGL and reduced motion get the poster.
import { useEffect, useRef, useState, type RefObject } from "react";
import { lowEnd, webglOK, dpr } from "./device";

export type Three = typeof import("three");
export type Scene = { frame: (t: number, dt: number) => void; resize?: (w: number, h: number) => void; dispose?: () => void };
export type Setup = (THREE: Three, renderer: import("three").WebGLRenderer, size: { w: number; h: number }) => Scene;

export function useGL(box: RefObject<HTMLElement | null>, setup: Setup, { enabled = true, cap = 1.75 } = {}) {
  const [mode, setMode] = useState<"poster" | "live" | "pending">("pending");
  const setupRef = useRef(setup); setupRef.current = setup;
  useEffect(() => {
    const el = box.current; if (!el) return;
    if (!enabled || lowEnd() || !webglOK()) { setMode("poster"); return; }
    let alive = true, raf = 0, visible = false, last = 0, scene: Scene | null = null;
    let renderer: import("three").WebGLRenderer | null = null; let ro: ResizeObserver | null = null;
    const loop = (t: number) => { raf = 0; if (!alive || !scene || !renderer) return; const dt = last ? t - last : 16; last = t; scene.frame(t / 1000, dt); if (visible && !document.hidden) raf = requestAnimationFrame(loop); };
    const kick = () => { if (!raf && visible && !document.hidden) { last = 0; raf = requestAnimationFrame(loop); } };
    const io = new IntersectionObserver(async ([en]) => {
      visible = en.isIntersecting;
      if (visible && !renderer) {
        const THREE = await import("three"); if (!alive) return;
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
        renderer.setPixelRatio(dpr(cap));
        const r = el.getBoundingClientRect(); renderer.setSize(r.width, r.height, false);
        renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
        renderer.domElement.setAttribute("aria-hidden", "true");
        el.appendChild(renderer.domElement);
        scene = setupRef.current(THREE, renderer, { w: r.width, h: r.height });
        ro = new ResizeObserver(([e]) => { const { width: w, height: h } = e.contentRect; renderer?.setSize(w, h, false); scene?.resize?.(w, h); });
        ro.observe(el); setMode("live");
      }
      kick();
    }, { rootMargin: "200px" });
    io.observe(el);
    const vis = () => kick(); document.addEventListener("visibilitychange", vis);
    return () => { alive = false; cancelAnimationFrame(raf); io.disconnect(); ro?.disconnect(); document.removeEventListener("visibilitychange", vis); scene?.dispose?.(); renderer?.dispose(); renderer?.domElement.remove(); };
  }, [box, enabled, cap]);
  return mode;
}

/** Draw multi-line text to a canvas for use as a texture. */
export function textCanvas(lines: string[], { font = "64px serif", w = 1024, h = 512, ink = "#000", bg = "transparent", lh = 1.1, align = "center" as CanvasTextAlign } = {}) {
  const c = document.createElement("canvas"); c.width = w; c.height = h; const g = c.getContext("2d")!;
  if (bg !== "transparent") { g.fillStyle = bg; g.fillRect(0, 0, w, h); }
  g.fillStyle = ink; g.font = font; g.textAlign = align; g.textBaseline = "middle";
  const size = parseFloat(font.match(/(\d+)px/)?.[1] ?? "64");
  const top = h / 2 - ((lines.length - 1) * size * lh) / 2;
  lines.forEach((l, i) => g.fillText(l, align === "center" ? w / 2 : 24, top + i * size * lh));
  return c;
}

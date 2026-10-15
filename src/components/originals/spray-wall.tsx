"use client";
// @motomation-component
// id: spray-wall
// name: Spray Wall
// family: cursor
// tier: 2
// deps: react
// what: A wall you spray-paint with the pointer on a 2D canvas: particle spray whose spread grows with distance from the wall (hold longer, it soaks), drips that run down under gravity when paint pools, an optional mask test (for stencils), and the finished wall saved on this device.
// use-when: Graffiti, street or play pages where leaving a mark is the content.
// avoid-when: Slop as a background effect on pages that are not about making marks; never over text the visitor must read.
// reduced-motion: Spray still works; drips are drawn as short static runs instead of running.
// touch: Spray with a finger (touch-action none on the wall only).
// a11y: The wall is a labelled image region; colour choice, Clear and Save are buttons.
// status: candidate to contribute back to the skill (examples/components/cursor)
import { useEffect, useImperativeHandle, useRef, type CSSProperties, type Ref } from "react";
import { useReducedMotion } from "@/lib/motion";
import { sfx } from "@/lib/sound";
export type SprayHandle = { clear: () => void };
type Props = { color: string; label: string; storageKey: string; mask?: ((x: number, y: number) => boolean) | null; handle?: Ref<SprayHandle>; className?: string; style?: CSSProperties };
export function SprayWall({ color, label, storageKey, mask, handle, className, style }: Props) {
  const reduce = useReducedMotion(); const cv = useRef<HTMLCanvasElement>(null);
  const drips = useRef<{ x: number; y: number; v: number; life: number; c: string; w: number }[]>([]); const pool = useRef(new Map<string, number>());
  const maskRef = useRef(mask); maskRef.current = mask; const colorRef = useRef(color); colorRef.current = color;
  useImperativeHandle(handle, () => ({ clear: () => { const c = cv.current!; c.getContext("2d")!.clearRect(0, 0, c.width, c.height); pool.current.clear(); drips.current = []; try { localStorage.removeItem(storageKey); } catch { /* blocked */ } } }));
  useEffect(() => {
    const c = cv.current!; const g = c.getContext("2d")!; const k = Math.min(1.5, devicePixelRatio || 1);
    const fit = () => { const img = c.width ? c.toDataURL() : null; c.width = c.clientWidth * k; c.height = c.clientHeight * k; g.setTransform(k, 0, 0, k, 0, 0); const src = img ?? (() => { try { return localStorage.getItem(storageKey); } catch { return null; } })(); if (src) { const im = new Image(); im.onload = () => g.drawImage(im, 0, 0, c.clientWidth, c.clientHeight); im.src = src; } };
    fit(); const ro = new ResizeObserver(fit); ro.observe(c);
    let raf = 0; const run = () => { raf = 0; const ds = drips.current; if (!ds.length) return; for (const d of ds) { g.fillStyle = d.c; g.fillRect(d.x - d.w / 2, d.y, d.w, d.v + 0.6); d.y += d.v; d.v = Math.min(2.4, d.v + 0.04); d.life--; d.w *= 0.995; } drips.current = ds.filter((d) => d.life > 0); raf = requestAnimationFrame(run); };
    let down = false, last = 0, sx = 0, sy = 0, hold = 0;
    const spray = (x: number, y: number, dt: number) => {
      hold = Math.min(1, hold + dt / 900); const r = 8 + hold * 14; const n = 26 + Math.round(hold * 30); g.fillStyle = colorRef.current;
      for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, d = Math.pow(Math.random(), 1.6) * r; const px = x + Math.cos(a) * d, py = y + Math.sin(a) * d; if (maskRef.current && !maskRef.current(px, py)) continue; g.globalAlpha = 0.5 + Math.random() * 0.5; g.fillRect(px, py, 1.4, 1.4); }
      g.globalAlpha = 1; const key = `${Math.round(x / 10)},${Math.round(y / 10)}`; const v = (pool.current.get(key) ?? 0) + dt; pool.current.set(key, v);
      if (v > 420 && (!maskRef.current || maskRef.current(x, y + r))) { pool.current.set(key, 0); if (reduce) { g.fillRect(x - 1, y + r * 0.5, 2, 22 + Math.random() * 20); } else { drips.current.push({ x: x + (Math.random() - 0.5) * r, y: y + r * 0.4, v: 0.4, life: 40 + Math.random() * 70, c: colorRef.current, w: 2 + Math.random() * 1.6 }); if (!raf) raf = requestAnimationFrame(run); } }
    };
    const pos = (e: PointerEvent) => { const r = c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    let tick = 0; const loop = (t: number) => { if (!down) return; spray(sx, sy, last ? t - last : 16); last = t; tick = requestAnimationFrame(loop); };
    const dn = (e: PointerEvent) => { c.setPointerCapture(e.pointerId); down = true; hold = 0; last = 0; [sx, sy] = pos(e); sfx("hiss", 0.04); tick = requestAnimationFrame(loop); };
    const mv = (e: PointerEvent) => { if (!down) return; const [x, y] = pos(e); const moved = Math.hypot(x - sx, y - sy); if (moved > 6) hold = Math.max(0, hold - 0.08); sx = x; sy = y; };
    const up = () => { if (!down) return; down = false; cancelAnimationFrame(tick); setTimeout(() => { try { localStorage.setItem(storageKey, c.toDataURL("image/webp", 0.7)); } catch { /* full */ } }, 1200); };
    c.addEventListener("pointerdown", dn); c.addEventListener("pointermove", mv); c.addEventListener("pointerup", up); c.addEventListener("pointercancel", up);
    return () => { ro.disconnect(); cancelAnimationFrame(raf); cancelAnimationFrame(tick); c.removeEventListener("pointerdown", dn); c.removeEventListener("pointermove", mv); c.removeEventListener("pointerup", up); c.removeEventListener("pointercancel", up); };
  }, [storageKey, reduce]);
  return <canvas ref={cv} className={className} role="img" aria-label={label} style={{ touchAction: "none", width: "100%", height: "100%", display: "block", ...style }} />;
}

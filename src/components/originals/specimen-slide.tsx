"use client";
// @motomation-component
// id: specimen-slide
// name: Specimen Slide
// family: cursor
// tier: 3
// deps: react
// what: Frosted glass slides you drag over a page. Each slide is a lens: outside it you read the label layer, through it you read the raw specimen layer aligned underneath. A specular edge follows the pointer.
// use-when: Glass or lab pages where two readings of the same thing (label and raw data) should be compared in place.
// avoid-when: Slop as decorative frosted cards over a gradient. Keep blur area small (it costs frames); never more than three slides.
// reduced-motion: Slides lie in a still stack with the raw layer visible through them; dragging still works and settles instantly.
// touch: Drag with a finger (touch-action none on slides only); arrow keys move a focused slide.
// a11y: Both layers exist as text; each slide is a focusable labelled group; the raw layer is aria-hidden duplicates only.
// status: candidate to contribute back to the skill (examples/components/cursor)
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { sfx } from "@/lib/sound";

type Props = { label: ReactNode; raw: ReactNode; slides: { id: string; name: string; x: number; y: number }[]; className?: string; style?: CSSProperties };
export function SpecimenSlides({ label, raw, slides, className, style }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(() => Object.fromEntries(slides.map((s) => [s.id, { x: s.x, y: s.y }])));
  const [top, setTop] = useState(slides[slides.length - 1].id);
  useEffect(() => { const el = root.current; if (!el) return; const ro = new ResizeObserver(([e]) => el.style.setProperty("--bench-w", `${e.contentRect.width}px`)); ro.observe(el); return () => ro.disconnect(); }, []);
  const drag = (id: string) => (e: React.PointerEvent) => {
    const el = e.currentTarget as HTMLElement; el.setPointerCapture(e.pointerId); setTop(id); sfx("tick", 0.03);
    const box = root.current!.getBoundingClientRect(); const s0 = { cx: e.clientX, cy: e.clientY, x: pos[id].x, y: pos[id].y };
    let tx = s0.x, ty = s0.y, raf = 0, vx = s0.x, vy = s0.y;
    const glide = () => { vx += (tx - vx) * 0.18; vy += (ty - vy) * 0.18; setPos((p) => ({ ...p, [id]: { x: vx, y: vy } })); raf = Math.abs(tx - vx) + Math.abs(ty - vy) > 0.05 ? requestAnimationFrame(glide) : 0; };
    const mv = (m: PointerEvent) => { tx = Math.max(0, Math.min(box.width - 120, s0.x + m.clientX - s0.cx)); ty = Math.max(0, Math.min(box.height - 80, s0.y + m.clientY - s0.cy)); if (!raf) raf = requestAnimationFrame(glide); };
    const up = () => { el.removeEventListener("pointermove", mv); el.removeEventListener("pointerup", up); };
    el.addEventListener("pointermove", mv); el.addEventListener("pointerup", up);
  };
  const key = (id: string) => (e: React.KeyboardEvent) => { const d: Record<string, [number, number]> = { ArrowLeft: [-20, 0], ArrowRight: [20, 0], ArrowUp: [0, -20], ArrowDown: [0, 20] }; const k = d[e.key]; if (!k) return; e.preventDefault(); setPos((p) => ({ ...p, [id]: { x: p[id].x + k[0], y: p[id].y + k[1] } })); };
  const spec = (e: React.PointerEvent) => { const el = e.currentTarget as HTMLElement; const r = el.getBoundingClientRect(); el.style.setProperty("--sx", `${e.clientX - r.left}px`); el.style.setProperty("--sy", `${e.clientY - r.top}px`); };
  return (
    <div ref={root} className={`sp ${className ?? ""}`} style={{ position: "relative", ...style }}>
      <div className="sp-label">{label}</div>
      {slides.map((s) => (
        <div key={s.id} role="group" tabIndex={0} aria-label={`Slide ${s.name}. Drag or use arrow keys; it shows the raw specimen beneath.`} className="sp-slide"
          style={{ transform: `translate(${pos[s.id].x}px, ${pos[s.id].y}px)`, zIndex: top === s.id ? 3 : 2 }} onPointerDown={drag(s.id)} onPointerMove={spec} onKeyDown={key(s.id)}>
          <div className="sp-raw" aria-hidden="true" style={{ transform: `translate(${-pos[s.id].x}px, ${-pos[s.id].y}px)` }}>{raw}</div>
          <span className="sp-name">{s.name}</span>
        </div>
      ))}
    </div>
  );
}

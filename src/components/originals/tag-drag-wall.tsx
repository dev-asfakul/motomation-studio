"use client";
// @motomation-component
// id: tag-drag-wall
// name: Tag Drag Wall
// family: layout
// tier: 2
// deps: react
// what: A wall of mixed objects on up to seven parallax depths. Every object wears a museum tag; drag one and it lags into a small rotation, its tag swings and its custody line updates.
// use-when: Maximal, collected, archive-like pages where the clutter is the content and the visitor should be allowed to rearrange it.
// avoid-when: Slop when the objects are random decoration with no tags, or when the wall hides the one thing the page must say.
// reduced-motion: No parallax and no swing; dragging still moves objects, which land exactly where dropped.
// touch: Pointer events with capture; touch-action none on objects only, so the page still scrolls between them.
// a11y: Each object is a focusable figure; arrow keys nudge it 16px; its tag text is its caption. Custody updates are announced politely.
// status: candidate to contribute back to the skill (examples/components/layout)
import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion, useScrollProgress } from "@/lib/motion";
import { sfx } from "@/lib/sound";

export type WallObject = { id: string; tag: string; meta: string; node: ReactNode; depth: number; x: number; y: number; rot?: number; w?: string };
type Props = { objects: WallObject[]; className?: string; style?: CSSProperties; children?: ReactNode };

export function TagDragWall({ objects, className, style, children }: Props) {
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(() => Object.fromEntries(objects.map((o) => [o.id, { x: o.x, y: o.y, moves: 0 }])));
  const [said, setSaid] = useState("");
  useScrollProgress(root, (p) => root.current?.style.setProperty("--p", (p - 0.5).toFixed(4)), !reduce);
  const drag = (o: WallObject) => (ev: React.PointerEvent<HTMLElement>) => {
    const el = ev.currentTarget; const box = root.current!.getBoundingClientRect();
    el.setPointerCapture(ev.pointerId); sfx("snip", 0.03);
    const start = { cx: ev.clientX, cy: ev.clientY, px: pos[o.id].x, py: pos[o.id].y }; let lastX = ev.clientX; let rot = 0; let raf = 0;
    el.dataset.drag = "";
    const move = (m: PointerEvent) => {
      const dx = ((m.clientX - start.cx) / box.width) * 100, dy = ((m.clientY - start.cy) / box.height) * 100;
      const v = m.clientX - lastX; lastX = m.clientX; rot += (Math.max(-14, Math.min(14, v * 0.8)) - rot) * 0.25;
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; el.style.translate = `${dx}cqw ${dy}cqh`; if (!reduce) el.style.setProperty("--swing", `${-rot * 2}deg`), el.style.setProperty("--lag", `${rot}deg`); });
    };
    const up = (u: PointerEvent) => {
      el.removeEventListener("pointermove", move); el.removeEventListener("pointerup", up); el.removeEventListener("pointercancel", up);
      delete el.dataset.drag; el.style.translate = ""; el.style.setProperty("--swing", "0deg"); el.style.setProperty("--lag", "0deg");
      const nx = start.px + ((u.clientX - start.cx) / box.width) * 100, ny = start.py + ((u.clientY - start.cy) / box.height) * 100;
      setPos((p) => ({ ...p, [o.id]: { x: Math.max(-5, Math.min(92, nx)), y: Math.max(-5, Math.min(92, ny)), moves: p[o.id].moves + 1 } }));
      setSaid(`${o.tag} moved. Custody: you.`); sfx("tick", 0.04);
    };
    el.addEventListener("pointermove", move); el.addEventListener("pointerup", up); el.addEventListener("pointercancel", up);
  };
  const key = (o: WallObject) => (ev: React.KeyboardEvent) => {
    const d: Record<string, [number, number]> = { ArrowLeft: [-2, 0], ArrowRight: [2, 0], ArrowUp: [0, -2], ArrowDown: [0, 2] };
    const k = d[ev.key]; if (!k) return; ev.preventDefault();
    setPos((p) => ({ ...p, [o.id]: { x: p[o.id].x + k[0], y: p[o.id].y + k[1], moves: p[o.id].moves + 1 } }));
  };
  return (
    <div ref={root} className={`tdw ${className ?? ""}`} style={style}>
      {objects.map((o) => {
        const p = pos[o.id];
        return (
          <figure key={o.id} className="tdw-o" tabIndex={0} aria-label={`${o.tag}. ${o.meta}. Drag or use arrow keys to move.`}
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: o.w, ["--d" as string]: o.depth, ["--r" as string]: `${o.rot ?? 0}deg`, zIndex: o.depth } as CSSProperties}
            onPointerDown={drag(o)} onKeyDown={key(o)}>
            <div className="tdw-body">{o.node}</div>
            <figcaption className="tdw-tag"><b>{o.tag}</b><span>{o.meta}</span><span className="tdw-c">{p.moves ? `Moved ${p.moves}× · custody: you` : "Custody: the lab"}</span></figcaption>
          </figure>
        );
      })}
      {children}
      <p className="sr-only" aria-live="polite">{said}</p>
    </div>
  );
}

"use client";
// @motomation-component
// id: reflow-photo
// name: Reflow Photo
// family: layout
// tier: 2
// deps: react
// what: A captioned photograph you can drag through an article. On drop it is re-inserted between the nearest paragraphs and floats left or right of the column, and the text reflows around it.
// use-when: Editorial and long-read layouts where the reader rearranging the page shows how the layout works.
// avoid-when: Slop on short pages, or with images that are not part of the story.
// reduced-motion: The photo jumps to its new slot without the settle; the reflow is the same.
// touch: Long press is not needed: drag the photo with a finger (touch-action none on the photo only). Buttons move it up and down too.
// a11y: "Move photo up" and "Move photo down" buttons do the same as dragging; the figure keeps its caption.
// status: candidate to contribute back to the skill (examples/components/layout)
import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { sfx } from "@/lib/sound";
type Props = { paragraphs: ReactNode[]; photo: ReactNode; caption: string; className?: string; style?: CSSProperties };
export function ReflowPhoto({ paragraphs, photo, caption, className, style }: Props) {
  const [at, setAt] = useState(1); const [side, setSide] = useState<"left" | "right">("right");
  const [ghost, setGhost] = useState<{ x: number; y: number } | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const down = (e: React.PointerEvent) => {
    const el = e.currentTarget as HTMLElement; el.setPointerCapture(e.pointerId); const sx = e.clientX, sy = e.clientY;
    const mv = (m: PointerEvent) => setGhost({ x: m.clientX - sx, y: m.clientY - sy });
    const up = (u: PointerEvent) => {
      el.removeEventListener("pointermove", mv); el.removeEventListener("pointerup", up); setGhost(null);
      const ps = Array.from(root.current!.querySelectorAll<HTMLElement>("[data-p]")); let idx = ps.length;
      for (let i = 0; i < ps.length; i++) { const r = ps[i].getBoundingClientRect(); if (u.clientY < r.top + r.height / 2) { idx = i; break; } }
      const rr = root.current!.getBoundingClientRect(); setSide(u.clientX < rr.left + rr.width / 2 ? "left" : "right"); setAt(idx); sfx("thud", 0.03);
    };
    el.addEventListener("pointermove", mv); el.addEventListener("pointerup", up);
  };
  const fig = (
    <figure key="fig" className="rp-fig" data-side={side} style={ghost ? { translate: `${ghost.x}px ${ghost.y}px`, zIndex: 5 } : undefined}>
      <div className="rp-img" onPointerDown={down}>{photo}</div>
      <figcaption>{caption}</figcaption>
      <span className="rp-move"><button type="button" onClick={() => setAt((a) => Math.max(0, a - 1))}>Move photo up</button><button type="button" onClick={() => setAt((a) => Math.min(paragraphs.length, a + 1))}>Move photo down</button><button type="button" onClick={() => setSide((s) => (s === "left" ? "right" : "left"))}>Swap side</button></span>
    </figure>
  );
  const out: ReactNode[] = [];
  paragraphs.forEach((p, i) => { if (i === at) out.push(fig); out.push(<p key={i} data-p>{p}</p>); });
  if (at >= paragraphs.length) out.push(fig);
  return <div ref={root} className={`rp ${className ?? ""}`} style={style}>{out}</div>;
}

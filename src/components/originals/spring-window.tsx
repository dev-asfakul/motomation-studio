"use client";
// @motomation-component
// id: spring-window
// name: Spring Window
// family: ui
// tier: 2
// deps: react
// what: Desktop-style windows that pop open on a spring with overshoot, can be dragged by their title bar, brought to front, and closed. A small window manager in one component.
// use-when: Y2K, OS-nostalgia or playful pages where facts are better found than listed, one per window.
// avoid-when: Slop as fake error dialogs, pop-ups that block reading, or windows with nothing in them.
// reduced-motion: Windows open and close instantly in a tidy cascade; dragging still works.
// touch: Title bars are 44px tall drag handles; close buttons are 44px.
// a11y: Each window is a labelled region; the close button is labelled; reopen buttons are listed for closed windows.
// status: candidate to contribute back to the skill (examples/components/ui)
import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { sfx } from "@/lib/sound";

export type Win = { id: string; title: string; body: ReactNode; x: number; y: number; w?: number };
type Props = { windows: Win[]; className?: string; style?: CSSProperties };
export function SpringWindows({ windows, className, style }: Props) {
  const [open, setOpen] = useState<string[]>(windows.map((w) => w.id));
  const [z, setZ] = useState<string[]>(windows.map((w) => w.id));
  const [pos, setPos] = useState(() => Object.fromEntries(windows.map((w) => [w.id, { x: w.x, y: w.y }])));
  const root = useRef<HTMLDivElement>(null);
  const front = (id: string) => setZ((o) => [...o.filter((x) => x !== id), id]);
  const drag = (id: string) => (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    front(id); const el = e.currentTarget as HTMLElement; el.setPointerCapture(e.pointerId);
    const r = root.current!.getBoundingClientRect(); const s = { x: e.clientX, y: e.clientY, ...{ px: pos[id].x, py: pos[id].y } };
    const mv = (m: PointerEvent) => setPos((p) => ({ ...p, [id]: { x: Math.max(0, Math.min(80, s.px + ((m.clientX - s.x) / r.width) * 100)), y: Math.max(0, Math.min(85, s.py + ((m.clientY - s.y) / r.height) * 100)) } }));
    const up = () => { el.removeEventListener("pointermove", mv); el.removeEventListener("pointerup", up); };
    el.addEventListener("pointermove", mv); el.addEventListener("pointerup", up);
  };
  return (
    <div ref={root} className={`sw-root ${className ?? ""}`} style={style}>
      {windows.filter((w) => open.includes(w.id)).map((w) => (
        <section key={w.id} className="sw-win" aria-label={w.title} style={{ left: `min(${pos[w.id].x}%, calc(100% - ${w.w ?? 260}px))`, top: `${pos[w.id].y}%`, width: w.w, maxWidth: "100%", zIndex: 10 + z.indexOf(w.id) }} onPointerDown={() => front(w.id)}>
          <header className="sw-bar" onPointerDown={drag(w.id)}><span>{w.title}</span><button type="button" aria-label={`Close ${w.title}`} onClick={() => { setOpen((o) => o.filter((x) => x !== w.id)); sfx("pop", 0.04); }}>×</button></header>
          <div className="sw-body">{w.body}</div>
        </section>
      ))}
      <div className="sw-dock" role="group" aria-label="Closed windows">
        {windows.filter((w) => !open.includes(w.id)).map((w) => <button key={w.id} type="button" onClick={() => { setOpen((o) => [...o, w.id]); front(w.id); sfx("pop", 0.05); }}>Open {w.title}</button>)}
      </div>
    </div>
  );
}

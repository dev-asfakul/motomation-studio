"use client";
// @motomation-component
// id: ransom-letters
// name: Ransom Letters
// family: type
// tier: 2
// deps: react
// what: A line of text set as cut-out letters, each in a different face, paper and angle from a list you pass in (seeded, so it is the same every visit). Every letter is a draggable piece with real z-order: the one you pick up comes to the top, tilts while held and lands slightly off.
// use-when: Collage, zine or ransom-note pages where one short demand is the headline and mismatched type is the point.
// avoid-when: Slop for anything longer than a few words, or with faces that are not otherwise used on the site.
// reduced-motion: No tilt or landing settle; drag still works.
// touch: Drag with a finger (touch-action none on each piece only).
// a11y: The full line is the accessible name of the group (aria-label); individual letters are aria-hidden; arrow keys nudge a focused piece.
// status: candidate to contribute back to the skill (examples/components/type)
import { useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "@/lib/motion";
import { sfx } from "@/lib/sound";
type Props = { text: string; faces: string[]; papers: { bg: string; ink: string }[]; seed?: number; as?: "h1" | "h2" | "p"; className?: string; style?: CSSProperties };
export function RansomLetters({ text, faces, papers, seed = 3, as: Tag = "h1", className, style }: Props) {
  const reduce = useReducedMotion();
  const rnd = (n: number) => { const x = Math.sin(seed * 31.7 + n * 91.3) * 10000; return x - Math.floor(x); };
  const [off, setOff] = useState<Record<number, { x: number; y: number; z: number }>>({});
  const z = useRef(10); const [held, setHeld] = useState(-1);
  const down = (i: number) => (e: React.PointerEvent) => {
    const el = e.currentTarget as HTMLElement; el.setPointerCapture(e.pointerId); const s = { x: e.clientX, y: e.clientY, o: off[i] ?? { x: 0, y: 0, z: 0 } };
    const top = ++z.current; setHeld(i); sfx("snip", 0.02);
    const mv = (m: PointerEvent) => setOff((p) => ({ ...p, [i]: { x: s.o.x + m.clientX - s.x, y: s.o.y + m.clientY - s.y, z: top } }));
    const up = () => { el.removeEventListener("pointermove", mv); el.removeEventListener("pointerup", up); setHeld(-1); sfx("thud", 0.02); };
    el.addEventListener("pointermove", mv); el.addEventListener("pointerup", up); setOff((p) => ({ ...p, [i]: { ...s.o, z: top } }));
  };
  const key = (i: number) => (e: React.KeyboardEvent) => { const d: Record<string, [number, number]> = { ArrowLeft: [-12, 0], ArrowRight: [12, 0], ArrowUp: [0, -12], ArrowDown: [0, 12] }; const k = d[e.key]; if (!k) return; e.preventDefault(); setOff((p) => { const o = p[i] ?? { x: 0, y: 0, z: 0 }; return { ...p, [i]: { x: o.x + k[0], y: o.y + k[1], z: ++z.current } }; }); };
  const words = text.split(" "); let k = 0;
  return (
    <Tag className={`rl ${className ?? ""}`} style={style} aria-label={text}>
      {words.map((w, wi) => (
        <span key={wi} className="rl-w" aria-hidden="true">
          {[...w].map((ch) => {
            const i = k++; const p = papers[Math.floor(rnd(i) * papers.length)]; const o = off[i] ?? { x: 0, y: 0, z: 0 };
            const rot = (rnd(i + 50) - 0.5) * 14 + (held === i && !reduce ? 6 : 0);
            return (
              <span key={i} tabIndex={0} className="rl-l" onPointerDown={down(i)} onKeyDown={key(i)} data-held={held === i ? "" : undefined}
                style={{ fontFamily: faces[Math.floor(rnd(i + 9) * faces.length)], background: p.bg, color: p.ink, zIndex: o.z, fontStyle: rnd(i + 3) > 0.7 ? "italic" : "normal", fontWeight: rnd(i + 5) > 0.5 ? 800 : 400,
                  transform: `translate(${o.x}px, ${o.y}px) rotate(${rot}deg) ${held === i && !reduce ? "scale(1.06)" : ""}`, clipPath: `polygon(${rnd(i + 1) * 8}% 0, 100% ${rnd(i + 2) * 10}%, ${100 - rnd(i + 4) * 8}% 100%, 0 ${100 - rnd(i + 6) * 10}%)` }}>{ch}</span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}

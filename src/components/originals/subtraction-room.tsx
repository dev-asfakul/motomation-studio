"use client";
// @motomation-component
// id: subtraction-room
// name: Subtraction Room
// family: scroll
// tier: 2
// deps: react
// what: A crowded room of labels that scroll empties one at a time, on one slow ease, logging every cut in the margin until one word is left.
// use-when: A minimal page has to prove its restraint: the visitor watches what was removed, so the empty result reads as a decision.
// avoid-when: Slop when the "removed" items are filler invented to be cut, or when the final word is a tagline. Cut real candidates.
// reduced-motion: The room is shown already empty, the full cut ledger printed beside the last word. Nothing animates.
// touch: Same scroll; the ledger moves under the word on narrow screens.
// a11y: The cut ledger is a real ordered list; removed labels are aria-hidden once cut; the final word is a heading.
// status: candidate to contribute back to the skill (examples/components/scroll)
import { useRef, useState, type CSSProperties } from "react";
import { useReducedMotion, useStickyProgress, useMedia } from "@/lib/motion";
import { sfx } from "@/lib/sound";

type Props = { items: string[]; last: string; lastLabel: string; className?: string; style?: CSSProperties; onDone?: () => void };

// deterministic scatter: positions are a pure function of the index, so server and client agree
// a jittered grid: every label gets its own cell, so nothing overlaps; the jitter keeps it a crowd, not a table
const jit = (n: number) => { const a = Math.sin(n * 12.9898) * 43758.5453; return a - Math.floor(a); };
const spot = (i: number, cols: number) => { const c = i % cols, r = Math.floor(i / cols); return { x: (c / cols) * 100 + jit(i) * (40 / cols), y: 6 + r * (cols > 2 ? 21 : 11.5) + jit(i + 31) * 6 }; };

export function SubtractionRoom({ items, last, lastLabel, className, style }: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [cut, setCut] = useState(0);
  useStickyProgress(ref, (p) => {
    const n = Math.min(items.length, Math.floor(p * (items.length + 2)));
    setCut((c) => { if (n > c) sfx("thud", 0.03); return n; });
  }, !reduce);
  const cols = useMedia("(max-width: 767px)") ? 2 : 4;
  const shown = reduce ? items.length : cut;
  const done = shown >= items.length;
  return (
    <div ref={ref} className={`sr-room ${className ?? ""}`} style={{ height: reduce ? "auto" : `${(items.length + 3) * 32}vh`, ...style }} data-reduce={reduce ? "" : undefined}>
      <div className="sr-stage">
        <ul className="sr-items" aria-label="Candidates on the wall">
          {items.map((t, i) => {
            const s = spot(i, cols); const gone = i < shown;
            return <li key={t} aria-hidden={gone || undefined} data-gone={gone ? "" : undefined} style={{ left: `${s.x}%`, top: `${s.y}%` }}>{t}</li>;
          })}
        </ul>
        <div className="sr-last" data-on={done ? "" : undefined}>
          <span className="sr-marker" aria-hidden="true" />
          <h1 className="sr-word">{last}</h1>
          <p className="sr-label">{lastLabel}</p>
        </div>
        <ol className="sr-ledger" aria-label="Cut ledger">
          {items.slice(0, shown).map((t, i) => <li key={t}><span>Cut {String(i + 1).padStart(2, "0")}</span> {t}</li>)}
        </ol>
        <p className="sr-count" aria-live="polite">{shown} of {items.length} cut</p>
      </div>
    </div>
  );
}

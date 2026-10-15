"use client";
// @motomation-component
// id: cut-ledger
// name: Cut Ledger
// family: ui
// tier: 1
// deps: react
// what: An interactive Restraint Gate. Each candidate element carries its answers to the two gate questions; you keep or cut it and a live preview shows what is left.
// use-when: Explaining an editorial decision, a design review, or any "why is this so empty" moment where the visitor can make the call themselves.
// avoid-when: Slop as a decorative checklist with no consequence. The preview must change with every cut.
// reduced-motion: Same controls; items leave the preview instantly instead of on the slow ease.
// touch: Large toggle rows, 48px minimum.
// a11y: Every row is a toggle button with aria-pressed; the preview count is announced politely.
// status: candidate to contribute back to the skill (examples/components/ui)
import { useState, type CSSProperties } from "react";
import { sfx } from "@/lib/sound";

export type Candidate = { name: string; concept: boolean; tells: boolean; why: string };
type Props = { candidates: Candidate[]; className?: string; style?: CSSProperties };

export function CutLedger({ candidates, className, style }: Props) {
  const [kept, setKept] = useState<boolean[]>(() => candidates.map(() => true));
  const n = kept.filter(Boolean).length;
  const runGate = () => { setKept(candidates.map((c) => c.concept || c.tells)); sfx("thud", 0.04); };
  return (
    <div className={`cl-root ${className ?? ""}`} style={style}>
      <div className="cl-rows" role="group" aria-label="Candidates">
        {candidates.map((c, i) => (
          <button key={c.name} type="button" className="cl-row" aria-pressed={kept[i]} onClick={() => { setKept((k) => k.map((v, j) => (j === i ? !v : v))); sfx("tick", 0.03); }}>
            <span className="cl-name">{c.name}</span>
            <span className="cl-q" title="Q1: does it come from the concept?">Q1 {c.concept ? "yes" : "no"}</span>
            <span className="cl-q" title="Q2: does it tell the visitor something?">Q2 {c.tells ? "yes" : "no"}</span>
            <span className="cl-state">{kept[i] ? "Kept" : "Cut"}</span>
            <span className="cl-why">{c.why}</span>
          </button>
        ))}
      </div>
      <div className="cl-preview" aria-label="Preview of what is kept">
        {candidates.map((c, i) => <span key={c.name} className="cl-p" data-cut={kept[i] ? undefined : ""}>{c.name}</span>)}
        <p className="cl-n" aria-live="polite">{n} of {candidates.length} kept</p>
        <button type="button" className="cl-run" onClick={runGate}>Run the gate</button>
      </div>
    </div>
  );
}

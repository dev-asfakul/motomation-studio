"use client";
// @motomation-component
// id: ink-writer
// name: Ink Writer
// family: text
// tier: 2
// deps: react
// what: Text set in a handwriting face that writes itself line by line: a soft-edged mask sweeps along each line at a hand's pace (slower on long words), a nib dot rides the edge, and the ink settles darker as it dries.
// use-when: Notebook, letter or journal pages where one short passage should appear as if being written now.
// avoid-when: Slop for body copy, headings that must read on first paint, or more than one writing passage per screen.
// reduced-motion: The passage is written already; no nib.
// touch: Tap writes the rest at once.
// a11y: The full text is real text from the start (the mask is visual only); aria-busy is never set.
// status: candidate to contribute back to the skill (examples/components/text)
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion, useInView } from "@/lib/motion";
type Props = { lines: string[]; cps?: number; as?: "p" | "h1" | "h2"; className?: string; style?: CSSProperties };
export function InkWriter({ lines, cps = 22, as: Tag = "p", className, style }: Props) {
  const reduce = useReducedMotion(); const ref = useRef<HTMLElement>(null); const seen = useInView(ref, { once: true });
  const [p, setP] = useState<number[]>(lines.map(() => 0)); const done = useRef(false);
  useEffect(() => {
    if (reduce) { setP(lines.map(() => 1)); return; } if (!seen) return;
    let raf = 0, t0 = 0; const durs = lines.map((l) => (l.length / cps) * 1000); const total = durs.reduce((a, b) => a + b, 0);
    const tick = (t: number) => { if (done.current) { setP(lines.map(() => 1)); return; } t0 ||= t; let e = t - t0; setP(durs.map((d) => { const v = Math.max(0, Math.min(1, e / d)); e -= d; return v; })); if (t - t0 < total) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [seen, reduce, lines, cps]);
  return (
    <Tag ref={ref as never} className={`iw ${className ?? ""}`} style={style} onClick={() => { done.current = true; }}>
      {lines.map((l, i) => (
        <span key={i} className="iw-l" style={{ ["--p" as string]: `${(p[i] * 112 - 6).toFixed(2)}%`, ["--dry" as string]: p[i] >= 1 ? 1 : 0 } as CSSProperties}>
          {l}{p[i] > 0 && p[i] < 1 && <span className="iw-nib" aria-hidden="true" />}
        </span>
      ))}
    </Tag>
  );
}

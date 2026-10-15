"use client";
// @motomation-component
// id: measure-rule
// name: Measure Rule
// family: type
// tier: 2
// deps: react
// what: A drawn dimension line under an element, with end ticks and its live width in pixels and in grid columns. It draws on when the element enters the viewport.
// use-when: Grid-led pages where measurement is the voice: specimens, systems, Swiss layouts, technical documentation.
// avoid-when: Slop under every heading, or with numbers that are not the element's real size.
// reduced-motion: The rule is drawn already; the numbers are the same.
// touch: Same as desktop.
// a11y: The measurement is a visually small text line that screen readers also get, in words.
// status: candidate to contribute back to the skill (examples/components/type)
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useInView, useReducedMotion } from "@/lib/motion";

type Props = { children: ReactNode; columnPx?: () => number; className?: string; style?: CSSProperties; delay?: number };
export function MeasureRule({ children, columnPx, className, style, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref); const reduce = useReducedMotion();
  const [w, setW] = useState(0); const [col, setCol] = useState(0);
  const colRef = useRef(columnPx); colRef.current = columnPx;
  useEffect(() => { const el = ref.current; if (!el) return; const ro = new ResizeObserver(([e]) => { setW(Math.round(e.contentRect.width)); setCol(colRef.current?.() ?? 0); }); ro.observe(el); return () => ro.disconnect(); }, []);
  return (
    <div ref={ref} className={`mr ${className ?? ""}`} style={{ position: "relative", ...style }} data-on={seen || reduce ? "" : undefined}>
      {children}
      <div className="mr-line" aria-hidden="true" style={{ transitionDelay: `${delay}ms` }} />
      <p className="mr-read">W {w || "…"}px{col ? ` · ${Math.max(1, Math.round(w / col))} col` : ""}</p>
    </div>
  );
}

"use client";
// @motomation-component
// id: grid-overlay
// name: Grid Overlay
// family: layout
// tier: 1
// deps: react
// what: Two switchable overlays drawn over a section: the column grid and the baseline grid, in the page's own units, so the visitor can check that everything sits where it says.
// use-when: Swiss, editorial or systems pages where the grid is the argument and showing it is part of the content.
// avoid-when: Slop as a permanent decorative grid behind a page that does not actually follow it.
// reduced-motion: Same; the overlays switch instantly (they never animate).
// touch: Two 48px toggle buttons.
// a11y: Toggle buttons with aria-pressed; the overlays are aria-hidden.
// status: candidate to contribute back to the skill (examples/components/layout)
import { useState, type CSSProperties, type ReactNode } from "react";
import { sfx } from "@/lib/sound";

type Props = { children: ReactNode; columns?: number; baseline?: number; color?: string; className?: string; style?: CSSProperties; defaultOn?: boolean };
export function GridOverlay({ children, columns = 12, baseline = 8, color = "rgba(227,6,19,0.5)", className, style, defaultOn = true }: Props) {
  const [cols, setCols] = useState(defaultOn); const [base, setBase] = useState(false);
  return (
    <div className={`go-root ${className ?? ""}`} style={{ position: "relative", ...style }}>
      <div className="go-controls" role="group" aria-label="Grid overlays">
        <button type="button" aria-pressed={cols} onClick={() => { setCols((v) => !v); sfx("tick", 0.04); }}>{columns} columns</button>
        <button type="button" aria-pressed={base} onClick={() => { setBase((v) => !v); sfx("tick", 0.04); }}>{baseline}px baseline</button>
      </div>
      {children}
      {cols && <div aria-hidden="true" className="go-cols" style={{ position: "absolute", inset: 0, pointerEvents: "none", display: "grid", gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap: "var(--gutter)", padding: "0 var(--gutter)", zIndex: 5 }}>{Array.from({ length: columns }, (_, i) => <span key={i} style={{ background: color.replace(/[\d.]+\)$/, "0.07)"), borderInline: `1px solid ${color}` }} />)}</div>}
      {base && <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 5, background: `repeating-linear-gradient(180deg, transparent 0 ${baseline - 1}px, ${color} ${baseline - 1}px ${baseline}px)` }} />}
    </div>
  );
}

"use client";
// @motomation-component
// id: stroke-draw
// name: Stroke Draw
// family: scroll
// tier: 2
// deps: react
// what: Any set of SVG paths draws itself on (stroke-dashoffset from each path's real length) when it enters the viewport or when its key changes, path by path, with an optional nib dot riding the line.
// use-when: Vector, technical or sketch pages where seeing a line being drawn explains construction.
// avoid-when: Slop on icons in a feature grid, or redrawing every time something scrolls past.
// reduced-motion: Paths are drawn already.
// touch: Nothing to touch.
// a11y: The svg takes a title from the caller (role img + aria-label); paths are presentation.
// status: candidate to contribute back to the skill (examples/components/scroll)
import { useEffect, useRef, type CSSProperties } from "react";
import { useReducedMotion, useInView } from "@/lib/motion";
type Props = { paths: string[]; viewBox: string; label: string; stroke?: string; width?: number; ms?: number; replayKey?: string | number; className?: string; style?: CSSProperties };
export function StrokeDraw({ paths, viewBox, label, stroke = "currentColor", width = 2, ms = 900, replayKey, className, style }: Props) {
  const reduce = useReducedMotion(); const svg = useRef<SVGSVGElement>(null); const seen = useInView(svg, { once: true });
  useEffect(() => {
    const ps = Array.from(svg.current?.querySelectorAll<SVGPathElement>("path[data-d]") ?? []);
    if (reduce || !seen) { ps.forEach((p) => { p.style.strokeDasharray = ""; p.style.strokeDashoffset = reduce ? "0" : ""; if (!reduce) { const L = p.getTotalLength(); p.style.strokeDasharray = `${L}`; p.style.strokeDashoffset = `${L}`; } }); return; }
    const anims = ps.map((p, i) => { const L = p.getTotalLength(); p.style.strokeDasharray = `${L}`; return p.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: ms, delay: i * (ms * 0.35), easing: "cubic-bezier(0.65, 0, 0.35, 1)", fill: "both" }); });
    return () => anims.forEach((a) => a.cancel());
  }, [seen, reduce, ms, replayKey, paths]);
  return (
    <svg ref={svg} viewBox={viewBox} className={className} style={style} role="img" aria-label={label}>
      {paths.map((d, i) => <path key={i} data-d="" d={d} fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />)}
    </svg>
  );
}

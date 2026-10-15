"use client";
// @motomation-component
// id: wind-botanical
// name: Wind Botanical
// family: backgrounds
// tier: 2
// deps: react
// what: Pressed-herbarium SVG plants (stems with leaves along a spine) that sway in a wind field: a faint constant breeze plus gusts made by the pointer's horizontal speed. Each stem bends from its base with spring damping; leaves flutter with a phase offset.
// use-when: Botanical, bohemian or natural pages that need one living layer framing the content, not behind text.
// avoid-when: Slop as decoration under paragraphs, or perpetual motion with nothing causing it (the breeze must stay faint).
// reduced-motion: Plants are drawn still, no sway.
// touch: Touch drags make wind too; scroll is never blocked.
// a11y: Decorative, aria-hidden. Pauses off screen.
// status: candidate to contribute back to the skill (examples/components/backgrounds)
import { useMemo, useRef, type CSSProperties } from "react";
import { useReducedMotion, useFrameLoop } from "@/lib/motion";
type Props = { stems?: number; colors: string[]; seed?: number; className?: string; style?: CSSProperties };
export function WindBotanical({ stems = 7, colors, seed = 4, className, style }: Props) {
  const reduce = useReducedMotion(); const svg = useRef<SVGSVGElement>(null);
  const rnd = (n: number) => { const x = Math.sin(seed * 12.9 + n * 78.2) * 43758.5; return x - Math.floor(x); };
  const plants = useMemo(() => Array.from({ length: stems }, (_, i) => ({ x: 6 + (i / Math.max(1, stems - 1)) * 88 + (rnd(i) - 0.5) * 6, h: 34 + rnd(i + 9) * 46, c: colors[i % colors.length], leaves: 5 + Math.floor(rnd(i + 3) * 5), k: 0.6 + rnd(i + 7) * 0.8 })), [stems, colors]); // eslint-disable-line react-hooks/exhaustive-deps
  const st = useRef({ wind: 0, bend: plants.map(() => 0), vel: plants.map(() => 0), lx: -1 });
  useFrameLoop(svg, (t) => {
    const s = st.current; s.wind *= 0.95; const breeze = Math.sin(t * 0.5) * 0.25 + Math.sin(t * 1.3) * 0.1;
    plants.forEach((p, i) => { const target = (breeze + s.wind) * p.k; s.vel[i] += (target - s.bend[i]) * 0.04; s.vel[i] *= 0.9; s.bend[i] += s.vel[i];
      const g = svg.current?.children[i] as SVGGElement | undefined; if (g) { g.setAttribute("transform", `rotate(${(s.bend[i] * 12).toFixed(2)} ${p.x} 100)`); Array.from(g.querySelectorAll("path.wb-leaf")).forEach((l, j) => l.setAttribute("transform", `rotate(${(Math.sin(t * 2 + j + i) * 4 * (0.3 + Math.abs(s.bend[i]))).toFixed(2)} ${l.getAttribute("data-x")} ${l.getAttribute("data-y")})`)); } });
  }, !reduce);
  const onMove = (e: React.PointerEvent) => { const s = st.current; if (s.lx >= 0) s.wind = Math.max(-2, Math.min(2, s.wind + (e.clientX - s.lx) * 0.01)); s.lx = e.clientX; };
  return (
    <svg ref={svg} className={className} style={{ width: "100%", height: "100%", ...style }} viewBox="0 0 100 100" preserveAspectRatio="xMidYMax slice" aria-hidden="true" onPointerMove={onMove} onPointerLeave={() => { st.current.lx = -1; }}>
      {plants.map((p, i) => (
        <g key={i}>
          <path d={`M${p.x} 100 Q${p.x + 2} ${100 - p.h / 2} ${p.x} ${100 - p.h}`} stroke={p.c} strokeWidth="0.5" fill="none" />
          {Array.from({ length: p.leaves }, (_, j) => { const y = 100 - (p.h * (j + 1)) / (p.leaves + 1); const side = j % 2 ? 1 : -1; const L = 4 + rnd(i * 10 + j) * 4;
            return <path key={j} className="wb-leaf" data-x={p.x} data-y={y} d={`M${p.x} ${y} q${side * L * 0.5} ${-L * 0.7} ${side * L} ${-L * 0.2} q${-side * L * 0.4} ${L * 0.5} ${-side * L} ${L * 0.2}Z`} fill={p.c} fillOpacity="0.75" />; })}
        </g>
      ))}
    </svg>
  );
}

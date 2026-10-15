"use client";
// @motomation-component
// id: scissor-cut
// name: Scissor Cut
// family: cursor
// tier: 2
// deps: react
// what: Draw a closed path over a sheet of paper and it is cut out: the shape becomes a separate SVG piece (clip-path of the paper) that you can drag away, leaving a hole. Up to six cuts; the sheet can be replaced.
// use-when: Collage and craft pages where cutting is the verb, or an onboarding moment that teaches drawing gestures.
// avoid-when: Slop as a toy on a page with no paper metaphor; never on content the visitor needs to read whole.
// reduced-motion: The cut piece appears beside the hole without the lift; dragging still works.
// touch: Draw with a finger; touch-action none on the sheet only. A "Cut a square" button is the non-drawing path.
// a11y: The sheet is a labelled region; the result is announced; the button does the same as a drawn cut.
// status: candidate to contribute back to the skill (examples/components/cursor)
import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { sfx } from "@/lib/sound";
type Cut = { d: string; dx: number; dy: number };
type Props = { paper: ReactNode; label: string; className?: string; style?: CSSProperties; width?: number; height?: number };
export function ScissorCut({ paper, label, className, style, width = 600, height = 380 }: Props) {
  const svg = useRef<SVGSVGElement>(null);
  const [cuts, setCuts] = useState<Cut[]>([]); const [path, setPath] = useState<[number, number][]>([]); const [said, setSaid] = useState("");
  const pt = (e: { clientX: number; clientY: number }): [number, number] => { const r = svg.current!.getBoundingClientRect(); return [((e.clientX - r.left) / r.width) * width, ((e.clientY - r.top) / r.height) * height]; };
  const add = (pts: [number, number][]) => {
    if (pts.length < 6) return; const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]); if (Math.max(...xs) - Math.min(...xs) < 30 || Math.max(...ys) - Math.min(...ys) < 30) return;
    const d = "M" + pts.map((p) => p.map((v) => v.toFixed(1)).join(" ")).join("L") + "Z"; setCuts((c) => [...c.slice(-5), { d, dx: 24, dy: 24 }]); setSaid("Cut out. Drag the piece away."); sfx("snip", 0.05);
  };
  const down = (e: React.PointerEvent<SVGRectElement>) => { (e.target as Element).setPointerCapture(e.pointerId); setPath([pt(e)]); };
  const move = (e: React.PointerEvent) => { if (path.length) setPath((p) => (p.length > 400 ? p : [...p, pt(e)])); };
  const up = () => { add(path); setPath([]); };
  const drag = (i: number) => (e: React.PointerEvent) => {
    e.stopPropagation(); const el = e.currentTarget as Element; el.setPointerCapture(e.pointerId); const s = pt(e); const o = { ...cuts[i] };
    const mv = (m: PointerEvent) => { const q = pt(m); setCuts((c) => c.map((x, j) => (j === i ? { ...x, dx: o.dx + q[0] - s[0], dy: o.dy + q[1] - s[1] } : x))); };
    const u = () => { el.removeEventListener("pointermove", mv as EventListener); el.removeEventListener("pointerup", u); };
    el.addEventListener("pointermove", mv as EventListener); el.addEventListener("pointerup", u);
  };
  const id = "sc-" + label.replace(/\W/g, "").slice(0, 8);
  return (
    <div className={`sc ${className ?? ""}`} style={style} role="region" aria-label={label}>
      <svg ref={svg} viewBox={`0 0 ${width} ${height}`} className="sc-svg">
        <defs><mask id={`${id}-m`}><rect width={width} height={height} fill="#fff" />{cuts.map((c, i) => <path key={i} d={c.d} fill="#000" />)}</mask>{cuts.map((c, i) => <clipPath key={i} id={`${id}-c${i}`}><path d={c.d} /></clipPath>)}</defs>
        <g mask={`url(#${id}-m)`}><foreignObject width={width} height={height}>{paper}</foreignObject></g>
        <rect width={width} height={height} fill="transparent" style={{ touchAction: "none" }} onPointerDown={down} onPointerMove={move} onPointerUp={up} />
        {path.length > 1 && <polyline points={path.map((p) => p.join(",")).join(" ")} fill="none" stroke="#161616" strokeWidth="2" strokeDasharray="6 5" pointerEvents="none" />}
        {cuts.map((c, i) => (
          <g key={i} transform={`translate(${c.dx} ${c.dy})`} className="sc-piece" onPointerDown={drag(i)} style={{ touchAction: "none" }}>
            <g clipPath={`url(#${id}-c${i})`}><foreignObject width={width} height={height}>{paper}</foreignObject></g>
            <path d={c.d} fill="none" stroke="#fff" strokeWidth="3" /><path d={c.d} fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="1" />
          </g>
        ))}
      </svg>
      <div className="sc-ctrl">
        <button type="button" onClick={() => { const x = 60 + cuts.length * 70, y = 60; add([[x, y], [x + 120, y], [x + 120, y + 30], [x + 120, y + 120], [x + 60, y + 120], [x, y + 120], [x, y + 60]]); }}>Cut a square</button>
        <button type="button" onClick={() => { setCuts([]); setSaid("New sheet."); }}>New sheet</button>
        <span aria-live="polite">{said}</span>
      </div>
    </div>
  );
}

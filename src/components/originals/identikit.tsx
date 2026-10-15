"use client";
// @motomation-component
// id: identikit
// name: Identikit
// family: ui
// tier: 3
// deps: react, gsap (MorphSVGPlugin)
// what: A composite face built from flat SVG planes. Each feature (frame, brow, eyes, mouth) has a set of options; choosing one morphs the current shape into the next with MorphSVG, and the chosen name is reported back for a caption.
// use-when: Vector, character or configurator pages where assembling something from parts is the content.
// avoid-when: Slop as an avatar builder bolted onto a page about something else, or with realistic human faces.
// reduced-motion: Features swap instantly, no morph.
// touch: Options are buttons, 44px.
// a11y: Each feature is a radio group; the face is role img with a live description of the current choices.
// status: candidate to contribute back to the skill (examples/components/ui)
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/motion";
import { sfx } from "@/lib/sound";
export type Feature = { id: string; name: string; fill: string; options: { name: string; d: string }[] };
type Props = { features: Feature[]; onPick?: (feature: string, option: string) => void; className?: string; style?: CSSProperties };
export function Identikit({ features, onPick, className, style }: Props) {
  const reduce = useReducedMotion();
  const [pick, setPick] = useState<Record<string, number>>(() => Object.fromEntries(features.map((f) => [f.id, 0])));
  const refs = useRef<Record<string, SVGPathElement | null>>({});
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    features.forEach((f) => { const el = refs.current[f.id]; const d = f.options[pick[f.id]].d; if (!el || el.getAttribute("data-now") === d) return; el.setAttribute("data-now", d);
      if (reduce) el.setAttribute("d", d); else gsap.to(el, { morphSVG: d, duration: 0.55, ease: "power2.inOut" }); });
  }, [pick, features, reduce]);
  const choose = (f: Feature, i: number) => { setPick((p) => ({ ...p, [f.id]: i })); onPick?.(f.name, f.options[i].name); sfx("hiss", 0.02); };
  const desc = features.map((f) => `${f.name}: ${f.options[pick[f.id]].name}`).join(", ");
  return (
    <div className={`ik ${className ?? ""}`} style={style}>
      <svg viewBox="0 0 200 240" className="ik-face" role="img" aria-label={`Composite sketch. ${desc}`}>
        {features.map((f) => <path key={f.id} ref={(el) => { refs.current[f.id] = el; }} d={f.options[0].d} data-now={f.options[0].d} fill={f.fill} />)}
      </svg>
      <div className="ik-ctrl">
        {features.map((f) => (
          <div key={f.id} role="radiogroup" aria-label={f.name} className="ik-row"><span className="ik-k">{f.name}</span>
            {f.options.map((o, i) => <button key={o.name} type="button" role="radio" aria-checked={pick[f.id] === i} onClick={() => choose(f, i)}>{o.name}</button>)}
          </div>
        ))}
      </div>
    </div>
  );
}

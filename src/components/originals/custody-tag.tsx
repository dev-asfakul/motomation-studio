"use client";
// @motomation-component
// id: custody-tag
// name: Custody Tag
// family: micro
// tier: 2
// deps: react
// what: A paper tag hanging on a string from a pin. Fling it and it swings as a damped pendulum; sign it and a new custody line is written on the back.
// use-when: A single, important object needs a record of who touched it: an order, a document, a hand-off.
// avoid-when: Slop as a decorative swinging thing with nothing written on it, or more than one per view.
// reduced-motion: The tag hangs still; signing still adds the line instantly.
// touch: Drag the tag sideways with a finger to swing it; the sign button is 48px.
// a11y: The swing is decorative (aria-hidden); the custody list is a real ordered list and the button is labelled.
// status: candidate to contribute back to the skill (examples/components/micro)
import { useRef, useState, type CSSProperties } from "react";
import { useReducedMotion, useFrameLoop } from "@/lib/motion";
import { sfx } from "@/lib/sound";

type Props = { title: string; initial: string[]; className?: string; style?: CSSProperties };
export function CustodyTag({ title, initial, className, style }: Props) {
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null); const tag = useRef<HTMLDivElement>(null);
  const s = useRef({ a: 0.5, v: 0, drag: false, x0: 0, a0: 0 });
  const [log, setLog] = useState(initial);
  useFrameLoop(root, (_t, dt) => {
    const st = s.current; if (st.drag) return;
    const k = Math.min(dt, 32) / 16;
    st.v += -0.012 * Math.sin(st.a) * k; st.v *= Math.pow(0.985, k); st.a += st.v * k;
    if (tag.current) tag.current.style.rotate = `${(st.a * 57.3).toFixed(2)}deg`;
  }, !reduce);
  const down = (e: React.PointerEvent) => { if (reduce) return; const st = s.current; st.drag = true; st.x0 = e.clientX; st.a0 = st.a; (e.target as HTMLElement).setPointerCapture(e.pointerId); };
  const move = (e: React.PointerEvent) => { const st = s.current; if (!st.drag) return; const na = Math.max(-1.2, Math.min(1.2, st.a0 - (e.clientX - st.x0) / 160)); st.v = na - st.a; st.a = na; if (tag.current) tag.current.style.rotate = `${st.a * 57.3}deg`; };
  const up = () => { s.current.drag = false; };
  const sign = () => {
    const t = new Date(); const hh = String(t.getHours()).padStart(2, "0"), mm = String(t.getMinutes()).padStart(2, "0");
    setLog((l) => [...l, `${hh}:${mm} · examined by you`]); s.current.v += 0.08; sfx("seal", 0.05);
  };
  return (
    <div ref={root} className={`ct-root ${className ?? ""}`} style={style}>
      <div className="ct-rig" aria-hidden="true">
        <span className="ct-pin" />
        <div ref={tag} className="ct-tag" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
          <span className="ct-string" /><span className="ct-hole" />
          <b>{title}</b><span>{log.length} signatures</span>
        </div>
      </div>
      <div className="ct-log">
        <ol aria-label="Chain of custody">{log.map((l, i) => <li key={i}>{l}</li>)}</ol>
        <button type="button" className="ct-sign" onClick={sign}>Sign the tag</button>
      </div>
    </div>
  );
}

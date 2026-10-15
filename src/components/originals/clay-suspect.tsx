"use client";
// @motomation-component
// id: clay-suspect
// name: Clay Suspect
// family: ui
// tier: 2
// deps: react
// what: A matte clay figure (SVG with a lit turbulence texture) you can press and drag to squash and stretch. Volume is preserved (width × height stays constant); on release it sags back slowly and keeps a thumbprint where you let go.
// use-when: Claymation, toy-like or tactile pages where each figure stands for one real thing (here: one motion tier).
// avoid-when: Slop as a mascot with nothing to say, or squash physics on buttons people need to trust.
// reduced-motion: No squash; pressing still leaves the print.
// touch: touch-action none on the figure only; a tap leaves a print.
// a11y: Each figure is a button labelled with what it stands for; Enter or Space leaves a print and announces it.
// status: candidate to contribute back to the skill (examples/components/ui)
import { useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "@/lib/motion";
import { Thumbprint } from "./thumbprint";
import { sfx, buzz } from "@/lib/sound";

type Props = { label: string; sub: string; height: number; color: string; seed: number; className?: string; style?: CSSProperties; onPrint?: (label: string) => void };
export function ClaySuspect({ label, sub, height, color, seed, className, style, onPrint }: Props) {
  const reduce = useReducedMotion();
  const body = useRef<HTMLSpanElement>(null);
  const [prints, setPrints] = useState<{ x: number; y: number; s: number }[]>([]);
  const press = (e: React.PointerEvent) => {
    const el = e.currentTarget as HTMLElement; el.setPointerCapture(e.pointerId); const y0 = e.clientY; const r = el.getBoundingClientRect();
    sfx("thud", 0.03); buzz(8);
    const set = (s: number) => { if (!body.current || reduce) return; body.current.style.transition = "none"; body.current.style.transform = `scale(${(1 / s).toFixed(3)}, ${s.toFixed(3)})`; };
    set(0.9);
    const mv = (m: PointerEvent) => set(Math.max(0.55, Math.min(1.5, 1 - (m.clientY - y0) / 220)));
    const up = (u: PointerEvent) => {
      el.removeEventListener("pointermove", mv); el.removeEventListener("pointerup", up);
      if (body.current) { body.current.style.transition = "transform 1.1s cubic-bezier(0.34, 1.4, 0.64, 1)"; body.current.style.transform = ""; }
      setPrints((p) => [...p.slice(-4), { x: ((u.clientX - r.left) / r.width) * 100, y: ((u.clientY - r.top) / r.height) * 100, s: seed * 10 + p.length }]); onPrint?.(label);
    };
    el.addEventListener("pointermove", mv); el.addEventListener("pointerup", up);
  };
  const key = (e: React.KeyboardEvent) => { if (e.key !== "Enter" && e.key !== " ") return; e.preventDefault(); setPrints((p) => [...p.slice(-4), { x: 50, y: 40, s: seed * 10 + p.length }]); onPrint?.(label); sfx("thud", 0.03); };
  return (
    <button type="button" className={`cs ${className ?? ""}`} style={{ ["--h" as string]: `${height}px`, ["--c" as string]: color, ...style } as CSSProperties} onPointerDown={press} onKeyDown={key} aria-label={`${label}, ${sub}. Press to leave a thumbprint.`}>
      <span ref={body} className="cs-body">
        <svg className="cs-skin" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><rect width="100" height="100" fill={color} filter="url(#clay-tex)" /></svg>
        <span className="cs-eyes" aria-hidden="true"><i /><i /></span>
        {prints.map((p, i) => <Thumbprint key={i} seed={p.s} size={30} className="cs-print" style={{ left: `${p.x}%`, top: `${p.y}%` }} />)}
      </span>
      <span className="cs-label"><b>{label}</b>{sub}</span>
    </button>
  );
}

/** One shared SVG filter for every clay figure on the page: matte, lit from the top left. */
export function ClayDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <filter id="clay-tex" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="7" result="n" />
        <feDiffuseLighting in="n" surfaceScale="0.8" lightingColor="#fff" result="l"><feDistantLight azimuth="225" elevation="55" /></feDiffuseLighting>
        <feComposite in="SourceGraphic" in2="l" operator="arithmetic" k1="0.4" k2="0.62" k3="0" k4="0" />
      </filter>
    </svg>
  );
}

"use client";
// @motomation-component
// id: gravity-flip
// name: Gravity Flip
// family: ui
// tier: 2
// deps: react
// what: A small box of labelled objects under simple gravity, with floor and ceiling. One press reverses gravity and everything falls the other way, overshooting a little like it is underwater.
// use-when: Surreal or playful pages where the physics of the page is itself the joke, and the labels carry real content.
// avoid-when: Slop when the objects are unlabelled confetti or when it competes with a form or a reading task.
// reduced-motion: Objects jump straight to their resting place on the new floor; no falling.
// touch: The flip button is 48px; tap an object to nudge it.
// a11y: Objects are list items with their labels; the button states the current direction with aria-pressed.
// status: candidate to contribute back to the skill (examples/components/ui)
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion, useFrameLoop } from "@/lib/motion";
import { sfx } from "@/lib/sound";

type Props = { items: string[]; className?: string; style?: CSSProperties };
export function GravityFlip({ items, className, style }: Props) {
  const reduce = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLLIElement | null)[]>([]);
  const [up, setUp] = useState(false);
  const sim = useRef(items.map((_, i) => ({ y: 0.2 + (i % 3) * 0.2, v: 0, x: ((i * 37) % 86) + 4, r: ((i * 53) % 30) - 15 })));
  const g = useRef(1);
  const place = () => sim.current.forEach((s, i) => { const el = els.current[i]; if (el) el.style.transform = `translate(0, calc(${s.y} * (var(--h) - 100%))) rotate(${s.r * (1 - Math.abs(s.v) * 4)}deg)`; });
  useEffect(() => { if (reduce) sim.current.forEach((s) => { s.y = 1; }); place(); }, [reduce]); // eslint-disable-line react-hooks/exhaustive-deps
  useFrameLoop(box, (_t, dt) => {
    const k = Math.min(dt, 32) / 1000;
    sim.current.forEach((s, i) => {
      s.v += g.current * 0.9 * k * (0.7 + (i % 4) * 0.1); s.v *= 0.985; s.y += s.v * k * 6;
      const floor = g.current > 0 ? 1 : 0;
      if ((g.current > 0 && s.y > 1) || (g.current < 0 && s.y < 0)) { s.y = floor; s.v = -s.v * 0.45; }
    });
    place();
  }, !reduce);
  const flip = () => {
    g.current = -g.current; setUp(g.current < 0); sfx("chime", 0.04);
    if (reduce) { sim.current.forEach((s) => { s.y = g.current > 0 ? 1 : 0; s.v = 0; }); place(); }
  };
  return (
    <div ref={box} className={`gf ${className ?? ""}`} style={style}>
      <ul className="gf-box" aria-label="Objects in the room">
        {items.map((t, i) => <li key={t} ref={(el) => { els.current[i] = el; }} style={{ left: `${sim.current[i].x}%` }} onClick={() => { sim.current[i].v -= g.current * 0.5; }}>{t}</li>)}
      </ul>
      <button type="button" className="gf-btn" aria-pressed={up} onClick={flip}>{up ? "Gravity: up. Flip it back" : "Gravity: down. Flip it"}</button>
    </div>
  );
}

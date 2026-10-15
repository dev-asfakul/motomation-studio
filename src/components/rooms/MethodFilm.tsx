"use client";
// The interrogation: the Thinking Sequence asked of this site, one step per screen. As each step reaches the middle
// of the viewport, the plan panel types the lines that step decided. Scrolling back leaves them written: a plan is
// not un-decided. Reduced motion: every line is already written; the panel only highlights the current step.
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/motion";
import { sfx } from "@/lib/sound";

export type MStep = { n: number; name: string; ask: string; body: string; answer: string[]; writes: string[]; ev: string };
export type PlanLine = { key: string; value: string };

export function MethodFilm({ steps, plan }: { steps: MStep[]; plan: PlanLine[] }) {
  const rm = useReducedMotion();
  const [active, setActive] = useState(-1);
  const [reached, setReached] = useState(-1);
  const [typed, setTyped] = useState<Record<string, number>>({});
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { const n = Number((e.target as HTMLElement).dataset.n); setActive(n); setReached((r) => Math.max(r, n)); } });
    }, { rootMargin: "-45% 0px -45% 0px" });
    refs.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);

  // type the lines of every newly reached step; reduced motion writes them at once
  useEffect(() => {
    const keys = steps.filter((s) => s.n <= reached).flatMap((s) => s.writes);
    const todo = keys.filter((k) => (typed[k] ?? 0) < (plan.find((p) => p.key === k)?.value.length ?? 0));
    if (!todo.length) return;
    if (rm) { setTyped((t) => { const n = { ...t }; todo.forEach((k) => (n[k] = 9999)); return n; }); return; }
    const k = todo[0]; const full = plan.find((p) => p.key === k)!.value.length;
    const id = window.setTimeout(() => {
      setTyped((t) => ({ ...t, [k]: Math.min(full, (t[k] ?? 0) + 3) }));
      if ((typed[k] ?? 0) === 0) sfx("tick", 0.04);
    }, 16);
    return () => window.clearTimeout(id);
  }, [reached, typed, rm, steps, plan]);

  const owner = (k: string) => steps.find((s) => s.writes.includes(k));
  return (
    <div className="mfilm">
      <div className="mfilm-steps">
        {steps.map((s, i) => (
          <section key={s.n} id={`step-${s.n}`} data-n={s.n} ref={(el) => { refs.current[i] = el; }} className={`mstep anchor${active === s.n ? " on" : ""}`} aria-labelledby={`ms-${s.n}`} data-ev={s.ev}>
            <p className="label"><span className="marker">{s.n}</span> Step {s.n} of {steps.length - 1}</p>
            <h2 id={`ms-${s.n}`} className="mstep-h">{s.name}</h2>
            <p className="mstep-rule">{s.body}</p>
            <div className="mstep-q"><span className="label">Investigator</span><p>{s.ask}</p></div>
            <div className="mstep-a"><span className="label">The build</span>{s.answer.map((a, j) => <p key={j}>{a}</p>)}</div>
            {s.writes.length > 0 && <p className="label mstep-w">Writes: {s.writes.join(", ")}</p>}
            <div className="mstep-plan" aria-hidden="true">{s.writes.map((k) => { const p = plan.find((x) => x.key === k); if (!p) return null; const n = typed[k] ?? 0; return (
              <div key={k} className="mplan-row"><span className="mono" style={{ textTransform: "uppercase", color: "#4a463e" }}>{k}</span><span className="mono">{n === 0 ? <span className="mplan-bar" /> : p.value.slice(0, n)}</span></div>); })}</div>
          </section>
        ))}
      </div>
      <aside className="mplan" aria-label="MOTOMATION PLAN, written as you read">
        <div className="mplan-card">
          <p className="mplan-h mono">MOTOMATION PLAN</p>
          <dl>
            {plan.map((p) => {
              const o = owner(p.key); const n = typed[p.key] ?? 0; const done = n >= p.value.length; const cur = o && o.n === active;
              return (
                <div key={p.key} className={`mplan-row${cur ? " cur" : ""}${n === 0 ? " pending" : ""}`}>
                  <dt>{p.key}</dt>
                  <dd>{n === 0 ? <span className="mplan-bar" aria-hidden="true" /> : <>{p.value.slice(0, n)}{!done && <span className="mplan-caret" aria-hidden="true" />}</>}
                    <span className="sr-only">{n === 0 ? "not yet decided" : ""}</span></dd>
                </div>);
            })}
          </dl>
          <p className="mono mplan-foot">{Object.values(typed).filter((v) => v > 0).length} of {plan.length} lines written</p>
        </div>
      </aside>
    </div>
  );
}

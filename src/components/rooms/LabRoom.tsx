"use client";
// The Lab: every one of the skill's components running (each demo mounts only while it is near the screen, so the
// page never runs 68 animations at once), the three dials retuning the room, and a style-morph bench that blends
// two exhibits and measures the blend's contrast at every step.
import { useEffect, useMemo, useRef, useState } from "react";
import { DEMOS } from "@/vendor/motomation/gallery/demos";
import { useCase, setCase, type Dials } from "@/lib/store";
import { ratio, fmt } from "@/lib/contrast";
import { sfx } from "@/lib/sound";
import { FAMILY } from "@/exhibits/fonts";

export type LabComp = { id: string; name: string; family: string; tier: string; what: string; use_when: string; avoid_when: string; reduced_motion: string; file: string; usedIn: { letter: string; slug: string }[] };
export type MorphEx = { letter: string; slug: string; style: string; title: string; display: string; text: string; ground: string; ink: string; accent: string; muted: string };

/* Reduced-motion override for the vendor components: Motion dial 1 makes every specimen render its own
   reduced-motion version, using the components' real fallbacks (the same trick the skill's gallery uses). */
const RMQ = "(prefers-reduced-motion: reduce)";
let sysMM: typeof window.matchMedia | null = null;
function forceRM(on: boolean) {
  if (typeof window === "undefined") return;
  if (on && !sysMM) {
    const sys = (sysMM = window.matchMedia);
    window.matchMedia = ((q: string) => {
      if (q.replace(/\s+/g, " ").trim() !== RMQ) return sys.call(window, q);
      return { matches: true, media: RMQ, onchange: null, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => true } as unknown as MediaQueryList;
    }) as typeof window.matchMedia;
  } else if (!on && sysMM) { window.matchMedia = sysMM; sysMM = null; }
}
// Installed during render, before the (re-keyed) specimens mount and read it; removed when the Lab unmounts.
function useForcedRM(on: boolean) {
  forceRM(on);
  useEffect(() => () => forceRM(false), []);
}

function LazyDemo({ id }: { id: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: "500px 0px" });
    io.observe(el); return () => io.disconnect();
  }, []);
  const D = DEMOS[id];
  return <div ref={ref} className="lab-stage">{near && D ? <D /> : <p className="label lab-wait">Specimen {id} · mounts when it reaches the screen</p>}</div>;
}

const DIAL_INFO: Record<keyof Dials, { name: string; v: [string, string, string] }> = {
  energy: { name: "Energy", v: ["Still: small type, quiet accent", "Confident: the house scale", "Loud: huge type, the accent floods the headers"] },
  rhythm: { name: "Rhythm", v: ["Uniform: one column, every card the same", "Deliberate breaks: a grid with feature cards", "Every family a different composition"] },
  motion: { name: "Motion", v: ["Tier 1: every specimen shows its reduced-motion version", "Specimens animate as they reach the screen", "Plus choreography: cards rise in sequence as they enter"] },
};

export function LabRoom({ comps, families, exhibits }: { comps: LabComp[]; families: { id: string; title: string }[]; exhibits: MorphEx[] }) {
  const dials = useCase((s) => s.dials);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const d = mounted ? dials : { energy: 2, rhythm: 2, motion: 2 } as Dials;
  useForcedRM(d.motion === 1);
  const [q, setQ] = useState("");
  const shown = comps.filter((c) => !q.trim() || q.toLowerCase().split(/\s+/).filter(Boolean).every((w) => `${c.name} ${c.id} ${c.family} tier ${c.tier} ${c.what}`.toLowerCase().includes(w)));
  const set = (k: keyof Dials, v: 1 | 2 | 3) => { setCase((s) => ({ dials: { ...s.dials, [k]: v } })); sfx("tick"); };

  return (
    <div className="lab" data-energy={d.energy} data-rhythm={d.rhythm} data-motion={d.motion}>
      <div className="lab-console" role="group" aria-label="Dials for this room">
        {(Object.keys(DIAL_INFO) as (keyof Dials)[]).map((k) => (
          <fieldset key={k} className="lab-dial">
            <legend className="label">{DIAL_INFO[k].name} · {d[k]}</legend>
            <div className="lab-dial-btns">{([1, 2, 3] as const).map((v) => (
              <button key={v} type="button" className="chip" aria-pressed={d[k] === v} onClick={() => set(k, v)} aria-label={`${DIAL_INFO[k].name} ${v}: ${DIAL_INFO[k].v[v - 1]}`}>{v}</button>))}</div>
            <p className="lab-dial-note">{DIAL_INFO[k].v[d[k] - 1]}</p>
          </fieldset>
        ))}
        <div className="field lab-q"><label className="label" htmlFor="lq">Find a specimen</label><input id="lq" className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="cursor, tier 3, marquee…" autoComplete="off" />
          <p className="mono lab-count" role="status">{shown.length} of {comps.length} specimens</p></div>
      </div>

      <Morph exhibits={exhibits} />

      <div key={`rm-${d.motion === 1}`}>
        {families.map((f) => { const list = shown.filter((c) => c.family === f.id); if (!list.length) return null; return (
          <section key={f.id} className="lab-fam" aria-labelledby={`lf-${f.id}`}>
            <h2 id={`lf-${f.id}`} className="lab-fam-h"><span>{f.title}</span><span className="label">{list.length} specimens</span></h2>
            <ul className="lab-grid">{list.map((c, i) => (
              <li key={c.id} id={`c-${c.id}`} className={`lab-card anchor${d.rhythm === 2 && i % 5 === 0 ? " wide" : ""}`} data-ev={`component:${c.id}`} style={{ ["--i" as string]: i % 6 }}>
                <div className="lab-card-h"><h3>{c.name}</h3><span className="label">T{c.tier}</span></div>
                <p className="lab-what">{c.what}</p>
                <LazyDemo id={c.id} />
                <details className="lab-notes"><summary className="label">Case notes</summary>
                  <dl><div><dt>Use when</dt><dd>{c.use_when}</dd></div><div><dt>It is slop when</dt><dd>{c.avoid_when}</dd></div><div><dt>Reduced motion</dt><dd>{c.reduced_motion}</dd></div></dl>
                  <p className="mono" style={{ fontSize: 12 }}><a href={`https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/main/skills/asfakulsiam-motomation-design/${c.file}`}>{c.file}</a></p>
                </details>
                {c.usedIn.length > 0 && <p className="label lab-used">Mutated in {c.usedIn.map((e, j) => <span key={e.letter}>{j ? ", " : ""}<a href={`/exhibits/${e.slug}/`}>exhibit {e.letter}</a></span>)}</p>}
              </li>))}</ul>
          </section>); })}
      </div>
    </div>
  );
}

/* ---------- Style morph ---------- */
const hex = (h: string) => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const toHex = (c: number[]) => "#" + c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
const mix = (a: string, b: string, t: number) => { const x = hex(a), y = hex(b); return toHex(x.map((v, i) => v + (y[i] - v) * t)); };

function Morph({ exhibits }: { exhibits: MorphEx[] }) {
  const [a, setA] = useState("J");
  const [b, setB] = useState("S");
  const [t, setT] = useState(0.35);
  const A = exhibits.find((e) => e.letter === a)!, B = exhibits.find((e) => e.letter === b)!;
  const g = mix(A.ground, B.ground, t), rawInk = mix(A.ink, B.ink, t), acc = mix(A.accent, B.accent, t), rawMu = mix(A.muted, B.muted, t);
  // a blended ink can sink into a blended ground (light A + dark B meet in grey). The bench measures the raw blend,
  // then sets text in whichever candidate reads best, the way the gate would make you fix it.
  const best = (c: string[]) => c.reduce((a, b) => (ratio(b, g) > ratio(a, g) ? b : a));
  const ink = best([rawInk, A.ink, B.ink, "#111111", "#f4f1ea"]), mu = ratio(rawMu, g) >= 4.5 ? rawMu : ink;
  const rRaw = ratio(rawInk, g), r = ratio(ink, g), rm = ratio(mu, g);
  // the worst point of the blend: sample the whole slider, as the gate samples the worst point of a background
  const worst = useMemo(() => { let w = { t: 0, r: 99 }; for (let i = 0; i <= 20; i++) { const tt = i / 20; const rr = ratio(mix(A.ink, B.ink, tt), mix(A.ground, B.ground, tt)); if (rr < w.r) w = { t: tt, r: rr }; } return w; }, [A, B]);
  return (
    <section className="morph" aria-labelledby="morph-h">
      <div className="morph-ctl">
        <p className="label">Bench 01</p>
        <h2 id="morph-h" className="sec-h" style={{ margin: "6px 0 14px" }}>Blend two exhibits</h2>
        <div className="kit-row" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div className="field"><label className="label" htmlFor="ma">From</label><select id="ma" className="input" value={a} onChange={(e) => setA(e.target.value)}>{exhibits.map((e) => <option key={e.letter} value={e.letter}>{e.letter} · {e.style}</option>)}</select></div>
          <div className="field"><label className="label" htmlFor="mb">To</label><select id="mb" className="input" value={b} onChange={(e) => setB(e.target.value)}>{exhibits.map((e) => <option key={e.letter} value={e.letter}>{e.letter} · {e.style}</option>)}</select></div>
        </div>
        <div className="field" style={{ marginTop: 14 }}><label className="label" htmlFor="mt">Blend · {Math.round(t * 100)}% {B.style}</label>
          <input id="mt" type="range" min={0} max={100} value={Math.round(t * 100)} onChange={(e) => setT(Number(e.target.value) / 100)} className="morph-range" /></div>
        <p className="mono morph-read" role="status">blended ink {fmt(rRaw)} {rRaw >= 4.5 ? "passes" : "fails"}{ink !== rawInk ? ` · swapped to ${ink} at ${fmt(r)}` : ""} · muted {fmt(rm)}</p>
        <p className="muted" style={{ fontSize: 14, margin: 0 }}>Worst point of this blend: {fmt(worst.r)} at {Math.round(worst.t * 100)}%. {worst.r < 4.5 ? "Two palettes that each pass can fail halfway. A blend has to be measured, so the bench swaps the text colour wherever the blended ink drops below 4.5:1." : "This pair holds up at every step."}</p>
      </div>
      <div className="morph-out" style={{ background: g, color: ink }} aria-label={`Blend of exhibit ${A.letter} and ${B.letter}`}>
        <span className="label" style={{ color: mu }}>Exhibit {A.letter} → {B.letter}</span>
        <div className="morph-type" aria-hidden="true">
          <span style={{ fontFamily: FAMILY[A.display], opacity: 1 - t }}>{A.title}</span>
          <span style={{ fontFamily: FAMILY[B.display], opacity: t }}>{B.title}</span>
        </div>
        <p className="sr-only">{A.title} blending into {B.title}</p>
        <p style={{ margin: 0, fontFamily: t < 0.5 ? FAMILY[A.text] : FAMILY[B.text], maxWidth: "40ch" }}>Set in {t < 0.5 ? A.display : B.display} over {t < 0.5 ? A.text : B.text}. The text face swaps at the halfway mark; type does not interpolate between families, only colour does.</p>
        <span className="morph-acc" style={{ background: acc }} />
      </div>
    </section>
  );
}

"use client";
// Live demos for the Autopsy: the folder tree with scrollspy, the collision engine (a port of scripts/collide.mjs:
// same PRNG, same draw order, so a seed here gives the CLI's draw), the three dials, and a contrast probe that uses
// the delivery gate's own thresholds.
import { useEffect, useMemo, useState } from "react";
import { ratio, fmt } from "@/lib/contrast";
import { sfx } from "@/lib/sound";

/* ---------- Folder tree with scrollspy ---------- */
export function TreeNav({ folders }: { folders: { id: string; name: string; count: number }[] }) {
  const [on, setOn] = useState(folders[0]?.id);
  useEffect(() => {
    const els = folders.map((f) => document.getElementById(`f-${f.id}`)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((es) => {
      const vis = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (vis[0]) setOn(vis[0].target.id.slice(2));
    }, { rootMargin: "-20% 0px -70% 0px" });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [folders]);
  return (
    <nav aria-label="Repo folders" className="tree">
      <p className="label tree-root">asfakulsiam-motomation-design/</p>
      <ul>
        {folders.map((f) => (
          <li key={f.id}><a href={`#f-${f.id}`} aria-current={on === f.id ? "location" : undefined}>
            <span className="tree-glyph" aria-hidden="true">{on === f.id ? "▸" : "·"}</span><span className="tree-n">{f.name}/</span><span className="tree-c mono">{f.count}</span>
          </a></li>
        ))}
      </ul>
    </nav>
  );
}

/* ---------- Collision engine ---------- */
function rng(seed?: number | string) {
  if (seed === undefined) { const b = new Uint32Array(1); return () => (crypto.getRandomValues(b), b[0] / 2 ** 32); }
  let s = typeof seed === "number" ? seed : [...String(seed)].reduce((h, ch) => Math.imul(h ^ ch.charCodeAt(0), 2654435761), 1);
  return () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
type Arch = { id: string; name: string; shape: string };
type Mut = { id: string; name: string; operator: string; example: string };
type Col = { source: string; world: string; property: string; becomes: string };
type Kin = { subject: string; verb: string; driver: string };
type Sig = { id: string; name: string; one_line: string };
type Draw = { arch: Arch; mut: Mut; col: Col; kin: string; sig: Sig };

export function CollisionEngine({ archetypes, mutations, collisions, kinetics, signatures }: { archetypes: Arch[]; mutations: Mut[]; collisions: Col[]; kinetics: Kin[]; signatures: Sig[] }) {
  const [seed, setSeed] = useState("42");
  const [n, setN] = useState(3);
  const [draws, setDraws] = useState<Draw[] | null>(null);
  const [lastSeed, setLastSeed] = useState<string>("");
  const run = (useSeed: boolean) => {
    const sv = seed.trim();
    const r = rng(useSeed && sv !== "" ? (Number.isNaN(Number(sv)) ? sv : Number(sv)) : undefined);
    const pick = <T,>(a: T[]) => a[Math.floor(r() * a.length)];
    const drawer = <T,>(all: T[], key: (x: T) => string) => { const used = new Set<string>(); return () => { let fresh = all.filter((x) => !used.has(key(x))); if (!fresh.length) { used.clear(); fresh = all; } const it = pick(fresh); used.add(key(it)); return it; }; };
    const nA = drawer(archetypes, (x) => x.id), nS = drawer(signatures, (x) => x.id), nM = drawer(mutations, (x) => x.id), nC = drawer(collisions, (x) => x.source);
    const out: Draw[] = [];
    for (let i = 0; i < n; i++) {
      const arch = nA(); const mut = nM(); const col = nC();
      const kin = `${pick(kinetics).subject} ${pick(kinetics).verb}, driven by ${pick(kinetics).driver}`;
      out.push({ arch, mut, col, kin, sig: nS() });
    }
    setDraws(out); setLastSeed(useSeed && sv !== "" ? sv : "random"); sfx("snip");
  };
  return (
    <div className="kit">
      <div className="kit-row">
        <div className="field"><label className="label" htmlFor="ce-seed">Seed</label><input id="ce-seed" className="input mono" value={seed} onChange={(e) => setSeed(e.target.value)} inputMode="text" style={{ width: 120 }} /></div>
        <div className="field"><label className="label" htmlFor="ce-n">Draws</label>
          <select id="ce-n" className="input" value={n} onChange={(e) => setN(Number(e.target.value))}>{[1, 2, 3, 4, 5].map((v) => <option key={v}>{v}</option>)}</select></div>
        <button type="button" className="btn" onClick={() => run(true)}>Draw with seed</button>
        <button type="button" className="btn ghost" onClick={() => run(false)}>Draw at random</button>
      </div>
      <p className="mono kit-cmd">$ node scripts/collide.mjs --n {n}{seed.trim() ? ` --seed ${seed.trim()}` : ""}</p>
      <div role="status" aria-live="polite">
        {!draws && <p className="muted">No draw yet. The same seed always gives the same draw, here and in the terminal.</p>}
        {draws && <>
          <p className="sr-only">{draws.length} draws, seed {lastSeed}.</p>
          <ol className="draws">{draws.map((d, i) => (
            <li key={i} className="draw">
              <span className="marker">{i + 1}</span>
              <dl>
                <div><dt>Archetype</dt><dd>{d.arch.name}: {d.arch.shape}</dd></div>
                <div><dt>Mutation</dt><dd>{d.mut.name}: {d.mut.operator}</dd></div>
                <div><dt>Collision</dt><dd>a {d.col.source} ({d.col.world}): {d.col.property}, so {d.col.becomes}</dd></div>
                <div><dt>Kinetic</dt><dd>{d.kin}</dd></div>
                <div><dt>Signature seed</dt><dd>{d.sig.name}: {d.sig.one_line}</dd></div>
              </dl>
            </li>))}</ol>
        </>}
      </div>
    </div>
  );
}

/* ---------- The three dials ---------- */
type Dial = { dial: string; one: string; two: string; three: string; controls: string };
export function DialsDemo({ dials, examples }: { dials: Dial[]; examples: { name: string; energy: number; rhythm: number; motion: number }[] }) {
  const [v, setV] = useState<number[]>([2, 2, 2]);
  const match = examples.find((e) => e.energy === v[0] && e.rhythm === v[1] && e.motion === v[2]);
  return (
    <div className="kit dials">
      {dials.map((d, i) => (
        <div key={d.dial} className="dial">
          <label className="label" htmlFor={`dl-${i}`}>{d.dial} · {v[i]}</label>
          <input id={`dl-${i}`} type="range" min={1} max={3} step={1} value={v[i]} onChange={(e) => { const nv = [...v]; nv[i] = Number(e.target.value); setV(nv); sfx("tick"); }} aria-valuetext={`${v[i]}: ${[d.one, d.two, d.three][v[i] - 1]}`} />
          <p><b>{[d.one, d.two, d.three][v[i] - 1]}.</b> <span className="muted">Controls: {d.controls}.</span></p>
        </div>
      ))}
      <p className="mono dial-out" role="status">--energy={v[0]} --rhythm={v[1]} --motion={v[2]}{match ? ` · the skill's own example: ${match.name}` : ""}</p>
    </div>
  );
}

/* ---------- Contrast probe (gate check c) ---------- */
export function ContrastProbe() {
  const [fg, setFg] = useState("#a8a196");
  const [bg, setBg] = useState("#0e0d0b");
  const ok = (h: string) => /^#([0-9a-f]{6})$/i.test(h);
  const r = useMemo(() => (ok(fg) && ok(bg) ? ratio(fg, bg) : null), [fg, bg]);
  const verdict = r === null ? "Enter two six-digit hex colours." : r >= 4.5 ? "Passes for body text (4.5:1) and large text (3:1)." : r >= 3 ? "Large text only: fails body text at 4.5:1." : "Fails. Below 3:1, even large text is unreadable to the gate.";
  return (
    <div className="kit probe">
      <div className="kit-row">
        <div className="field"><label className="label" htmlFor="cp-fg">Text</label><span className="probe-in"><input type="color" value={ok(fg) ? fg : "#000000"} onChange={(e) => setFg(e.target.value)} aria-label="Pick text colour" /><input id="cp-fg" className="input mono" value={fg} onChange={(e) => setFg(e.target.value.trim())} style={{ width: 120 }} /></span></div>
        <div className="field"><label className="label" htmlFor="cp-bg">Background</label><span className="probe-in"><input type="color" value={ok(bg) ? bg : "#000000"} onChange={(e) => setBg(e.target.value)} aria-label="Pick background colour" /><input id="cp-bg" className="input mono" value={bg} onChange={(e) => setBg(e.target.value.trim())} style={{ width: 120 }} /></span></div>
      </div>
      <div className="probe-swatch" style={{ background: ok(bg) ? bg : undefined, color: ok(fg) ? fg : undefined }}>The suspect was seen leaving at 4.45:1.</div>
      <p role="status" className="mono"><b style={{ fontSize: 22 }}>{r === null ? "—" : fmt(r)}</b> · {verdict}</p>
      <p className="muted" style={{ fontSize: 14 }}>Ratios are floored to two decimals, as the skill’s contrast script prints them: 4.499 reads 4.49 and fails. That is how the skill lost its own studio brief in v1.</p>
    </div>
  );
}

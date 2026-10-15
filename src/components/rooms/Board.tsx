"use client";
// The evidence board: a pan/zoom corkboard. 20 exhibit cards, 5 tier pins and 8 component-family pins, joined by
// red string. Drag (or two fingers) to pan, ⌘/Ctrl + wheel or pinch to zoom, buttons and keys for everything else.
// Plain wheel scrolls the page, so the board never traps the visitor. Filters dim what does not match; the same
// filters drive the list below, which is the accessible reading of the board.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/motion";
import { sfx } from "@/lib/sound";

export type BoardCard = {
  letter: string; slug: string; style: string; title: string; verdict: string; archetype: string; archetypeName: string;
  tier: number; families: string[]; components: string[]; ground: string; ink: string; accent: string; surface: string;
};
type Pin = { id: string; label: string; sub: string; x: number; y: number; kind: "tier" | "family" };

const W = 2600, H = 1640, CW = 250, CH = 200;
const FAM_ORDER = ["type", "text", "scroll", "cursor", "backgrounds", "layout", "ui", "micro"];

function place(i: number) {
  const col = i % 5, row = Math.floor(i / 5);
  // a hand-pinned scatter: a fixed jitter per card so the board is identical on every visit
  const jx = [[-30, 40, -10, 50, -40], [30, -50, 20, -20, 40], [-40, 20, -30, 40, -10], [20, -30, 50, -40, 30]][row][col];
  const jy = [[10, -20, 30, -10, 20], [-20, 30, -10, 20, -30], [20, -10, 30, -20, 10], [-10, 20, -20, 30, -10]][row][col];
  const rot = [[-2.5, 1.5, -1, 2, -1.5], [1, -2, 2.5, -1, 1.5], [-1.5, 2, -2, 1, -2.5], [2, -1, 1.5, -2.5, 1]][row][col];
  return { x: 300 + col * 500 + jx, y: 330 + row * 285 + jy, rot };
}

export function Board({ cards, tiers, families }: { cards: BoardCard[]; tiers: { tier: number; name: string }[]; families: { id: string; title: string; count: number }[] }) {
  const rm = useReducedMotion();
  const vp = useRef<HTMLDivElement>(null);
  const [cam, setCam] = useState({ x: 0, y: 0, s: 0.4 });
  const camRef = useRef(cam); camRef.current = cam;
  const [ready, setReady] = useState(false);
  const [q, setQ] = useState("");
  const [tier, setTier] = useState<number | null>(null);
  const [fam, setFam] = useState<string | null>(null);
  const [hot, setHot] = useState<string | null>(null);
  const [grab, setGrab] = useState(false);
  const moved = useRef(false);

  const pins: Pin[] = useMemo(() => [
    ...tiers.map((t, i) => ({ id: `tier-${t.tier}`, label: `Tier ${t.tier}`, sub: t.name, x: 360 + i * 470, y: 110, kind: "tier" as const })),
    ...FAM_ORDER.map((f, i) => { const fm = families.find((x) => x.id === f)!; return { id: `fam-${f}`, label: fm.title, sub: `${fm.count} components`, x: 230 + i * 305, y: H - 120, kind: "family" as const }; }),
  ], [tiers, families]);
  const pos = useMemo(() => cards.map((_, i) => place(i)), [cards]);

  const match = useCallback((c: BoardCard) => {
    if (tier !== null && c.tier !== tier) return false;
    if (fam && !c.families.includes(fam)) return false;
    if (q.trim()) { const h = `${c.letter} ${c.style} ${c.title} ${c.archetypeName}`.toLowerCase(); if (!q.toLowerCase().split(/\s+/).filter(Boolean).every((w) => h.includes(w))) return false; }
    return true;
  }, [tier, fam, q]);
  const shown = cards.filter(match).length;

  const clamp = (c: { x: number; y: number; s: number }) => {
    const el = vp.current; if (!el) return c;
    const s = Math.min(1.6, Math.max(0.22, c.s));
    const vw = el.clientWidth, vh = el.clientHeight, mw = W * s, mh = H * s;
    const x = mw < vw ? (vw - mw) / 2 : Math.min(80, Math.max(vw - mw - 80, c.x));
    const y = mh < vh ? (vh - mh) / 2 : Math.min(80, Math.max(vh - mh - 80, c.y));
    return { x, y, s };
  };
  const fit = useCallback(() => {
    const el = vp.current; if (!el) return;
    // on a phone, fitting the whole board makes the cards unreadable; fit the height and let the visitor pan sideways
    const s = el.clientWidth < 700 ? Math.max(0.3, el.clientHeight / H) : Math.min(el.clientWidth / W, el.clientHeight / H) * 0.98;
    setCam(clamp({ x: 0, y: 0, s }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const zoomAt = (f: number, px?: number, py?: number) => {
    const el = vp.current; if (!el) return;
    const c = camRef.current; const ox = px ?? el.clientWidth / 2, oy = py ?? el.clientHeight / 2;
    const s = Math.min(1.6, Math.max(0.22, c.s * f)); const k = s / c.s;
    setCam(clamp({ s, x: ox - (ox - c.x) * k, y: oy - (oy - c.y) * k }));
  };
  const focusOn = (wx: number, wy: number, s = Math.max(camRef.current.s, 0.8)) => {
    const el = vp.current; if (!el) return;
    setCam(clamp({ s, x: el.clientWidth / 2 - wx * s, y: el.clientHeight / 2 - wy * s }));
  };

  useEffect(() => { fit(); setReady(true); const on = () => fit(); window.addEventListener("resize", on); return () => window.removeEventListener("resize", on); }, [fit]);

  // ⌘/Ctrl + wheel and trackpad pinch zoom; plain wheel is left to the page.
  useEffect(() => {
    const el = vp.current; if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault(); const r = el.getBoundingClientRect();
      zoomAt(Math.exp(-e.deltaY * 0.0022), e.clientX - r.left, e.clientY - r.top);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pointer pan + two-finger pinch
  const pts = useRef(new Map<number, { x: number; y: number }>());
  const last = useRef<{ x: number; y: number; d: number } | null>(null);
  const centroid = () => { const a = [...pts.current.values()]; const x = a.reduce((n, p) => n + p.x, 0) / a.length, y = a.reduce((n, p) => n + p.y, 0) / a.length; const d = a.length > 1 ? Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y) : 0; return { x, y, d }; };
  const onDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    last.current = centroid(); moved.current = false;
    if (e.pointerType === "mouse" || pts.current.size > 1) (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!pts.current.has(e.pointerId) || !last.current) return;
        const one = e.pointerType === "touch" && pts.current.size < 2; // one finger: the page owns vertical, the board horizontal
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const c = centroid(); const dx = c.x - last.current.x, dy = one ? 0 : c.y - last.current.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) { moved.current = true; setGrab(true); }
    const cur = camRef.current; let next = { ...cur, x: cur.x + dx, y: cur.y + dy };
    if (c.d && last.current.d) { const r = vp.current!.getBoundingClientRect(); const s = Math.min(1.6, Math.max(0.22, cur.s * (c.d / last.current.d))); const k = s / cur.s; const ox = c.x - r.left, oy = c.y - r.top; next = { s, x: ox - (ox - next.x) * k, y: oy - (oy - next.y) * k }; }
    setCam(clamp(next)); last.current = c;
  };
  const onUp = (e: React.PointerEvent) => { pts.current.delete(e.pointerId); last.current = pts.current.size ? centroid() : null; setGrab(false); };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.target !== vp.current) return;
    const step = 80; const c = camRef.current;
    const map: Record<string, () => void> = {
      ArrowLeft: () => setCam(clamp({ ...c, x: c.x + step })), ArrowRight: () => setCam(clamp({ ...c, x: c.x - step })),
      ArrowUp: () => setCam(clamp({ ...c, y: c.y + step })), ArrowDown: () => setCam(clamp({ ...c, y: c.y - step })),
      "+": () => zoomAt(1.25), "=": () => zoomAt(1.25), "-": () => zoomAt(0.8), "0": fit,
    };
    if (map[e.key]) { e.preventDefault(); map[e.key](); }
  };

  const pinById = Object.fromEntries(pins.map((p) => [p.id, p]));
  const strings: { k: string; a: { x: number; y: number }; b: { x: number; y: number }; on: boolean; lit: boolean; card: string }[] = [];
  cards.forEach((c, i) => {
    const p = pos[i]; const a = { x: p.x, y: p.y - CH / 2 + 8 };
    const on = match(c);
    const tp = pinById[`tier-${c.tier}`]; if (tp) strings.push({ k: `${c.letter}-t`, a, b: { x: tp.x, y: tp.y + 22 }, on, lit: hot === c.letter || hot === tp.id, card: c.letter });
    c.families.forEach((f) => { const fp = pinById[`fam-${f}`]; if (fp) strings.push({ k: `${c.letter}-${f}`, a: { x: p.x, y: p.y + CH / 2 - 8 }, b: { x: fp.x, y: fp.y - 22 }, on: on && (!fam || fam === f), lit: hot === c.letter || hot === fp.id, card: c.letter }); });
  });
  const sag = (a: { x: number; y: number }, b: { x: number; y: number }) => { const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 + Math.min(120, Math.abs(a.x - b.x) * 0.12 + 30); return `M${a.x} ${a.y} Q${mx} ${my} ${b.x} ${b.y}`; };

  const pinHit = (p: Pin) => {
    if (p.kind === "tier") { const t = Number(p.id.split("-")[1]); setTier(tier === t ? null : t); }
    else { const f = p.id.slice(4); setFam(fam === f ? null : f); }
    sfx("tick");
  };

  return (
    <div className="board">
      <div className="board-tools wrap" role="group" aria-label="Board filters">
        <div className="field board-q"><label className="label" htmlFor="bq">Search the styles</label>
          <input id="bq" className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="cyberpunk, letter, ledger…" autoComplete="off" /></div>
        <div className="field"><span className="label">Tier</span>
          <div className="chips">{tiers.map((t) => { const n = cards.filter((c) => c.tier === t.tier).length; return (
            <button key={t.tier} type="button" className="chip" aria-pressed={tier === t.tier} onClick={() => { setTier(tier === t.tier ? null : t.tier); sfx("tick"); }}>T{t.tier}<span className="n">{n}</span></button>); })}</div></div>
        <div className="field"><span className="label">Component family</span>
          <div className="chips">{FAM_ORDER.map((f) => { const fm = families.find((x) => x.id === f)!; const n = cards.filter((c) => c.families.includes(f)).length; return (
            <button key={f} type="button" className="chip" aria-pressed={fam === f} onClick={() => { setFam(fam === f ? null : f); sfx("tick"); }}>{fm.title}<span className="n">{n}</span></button>); })}</div></div>
        <p className="board-count mono" role="status" aria-live="polite">{shown} of {cards.length} exhibits match{tier === 1 ? ". No exhibit needed Tier 1 alone; the lowest tier that delivers was always 2 or higher here" : ""}{shown === 0 && tier !== 1 ? ". Nothing on the board fits; clear a filter" : ""}.</p>
        {(tier !== null || fam || q) && <button type="button" className="btn ghost board-clear" onClick={() => { setTier(null); setFam(null); setQ(""); sfx("snip"); }}>Clear filters</button>}
      </div>

      <div className="board-frame">
        <div ref={vp} className={`board-vp${grab ? " grabbing" : ""}`} tabIndex={0} role="application" aria-roledescription="pan and zoom board"
          aria-label="Evidence board. Arrow keys pan, plus and minus zoom, 0 fits the board. Tab moves between exhibit cards."
          onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onKeyDown={onKey}
          onClickCapture={(e) => { if (moved.current) { e.preventDefault(); e.stopPropagation(); moved.current = false; } }}>
          <div className="board-world" style={{ width: W, height: H, transform: `translate3d(${cam.x}px, ${cam.y}px, 0) scale(${cam.s})`, transition: ready && !grab && !rm ? "transform 0.32s var(--ease-out)" : "none" }}>
            <svg className="board-strings" width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
              {strings.map((s) => <path key={s.k} d={sag(s.a, s.b)} className={`str${s.on ? "" : " off"}${s.lit ? " lit" : ""}`} />)}
            </svg>
            {pins.map((p) => (
              <button key={p.id} type="button" className={`pin pin-${p.kind}`} style={{ left: p.x, top: p.y }}
                aria-pressed={p.kind === "tier" ? tier === Number(p.id.split("-")[1]) : fam === p.id.slice(4)}
                onMouseEnter={() => setHot(p.id)} onMouseLeave={() => setHot(null)} onFocus={() => setHot(p.id)} onBlur={() => setHot(null)}
                onClick={() => pinHit(p)}>
                <span className="pin-head" aria-hidden="true" /><b>{p.label}</b><span>{p.sub}</span>
              </button>
            ))}
            {cards.map((c, i) => { const p = pos[i]; const on = match(c); return (
              <a key={c.letter} href={`/exhibits/${c.slug}/`} className={`bcard${on ? "" : " off"}`} data-ev={`archetype:${c.archetype}`}
                style={{ left: p.x - CW / 2, top: p.y - CH / 2, width: CW, height: CH, transform: `rotate(${p.rot}deg)` }}
                onMouseEnter={() => setHot(c.letter)} onMouseLeave={() => setHot(null)}
                onFocus={() => { setHot(c.letter); focusOn(p.x, p.y); }} onBlur={() => setHot(null)}
                aria-label={`Exhibit ${c.letter}, ${c.style}: ${c.title}. Archetype ${c.archetypeName}, Tier ${c.tier}.${on ? "" : " Does not match the filters."}`}>
                <span className="bcard-photo" style={{ background: c.ground, color: c.ink }}>
                  <span className="bcard-l" style={{ color: c.ink }}>{c.letter}</span>
                  <span className="bcard-sw" aria-hidden="true"><i style={{ background: c.surface }} /><i style={{ background: c.ink }} /><i style={{ background: c.accent }} /></span>
                </span>
                <span className="bcard-cap"><b>{c.style}</b><span>{c.title}</span><span className="bcard-k mono">{c.archetypeName} · T{c.tier}</span></span>
                <span className="bcard-tack" aria-hidden="true" />
              </a>); })}
          </div>
        </div>
        <div className="board-zoom" role="group" aria-label="Zoom">
          <button type="button" className="chip" onClick={() => zoomAt(1.25)} aria-label="Zoom in">+</button>
          <button type="button" className="chip" onClick={() => zoomAt(0.8)} aria-label="Zoom out">−</button>
          <button type="button" className="chip" onClick={fit}>Fit</button>
          <span className="mono board-pct" aria-live="off">{Math.round(cam.s * 100)}%</span>
        </div>
        <p className="board-hint mono">Drag to pan · ⌘ or Ctrl + scroll to zoom · two fingers on touch</p>
      </div>

      <section className="sec board-list" aria-labelledby="bl-h">
        <p className="label">The board, read as a list</p>
        <h2 id="bl-h" className="sec-h">Who is pinned to what</h2>
        <div className="reg-wrap" tabIndex={0} role="region" aria-label="Exhibits and their strings">
          <table className="reg">
            <thead><tr><th>Exhibit</th><th>Style</th><th>Archetype</th><th className="num">Tier</th><th>Strings to families</th><th>Skill components</th></tr></thead>
            <tbody>{cards.filter(match).map((c) => (
              <tr key={c.letter}><td><a href={`/exhibits/${c.slug}/`}><b>{c.letter}</b> {c.title}</a></td><td>{c.style}</td><td>{c.archetypeName}</td><td className="num">{c.tier}</td>
                <td>{c.families.map((f) => families.find((x) => x.id === f)?.title).join(", ")}</td><td><code>{c.components.join(", ")}</code></td></tr>))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

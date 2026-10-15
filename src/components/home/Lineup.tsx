"use client";
// The Lineup (Home, Tier 5, technique A). The word MOTOMATION morphs its real glyph outlines through the 20 exhibit
// typefaces as you scroll, against a lineup height wall. Palette cuts hard at each beat's midpoint (never cross-fades).
// Reduced motion gets a different composition: the lineup photo sheet. Mobile gets its own two-row choreography.
import { useEffect, useMemo, useRef, useState } from "react";
import { gsap, ScrollTrigger, MorphSVGPlugin } from "@/lib/gsap";
import { useReducedMotion, useMedia } from "@/lib/motion";
import { sfx } from "@/lib/sound";

type Glyph = { ch: string; x: number; d: string };
type Mark = { family: string; width: number; capHeight: number; glyphs: Glyph[] };
export type Suspect = { letter: string; slug: string; style: string; title: string; display: string; palette: string; ground: string; ink: string; accent: string; verdict: string };

const BUREAU: Pick<Suspect, "ground" | "ink" | "accent"> = { ground: "#0E0D0B", ink: "#F2EEE6", accent: "#E0442B" };
const W = 1200; // desktop viewBox width
const MW = 640; // mobile viewBox width

/** Where glyph i of a word sits: its row's offset, baseline and the uniform scale. Paths stay in font units. */
function place(m: Mark, i: number, mobile: boolean) {
  if (!mobile) {
    const k = Math.min((W * 0.86) / m.width, 150 / m.capHeight);
    return { x: (W - m.width * k) / 2, y: 190 + (m.capHeight * k) / 2, k };
  }
  const split = m.glyphs[4].x;
  const w1 = split, w2 = m.width - split;
  const k = Math.min((MW * 0.88) / Math.max(w1, w2), 170 / m.capHeight);
  const capPx = m.capHeight * k;
  const top = 260 - capPx - 18;
  if (i < 4) return { x: (MW - w1 * k) / 2, y: top + capPx, k };
  return { x: (MW - w2 * k) / 2 - split * k, y: top + capPx * 2 + 36, k };
}

export function Lineup({ suspects }: { suspects: Suspect[] }) {
  const reduce = useReducedMotion();
  const mobile = useMedia("(max-width: 767px)");
  const [marks, setMarks] = useState<Record<string, Mark> | null>(null);
  const [beat, setBeat] = useState(-1);
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const groups = useRef<(SVGGElement | null)[]>([]);

  useEffect(() => { import("@content/wordmarks.json").then((m) => setMarks(m.default as unknown as Record<string, Mark>)); }, []);

  const order = useMemo(() => ["BUREAU", ...suspects.map((s) => s.letter), "BUREAU"], [suspects]);
  const seg = order.length - 1; // 21 segments: Bureau → J … → N → Bureau

  useEffect(() => {
    if (!marks || reduce || !root.current) return;
    const ctx = gsap.context(() => {
      const first = order.map((key) => Array.from({ length: 10 }, (_, i) => ({ d: marks[key].glyphs[i].d, ...place(marks[key], i, mobile) })));
      first[0].forEach((p, i) => {
        paths.current[i]?.setAttribute("d", p.d);
        gsap.set(groups.current[i], { x: p.x, y: p.y, scale: p.k, svgOrigin: "0 0" });
      });
      const tl = gsap.timeline({ defaults: { ease: "none" } });
      for (let s = 1; s <= seg; s++) {
        const at = s - 1;
        for (let i = 0; i < 10; i++) {
          const p = first[s][i];
          tl.to(paths.current[i], { morphSVG: { shape: p.d, shapeIndex: "auto" }, duration: 0.55 }, at);
          tl.to(groups.current[i], { x: p.x, y: p.y, scale: p.k, duration: 0.55 }, at);
        }
        tl.to({}, { duration: 0.45 }, at + 0.55);
      }
      ScrollTrigger.create({
        trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.6, animation: tl,
        onUpdate: (st) => {
          const t = st.progress * seg; const k = Math.floor(t); const local = t - k;
          const b = Math.min(seg, local >= 0.275 ? k + 1 : k);
          setBeat((prev) => { if (prev !== b) sfx("tick", 0.04); return b; });
        },
      });
    }, root);
    return () => ctx.revert();
  }, [marks, reduce, mobile, order, seg]);

  const current = beat <= 0 || beat >= seg ? null : suspects[beat - 1];
  const pal = current ?? { ...BUREAU };

  if (reduce) return <LineupSheet suspects={suspects} marks={marks} />;

  return (
    <section ref={root} className="lineup" aria-labelledby="lineup-h" style={{ height: mobile ? "700vh" : "1000vh" }} data-ev="signature:lineup">
      <h2 id="lineup-h" className="sr-only">The lineup: the word Motomation set in each of the 20 exhibit typefaces</h2>
      <div ref={stage} className="lineup-stage" style={{ background: pal.ground, color: pal.ink }}>
        <div className="lineup-wall" aria-hidden="true">
          {[200, 190, 180, 170, 160, 150].map((h) => <div key={h} className="wall-line"><span>{h}</span></div>)}
        </div>
        <svg className="lineup-svg" viewBox={mobile ? `0 0 ${MW} 520` : `0 0 ${W} 380`} preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
          {Array.from({ length: 10 }, (_, i) => (
            <g key={i} ref={(el) => { groups.current[i] = el; }}>
              <path ref={(el) => { paths.current[i] = el; }} fill="currentColor" d={marks ? marks.BUREAU.glyphs[i].d : ""} />
            </g>
          ))}
        </svg>
        <div className="suspect-card">
          {current ? (
            <>
              <p className="label" style={{ color: "var(--muted)" }}><span className="marker">{current.letter}</span> Suspect {String(beat).padStart(2, "0")} of 20</p>
              <p className="suspect-name">{current.style}</p>
              <p className="suspect-meta">{current.title} · set in {current.display} · palette {current.palette}</p>
              <p className="suspect-verdict">“{current.verdict}”</p>
              <a className="btn" href={`/exhibits/${current.slug}/`}>Examine exhibit {current.letter}</a>
            </>
          ) : (
            <>
              <p className="label" style={{ color: "var(--muted)" }}>{beat >= seg ? "Lineup complete" : "The lineup"}</p>
              <p className="suspect-name">{beat >= seg ? "Back to the Bureau" : "Twenty suspects, one word"}</p>
              <p className="suspect-meta">{beat >= seg ? "Same letters, twenty languages. Pick one and take it apart." : "Scroll. Each stop sets MOTOMATION in one exhibit's own typeface and palette."}</p>
            </>
          )}
        </div>
        <ol className="lineup-rail" aria-label="Lineup position">
          {suspects.map((s, i) => (
            <li key={s.letter} data-on={beat === i + 1 ? "true" : undefined} data-past={beat > i + 1 ? "true" : undefined}><a href={`/exhibits/${s.slug}/`} aria-label={`Exhibit ${s.letter}, ${s.style}`}>{s.letter}</a></li>
          ))}
        </ol>
        <p className="lineup-time mono" role="timer" aria-live="off">{String(Math.max(0, Math.min(20, beat))).padStart(2, "0")}/20</p>
      </div>
    </section>
  );
}

function LineupSheet({ suspects, marks }: { suspects: Suspect[]; marks: Record<string, Mark> | null }) {
  // Designed reduced-motion frame R2: the lineup photo sheet. Every suspect visible at once, each a link.
  return (
    <section className="lineup-sheet" aria-labelledby="sheet-h">
      <div className="wrap">
        <p className="label">Reduced motion · the lineup photo sheet</p>
        <h2 id="sheet-h" className="display" style={{ fontSize: "var(--step-3)", margin: "8px 0 28px" }}>Twenty suspects, one word</h2>
      </div>
      <ol className="sheet-grid">
        {suspects.map((s) => {
          const m = marks?.[s.letter];
          return (
            <li key={s.letter} style={{ background: s.ground, color: s.ink }}>
              <a href={`/exhibits/${s.slug}/`}>
                <div className="sheet-wall" aria-hidden="true" />
                {m ? (
                  <svg viewBox={`-10 ${-m.capHeight - 18} ${m.width + 20} ${m.capHeight + 34}`} aria-hidden="true" focusable="false">
                    {m.glyphs.map((g, i) => <path key={i} d={g.d} fill="currentColor" />)}
                  </svg>
                ) : <span className="sheet-fallback" aria-hidden="true">MOTOMATION</span>}
                <span className="sheet-card"><b>{s.letter}</b> {s.style} · {s.display} · {s.palette}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

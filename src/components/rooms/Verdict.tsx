"use client";
// The verdict: sealed until all twenty exhibits are in the evidence tray. Then a generative poster, drawn on canvas
// from the twenty palettes in the order you collected them (seeded, so Reshuffle gives a new composition and the
// same seed always gives the same poster), downloadable as a PNG.
import { useEffect, useRef, useState } from "react";
import { useCase } from "@/lib/store";
import { sfx } from "@/lib/sound";

export type VEx = { letter: string; slug: string; style: string; ground: string; ink: string; accent: string };

function rng(seed: number) { let s = seed | 0; return () => { s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const SEED_KEY = "motomation-verdict-seed";

export function Verdict({ ex, caseNo, total }: { ex: VEx[]; caseNo: string; total: number }) {
  const evidence = useCase((s) => s.evidence);
  const [on, setOn] = useState(false);
  useEffect(() => setOn(true), []);
  const have = on ? evidence.length : 0;
  const open = on && have >= total;
  if (!on) return <div className="vd-sealed" aria-busy="true"><p className="label">Checking the evidence tray</p></div>;
  if (!open) return <Sealed ex={ex} evidence={evidence} total={total} />;
  return <Poster ex={ex} caseNo={caseNo} />;
}

function Sealed({ ex, evidence, total }: { ex: VEx[]; evidence: string[]; total: number }) {
  const missing = ex.filter((e) => !evidence.includes(e.letter));
  return (
    <section className="sec vd-sealed" aria-labelledby="vs-h">
      <p className="label">Sealed · {evidence.length} of {total} exhibits in your tray</p>
      <h2 id="vs-h" className="sec-h">The verdict waits for the evidence</h2>
      <p className="sec-lede">Open every exhibit once and it goes into your tray. When all {total} are in, this room unseals and draws a poster from what you collected.</p>
      <div className="meter" role="img" aria-label={`${evidence.length} of ${total}`} style={{ maxWidth: 560, marginBottom: 24 }}><i style={{ width: `${(evidence.length / total) * 100}%` }} /></div>
      <p className="label">Still outstanding</p>
      <ul className="vd-miss">{missing.map((e) => <li key={e.letter}><a href={`/exhibits/${e.slug}/`} className="chip"><b>{e.letter}</b> {e.style}</a></li>)}</ul>
    </section>
  );
}

function Poster({ ex, caseNo }: { ex: VEx[]; caseNo: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [seed, setSeed] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    let s = Number(localStorage.getItem(SEED_KEY));
    if (!s) { s = Math.floor(Math.random() * 1e9) + 1; try { localStorage.setItem(SEED_KEY, String(s)); } catch { /* private mode */ } }
    setSeed(s); sfx("chime");
  }, []);
  useEffect(() => {
    if (seed === null) return;
    const c = ref.current!; const W = 1500, H = 2000; c.width = W; c.height = H; const g = c.getContext("2d")!;
    const css = getComputedStyle(document.documentElement);
    const disp = css.getPropertyValue("--font-display").trim() || "serif", mono = css.getPropertyValue("--font-mono").trim() || "monospace";
    const draw = () => {
      const r = rng(seed);
      g.fillStyle = "#0e0d0b"; g.fillRect(0, 0, W, H);
      // lineup height wall
      g.strokeStyle = "rgba(242,238,230,0.14)"; g.lineWidth = 2; g.font = `28px ${mono}`; g.fillStyle = "rgba(242,238,230,0.5)";
      for (let i = 0; i <= 10; i++) { const y = 420 + i * 100; g.beginPath(); g.moveTo(90, y); g.lineTo(W - 90, y); g.stroke(); g.fillText(`${(10 - i) * 10}`, 96, y - 10); }
      // twenty suspects: one bar per exhibit, heights and order drawn from the seed
      const order = [...ex].sort(() => r() - 0.5);
      const bw = (W - 180) / order.length;
      order.forEach((e, i) => {
        const h = 260 + r() * 720; const x = 90 + i * bw, y = 1420 - h;
        g.fillStyle = e.ground; g.fillRect(x + 4, y, bw - 8, h);
        g.fillStyle = e.accent; g.fillRect(x + 4, y, bw - 8, 10 + r() * 30);
        g.fillStyle = e.ink; g.font = `800 ${Math.floor(bw * 0.9)}px ${disp}`; g.textAlign = "center"; g.fillText(e.letter, x + bw / 2, 1400);
      });
      g.textAlign = "left";
      // red string through three of them
      g.strokeStyle = "#e0442b"; g.lineWidth = 5; g.beginPath();
      for (let k = 0; k < 4; k++) { const i = Math.floor(r() * order.length); const x = 90 + i * bw + bw / 2, y = 520 + r() * 600; if (k) g.quadraticCurveTo((x + 750) / 2, y + 120, x, y); else g.moveTo(x, y); }
      g.stroke();
      // title block
      g.fillStyle = "#f2eee6"; g.font = `800 260px ${disp}`; g.fillText("VERDICT", 84, 300);
      g.fillStyle = "#f2c230"; g.fillRect(90, 1500, W - 180, 6);
      g.fillStyle = "#f2eee6"; g.font = `600 64px ${disp}`; g.fillText("Guilty of taste, on twenty counts.", 90, 1610);
      g.font = `30px ${mono}`; g.fillStyle = "#a8a196";
      g.fillText(`${caseNo} · 20 of 20 exhibits examined`, 90, 1700);
      g.fillText(`Filed ${new Date().toISOString().slice(0, 10)} · poster seed ${seed}`, 90, 1750);
      g.fillText("motomation · the case file", 90, 1900);
    };
    document.fonts.ready.then(draw);
  }, [seed, ex, caseNo]);
  const download = () => { ref.current!.toBlob((b) => { if (!b) return; const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = `motomation-verdict-${seed}.png`; a.click(); URL.revokeObjectURL(a.href); setSaved(true); sfx("seal"); }, "image/png"); };
  const reshuffle = () => { const s = Math.floor(Math.random() * 1e9) + 1; try { localStorage.setItem(SEED_KEY, String(s)); } catch { /* ignore */ } setSeed(s); setSaved(false); sfx("snip"); };
  return (
    <section className="sec vd-open" aria-labelledby="vo-h">
      <div className="vd-grid">
        <div>
          <p className="label">Unsealed · 20 of 20</p>
          <h2 id="vo-h" className="sec-h">The finding</h2>
          <p className="sec-lede">You opened every exhibit. The poster is drawn from their twenty palettes, in an order and at heights taken from your seed. Keep it, or draw another.</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button type="button" className="btn" onClick={download}>{saved ? "Saved. Download again" : "Download the poster (PNG)"}</button>
            <button type="button" className="btn ghost" onClick={reshuffle}>Draw a new composition</button>
          </div>
          <p className="mono" role="status" style={{ fontSize: 13, color: "var(--muted)", marginTop: 14 }}>{seed ? `Seed ${seed}. 1500 × 2000 pixels.` : ""}</p>
        </div>
        <canvas ref={ref} className="vd-canvas" role="img" aria-label="Verdict poster: twenty coloured bars against a lineup wall, one per exhibit, under the word VERDICT and the line Guilty of taste, on twenty counts." />
      </div>
    </section>
  );
}

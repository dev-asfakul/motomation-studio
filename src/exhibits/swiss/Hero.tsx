"use client";
import "./x.css";
import { GridOverlay } from "@/components/originals/grid-overlay";
import { MeasureRule } from "@/components/originals/measure-rule";
import type { Exhibit } from "@/content/exhibits";
import { repo } from "@/content/repo-client";

const colPx = () => (typeof window === "undefined" ? 0 : (window.innerWidth - 32) / 12);

export default function Hero({ e }: { e: Exhibit }) {
  const rows = [
    { n: String(repo.components).padStart(2, "0"), k: "Components", v: "every one a working specimen" },
    { n: String(repo.signatures).padStart(2, "0"), k: "Signatures", v: "one per page, never repeated" },
    { n: String(repo.archetypes).padStart(2, "0"), k: "Archetypes", v: "the finding: no two exhibits share one", signal: true },
    { n: String(repo.tiers).padStart(2, "0"), k: "Tiers", v: "the lowest that delivers" },
  ];
  return (
    <header className="x-hero d-hero" aria-labelledby="x-title">
      <GridOverlay columns={12} baseline={8}>
        <div className="d-grid">
          <p className="x-hero-meta d-meta"><b>Exhibit {e.letter}</b><span>{e.style}</span><span>Tier {e.tier}</span></p>
          <h1 id="x-title" className="d-title"><span className="d-mask"><span>The Grid</span></span><span className="d-mask"><span>Reconstruction</span></span></h1>
          <ol className="d-rows">
            {rows.map((r, i) => (
              <li key={r.k} className="d-row" data-signal={r.signal ? "" : undefined}>
                <MeasureRule columnPx={colPx} delay={300 + i * 120}>
                  <span className="d-mask"><span className="d-n" style={{ animationDelay: `${200 + i * 120}ms` }}>{r.n}</span></span>
                </MeasureRule>
                <p className="d-k">{r.k}{r.signal && <i className="d-sig" aria-label="signal" />}</p>
                <p className="d-v">{r.v}</p>
              </li>
            ))}
          </ol>
          <p className="d-foot">Every element on this page snaps to the 12-column grid or the 8px baseline. Switch the overlays and check.</p>
        </div>
      </GridOverlay>
    </header>
  );
}

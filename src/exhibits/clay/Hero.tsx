"use client";
import "./x.css";
import { useState } from "react";
import { ClaySuspect, ClayDefs } from "@/components/originals/clay-suspect";
import type { Exhibit } from "@/content/exhibits";
import { repo } from "@/content/repo-client";

const COLORS = ["#C9B79C", "#B8875E", "#8FA67A", "#5C7A48", "#A8553A"];
export default function Hero({ e }: { e: Exhibit }) {
  const [said, setSaid] = useState("");
  return (
    <header className="x-hero h-hero" aria-labelledby="x-title">
      <ClayDefs />
      <p className="x-hero-meta"><b>Exhibit {e.letter}</b><span>{e.style}</span><span>Tier {e.tier}</span><span>Press, drag, let go</span></p>
      <h1 id="x-title" className="h-title">The Clay Lineup</h1>
      <p className="h-sub">Five suspects, one per motion tier, from a small Basic to a towering Motomation. Squeeze one. It keeps your print.</p>
      <div className="h-wall" aria-hidden="true">{[200, 160, 120, 80, 40].map((n) => <span key={n} style={{ bottom: `${(n / 220) * 100}%` }}>{n}</span>)}</div>
      <div className="h-line">
        {repo.tierNames.map((t, i) => <ClaySuspect key={t.tier} label={`Tier ${t.tier} · ${t.name}`} sub={t.when} height={110 + i * 46} color={COLORS[i]} seed={i + 1} onPrint={(l) => setSaid(`Thumbprint left on ${l}.`)} />)}
      </div>
      <p className="sr-only" aria-live="polite">{said}</p>
    </header>
  );
}

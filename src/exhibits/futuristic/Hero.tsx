"use client";
import "./x.css";
import { useState } from "react";
import { HologramVolume } from "@/components/originals/hologram-volume";
import { CTScrubber } from "@/components/originals/ct-scrubber";
import { SplitFlap } from "@/vendor/motomation/components/type/split-flap";
import type { Exhibit } from "@/content/exhibits";
import { repo } from "@/content/repo-client";

const LAYERS = repo.folders.slice(0, 9);
export default function Hero({ e }: { e: Exhibit }) {
  const [v, setV] = useState(0.5);
  const poster = (
    <svg className="o-poster" viewBox="0 0 400 420" role="img" aria-label={`Still reconstruction: ${LAYERS.length} layers, one per folder`}>
      {LAYERS.map((l, i) => { const y = 380 - i * 40; const on = Math.round(v * (LAYERS.length - 1)) === i; const rx = 120 + (l.count % 7) * 9;
        return <g key={l.id} opacity={on ? 1 : 0.55}><ellipse cx="200" cy={y} rx={rx} ry={rx * 0.22} fill="none" stroke={on ? "#337FE3" : "#9EAAB3"} strokeWidth={on ? 2 : 1} strokeDasharray={on ? "" : "2 4"} />
          {Array.from({ length: 10 + l.count }, (_, k) => { const a = (k / (10 + l.count)) * Math.PI * 2 + i; return <circle key={k} cx={200 + Math.cos(a) * rx * 0.8} cy={y + Math.sin(a) * rx * 0.18} r="1.6" fill={on ? "#337FE3" : "#E8EEF2"} />; })}</g>; })}
      <path d="M200 20 V400" stroke="#9EAAB3" strokeDasharray="1 6" />
    </svg>
  );
  return (
    <header className="x-hero o-hero" aria-labelledby="x-title">
      <p className="x-hero-meta"><b>Exhibit {e.letter}</b><span>{e.style}</span><span>Tier {e.tier}</span><span>Drag to orbit · scrub to slice</span></p>
      <h1 id="x-title" className="o-title">Holographic<br />Reconstruction</h1>
      <div className="o-stage">
        <div className="o-vol"><span className="o-ret" aria-hidden="true" /><HologramVolume layers={LAYERS.map((l) => ({ name: l.id, count: l.count }))} slice={v} ink="#E8EEF2" accent="#337FE3" poster={poster} style={{ position: "absolute", inset: 0 }} /></div>
        <CTScrubber className="o-ct" layers={LAYERS.map((l) => ({ name: l.id, note: `${l.count} files` }))} value={v} onChange={setV}
          readout={(i) => (<><p className="o-k">Slice {String(i + 1).padStart(2, "0")} / {String(LAYERS.length).padStart(2, "0")}</p><SplitFlap value={LAYERS[i].id.toUpperCase().padEnd(10, " ")} className="o-flap" /><p className="o-note">{LAYERS[i].count} file{LAYERS[i].count === 1 ? "" : "s"} in skills/…/{LAYERS[i].id}/</p></>)} />
      </div>
    </header>
  );
}

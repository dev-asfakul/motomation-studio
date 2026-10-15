"use client";
import "./x.css";
import { VelvetCurtain } from "@/components/originals/velvet-curtain";
import { WaxSeal } from "@/components/originals/wax-seal";
import { DarkroomDevelop } from "@/vendor/motomation/components/scroll/darkroom-develop";
import { PLATES } from "./plates";
import type { Exhibit } from "@/content/exhibits";
import { repo } from "@/content/repo-client";

export default function Hero({ e }: { e: Exhibit }) {
  return (
    <header className="x-hero t-hero" aria-labelledby="x-title">
      <div className="t-gas" aria-hidden="true" />
      <VelvetCurtain className="t-curtain" />
      <div className="t-head">
        <p className="x-hero-meta"><b>Exhibit {e.letter}</b><span>{e.style}</span><span>Tier {e.tier}</span><span>Press a seal on a plate</span></p>
        <p className="t-orn" aria-hidden="true">❦</p>
        <h1 id="x-title" className="t-title">The Gaslight<br /><em>Archive</em></h1>
        <p className="t-sub">Three plates from the case, engraved in line and developed under gaslight. Version {repo.version}, {repo.files.toLocaleString("en-US")} files catalogued.</p>
      </div>
      <ol className="t-plates">
        {PLATES.map((p) => (
          <li key={p.n} className="t-plate">
            <div className="t-frame"><DarkroomDevelop src={p.src} alt={`Plate ${p.n}: ${p.name}, an engraving`} width={600} height={760} /></div>
            <p className="t-cap"><b>Plate {p.n} · {p.name}</b>{p.caption}</p>
            <WaxSeal id={`plate-${p.n}`} label={`Plate ${p.n}`} className="t-seal" />
          </li>
        ))}
      </ol>
    </header>
  );
}

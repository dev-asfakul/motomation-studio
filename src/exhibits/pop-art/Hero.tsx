"use client";
import "./x.css";
import { BendayCanvas } from "@/components/originals/benday-canvas";
import { SpeechBubble } from "@/components/originals/speech-bubble";
import { magnifier, print, mark, folder } from "./draws";
import type { Exhibit } from "@/content/exhibits";
import { repo } from "@/content/repo-client";

const PANELS = [
  { n: "01", draw: magnifier, alt: "Halftone panel: a magnifying glass", ink: "#1F4FD8", paper: "#F2EFE6", sfx: "LOOK!", say: `${repo.components} components. Each one says when it is slop.`, who: "The detective", tail: "left" as const },
  { n: "02", draw: print, alt: "Halftone panel: a thumbprint", ink: "#B91D17", paper: "#F7E7B4", sfx: "SMUDGE", say: `${repo.signatures} signatures. Use one, bend it, never stack three.`, who: "The lab", tail: "right" as const },
  { n: "03", draw: mark, alt: "Halftone panel: the letter M", ink: "#141414", paper: "#F2EFE6", sfx: "THWACK", say: "A gate that measures contrast and overflow on real screenshots.", who: "The gate", tail: "left" as const },
  { n: "04", draw: folder, alt: "Halftone panel: a case folder", ink: "#1F4FD8", paper: "#F7E7B4", sfx: "CASE OPEN", say: `${repo.tiers} motion tiers. Pick the lowest one that delivers.`, who: "The file", tail: "right" as const },
];
export default function Hero({ e }: { e: Exhibit }) {
  return (
    <header className="x-hero k-hero" aria-labelledby="x-title">
      <div className="k-top">
        <p className="x-hero-meta"><b>Exhibit {e.letter}</b><span>{e.style}</span><span>Tier {e.tier}</span><span>Move over the dots</span></p>
        <h1 id="x-title" className="k-title">The Halftone Dossier</h1>
        <p className="k-issue">Issue {repo.version} · four colourways · printed from the repo</p>
      </div>
      <ol className="k-page">
        {PANELS.map((p) => (
          <li key={p.n} className="k-panel">
            <span className="k-stub" aria-hidden="true">No. {p.n}</span>
            <BendayCanvas draw={p.draw} alt={p.alt} ink={p.ink} paper={p.paper} cell={10} angle={p.n === "02" ? 45 : 15} />
            <span className="k-sfx" aria-hidden="true">{p.sfx}</span>
            <SpeechBubble className="k-bub" text={p.say} speaker={p.who} tail={p.tail} />
          </li>
        ))}
      </ol>
    </header>
  );
}

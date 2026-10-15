"use client";
import "./x.css";
import { InkWriter } from "@/components/originals/ink-writer";
import { FreehandPad } from "@/components/originals/freehand-pad";
import type { Exhibit } from "@/content/exhibits";
import { repo } from "@/content/repo-client";

export default function Hero({ e }: { e: Exhibit }) {
  return (
    <header className="x-hero p-hero" aria-labelledby="x-title">
      <div className="p-page">
        <div className="p-margin" aria-hidden="true" />
        <svg className="p-ring" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="78" fill="none" stroke="#8a5a32" strokeOpacity="0.22" strokeWidth="14" strokeDasharray="300 30 120 40" /></svg>
        <svg className="p-leaf" viewBox="0 0 120 200" aria-hidden="true"><path d="M60 196 C58 150 60 90 62 20" stroke="#5C7A48" strokeWidth="2" fill="none" /><path d="M62 20 C20 50 10 110 60 160 C110 110 100 50 62 20 Z" fill="#8FA67A" fillOpacity="0.55" stroke="#5C7A48" /></svg>
        <p className="x-hero-meta"><b>Exhibit {e.letter}</b><span>{e.style}</span><span>Tier {e.tier}</span><span>Draw anywhere on the page</span></p>
        <h1 id="x-title" className="p-title">The Detective&rsquo;s Notebook</h1>
        <InkWriter className="p-ink" lines={["Tuesday. Skill found at the scene.", `It carried ${repo.components} components and`, `${repo.signatures} signature moves, and no lorem ipsum.`, "Suspect insists on running a gate."]} />
        <p className="p-circled"><span>clue:</span> ask it for the plan <em>first</em></p>
        <FreehandPad className="p-pad" storageKey="mm-notebook" ink="#2B2118" label="Your notes on the notebook page" />
      </div>
    </header>
  );
}

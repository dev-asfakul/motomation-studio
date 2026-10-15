"use client";
import "./x.css";
import { SpriteScene } from "@/components/originals/sprite-scene";
import { PixelWake } from "@/vendor/motomation/components/cursor/pixel-wake";
import type { Exhibit } from "@/content/exhibits";
import { repo } from "@/content/repo-client";

export default function Hero({ e }: { e: Exhibit }) {
  const rooms = repo.folders.slice(0, 8).map((f) => ({ name: `${f.id}/`, item: `${f.count} file${f.count === 1 ? "" : "s"} of evidence` }));
  return (
    <header className="x-hero g-hero" aria-labelledby="x-title">
      <PixelWake cell={16} fadeMs={600} color="#577DE7" className="g-wake" />
      <p className="x-hero-meta"><b>Exhibit {e.letter}</b><span>{e.style}</span><span>Tier {e.tier}</span><span>10 fps</span></p>
      <h1 id="x-title" className="g-title"><span>The 8&#8209;Bit</span> <span>Crime Scene</span></h1>
      <p className="g-sub">Walk the detective through eight folders of the repo. Every glowing square is evidence. Focus the map, then use the arrow keys, WASD or the pad.</p>
      <SpriteScene rooms={rooms} palette={{ floor: "#211E15", wall: "#3a3628", ink: "#F3F0E8", accent: "#577DE7", wake: "#577DE7" }} />
    </header>
  );
}

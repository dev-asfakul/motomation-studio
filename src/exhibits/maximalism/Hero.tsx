"use client";
import "./x.css";
import { TagDragWall, type WallObject } from "@/components/originals/tag-drag-wall";
import { StickerScatter } from "@/vendor/motomation/components/micro/sticker-scatter";
import { VelocityMarquee } from "@/vendor/motomation/components/scroll/velocity-marquee";
import { Halftone } from "@/vendor/motomation/components/backgrounds/halftone";
import type { Exhibit } from "@/content/exhibits";
import { repo } from "@/content/repo-client";

// a halftone source drawn as SVG: the wordmark's M on a stripe field (no stock photography)
const SRC = "data:image/svg+xml," + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='400' height='260'><defs><radialGradient id='g' cx='.35' cy='.4' r='.8'><stop offset='0' stop-color='#fff'/><stop offset='1' stop-color='#000'/></radialGradient></defs><rect width='400' height='260' fill='url(#g)'/><text x='200' y='215' font-family='Arial Black,Arial' font-weight='900' font-size='250' text-anchor='middle' fill='#000'>M</text></svg>`);

export default function Hero({ e }: { e: Exhibit }) {
  const objs: WallObject[] = [
    { id: "more", tag: "Specimen 01 · the word MORE", meta: "Syne 800, 1 of 1", depth: 6, x: 2, y: 6, rot: -4, node: <span className="b-more">MORE</span> },
    { id: "dots", tag: "Specimen 02 · halftone M", meta: "canvas dots, 8px cell", depth: 3, x: 60, y: 4, rot: 3, w: "min(320px, 38%)", node: <Halftone src={SRC} alt="A halftone print of the letter M" cell={7} ink="#111111" paper="#FFE9A3" width={400} height={260} /> },
    { id: "stripe", tag: "Specimen 03 · warning stripe", meta: "CSS gradient, 45°", depth: 2, x: 30, y: 52, rot: 8, w: "min(260px, 34%)", node: <span className="b-stripe" /> },
    { id: "count", tag: "Specimen 04 · a count", meta: "read from repo.json", depth: 5, x: 66, y: 50, rot: -6, node: <span className="b-count"><b>{repo.components}</b> components, all of them on one wall</span> },
    { id: "dot", tag: "Specimen 05 · one red dot", meta: "the only accent", depth: 4, x: 8, y: 66, rot: 0, node: <span className="b-dot" /> },
    { id: "check", tag: "Specimen 06 · checkerboard", meta: "conic gradient", depth: 1, x: 44, y: 18, rot: -10, w: "min(200px, 26%)", node: <span className="b-check" /> },
    { id: "zig", tag: "Specimen 07 · zigzag type", meta: "Space Mono, set by hand", depth: 7, x: 40, y: 72, rot: 5, node: <span className="b-zig">MAXIMALISM IS A DISCIPLINE</span> },
  ];
  return (
    <header className="x-hero b-hero" aria-labelledby="x-title">
      <p className="x-hero-meta"><b>Exhibit {e.letter}</b><span>{e.style}</span><span>Tier {e.tier}</span><span>Drag anything</span></p>
      <h1 id="x-title" className="b-title">The Overstuffed <span>Evidence Room</span></h1>
      <TagDragWall objects={objs} className="b-wall">
        <div className="b-num-wrap">
          <StickerScatter stickers={["SEALED", "EXHIBIT B", "MORE IS MORE", "HANDLE WITH CARE", "DO NOT TIDY", "TAGGED", "7 DEPTHS", "LOUD"]} count={6} spread={220}>
            <button type="button" className="b-num" aria-label="Empty the sticker pocket">B<span>07</span></button>
          </StickerScatter>
          <p className="b-num-cap">Press the evidence number to empty the sticker pocket.</p>
        </div>
      </TagDragWall>
      <VelocityMarquee items={["seven depths", "every object tagged", "one red number", "drag the clutter", "nothing here is filler"]} separator=" ✶ " className="b-marquee" />
    </header>
  );
}

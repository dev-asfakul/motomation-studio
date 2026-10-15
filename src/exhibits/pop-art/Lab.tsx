"use client";
import { Halftone } from "@/vendor/motomation/components/backgrounds/halftone";
import { BentoReveal } from "@/vendor/motomation/components/layout/bento-reveal";
import { Typewriter } from "@/vendor/motomation/components/text/typewriter";
import { PHOTO } from "@/exhibits/editorial/Hero";
import type { Exhibit } from "@/content/exhibits";
export default function Lab({ e }: { e: Exhibit }) {
  void e;
  return (
    <div className="k-lab">
      <BentoReveal columns={3} tiles={[
        { col: 2, row: 2, content: <div className="k-tile k-ht"><Halftone src={PHOTO} alt="The evidence board, reprinted as a halftone" cell={7} ink="#141414" paper="#F7E7B4" width={640} height={448} /></div> },
        { content: <div className="k-tile k-blue"><p className="k-tile-big">CMYK</p><p>Halftone is the vendor component; Ben-Day is ours. Same dots, different job.</p></div> },
        { content: <div className="k-tile"><Typewriter as="p" text="Panels reveal on scroll, once. Then the page holds still." speed={28} /></div> },
        { col: 3, content: <div className="k-tile k-red"><p className="k-tile-big">Impact, then still.</p></div> },
      ]} />
    </div>
  );
}

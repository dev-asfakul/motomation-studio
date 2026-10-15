"use client";
import { Lens } from "@/vendor/motomation/components/cursor/lens";
import { SpotlightCard } from "@/vendor/motomation/components/ui/spotlight-card";
import { GlareCard } from "@/vendor/motomation/components/ui/glare-card";
import type { Exhibit } from "@/content/exhibits";
import { repo } from "@/content/repo-client";
export default function Lab({ e }: { e: Exhibit }) {
  void e;
  return (
    <div className="i-lab">
      <Lens className="i-lens" radius={110} toggleLabel="Show the raw layer"
        base={<div className="i-lens-in"><p className="i-big">Specimen</p><p>{repo.components} components, each with a header that says when it is slop.</p></div>}
        reveal={<div className="i-lens-in i-lens-raw"><p className="i-big">avoid-when</p><p>// Slop as decorative frosted cards over a gradient. Keep blur area small.</p></div>} />
      <SpotlightCard surface="#161F1E" light="rgba(17,142,131,0.28)" className="i-card"><p className="x-k">Spotlight card</p><p>Light pools under the pointer and fades at the edge. One per group, never on every card.</p></SpotlightCard>
      <GlareCard className="i-card i-glare"><p className="x-k">Glare card</p><p>A sheen tracks the pointer across a sealed slide. Blur stays capped at three surfaces per view.</p></GlareCard>
    </div>
  );
}

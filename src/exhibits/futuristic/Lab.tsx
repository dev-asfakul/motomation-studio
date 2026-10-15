"use client";
import { OrbitingCircles } from "@/vendor/motomation/components/ui/orbiting-circles";
import { Globe } from "@/vendor/motomation/components/backgrounds/globe";
import type { Exhibit } from "@/content/exhibits";
import { repo } from "@/content/repo-client";
export default function Lab({ e }: { e: Exhibit }) {
  void e;
  return (
    <div className="o-lab">
      <OrbitingCircles label="Tiers orbiting the skill" size={340} line="rgba(232,238,242,0.16)" center={<span className="o-core">v{repo.version}</span>}
        rings={[{ radius: 90, seconds: 30, items: repo.tierNames.slice(0, 3).map((t) => ({ label: t.name, node: <span className="o-sat">T{t.tier}</span> })) }, { radius: 150, seconds: 46, reverse: true, items: repo.tierNames.slice(3).map((t) => ({ label: t.name, node: <span className="o-sat">T{t.tier}</span> })) }]} />
      <div className="o-globe"><Globe dots={1400} dot="#9EAAB3" mark="#337FE3" ground="#0C1115" markers={[{ lat: 23.8, lon: 90.4 }]} speed={0.05} /><p className="o-note">Wrong room, on purpose: a globe with one marker, the author&rsquo;s city, and nothing else. The skill calls a spinning globe slop when it means nothing.</p></div>
    </div>
  );
}

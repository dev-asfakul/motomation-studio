"use client";
import { HorizontalReel } from "@/vendor/motomation/components/scroll/horizontal-reel";
import { LightSweep } from "@/vendor/motomation/components/backgrounds/light-sweep";
import type { Exhibit } from "@/content/exhibits";
import { repo } from "@/content/repo-client";
export default function Lab({ e }: { e: Exhibit }) {
  void e;
  return (
    <div className="l-lab">
      <div className="l-sweep"><LightSweep seconds={11} angle={105} strength={0.16} /><p className="l-sweep-t">Light leak, once every eleven seconds. Never on text that is being read.</p></div>
      <HorizontalReel frameWidth="min(72vw, 520px)" frames={repo.tierNames.map((t) => (
        <div key={t.tier} className="l-frame"><span className="l-frame-n">T{t.tier}</span><b>{t.name}</b><p>{t.when}</p></div>
      ))} />
    </div>
  );
}

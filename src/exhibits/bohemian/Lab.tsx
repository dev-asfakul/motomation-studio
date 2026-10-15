"use client";
import { CurveCarousel } from "@/vendor/motomation/components/layout/curve-carousel";
import { RotatingWords } from "@/vendor/motomation/components/text/rotating-words";
import { Sprig } from "./Hero";
import type { Exhibit } from "@/content/exhibits";
const SPEC = [["Terracotta", "#A8550F", "ground and pot"], ["Ochre", "#B98A2E", "warm accent, used large"], ["Plum", "#6B2E4F", "the deck's back"], ["Moss", "#5C7A48", "every stem"], ["Linen", "#F3E6CF", "pressed paper"]];
export default function Lab({ e }: { e: Exhibit }) {
  void e;
  return (
    <div className="q-lab">
      <RotatingWords as="h3" className="q-rot" before="The reading favours " words={["restraint", "one signature", "the lowest tier", "real copy"]} after="." />
      <CurveCarousel label="Pressed palette specimens" cardWidth={240} items={SPEC.map(([n, c, w], i) => (
        <div key={n} className="q-spec"><div className="q-spec-art"><Sprig c={c} s={i * 2 - 4} /></div><p className="q-spec-n">{n}</p><p className="q-spec-w">{c} · {w}</p></div>
      ))} />
    </div>
  );
}

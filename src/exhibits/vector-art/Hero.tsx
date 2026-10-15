"use client";
import "./x.css";
import { useState } from "react";
import { Identikit, type Feature } from "@/components/originals/identikit";
import { StrokeDraw } from "@/components/originals/stroke-draw";
import { graphemes, useReducedMotion } from "@/lib/motion";
import type { Exhibit } from "@/content/exhibits";

export const FEATURES: Feature[] = [
  { id: "frame", name: "Frame", fill: "#2337C6", options: [
    { name: "The mark", d: "M24 228 L24 24 L100 120 L176 24 L176 228 L140 228 L140 110 L100 160 L60 110 L60 228 Z" },
    { name: "Square jaw", d: "M30 40 L170 40 L180 200 L100 228 L20 200 Z" },
    { name: "Round", d: "M100 20 C160 20 180 80 180 130 C180 190 145 228 100 228 C55 228 20 190 20 130 C20 80 40 20 100 20 Z" } ] },
  { id: "brow", name: "Brow", fill: "#14161F", options: [
    { name: "Level", d: "M50 78 L90 74 L90 84 L50 86 Z M110 74 L150 78 L150 86 L110 84 Z" },
    { name: "Raised", d: "M50 62 L90 70 L90 78 L50 72 Z M110 70 L150 62 L150 72 L110 78 Z" },
    { name: "Stern", d: "M50 72 L92 84 L90 92 L50 80 Z M108 84 L150 72 L150 80 L110 92 Z" } ] },
  { id: "eyes", name: "Eyes", fill: "#F5F3EE", options: [
    { name: "Dots", d: "M62 100 L80 100 L80 118 L62 118 Z M120 100 L138 100 L138 118 L120 118 Z" },
    { name: "Wide", d: "M52 104 L88 96 L88 118 L52 118 Z M112 96 L148 104 L148 118 L112 118 Z" },
    { name: "Narrow", d: "M56 106 L86 106 L86 112 L56 112 Z M114 106 L144 106 L144 112 L114 112 Z" } ] },
  { id: "mouth", name: "Mouth", fill: "#F5F3EE", options: [
    { name: "Flat", d: "M70 170 L130 170 L130 178 L70 178 Z" },
    { name: "Smirk", d: "M70 174 L130 160 L132 168 L72 182 Z" },
    { name: "Open", d: "M82 160 L118 160 L118 188 L82 188 Z" } ] },
];
const GUIDES = ["M100 4 L100 236", "M4 110 L196 110", "M100 20 A90 90 0 1 1 99.9 20", "M24 228 L100 120 L176 228"];

export default function Hero({ e }: { e: Exhibit }) {
  const reduce = useReducedMotion();
  const [cap, setCap] = useState({ f: "Frame", o: "The mark", n: 0 });
  return (
    <header className="x-hero n-hero" aria-labelledby="x-title">
      <p className="x-hero-meta"><b>Exhibit {e.letter}</b><span>{e.style}</span><span>Tier {e.tier}</span><span>Two witnesses</span></p>
      <h1 id="x-title" className="n-title">The Composite<br />Sketch</h1>
      <div className="n-dip">
        <div className="n-wit">
          <p className="n-k">Witness A</p>
          <blockquote>&ldquo;Tall. Two strokes up, one down the middle. Blue, all of it.&rdquo;</blockquote>
          <p className="n-k">Witness B</p>
          <blockquote>&ldquo;Shorter than that. It had a plan written on it.&rdquo;</blockquote>
        </div>
        <div className="n-sketch">
          <StrokeDraw className="n-guides" viewBox="0 0 200 240" label="Construction guides" paths={GUIDES} stroke="#555B6B" width={1} ms={1100} />
          <Identikit features={FEATURES} onPick={(f, o) => setCap((c) => ({ f, o, n: c.n + 1 }))} />
          <p className="n-cap" aria-live="polite"><span className="n-cap-k">{cap.f}</span>{" "}
            <span key={cap.n} className="n-relay">{graphemes(cap.o).map((g, i) => <span key={i} style={{ animationDelay: reduce ? "0ms" : `${i * 28}ms` }}>{g === " " ? "\u00a0" : g}</span>)}</span></p>
        </div>
      </div>
    </header>
  );
}

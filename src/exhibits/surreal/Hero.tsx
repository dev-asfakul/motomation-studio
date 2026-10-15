"use client";
import "./x.css";
import { useRef } from "react";
import { MeltTypeShader } from "@/components/originals/melt-type-shader";
import { Aperture } from "@/vendor/motomation/components/scroll/aperture";
import { LiquidField } from "@/vendor/motomation/components/backgrounds/liquid-field";
import { useReducedMotion, useStickyProgress } from "@/lib/motion";
import { FAMILY } from "@/exhibits/fonts";
import type { Exhibit } from "@/content/exhibits";

export default function Hero({ e }: { e: Exhibit }) {
  const reduce = useReducedMotion();
  const film = useRef<HTMLDivElement>(null);
  const world = useRef<HTMLDivElement>(null);
  useStickyProgress(film, (p) => {
    const w = world.current; if (!w) return;
    w.style.setProperty("--spin", `${(p - 0.2) * 38}deg`);
    w.style.setProperty("--rise", `${p * -14}vh`);
  }, !reduce);
  return (
    <header className="x-hero c-hero" aria-labelledby="x-title">
      <div ref={film} className="c-film" data-reduce={reduce ? "" : undefined}>
        <div className="c-stage">
          <p className="x-hero-meta"><b>Exhibit {e.letter}</b><span>{e.style}</span><span>Tier {e.tier}</span><span>Witness statement, taken asleep</span></p>
          <div ref={world} className="c-world" aria-hidden="true">
            <svg className="c-stair" viewBox="0 0 400 520">
              {Array.from({ length: 9 }, (_, i) => (
                <g key={i} transform={`translate(${40 + i * 34} ${470 - i * 52})`}>
                  <path d="M0 0h96l-28 16H-28z" fill="#E1EAE8" stroke="#10201E" strokeWidth="1.5" />
                  <path d="M-28 16h96v22h-96z" fill="#10201E" />
                  <path d="M68 16l28-16v22l-28 16z" fill="#4C5F5C" />
                </g>
              ))}
            </svg>
            <svg className="c-key" viewBox="0 0 200 320"><path d="M100 10a70 70 0 0 1 34 131l26 169H40l26-169A70 70 0 0 1 100 10z" fill="#10201E" /><path d="M100 30a50 50 0 0 1 20 96l18 168H62l18-168a50 50 0 0 1 20-96z" fill="#0F7C72" opacity=".9" /></svg>
            <span className="c-cloud c1" /><span className="c-cloud c2" /><span className="c-cloud c3" />
          </div>
          <div className="c-copy">
            <h1 id="x-title" className="c-title">The Witness Was <em>Dreaming</em></h1>
            <MeltTypeShader className="c-melt" lines={["The stairs went up into nothing.", "The type was melting.", "The keyhole was bigger than the door."]} font={`44px ${FAMILY["Gloock"]}`} ink="#10201E" />
          </div>
        </div>
      </div>
      <Aperture shape="circle" from={4} className="c-iris">
        <div className="c-iris-in">
          <LiquidField colors={["#0F7C72", "#10201E", "#4C5F5C"]} speed={0.18} className="c-liquid" />
          <p className="c-iris-t">Through the keyhole: the specimen, awake.</p>
        </div>
      </Aperture>
    </header>
  );
}

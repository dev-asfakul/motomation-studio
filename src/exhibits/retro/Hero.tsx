"use client";
import "./x.css";
import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion, useStickyProgress, useMedia } from "@/lib/motion";
import { TapeDeck } from "@/components/originals/tape-deck";
import { LeaderCountdown } from "@/components/originals/leader-countdown";
import { Grain } from "@/vendor/motomation/components/backgrounds/grain";
import type { Exhibit } from "@/content/exhibits";
import { repo } from "@/content/repo-client";

// Storyboard and timing sheet: docs/storyboards/retro.md. One master timeline, 4 chapters × 1 unit each.
const CH = [
  { reel: "Reel 1", title: "The Brief", body: "Eight questions, asked in order, before a line of code.", items: repo.stepNames.map((s, i) => `${i}. ${s}`) },
  { reel: "Reel 2", title: "The Tiers", body: "Five motion tiers. The plan picks the lowest one that delivers.", items: repo.tierNames.map((t) => `T${t.tier} ${t.name}`) },
  { reel: "Reel 3", title: "The Signatures", body: `${repo.signatures} signature moves on file. One per page, bent to fit.`, items: repo.sigNames.slice(0, 8) },
  { reel: "Reel 4", title: "The Verdict", body: "Tape rewound. Story checks out.", items: [repo.install[0].cmd] },
];
export default function Hero({ e }: { e: Exhibit }) {
  const reduce = useReducedMotion(); const mobile = useMedia("(max-width: 767px)");
  const sec = useRef<HTMLElement>(null); const tl = useRef<gsap.core.Timeline | null>(null);
  const [lead, setLead] = useState([0, 0, 0, 0]); const [mode, setMode] = useState("stop");
  useGSAP(() => {
    if (reduce) return;
    const t = gsap.timeline({ paused: true, defaults: { ease: "none" } });
    CH.forEach((_, i) => {
      const at = i, q = (s: string) => `.l-ch-${i} ${s}`;
      t.set(`.l-ch-${i}`, { autoAlpha: 1 }, at)
        .fromTo(q(".l-leader"), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.04 }, at + 0.26)
        .fromTo(q(".l-burn"), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 0.9, scale: 2.2, duration: 0.08 }, at + 0.24).to(q(".l-burn"), { autoAlpha: 0, duration: 0.06 }, at + 0.32)
        .fromTo(q(".l-card"), { xPercent: -12, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 0.12, ease: "power2.out" }, at + 0.28)
        .fromTo(q(".l-strip"), { xPercent: 30 }, { xPercent: mobile ? -70 : -40, duration: 0.6 }, at + 0.36).fromTo(q(".l-strip"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05 }, at + 0.36)
        .to(`.l-ch-${i}`, { autoAlpha: i === CH.length - 1 ? 1 : 0, duration: 0.03 }, at + 0.97);
    });
    t.fromTo(".l-film", { backgroundPositionY: "0px" }, { backgroundPositionY: "-4000px", duration: CH.length }, 0);
    tl.current = t;
  }, { scope: sec, dependencies: [reduce, mobile] });
  useStickyProgress(sec, (p) => {
    tl.current?.progress(p);
    const per = CH.map((_, i) => Math.max(0, Math.min(1, (p * CH.length - i) / 0.26)));
    setLead((old) => (old.every((v, i) => Math.abs(v - per[i]) < 0.01) ? old : per));
  }, !reduce);
  return (
    <section ref={sec} className="x-hero l-hero" data-rm={reduce ? "" : undefined} data-mode={mode} aria-labelledby="x-title" style={{ height: reduce ? "auto" : `${mobile ? 560 : 720}vh` }}>
      <div className="l-stick">
        <Grain opacity={0.1} animate={!reduce} fps={12} className="l-grain" />
        <div className="l-leak" aria-hidden="true" />
        <div className="l-top">
          <p className="x-hero-meta"><b>Exhibit {e.letter}</b><span>{e.style}</span><span>Tier {e.tier}</span><span>Scroll, or use the deck</span></p>
          <h1 id="x-title" className="l-title">The Case Tape Archive</h1>
        </div>
        <div className="l-gate">
          <div className="l-film" aria-hidden="true" />
          <div className="l-track" aria-hidden="true" />
          {CH.map((c, i) => (
            <article key={c.reel} className={`l-ch l-ch-${i}`} aria-label={`${c.reel}: ${c.title}`}>
              <LeaderCountdown className="l-leader" progress={lead[i]} still={reduce ? 5 - i : undefined} />
              <span className="l-burn" aria-hidden="true" />
              <div className="l-card"><p className="l-reel">{c.reel}</p><h2>{c.title}</h2><p>{c.body}</p></div>
              <ol className="l-strip">{c.items.map((it) => <li key={it}>{it}</li>)}</ol>
            </article>
          ))}
        </div>
        <TapeDeck className="l-deck" section={sec} seconds={4 * 60 + 12} marks={[0, 0.25, 0.5, 0.75, 0.999]} onMode={setMode} />
      </div>
    </section>
  );
}

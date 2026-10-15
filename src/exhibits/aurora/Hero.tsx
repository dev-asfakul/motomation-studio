"use client";
import "./x.css";
import { useRef, useState } from "react";
import { AuroraShader } from "@/components/originals/aurora-shader";
import { HourLedger } from "@/components/originals/hour-ledger";
import { SeismographLine } from "@/vendor/motomation/components/cursor/seismograph-line";
import { useReducedMotion, useStickyProgress, useMedia } from "@/lib/motion";
import type { Exhibit } from "@/content/exhibits";
import { repo } from "@/content/repo-client";

const S = repo.stepNames;
const ROWS = [
  { at: 0, text: `Brief received. ${S[0]} decided before anything else.` },
  { at: 1, text: `${S[1]} named; ${S[2].toLowerCase()} written in one sentence.` },
  { at: 2, text: `${S[3]}, then a ${S[4].toLowerCase()} with something outside design.` },
  { at: 3, text: `${S[5]} chosen. One, bent to fit. The alibi starts here.` },
  { at: 4, text: `${S[6]} against recent runs, then the ${S[7]}.` },
  { at: 5, text: "Built, then measured: the gate runs on real screenshots." },
];
export default function Hero({ e }: { e: Exhibit }) {
  const reduce = useReducedMotion(); const mobile = useMedia("(max-width: 767px)");
  const sec = useRef<HTMLElement>(null); const [hour, setHour] = useState(reduce ? 3 : 0);
  useStickyProgress(sec, (p) => setHour((h) => (Math.abs(h - p * 6) > 0.004 ? p * 6 : h)), !reduce);
  const seek = (h: number) => {
    if (reduce) { setHour(h); return; } const el = sec.current!; const top = el.getBoundingClientRect().top + scrollY; const run = el.offsetHeight - innerHeight; const y = top + (h / 6) * run;
    const l = window.__lenis; if (l) l.scrollTo(y, { duration: 1.2 }); else window.scrollTo({ top: y, behavior: "smooth" });
  };
  return (
    <section ref={sec} className="x-hero s-hero" aria-labelledby="x-title" data-rm={reduce ? "" : undefined} style={{ height: reduce ? "auto" : `${mobile ? 360 : 420}vh` }}>
      <div className="s-stick">
        <AuroraShader hour={hour} />
        <div className="s-horizon" aria-hidden="true"><SeismographLine height={90} reach={60} color="rgba(237,240,235,0.4)" /></div>
        <div className="s-top">
          <p className="x-hero-meta"><b>Exhibit {e.letter}</b><span>{e.style}</span><span>Tier {e.tier}</span><span>{reduce ? "Choose an hour" : "Scroll moves the clock"}</span></p>
          <h1 id="x-title" className="s-title">The 3&nbsp;AM <br />Alibi</h1>
          <p className="s-sub">Where was the skill between midnight and six? Every hour is on the ledger, and every entry is a step it really takes.</p>
        </div>
        <HourLedger className="s-ledger" hour={hour} rows={ROWS} onSeek={seek} />
      </div>
    </section>
  );
}

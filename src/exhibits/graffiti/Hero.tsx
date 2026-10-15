"use client";
import "./x.css";
import { useMemo, useRef, useState, useEffect } from "react";
import { SprayWall, type SprayHandle } from "@/components/originals/spray-wall";
import { StencilMask, STENCILS, stencilTest } from "@/components/originals/stencil-mask";
import { useMedia } from "@/lib/motion";
import type { Exhibit } from "@/content/exhibits";
import { repo } from "@/content/repo-client";

const PAINTS = [{ n: "Vermilion", c: "#E04A22" }, { n: "Chalk", c: "#F2EFE8" }, { n: "Signal yellow", c: "#F2C230" }, { n: "Teal", c: "#1FA39A" }];
export default function Hero({ e }: { e: Exhibit }) {
  const mobile = useMedia("(max-width: 767px)");
  const [paint, setPaint] = useState(PAINTS[0].c); const [st, setSt] = useState<string | null>(null);
  const wall = useRef<HTMLDivElement>(null); const sw = useRef<SprayHandle>(null); const [box, setBox] = useState({ w: 0, h: 0 });
  useEffect(() => { const el = wall.current; if (!el) return; const ro = new ResizeObserver(([x]) => setBox({ w: x.contentRect.width, h: x.contentRect.height })); ro.observe(el); return () => ro.disconnect(); }, []);
  const SW = mobile ? 220 : 320; const sten = STENCILS.find((s) => s.id === st) ?? null;
  const cx = box.w * (mobile ? 0.5 : 0.36), cy = box.h * 0.5;
  const mask = useMemo(() => (sten ? stencilTest(sten, cx, cy, SW) : null), [sten, cx, cy, SW]);
  return (
    <header className="x-hero r-hero" aria-labelledby="x-title">
      <p className="x-hero-meta"><b>Exhibit {e.letter}</b><span>{e.style}</span><span>Tier {e.tier}</span><span>Hold to spray, hold longer to drip</span></p>
      <div ref={wall} className="r-wall">
        <div className="r-poster">
          <span className="r-orn" aria-hidden="true" />
          <h1 id="x-title" className="r-title">The Wall</h1>
          <p className="r-claim">Case {repo.version}: one skill, {repo.components} components, zero stock photos.</p>
          <p className="r-small">Posted by the Bureau. Paint over it, it is your wall.</p>
          <span className="r-orn r-orn-b" aria-hidden="true" />
        </div>
        <SprayWall className="r-canvas" color={paint} storageKey="mm-wall" mask={mask} handle={sw} label="A brick wall you can spray-paint; your wall is saved on this device" />
        {sten && <StencilMask stencil={sten} width={SW} className="r-stencil" style={{ left: cx - SW / 2, top: cy - (sten.h * SW) / sten.w / 2 }} />}
      </div>
      <div className="r-tools">
        <div role="radiogroup" aria-label="Paint" className="r-paints">{PAINTS.map((p) => <button key={p.c} type="button" role="radio" aria-checked={paint === p.c} aria-label={p.n} style={{ background: p.c }} onClick={() => setPaint(p.c)} />)}</div>
        <div role="radiogroup" aria-label="Stencil" className="r-stens">
          <button type="button" role="radio" aria-checked={!st} onClick={() => setSt(null)}>Freehand</button>
          {STENCILS.map((s) => <button key={s.id} type="button" role="radio" aria-checked={st === s.id} onClick={() => setSt(s.id)}>{s.name}</button>)}
        </div>
        <button type="button" className="r-clear" onClick={() => sw.current?.clear()}>Buff the wall</button>
      </div>
    </header>
  );
}

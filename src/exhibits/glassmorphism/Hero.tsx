"use client";
import "./x.css";
import { HeatField } from "@/components/originals/heat-field";
import { SpecimenSlides } from "@/components/originals/specimen-slide";
import { useMedia } from "@/lib/motion";
import type { Exhibit } from "@/content/exhibits";

const SPEC = [
  { id: "lens", name: "Lens", fam: "cursor", tier: 2, what: "a circle that shows a second layer", x: 6, y: 18 },
  { id: "glare-card", name: "Glare", fam: "ui", tier: 2, what: "a sheen that follows the pointer", x: 52, y: 40 },
  { id: "spotlight-card", name: "Spotlight", fam: "ui", tier: 2, what: "a soft light under the pointer", x: 14, y: 66 },
];
export default function Hero({ e }: { e: Exhibit }) {
  const mobile = useMedia("(max-width: 767px)");
  const layer = (raw: boolean) => (
    <div className={raw ? "i-layer i-raw" : "i-layer"}>
      {SPEC.map((s) => (
        <div key={s.id} className="i-spec" style={{ left: `${s.x}%`, top: `${s.y}%` }}>
          {raw ? <pre>{`{\n  "id": "${s.id}",\n  "family": "${s.fam}",\n  "tier": ${s.tier},\n  "what": "${s.what}"\n}`}</pre> : <><b>{s.name}</b><span>{s.what}</span></>}
        </div>
      ))}
    </div>
  );
  return (
    <header className="x-hero i-hero" aria-labelledby="x-title">
      <div className="i-heat" aria-hidden="true"><HeatField ramp={["#0E1312", "#11403b", "#118E83", "#7fd6c2", "#EAF0EF"]} /></div>
      <p className="x-hero-meta"><b>Exhibit {e.letter}</b><span>{e.style}</span><span>Tier {e.tier}</span><span>Under the microscope</span></p>
      <h1 id="x-title" className="i-title">Microscope Slides</h1>
      <p className="i-sub">Drag a slide over a label. Through the glass you read the raw specimen, straight from the skill&rsquo;s component headers.</p>
      <SpecimenSlides className="i-bench" label={layer(false)} raw={layer(true)} slides={mobile
        ? [{ id: "s1", name: "Slide 1", x: 120, y: 60 }, { id: "s2", name: "Slide 2", x: 20, y: 470 }]
        : [{ id: "s1", name: "Slide 1", x: 220, y: 70 }, { id: "s2", name: "Slide 2", x: 1000, y: 110 }, { id: "s3", name: "Slide 3", x: 960, y: 330 }]} />
    </header>
  );
}

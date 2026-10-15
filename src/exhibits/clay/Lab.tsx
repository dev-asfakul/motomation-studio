"use client";
import { useState } from "react";
import { HoldToCommit } from "@/vendor/motomation/components/micro/hold-to-commit";
import { SquishSwitch } from "@/vendor/motomation/components/micro/squish-switch";
import { Thumbprint } from "@/components/originals/thumbprint";
import type { Exhibit } from "@/content/exhibits";
export default function Lab({ e }: { e: Exhibit }) {
  void e;
  const [prints, setPrints] = useState<number[]>([]);
  const [wet, setWet] = useState(false);
  return (
    <div className="h-lab">
      <div className="h-slab" data-wet={wet ? "" : undefined}>
        <svg className="cs-skin" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><rect width="100" height="100" fill="#B8875E" filter="url(#clay-tex)" /></svg>
        {prints.map((s, i) => <Thumbprint key={s} seed={s} size={64} className="h-slab-print" style={{ left: `${12 + ((i * 23) % 70)}%`, top: `${18 + ((i * 37) % 50)}%` }} />)}
        <p className="h-slab-n">{prints.length ? `${prints.length} print${prints.length > 1 ? "s" : ""} on file` : "Clean slab"}</p>
      </div>
      <div className="h-ctrl">
        <p>Hold the button. The print only commits if you hold for the full count; let go early and nothing is filed.</p>
        <HoldToCommit label="Hold to press a print" doneLabel="Print filed" confirmLabel="Hold again for another" holdMs={1100} onCommit={() => setPrints((p) => [...p, p.length + 7])} />
        <SquishSwitch label="Wet clay" onChange={setWet} />
      </div>
    </div>
  );
}

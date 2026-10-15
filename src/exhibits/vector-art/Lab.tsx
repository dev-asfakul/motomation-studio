"use client";
import { useState } from "react";
import { StrokeDraw } from "@/components/originals/stroke-draw";
import { ScrollFloat } from "@/vendor/motomation/components/type/scroll-float";
import type { Exhibit } from "@/content/exhibits";
const MARK = ["M20 180 L20 20", "M20 20 L100 120", "M100 120 L180 20", "M180 20 L180 180", "M60 180 L60 90 L100 140 L140 90 L140 180"];
export default function Lab({ e }: { e: Exhibit }) {
  void e;
  const [k, setK] = useState(0);
  return (
    <div className="n-lab">
      <div className="n-mark">
        <StrokeDraw viewBox="0 0 200 200" label="The M mark, drawn stroke by stroke" paths={MARK} stroke="#2337C6" width={3} ms={700} replayKey={k} />
        <button type="button" className="n-btn" onClick={() => setK((v) => v + 1)}>Redraw the mark</button>
      </div>
      <ScrollFloat text="Flat shapes. One stroke weight. Nothing breathing." as="h3" className="n-float" />
    </div>
  );
}

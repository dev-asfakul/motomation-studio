"use client";
import { useState } from "react";
import { Terminal } from "@/vendor/motomation/components/ui/terminal";
import { Decode } from "@/vendor/motomation/components/type/decode";
import { sfx } from "@/lib/sound";
import type { Exhibit } from "@/content/exhibits";
import { repo } from "@/content/repo-client";
export default function Lab({ e }: { e: Exhibit }) {
  void e;
  const [n, setN] = useState(0); const [jit, setJit] = useState(60);
  const words = repo.sigNames;
  return (
    <div className="j-lab">
      <div className="j-dec">
        <p className="x-k">Decode a signature name</p>
        <p className="j-dec-word"><Decode key={n + "-" + jit} text={words[n % words.length].toUpperCase()} duration={jit * 15} as="span" /></p>
        <label className="j-range"><span>Jitter clock <b>{jit} ms</b></span><input type="range" min={20} max={120} step={10} value={jit} onChange={(ev) => setJit(+ev.target.value)} /></label>
        <button type="button" className="j-btn" onClick={() => { setN((v) => v + 1); sfx("blip", 0.04); }}>Next suspect</button>
      </div>
      <Terminal title="replay.log" prompt="$" lines={[{ cmd: "npx skills add asfakulsiam/asfakulsiam-motomation-design", out: "skill installed" }, { cmd: "node scripts/gate.mjs out/", out: "contrast · overflow · words · motion · names · numbers" }]} />
    </div>
  );
}

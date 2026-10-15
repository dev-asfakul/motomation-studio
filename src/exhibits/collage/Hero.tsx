"use client";
import "./x.css";
import { RansomLetters } from "@/components/originals/ransom-letters";
import { AnimatedList } from "@/vendor/motomation/components/ui/animated-list";
import { BrandSelection } from "@/vendor/motomation/components/micro/brand-selection";
import { FAMILY } from "@/exhibits/fonts";
import type { Exhibit } from "@/content/exhibits";
import { repo } from "@/content/repo-client";

const FACES = ["Young Serif", "Syne", "Gloock", "Unbounded", "Libre Caslon Display", "Tilt Warp", "Big Shoulders Display", "Rubik Mono One", "Bodoni Moda", "Epilogue"].map((f) => FAMILY[f]).filter(Boolean);
const PAPERS = [{ bg: "#F4F1E8", ink: "#161616" }, { bg: "#161616", ink: "#F4F1E8" }, { bg: "#C2410C", ink: "#FFFFFF" }, { bg: "#E9DFC4", ink: "#161616" }, { bg: "#DCDCD8", ink: "#161616" }, { bg: "#FFFFFF", ink: "#C2410C" }];
export default function Hero({ e }: { e: Exhibit }) {
  return (
    <header className="x-hero m-hero" aria-labelledby="x-title">
      <p className="x-hero-meta"><b>Exhibit {e.letter}</b><span>{e.style}</span><span>Tier {e.tier}</span><span>Drag the letters</span></p>
      <div className="m-grid">
        <div className="m-note">
          <span className="m-tape m-tape-1" aria-hidden="true" /><span className="m-tape m-tape-2" aria-hidden="true" />
          <p className="m-to">To whoever ships the next page:</p>
          <RansomLetters text="RUN THE GATE" faces={FACES} papers={PAPERS} seed={7} className="m-ransom" />
          <h1 id="x-title" className="m-sign">The Ransom Note</h1>
          <BrandSelection background="#C2410C" color="#ffffff"><p className="m-body">We have your layout. You will get it back when every check passes on real screenshots, at every width, in both motion modes. Select this text: it cuts into a strip.</p></BrandSelection>
        </div>
        <aside className="m-receipt" aria-label="The demands, printed">
          <p className="m-r-head">DEMANDS · v{repo.version}<br />{repo.gateNames.length} checks · no exceptions</p>
          <AnimatedList as="ol" interval={420} gap={0} className="m-r-list">
            {repo.gateNames.map((g, i) => <li key={g}><span>{String(i + 1).padStart(2, "0")}</span>{g}<b>REQUIRED</b></li>)}
          </AnimatedList>
          <p className="m-r-foot">node scripts/gate.mjs out/<br />keep this receipt</p>
        </aside>
      </div>
    </header>
  );
}

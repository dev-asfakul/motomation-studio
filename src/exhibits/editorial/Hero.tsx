"use client";
import "./x.css";
import { Redacted } from "@/components/originals/redaction-reveal";
import { DarkroomDevelop } from "@/vendor/motomation/components/scroll/darkroom-develop";
import { Typewriter } from "@/vendor/motomation/components/text/typewriter";
import type { Exhibit } from "@/content/exhibits";
import { repo } from "@/content/repo-client";

export const PHOTO = "data:image/svg+xml," + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='800' height='560' viewBox='0 0 800 560'><rect width='800' height='560' fill='#2a2724'/><g fill='#eae6de'><rect x='60' y='70' width='150' height='110'/><rect x='300' y='40' width='190' height='140'/><rect x='580' y='90' width='150' height='120'/><rect x='120' y='300' width='170' height='130'/><rect x='420' y='290' width='210' height='160'/></g><g stroke='#c8401c' stroke-width='4' fill='none'><path d='M135 125L395 110L655 150M395 110L205 365L525 370L655 150'/></g><g fill='#151412'><circle cx='135' cy='125' r='9'/><circle cx='395' cy='110' r='9'/><circle cx='655' cy='150' r='9'/><circle cx='205' cy='365' r='9'/><circle cx='525' cy='370' r='9'/></g></svg>`);

export default function Hero({ e }: { e: Exhibit }) {
  return (
    <header className="x-hero f-hero" aria-labelledby="x-title">
      <div className="f-mast">
        <span>Vol. {repo.version}</span><span className="f-name">The Motomation Gazette</span><span>Exhibit {e.letter} · {e.style}</span>
      </div>
      <p className="f-dateline">Late edition · {repo.files.toLocaleString("en-US")} files on record · price: one careful read</p>
      <h1 id="x-title" className="f-head">Skill Found Guilty of <Redacted>Taste</Redacted></h1>
      <p className="f-deck">A design skill stood accused of making pages that look designed for their brief. The evidence: {repo.components} components, {repo.signatures} signatures and a delivery gate that measures instead of guessing. Hover the bars to un-redact.</p>
      <div className="f-cols">
        <div className="f-lead">
          <p className="f-by"><Typewriter as="span" text="By the case desk. Filed at the Bureau." speed={30} /></p>
          <p><span className="f-drop">T</span>he prosecution opened with a single exhibit: a page with no gradient, no three-card grid and one accent used once. The defence called it <Redacted>restraint</Redacted>. The jury called it <Redacted>a decision</Redacted>.</p>
          <p>Witnesses described a sequence of seven questions asked before any code was written, beginning with a stack and ending in a plan. Asked whether the plan was followed, the skill produced <Redacted>a screenshot test</Redacted>.</p>
        </div>
        <figure className="f-photo"><DarkroomDevelop src={PHOTO} alt="The evidence board: five pinned prints joined by red string" width={800} height={560} /><figcaption>The board as found. Five prints, one string, no stock photography.</figcaption></figure>
        <aside className="f-side">
          <p className="f-pull">&ldquo;It cuts what the concept didn&rsquo;t ask for.&rdquo;</p>
          <p className="f-small">Restraint Gate, rules.csv. Two questions decide every element: does it come from the concept, does it tell the visitor something.</p>
        </aside>
      </div>
    </header>
  );
}

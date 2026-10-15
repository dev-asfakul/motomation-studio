"use client";
import "./x.css";
import { TarotDeck, type Card } from "@/components/originals/tarot-deck";
import { WindBotanical } from "@/components/originals/wind-botanical";
import type { Exhibit } from "@/content/exhibits";
import { repo } from "@/content/repo-client";

export const Sprig = ({ c = "#5C7A48", s = 0 }: { c?: string; s?: number }) => (
  <svg viewBox="0 0 60 90" width="60" height="90"><path d={`M30 88 C${28 + s} 60 ${32 - s} 30 30 4`} stroke={c} strokeWidth="1.4" fill="none" />
    {[18, 32, 46, 60].map((y, i) => <path key={y} d={`M30 ${y} q${i % 2 ? 12 : -12} -8 ${i % 2 ? 18 : -18} -2 q${i % 2 ? -8 : 8} 6 ${i % 2 ? -18 : 18} 2Z`} fill={c} fillOpacity="0.7" />)}</svg>
);
const CARDS: Card[] = [
  { title: "The Library", fact: `${repo.components} components, each with a header that says when it is slop.`, art: <Sprig /> },
  { title: "The Hand", fact: `${repo.signatures} signature moves. One per page, bent to fit the concept.`, art: <Sprig c="#A8550F" s={4} /> },
  { title: "The Ladder", fact: `${repo.tiers} motion tiers. The reading always says: the lowest one that delivers.`, art: <Sprig c="#6B2E4F" s={-3} /> },
  { title: "The Rooms", fact: `${repo.archetypes} layout archetypes, from room to poster.`, art: <Sprig c="#5C7A48" s={6} /> },
  { title: "The Voice", fact: `${repo.commands} commands, from /shape to /overdrive.`, art: <Sprig c="#A8550F" s={-5} /> },
  { title: "The Roads", fact: `${repo.installs} install paths, one for each kind of agent.`, art: <Sprig c="#6B2E4F" s={2} /> },
  { title: "The Sequence", fact: `${repo.steps} steps of thinking before a line of code.`, art: <Sprig c="#5C7A48" s={-2} /> },
  { title: "The Archive", fact: `${repo.files.toLocaleString("en-US")} files in the repository at v${repo.version}.`, art: <Sprig c="#A8550F" s={3} /> },
];
const Back = () => (<div className="q-back"><svg viewBox="0 0 100 160" aria-hidden="true"><rect x="6" y="6" width="88" height="148" rx="6" fill="none" stroke="#F3E6CF" strokeWidth="1" /><circle cx="50" cy="80" r="26" fill="none" stroke="#F3E6CF" /><path d="M50 50 L58 80 L50 110 L42 80Z" fill="#F3E6CF" fillOpacity="0.6" />{[0, 60, 120, 180, 240, 300].map((a) => <circle key={a} cx={50 + Math.cos((a * Math.PI) / 180) * 36} cy={80 + Math.sin((a * Math.PI) / 180) * 36} r="2" fill="#F3E6CF" />)}</svg></div>);

export default function Hero({ e }: { e: Exhibit }) {
  return (
    <header className="x-hero q-hero" aria-labelledby="x-title">
      <div className="q-plants" aria-hidden="true"><WindBotanical stems={9} colors={["#5C7A48", "#7a8f4e", "#A8550F", "#6B2E4F"]} /></div>
      <p className="x-hero-meta"><b>Exhibit {e.letter}</b><span>{e.style}</span><span>Tier {e.tier}</span><span>Draw a card</span></p>
      <div className="q-grid">
        <div className="q-copy">
          <h1 id="x-title" className="q-title">The Greenhouse <em>Reading</em></h1>
          <p className="q-sub">Eight cards, pressed like herbarium sheets. Each face holds one fact from the repo, and none of them is a prediction.</p>
        </div>
        <TarotDeck cards={CARDS} back={<Back />} className="q-deck" />
      </div>
    </header>
  );
}

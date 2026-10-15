"use client";
// @motomation-component
// id: tarot-deck
// name: Tarot Deck
// family: ui
// tier: 2
// deps: react
// what: A fanned deck of cards. The deck leans gently toward the pointer (Considerate Magnet) and steps back when it leaves; drawing a card lifts it out of the fan and flips it in 3D to a face with one real fact. Draws are random without repeats until the deck is spent.
// use-when: Playful, editorial or bohemian pages where facts are better discovered one at a time than listed.
// avoid-when: Slop for content the visitor needs all at once, or as fortune-telling with made-up claims; every face must be true.
// reduced-motion: Cards turn without the lift and flip; the lean is off.
// touch: Tap "Draw a card"; no lean on touch.
// a11y: A button draws; the drawn face is a live region; every fact is also listed in a details element.
// status: candidate to contribute back to the skill (examples/components/ui)
import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion, useFinePointer } from "@/lib/motion";
import { sfx } from "@/lib/sound";
export type Card = { title: string; fact: string; art: ReactNode };
type Props = { cards: Card[]; back: ReactNode; className?: string; style?: CSSProperties };
export function TarotDeck({ cards, back, className, style }: Props) {
  const reduce = useReducedMotion(); const fine = useFinePointer(); const root = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState<number[]>([]); const [lean, setLean] = useState({ x: 0, y: 0 });
  const draw = () => { const left = cards.map((_, i) => i).filter((i) => !drawn.includes(i)); if (!left.length) { setDrawn([]); return; } const i = left[Math.floor(Math.random() * left.length)]; setDrawn((d) => [...d, i]); sfx("chime", 0.05); };
  const cur = drawn[drawn.length - 1];
  const mv = (e: React.PointerEvent) => { if (!fine || reduce) return; const r = root.current!.getBoundingClientRect(); setLean({ x: ((e.clientX - r.left) / r.width - 0.5) * 2, y: ((e.clientY - r.top) / r.height - 0.5) * 2 }); };
  const n = Math.min(7, cards.length - drawn.length);
  return (
    <div ref={root} className={`td2 ${className ?? ""}`} style={style} onPointerMove={mv} onPointerLeave={() => setLean({ x: 0, y: 0 })}>
      <div className="td2-fan" style={{ transform: `translate(${lean.x * 14}px, ${lean.y * 8}px) rotate(${lean.x * 3}deg)` }}>
        {Array.from({ length: n }, (_, k) => <div key={k} className="td2-back" style={{ rotate: `${(k - (n - 1) / 2) * 6}deg`, translate: `${(k - (n - 1) / 2) * 18}px ${Math.abs(k - (n - 1) / 2) * 6}px` }} aria-hidden="true">{back}</div>)}
      </div>
      {cur !== undefined && (
        <div key={cur} className="td2-card" data-rm={reduce ? "" : undefined} aria-live="polite">
          <div className="td2-in"><div className="td2-face td2-b" aria-hidden="true">{back}</div>
            <div className="td2-face td2-f"><div className="td2-art" aria-hidden="true">{cards[cur].art}</div><p className="td2-t">{cards[cur].title}</p><p className="td2-x">{cards[cur].fact}</p></div></div>
        </div>
      )}
      <div className="td2-ctrl"><button type="button" onClick={draw}>{drawn.length === cards.length ? "Shuffle the deck" : "Draw a card"}</button><span>{drawn.length} of {cards.length} drawn</span></div>
      <details className="td2-all"><summary>Every card, face up</summary><ol>{cards.map((c) => <li key={c.title}><b>{c.title}.</b> {c.fact}</li>)}</ol></details>
    </div>
  );
}

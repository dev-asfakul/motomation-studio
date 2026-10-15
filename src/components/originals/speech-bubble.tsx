"use client";
// @motomation-component
// id: speech-bubble
// name: Speech Bubble
// family: text
// tier: 1
// deps: react
// what: A comic speech or thought bubble, pure CSS with an SVG tail, whose line types itself once the bubble enters the viewport, with a hard stop and a tiny impact shake.
// use-when: Comic, pop or conversational layouts where a character (or the product) says one short real line.
// avoid-when: Slop as decoration with no speaker, or for paragraphs; one or two sentences only.
// reduced-motion: The full line is shown at once; no shake.
// touch: Nothing to touch; tap replays the line.
// a11y: The full line is in the DOM from the start (visually typed via a clip), so screen readers read it once and whole.
// status: candidate to contribute back to the skill (examples/components/text)
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion, useInView } from "@/lib/motion";
type Props = { text: string; speaker?: string; tail?: "left" | "right" | "down"; kind?: "say" | "think"; speed?: number; className?: string; style?: CSSProperties };
export function SpeechBubble({ text, speaker, tail = "left", kind = "say", speed = 34, className, style }: Props) {
  const reduce = useReducedMotion(); const ref = useRef<HTMLDivElement>(null); const seen = useInView(ref, { once: true });
  const [n, setN] = useState(0); const [run, setRun] = useState(0);
  useEffect(() => {
    if (!seen) return; if (reduce) { setN(text.length); return; } setN(0); let i = 0;
    const id = setInterval(() => { i++; setN(i); if (i >= text.length) { clearInterval(id); ref.current?.animate([{ translate: "0 0" }, { translate: "2px -1px" }, { translate: "-2px 1px" }, { translate: "0 0" }], { duration: 180 }); } }, speed);
    return () => clearInterval(id);
  }, [seen, reduce, text, speed, run]);
  return (
    <div ref={ref} className={`sb sb-${kind} ${className ?? ""}`} data-tail={tail} style={style} onClick={() => setRun((r) => r + 1)}>
      {speaker && <span className="sb-who">{speaker}</span>}
      <p className="sb-t"><span className="sr-only">{text}</span><span aria-hidden="true">{text.slice(0, n)}<span className="sb-rest">{text.slice(n)}</span></span></p>
      <svg className="sb-tail" viewBox="0 0 40 30" aria-hidden="true"><path d={kind === "say" ? "M2 0 L18 28 L30 0 Z" : "M8 4a6 6 0 1 0 0.1 0M24 18a4 4 0 1 0 0.1 0"} /></svg>
    </div>
  );
}

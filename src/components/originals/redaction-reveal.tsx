"use client";
// @motomation-component
// id: redaction-reveal
// name: Redaction Reveal
// family: text
// tier: 1
// deps: react
// what: Inline text under a black redaction bar. Hover, focus or tap lifts the bar for as long as you look; leaving puts it back. Reading is the interaction.
// use-when: Editorial or investigative pages where a few key phrases should be earned by a closer look.
// avoid-when: Slop on anything the visitor needs to act on (prices, legal text, instructions) or on more than a few phrases per screen.
// reduced-motion: The bar lifts instantly; no slide.
// touch: Tap toggles the bar (no hover on touch).
// a11y: The words are real text inside a button with aria-pressed; screen readers always get the words; the bar is presentation only.
// status: candidate to contribute back to the skill (examples/components/text)
import { useState, type CSSProperties } from "react";
import { sfx } from "@/lib/sound";
type Props = { children: string; className?: string; style?: CSSProperties };
export function Redacted({ children, className, style }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <button type="button" className={`rr ${className ?? ""}`} style={style} aria-pressed={open} data-open={open ? "" : undefined}
      onPointerEnter={(e) => { if (e.pointerType === "mouse") setOpen(true); }} onPointerLeave={(e) => { if (e.pointerType === "mouse") setOpen(false); }}
      onFocus={() => setOpen(true)} onBlur={() => setOpen(false)} onClick={() => { setOpen((v) => !v); sfx("snip", 0.03); }}>
      <span className="rr-t">{children}</span><span className="rr-bar" aria-hidden="true" />
    </button>
  );
}

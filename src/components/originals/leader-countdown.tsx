"use client";
// @motomation-component
// id: leader-countdown
// name: Leader Countdown
// family: scroll
// tier: 2
// deps: react
// what: An Academy film leader (number in a ring, crosshair, a sweeping wedge) driven by a 0–1 progress value you pass in, so scroll or a timeline counts it down from 5 to 2, then it cuts to black.
// use-when: Opening each chapter of a film, tape or reel story; once per chapter, scrubbed.
// avoid-when: Slop as a page loader or a decorative timer that is not tied to the story's timeline.
// reduced-motion: Shows a still leader frame with the chapter number; no sweep.
// touch: Nothing to touch.
// a11y: Decorative (aria-hidden); the chapter title that follows is the real heading.
// status: candidate to contribute back to the skill (examples/components/scroll)
import type { CSSProperties } from "react";
type Props = { progress: number; className?: string; style?: CSSProperties; still?: number };
export function LeaderCountdown({ progress, className, style, still }: Props) {
  const p = Math.max(0, Math.min(0.999, progress)); const n = still ?? 5 - Math.floor(p * 4); const f = still ? 0.3 : (p * 4) % 1;
  const a = f * Math.PI * 2; const x = 50 + Math.sin(a) * 60, y = 50 - Math.cos(a) * 60;
  const wedge = f > 0.5 ? `M50 50 L50 -10 A60 60 0 1 1 ${x} ${y} Z` : `M50 50 L50 -10 A60 60 0 0 1 ${x} ${y} Z`;
  return (
    <svg className={className} style={style} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <rect width="100" height="100" fill="#2a2522" />
      <path d={wedge} fill="#4a413c" />
      <path d="M50 0V100M0 50H100" stroke="#F6E9E2" strokeWidth="0.6" opacity="0.6" />
      <circle cx="50" cy="50" r="34" fill="none" stroke="#F6E9E2" strokeWidth="1.2" /><circle cx="50" cy="50" r="40" fill="none" stroke="#F6E9E2" strokeWidth="0.6" />
      <text x="50" y="50" textAnchor="middle" dominantBaseline="central" fontSize="40" fontWeight="700" fill="#F6E9E2" fontFamily="var(--x-text), monospace">{n}</text>
    </svg>
  );
}

"use client";
// @motomation-component
// id: wax-seal
// name: Wax Seal
// family: micro
// tier: 1
// deps: react
// what: Press a wax seal onto anything: a blob of wax with an irregular seeded edge, an embossed monogram (inner shadow and highlight, no images), a press-in animation with a short spread, and the sealed state kept on this device.
// use-when: Certifying, approving or "filing" one item at a time on archival, formal or letter-like pages.
// avoid-when: Slop as decoration on every card, or as a fake trust badge; a seal must record something the visitor did.
// reduced-motion: The seal appears pressed, no squash or spread.
// touch: It is a button; tap seals and tap again breaks the seal.
// a11y: A toggle button (aria-pressed) with a label naming what is sealed.
// status: candidate to contribute back to the skill (examples/components/micro)
import { useEffect, useState, type CSSProperties } from "react";
import { sfx, buzz } from "@/lib/sound";
type Props = { id: string; label: string; monogram?: string; wax?: string; size?: number; className?: string; style?: CSSProperties; onChange?: (sealed: boolean) => void };
export function WaxSeal({ id, label, monogram = "M", wax = "#8E1B1B", size = 84, className, style, onChange }: Props) {
  const key = `mm-seal-${id}`; const [on, setOn] = useState(false);
  useEffect(() => { try { setOn(localStorage.getItem(key) === "1"); } catch { /* blocked */ } }, [key]);
  const rnd = (n: number) => { const x = Math.sin(id.length * 17.1 + n * 4.7 + id.charCodeAt(0)) * 9999; return x - Math.floor(x); };
  const edge = Array.from({ length: 18 }, (_, i) => { const a = (i / 18) * Math.PI * 2; const r = 44 + (rnd(i) - 0.5) * 8; return `${(50 + Math.cos(a) * r).toFixed(1)},${(50 + Math.sin(a) * r).toFixed(1)}`; });
  const toggle = () => { const v = !on; setOn(v); onChange?.(v); try { localStorage.setItem(key, v ? "1" : "0"); } catch { /* blocked */ } if (v) { sfx("seal", 0.06); buzz(14); } };
  return (
    <button type="button" className={`ws ${className ?? ""}`} style={{ width: size, height: size, ...style }} aria-pressed={on} aria-label={on ? `Break the seal on ${label}` : `Seal ${label}`} onClick={toggle} data-on={on ? "" : undefined}>
      {on ? (
        <svg viewBox="0 0 100 100" className="ws-s" aria-hidden="true">
          <defs><filter id={`ws-e-${id}`}><feGaussianBlur stdDeviation="1.2" /></filter><radialGradient id={`ws-g-${id}`} cx="35%" cy="30%"><stop offset="0" stopColor="#fff" stopOpacity="0.35" /><stop offset="0.5" stopColor={wax} stopOpacity="0" /></radialGradient></defs>
          <polygon points={edge.join(" ")} fill={wax} /><polygon points={edge.join(" ")} fill={`url(#ws-g-${id})`} />
          <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="3" filter={`url(#ws-e-${id})`} /><circle cx="50" cy="50" r="30" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" transform="translate(-0.8 -0.8)" />
          <text x="50" y="52" textAnchor="middle" dominantBaseline="central" fontSize="34" fontFamily="var(--x-display), serif" fill="rgba(0,0,0,0.38)" transform="translate(1 1.4)">{monogram}</text>
          <text x="50" y="52" textAnchor="middle" dominantBaseline="central" fontSize="34" fontFamily="var(--x-display), serif" fill={wax} stroke="rgba(255,255,255,0.22)" strokeWidth="0.6">{monogram}</text>
        </svg>
      ) : <span className="ws-empty" aria-hidden="true">Seal</span>}
    </button>
  );
}

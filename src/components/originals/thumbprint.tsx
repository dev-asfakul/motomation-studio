// @motomation-component
// id: thumbprint
// name: Thumbprint
// family: micro
// tier: 1
// deps: react
// what: A procedural fingerprint (whorl of offset ellipse arcs, seeded) pressed into a surface as an inset SVG. Same seed, same print.
// use-when: Tactile, clay, forensic or handmade pages where the visitor's touch should leave a mark that stays.
// avoid-when: Slop as a decorative "security" icon, or anywhere it suggests real biometrics.
// reduced-motion: Same; the print appears without the press-in scale.
// touch: Works the same for finger and pointer.
// a11y: Decorative (aria-hidden); the action that made it is announced by its caller.
// status: candidate to contribute back to the skill (examples/components/micro)
import type { CSSProperties } from "react";
type Props = { seed?: number; size?: number; color?: string; className?: string; style?: CSSProperties };
export function Thumbprint({ seed = 1, size = 44, color = "rgba(42,36,30,0.45)", className, style }: Props) {
  const r = (n: number) => { const x = Math.sin(seed * 99.13 + n * 12.7) * 43758.5; return x - Math.floor(x); };
  const rings = Array.from({ length: 9 }, (_, i) => {
    const rx = 4 + i * 2.1 + r(i) * 0.8, ry = rx * (1.28 + r(i + 20) * 0.08); const gap = 0.25 + r(i + 40) * 1.2; const a0 = r(i + 60) * Math.PI * 2;
    const p = (a: number) => `${(24 + Math.cos(a) * rx).toFixed(2)} ${(28 + Math.sin(a) * ry).toFixed(2)}`;
    return `M${p(a0)} A${rx.toFixed(2)} ${ry.toFixed(2)} 0 1 1 ${p(a0 + Math.PI * 2 - gap)}`;
  });
  return (
    <svg className={className} style={style} width={size} height={size * 1.2} viewBox="0 0 48 58" aria-hidden="true" focusable="false">
      <g fill="none" stroke={color} strokeWidth="1.1" strokeLinecap="round" transform={`rotate(${(r(99) - 0.5) * 40} 24 28)`}>{rings.map((d, i) => <path key={i} d={d} />)}</g>
    </svg>
  );
}

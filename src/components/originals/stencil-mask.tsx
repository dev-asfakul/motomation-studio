"use client";
// @motomation-component
// id: stencil-mask
// name: Stencil Mask
// family: cursor
// tier: 2
// deps: react
// what: A card stencil laid over a paintable surface: an SVG sheet with a shape cut out of it, plus a hit test (Path2D in the surface's coordinates) the paint tool uses to keep spray inside the cut. Lifting the stencil leaves the sharp-edged mark.
// use-when: Spray, print or craft surfaces where masking is part of the making; pair with a paint surface that accepts a mask test.
// avoid-when: Slop as a static decorative cut-out with nothing to paint.
// reduced-motion: The stencil appears and lifts without the slide.
// touch: Stencil choices and Lift are buttons.
// a11y: Stencil options are a radio group; the sheet is decorative.
// status: candidate to contribute back to the skill (examples/components/cursor)
import type { CSSProperties } from "react";
export type Stencil = { id: string; name: string; d: string; w: number; h: number };
export const STENCILS: Stencil[] = [
  { id: "m", name: "The M", w: 200, h: 160, d: "M20 150 L20 10 L100 90 L180 10 L180 150 L146 150 L146 76 L100 122 L54 76 L54 150 Z" },
  { id: "arrow", name: "Arrow", w: 200, h: 160, d: "M10 60 L120 60 L120 20 L190 80 L120 140 L120 100 L10 100 Z" },
  { id: "case", name: "Case no.", w: 200, h: 160, d: "M20 40 L180 40 L180 120 L20 120 Z M44 64 L44 96 L156 96 L156 64 Z" },
];
/** Hit test in surface pixels: stencil is centred at (cx, cy) and scaled to width sw. */
export function stencilTest(s: Stencil, cx: number, cy: number, sw: number) {
  const p = new Path2D(s.d); const k = sw / s.w; let ctx: CanvasRenderingContext2D | null = null;
  return (x: number, y: number) => { ctx ||= document.createElement("canvas").getContext("2d"); return !!ctx && ctx.isPointInPath(p, (x - cx) / k + s.w / 2, (y - cy) / k + s.h / 2, "evenodd"); };
}
type Props = { stencil: Stencil; width: number; className?: string; style?: CSSProperties };
export function StencilMask({ stencil, width, className, style }: Props) {
  const k = width / stencil.w;
  return (
    <svg className={className} style={{ width, height: stencil.h * k, ...style }} viewBox={`-40 -40 ${stencil.w + 80} ${stencil.h + 80}`} aria-hidden="true" preserveAspectRatio="none">
      <path fillRule="evenodd" d={`M-40 -40 H${stencil.w + 40} V${stencil.h + 40} H-40 Z ${stencil.d}`} fill="#c9b48a" stroke="#8a7a58" strokeWidth="1" />
    </svg>
  );
}

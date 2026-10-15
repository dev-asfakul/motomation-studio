"use client";
// @motomation-component
// id: ct-scrubber
// name: CT Scrubber
// family: ui
// tier: 2
// deps: react
// what: A vertical slice control for a layered volume: a range input styled as a scanner rail, with every layer's label stacked beside it like a deck index. The active slice's readout flips in on a split-flap board.
// use-when: Any layered structure (strata, folders, floors, versions) where moving one cut through it explains what each layer holds.
// avoid-when: Slop as a decorative slider with no layers behind it.
// reduced-motion: The readout changes without flipping.
// touch: The rail is a native range input, 48px wide hit area; labels are buttons.
// a11y: Native range (aria-valuetext names the layer); index buttons jump to a layer; the readout is a polite live region.
// status: candidate to contribute back to the skill (examples/components/ui)
import type { CSSProperties, ReactNode } from "react";
type Props = { layers: { name: string; note: string }[]; value: number; onChange: (v: number) => void; readout: (i: number) => ReactNode; className?: string; style?: CSSProperties };
export function CTScrubber({ layers, value, onChange, readout, className, style }: Props) {
  const N = layers.length; const i = Math.min(N - 1, Math.round(value * (N - 1)));
  return (
    <div className={`ct ${className ?? ""}`} style={style}>
      <div className="ct-rail">
        <input type="range" min={0} max={N - 1} step={1} value={i} onChange={(e) => onChange(+e.target.value / (N - 1))} aria-label="Slice depth" aria-valuetext={`Slice ${i + 1} of ${N}: ${layers[i].name}`} {...{ orient: "vertical" }} />
        <ol className="ct-index">{layers.map((l, k) => <li key={l.name} data-on={k === i ? "" : undefined} data-past={k < i ? "" : undefined}><button type="button" onClick={() => onChange(k / (N - 1))}>{String(k + 1).padStart(2, "0")} {l.name}</button></li>).reverse()}</ol>
      </div>
      <div className="ct-read" aria-live="polite">{readout(i)}</div>
    </div>
  );
}

"use client";
// @motomation-component
// id: hour-ledger
// name: Hour Ledger
// family: scroll
// tier: 2
// deps: react
// what: A ledger of time-stamped entries driven by an hour value (from scroll or a control): a large clock reads the exact time, the current row is lit by a slow lighthouse beam that sweeps on a fixed period, and past rows settle into ink.
// use-when: Timelines told by the hour (a night, a launch, an incident) where one clock should move everything else.
// avoid-when: Slop as a decorative clock with no entries, or with fabricated timestamps; every row must be real.
// reduced-motion: The beam does not sweep; the current row is marked with a solid rule instead.
// touch: Rows are buttons that set the hour.
// a11y: The clock is a timer with aria-live off; the current row has aria-current="time"; rows are a list.
// status: candidate to contribute back to the skill (examples/components/scroll)
import type { CSSProperties } from "react";
type Row = { at: number; text: string };
type Props = { hour: number; rows: Row[]; onSeek?: (h: number) => void; className?: string; style?: CSSProperties };
const fmt = (h: number) => { const m = Math.floor((h % 1) * 60); return `${String(Math.floor(h)).padStart(2, "0")}:${String(m).padStart(2, "0")}`; };
export function HourLedger({ hour, rows, onSeek, className, style }: Props) {
  const cur = rows.reduce((a, r, i) => (hour >= r.at ? i : a), 0);
  return (
    <div className={`hl ${className ?? ""}`} style={style}>
      <p className="hl-clock" role="timer" aria-live="off" aria-label="Time on the ledger">{fmt(Math.min(5.99, hour))}</p>
      <ol className="hl-rows">
        {rows.map((r, i) => (
          <li key={r.at} aria-current={i === cur ? "time" : undefined} data-past={i < cur ? "" : undefined}>
            <button type="button" onClick={() => onSeek?.(r.at + 0.01)}><time>{fmt(r.at)}</time><span>{r.text}</span></button>
            {i === cur && <span className="hl-beam" aria-hidden="true" />}
          </li>
        ))}
      </ol>
    </div>
  );
}

"use client";
// Live evidence log meter: what the site shows (always complete, checked in CI) and what you have witnessed so far.
import { useCase } from "@/lib/store";
import { useEffect, useState } from "react";

export function EvidenceLog({ kinds }: { kinds: { kind: string; label: string; total: number }[] }) {
  const seen = useCase((s) => s.seen);
  const [on, setOn] = useState(false);
  useEffect(() => setOn(true), []);
  const total = kinds.reduce((n, k) => n + k.total, 0);
  const mine = on ? seen.length : 0;
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <p style={{ margin: 0, fontSize: "var(--step-1)", lineHeight: 1.25 }}>
        On file: <b>{total}</b> items of evidence, every one shown somewhere in this case. Witnessed by you: <b style={{ fontVariantNumeric: "tabular-nums" }}>{mine}</b>.
      </p>
      <div className="meter" role="img" aria-label={`Witnessed ${mine} of ${total}`}><i style={{ width: `${(mine / total) * 100}%` }} /></div>
      <dl style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "6px 18px", margin: 0 }}>
        {kinds.map((k) => {
          const n = on ? seen.filter((s) => s.startsWith(k.kind + ":")).length : 0;
          return (<div key={k.kind} style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--line)", paddingTop: 6 }}>
            <dt className="label">{k.label}</dt><dd className="mono" style={{ margin: 0, fontVariantNumeric: "tabular-nums" }}>{n}/{k.total}</dd>
          </div>);
        })}
      </dl>
    </div>
  );
}

export function Witness({ ids }: { ids: string[] }) {
  useEffect(() => {
    import("@/lib/store").then(({ markSeen }) => markSeen(ids));
  }, [ids]);
  return null;
}

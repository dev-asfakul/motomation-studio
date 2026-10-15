"use client";
// ⌘K "Search the case": pages, exhibits, components, signatures, commands, install paths, archetypes.
import { useEffect, useMemo, useRef, useState } from "react";

export type SearchItem = { kind: string; title: string; note: string; href: string };

export function CommandPalette({ items, onClose, onGo }: { items: SearchItem[]; onClose: () => void; onGo: (href: string) => void }) {
  const [q, setQ] = useState("");
  const [i, setI] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const prev = useRef<Element | null>(null);
  useEffect(() => { prev.current = document.activeElement; input.current?.focus(); return () => { (prev.current as HTMLElement | null)?.focus?.(); }; }, []);
  const hits = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const scored = items.map((it) => {
      const hay = `${it.kind} ${it.title} ${it.note}`.toLowerCase();
      if (!words.every((w) => hay.includes(w))) return null;
      const s = words.reduce((n, w) => n + (it.title.toLowerCase().startsWith(w) ? 3 : it.title.toLowerCase().includes(w) ? 2 : 1), 0);
      return { it, s };
    }).filter(Boolean) as { it: SearchItem; s: number }[];
    return scored.sort((a, b) => b.s - a.s).slice(0, 40).map((x) => x.it);
  }, [q, items]);
  useEffect(() => setI(0), [q]);
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setI((v) => Math.min(hits.length - 1, v + 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setI((v) => Math.max(0, v - 1)); }
    if (e.key === "Enter" && hits[i]) { e.preventDefault(); onGo(hits[i].href); }
    if (e.key === "Escape") onClose();
    if (e.key === "Tab") e.preventDefault();
  };
  return (
    <div className="cmdk-back" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="cmdk" role="dialog" aria-modal="true" aria-label="Search the case" onKeyDown={onKey}>
        <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the case: an exhibit, a component, a command…"
          role="combobox" aria-expanded="true" aria-controls="cmdk-list" aria-activedescendant={hits[i] ? `cmdk-${i}` : undefined} aria-label="Search the case" />
        <ul id="cmdk-list" role="listbox" aria-label="Results">
          {hits.map((h, n) => (
            <li key={h.kind + h.href + h.title} role="presentation">
              <a id={`cmdk-${n}`} role="option" aria-selected={n === i} href={h.href} onMouseEnter={() => setI(n)} onClick={(e) => { e.preventDefault(); onGo(h.href); }}>
                <span className="k">{h.kind}</span><span className="t">{h.title}<small>{h.note}</small></span>
              </a>
            </li>
          ))}
          {!hits.length && <li style={{ padding: 16, color: "var(--muted)" }}>Nothing filed under that. Try a letter, a tier or a command.</li>}
        </ul>
        <div className="cmdk-foot"><span>{hits.length} of {items.length} items</span><span>↑↓ to move · Enter to open · Esc to close</span></div>
      </div>
    </div>
  );
}

"use client";
import { useRef, useState } from "react";
import { SplitFlap } from "@/vendor/motomation/components/type/split-flap";
import { CountUp } from "@/vendor/motomation/components/micro/count-up";
import { StickyIndex } from "@/vendor/motomation/components/layout/sticky-index";
import { sfx } from "@/lib/sound";
import type { Exhibit } from "@/content/exhibits";
import { repo } from "@/content/repo-client";

// Snap lab: blocks move along grid lines only, x or y, never diagonal. A crosshair reads the grid position.
const COLS = 12, ROWS = 8;
export default function Lab({ e }: { e: Exhibit }) {
  void e;
  const box = useRef<HTMLDivElement>(null);
  const [blocks, setBlocks] = useState([{ id: "A", c: 0, r: 0, w: 4, h: 2 }, { id: "B", c: 5, r: 3, w: 3, h: 3 }, { id: "C", c: 9, r: 1, w: 3, h: 1 }]);
  const [cross, setCross] = useState({ c: 0, r: 0, on: false });
  const [recount, setRecount] = useState(0);
  const cell = () => { const r = box.current!.getBoundingClientRect(); return { w: r.width / COLS, h: r.height / ROWS, r }; };
  const down = (id: string) => (ev: React.PointerEvent) => {
    const el = ev.currentTarget as HTMLElement; el.setPointerCapture(ev.pointerId);
    const b0 = blocks.find((b) => b.id === id)!; const x0 = ev.clientX, y0 = ev.clientY; let axis: "x" | "y" | null = null;
    const mv = (m: PointerEvent) => {
      const { w, h } = cell(); const dx = m.clientX - x0, dy = m.clientY - y0;
      if (!axis && Math.hypot(dx, dy) > 6) axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      const c = axis === "x" ? Math.max(0, Math.min(COLS - b0.w, b0.c + Math.round(dx / w))) : b0.c;
      const r = axis === "y" ? Math.max(0, Math.min(ROWS - b0.h, b0.r + Math.round(dy / h))) : b0.r;
      setBlocks((bs) => bs.map((b) => { if (b.id !== id) return b; if (b.c !== c || b.r !== r) sfx("tick", 0.03); return { ...b, c, r }; }));
    };
    const up = () => { el.removeEventListener("pointermove", mv); el.removeEventListener("pointerup", up); };
    el.addEventListener("pointermove", mv); el.addEventListener("pointerup", up);
  };
  const key = (id: string) => (ev: React.KeyboardEvent) => {
    const d: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }; const k = d[ev.key]; if (!k) return; ev.preventDefault();
    setBlocks((bs) => bs.map((b) => b.id === id ? { ...b, c: Math.max(0, Math.min(COLS - b.w, b.c + k[0])), r: Math.max(0, Math.min(ROWS - b.h, b.r + k[1])) } : b)); sfx("tick", 0.03);
  };
  const a = blocks[0];
  return (
    <div className="d-lab">
      <StickyIndex sections={[{ id: "x-spec-h", label: "Specimen" }, { id: "x-anat-h", label: "Anatomy" }, { id: "x-lab-h", label: "Motion lab" }, { id: "x-link-h", label: "Skill link" }, { id: "x-ba-h", label: "Before and after" }]} label="Exhibit D" />
      <div ref={box} className="d-board" onPointerMove={(ev) => { const { w, h, r } = cell(); setCross({ c: Math.floor((ev.clientX - r.left) / w), r: Math.floor((ev.clientY - r.top) / h), on: true }); }} onPointerLeave={() => setCross((c) => ({ ...c, on: false }))}>
        {blocks.map((b) => (
          <button key={b.id} type="button" className="d-block" onPointerDown={down(b.id)} onKeyDown={key(b.id)} aria-label={`Block ${b.id}, column ${b.c + 1}, row ${b.r + 1}. Arrow keys move it one unit.`}
            style={{ left: `${(b.c / COLS) * 100}%`, top: `${(b.r / ROWS) * 100}%`, width: `${(b.w / COLS) * 100}%`, height: `${(b.h / ROWS) * 100}%` }}>{b.id}</button>
        ))}
        {cross.on && <div className="d-cross" aria-hidden="true" style={{ left: `${((cross.c + 0.5) / COLS) * 100}%`, top: `${((cross.r + 0.5) / ROWS) * 100}%` }}><span>x {cross.c + 1} · y {cross.r + 1}</span></div>}
      </div>
      <div className="d-read">
        <p className="x-k">Block A position</p>
        <SplitFlap value={`C${String(a.c + 1).padStart(2, "0")} R${String(a.r + 1).padStart(2, "0")}`} className="d-flap" />
        <p className="x-k" style={{ marginTop: 24 }}>Recount the components</p>
        <p className="d-count"><CountUp key={recount} value={repo.components} duration={900} /></p>
        <button type="button" className="d-btn" onClick={() => setRecount((n) => n + 1)}>Recount</button>
      </div>
    </div>
  );
}

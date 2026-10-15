"use client";
// @motomation-component
// id: sprite-scene
// name: Sprite Scene
// family: backgrounds
// tier: 2
// deps: react
// what: A small playable canvas at 10 frames a second: a sprite walks a tiled map of rooms, picks up labelled items, and leaves a fading pixel wake. Keys, WASD or an on-screen pad.
// use-when: Pixel-art or game-flavoured pages where exploring is the content: each item collected is a real fact.
// avoid-when: Slop as an idle animation nobody can play, or a game that hides content the visitor needs.
// reduced-motion: No idle animation and no wake; the sprite moves one tile per key press; every item is also listed as text.
// touch: An on-screen pad with 48px buttons; the canvas does not capture scroll.
// a11y: The canvas is a labelled image; the item list and pick-up announcements are real text (aria-live polite).
// status: candidate to contribute back to the skill (examples/components/backgrounds)
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "@/lib/motion";
import { sfx } from "@/lib/sound";

export type Room = { name: string; item: string };
type Props = { rooms: Room[]; palette: { floor: string; wall: string; ink: string; accent: string; wake: string }; className?: string; style?: CSSProperties };
const T = 8, COLS = 40, ROWS = 22;
// 8×10 detective: hat, coat, legs (1 = ink, 2 = accent)
const SPRITE = ["00111100", "01111110", "00222200", "00211200", "01111110", "11111111", "01111110", "01111110", "01100110", "01100110"];

export function SpriteScene({ rooms, palette, className, style }: Props) {
  const reduce = useReducedMotion();
  const cv = useRef<HTMLCanvasElement>(null);
  const st = useRef({ x: 3, y: 4, dir: [0, 0] as [number, number], wake: new Map<string, number>(), got: new Set<number>(), frame: 0 });
  const [got, setGot] = useState<number[]>([]); const [said, setSaid] = useState("");
  const cell = (i: number) => ({ cx: (i % 4) * 10, cy: Math.floor(i / 4) * 11 });
  const itemAt = (i: number) => { const { cx, cy } = cell(i); return { x: cx + 5, y: cy + 6 }; };
  const wall = (x: number, y: number) => {
    if (x <= 0 || y <= 0 || x >= COLS - 1 || y >= ROWS - 1) return true;
    const onV = x % 10 === 0, onH = y % 11 === 0;
    if (onV && !(y % 11 >= 4 && y % 11 <= 6)) return true; // doors in vertical walls
    if (onH && !(x % 10 >= 4 && x % 10 <= 5)) return true; // doors in horizontal walls
    return false;
  };
  const step = (dx: number, dy: number) => {
    const s = st.current; const nx = s.x + dx, ny = s.y + dy; if (wall(nx, ny)) return;
    s.wake.set(`${s.x},${s.y}`, 7); s.x = nx; s.y = ny;
    rooms.forEach((r, i) => { const it = itemAt(i); if (!s.got.has(i) && Math.abs(it.x - nx) <= 1 && Math.abs(it.y - ny) <= 1) { s.got.add(i); setGot([...s.got]); setSaid(`Picked up: ${r.item}, in ${r.name}`); sfx("blip", 0.05); } });
  };
  const draw = () => {
    const g = cv.current?.getContext("2d"); if (!g) return; const s = st.current;
    g.fillStyle = palette.floor; g.fillRect(0, 0, COLS * T, ROWS * T);
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
      if (wall(x, y)) { g.fillStyle = palette.wall; g.fillRect(x * T, y * T, T, T); }
      else if ((x + y) % 2 === 0) { g.fillStyle = "rgba(255,255,255,0.025)"; g.fillRect(x * T, y * T, T, T); }
      const w = s.wake.get(`${x},${y}`); if (w && !reduce) { g.globalAlpha = w / 8; g.fillStyle = palette.wake; g.fillRect(x * T + 2, y * T + 2, T - 4, T - 4); g.globalAlpha = 1; }
    }
    rooms.forEach((r, i) => {
      const it = itemAt(i); const { cx, cy } = cell(i);
      g.fillStyle = palette.ink; g.font = "8px monospace"; g.textBaseline = "top"; g.fillText(r.name.slice(0, 9), (cx + 1) * T + 2, (cy + 1) * T + 1);
      if (!s.got.has(i)) { const bob = reduce ? 0 : (s.frame % 10 < 5 ? 0 : 1); g.fillStyle = palette.accent; g.fillRect(it.x * T + 1, it.y * T + 1 - bob, T - 2, T - 2); g.fillStyle = palette.floor; g.fillRect(it.x * T + 3, it.y * T + 3 - bob, 2, 2); }
    });
    const walk = !reduce && (s.dir[0] || s.dir[1]) && s.frame % 2 === 0;
    SPRITE.forEach((row, j) => [...row].forEach((c, i) => { if (c === "0") return; g.fillStyle = c === "2" ? palette.accent : palette.ink; const leg = j >= 8 && walk ? (i < 4 ? -1 : 1) : 0; g.fillRect(s.x * T + i + leg * 0, s.y * T - 2 + j + (j >= 8 && walk && i < 4 ? -1 : 0), 1, 1); }));
  };
  useEffect(() => {
    draw(); const s = st.current;
    const keys: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1], a: [-1, 0], d: [1, 0], w: [0, -1], s: [0, 1] };
    const dn = (e: KeyboardEvent) => { const host = cv.current?.parentElement; if (!host?.contains(document.activeElement) && document.activeElement !== cv.current) return; const k = keys[e.key]; if (!k) return; e.preventDefault(); if (reduce) { step(...k); draw(); } else s.dir = k; };
    const upk = (e: KeyboardEvent) => { if (keys[e.key]) s.dir = [0, 0]; };
    window.addEventListener("keydown", dn); window.addEventListener("keyup", upk);
    let id = 0;
    if (!reduce) id = window.setInterval(() => { if (document.hidden) return; s.frame++; if (s.dir[0] || s.dir[1]) step(...s.dir); s.wake.forEach((v, k) => (v <= 1 ? s.wake.delete(k) : s.wake.set(k, v - 1))); draw(); }, 100);
    return () => { window.removeEventListener("keydown", dn); window.removeEventListener("keyup", upk); clearInterval(id); };
  }, [reduce]); // eslint-disable-line react-hooks/exhaustive-deps
  const pad = (d: [number, number]) => ({
    onPointerDown: () => { if (reduce) { step(...d); draw(); } else st.current.dir = d; },
    onPointerUp: () => { st.current.dir = [0, 0]; }, onPointerLeave: () => { st.current.dir = [0, 0]; },
    onKeyDown: (e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); step(...d); draw(); } },
  });
  return (
    <div className={`ss ${className ?? ""}`} style={style}>
      <canvas ref={cv} width={COLS * T} height={ROWS * T} tabIndex={0} role="img" aria-label={`A pixel map of ${rooms.length} rooms. Focus it and use the arrow keys or WASD to walk; ${got.length} of ${rooms.length} items collected.`} />
      <div className="ss-pad" role="group" aria-label="Movement pad">
        <button type="button" aria-label="Up" {...pad([0, -1])}>▲</button><button type="button" aria-label="Left" {...pad([-1, 0])}>◀</button>
        <button type="button" aria-label="Down" {...pad([0, 1])}>▼</button><button type="button" aria-label="Right" {...pad([1, 0])}>▶</button>
      </div>
      <ol className="ss-list" aria-label="Evidence in the rooms">{rooms.map((r, i) => <li key={r.name} data-got={got.includes(i) ? "" : undefined}><b>{r.name}</b> {r.item}</li>)}</ol>
      <p className="ss-said" aria-live="polite">{said || `${got.length} of ${rooms.length} collected`}</p>
    </div>
  );
}

import { caseNo } from "@/content/repo";

// The header every Bureau room shares: room number, case number, one title, one lede, optional aside.
// fit: letters in the longest word of the title. Anybody at wdth 150 sets about 0.92em per letter, so the title is
// capped to the size at which that word still fits the phone width: no display word ever breaks mid-word.
// compact: a short head for rooms where the instrument is the hero (the board, the lab).
export function RoomHead({ n, room, title, lede, aside, uv, fit = 9, compact }: { n: string; room: string; title: React.ReactNode; lede: React.ReactNode; aside?: React.ReactNode; uv?: string; fit?: number; compact?: boolean }) {
  const cap = (92 / (fit * 0.94)).toFixed(2);
  return (
    <header className={`room-head${compact ? " compact" : ""}`}>
      <div className="room-meta"><span className="tag">Room {n} · {room}</span><span className="label">{caseNo}</span></div>
      <h1 className="room-title" style={{ fontSize: `min(${compact ? "var(--step-3)" : "var(--step-4)"}, ${cap}vw)` }}>{title}</h1>
      <p className="room-lede">{lede}</p>
      {aside && <p className="room-aside">{aside}</p>}
      {uv && <p className="uv-note">UV: {uv}</p>}
    </header>
  );
}

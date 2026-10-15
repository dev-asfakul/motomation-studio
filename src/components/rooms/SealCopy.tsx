"use client";
// Copy a command and seal it into an evidence bag: the bag slides over the line, the tag records the item number and
// the time, and the bag stays sealed on this device. Tier 1: one transform and a colour change, under 250ms.
import { useEffect, useState } from "react";
import { sfx, buzz } from "@/lib/sound";

const KEY = "motomation-locker-v1";
const read = (): Record<string, string> => { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; } };

export function SealCopy({ id, n, text, label }: { id: string; n: number; text: string; label: string }) {
  const [at, setAt] = useState<string | null>(null);
  const [fresh, setFresh] = useState(false);
  useEffect(() => { setAt(read()[id] ?? null); const on = () => setAt(read()[id] ?? null); window.addEventListener("locker", on); return () => window.removeEventListener("locker", on); }, [id]);
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); } catch { const t = document.createElement("textarea"); t.value = text; document.body.appendChild(t); t.select(); document.execCommand?.("copy"); t.remove(); }
    const time = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    const all = read(); all[id] = time; try { localStorage.setItem(KEY, JSON.stringify(all)); } catch { /* private mode */ }
    setAt(time); setFresh(true); window.setTimeout(() => setFresh(false), 1600); window.dispatchEvent(new Event("locker"));
    sfx("seal"); buzz(10);
  };
  return (
    <div className={`bag${at ? " sealed" : ""}${fresh ? " fresh" : ""}`}>
      <pre className="bag-cmd" tabIndex={0} aria-label={`Command ${n}`}><code>{text}</code></pre>
      <span className="bag-film" aria-hidden="true" />
      <button type="button" className="btn bag-btn" onClick={copy} data-sealed={!!at}>
        {fresh ? "Copied, sealed" : at ? "Copy again" : label}
      </button>
      <span className="bag-tag mono" aria-hidden={!at}>{at ? `Item ${String(n).padStart(2, "0")} · sealed ${at}` : ""}</span>
      <span className="sr-only" aria-live="polite">{fresh ? `Copied. Item ${n} sealed in the evidence bag.` : ""}</span>
    </div>
  );
}

export function BagCount({ total }: { total: number }) {
  const [n, setN] = useState(0);
  useEffect(() => { const on = () => setN(Object.keys(read()).length); on(); window.addEventListener("locker", on); return () => window.removeEventListener("locker", on); }, []);
  return <p className="mono bag-count" role="status">{n} of {total} sealed{n === total ? ". The locker is empty; every procedure is in a bag." : ""}</p>;
}

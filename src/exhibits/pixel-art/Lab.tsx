"use client";
import { useCallback } from "react";
import { DitherImage } from "@/components/originals/dither-image";
import { AsciiText } from "@/vendor/motomation/components/text/ascii-text";
import type { Exhibit } from "@/content/exhibits";

export default function Lab({ e }: { e: Exhibit }) {
  void e;
  const draw = useCallback((g: CanvasRenderingContext2D, w: number, h: number) => {
    // the source: a magnifying glass over a gradient floor, drawn, not photographed
    const grd = g.createLinearGradient(0, 0, w, h); grd.addColorStop(0, "#000"); grd.addColorStop(1, "#fff"); g.fillStyle = grd; g.fillRect(0, 0, w, h);
    const r = Math.min(w, h) * 0.28; const cx = w * 0.42, cy = h * 0.44;
    const lens = g.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r); lens.addColorStop(0, "#fff"); lens.addColorStop(1, "#555"); g.fillStyle = lens;
    g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.fill(); g.lineWidth = r * 0.18; g.strokeStyle = "#111"; g.stroke();
    g.lineCap = "round"; g.lineWidth = r * 0.28; g.beginPath(); g.moveTo(cx + r * 0.75, cy + r * 0.75); g.lineTo(cx + r * 1.7, cy + r * 1.6); g.stroke();
  }, []);
  return (
    <div className="g-lab">
      <DitherImage draw={draw} alt="A magnifying glass, dithered into the exhibit's four colours" palette={["#15130C", "#3a3628", "#577DE7", "#F3F0E8"]} width={480} height={300} />
      <div className="g-ascii"><p className="x-k">The same word, in characters</p><AsciiText text="CASE" cols={44} fontFamily="Arial Black, Arial, sans-serif" /></div>
    </div>
  );
}

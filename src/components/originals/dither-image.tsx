"use client";
// @motomation-component
// id: dither-image
// name: Dither Image
// family: backgrounds
// tier: 1
// deps: react
// what: Renders any image (or a drawn source) through an ordered Bayer dither or Floyd–Steinberg error diffusion into a two- to four-colour palette, at a chosen pixel size.
// use-when: Pixel-art, zine, retro-computing pages that need images in the page's own palette rather than photographs pasted in.
// avoid-when: Slop as a filter on stock photos to fake a style, or on images whose detail the visitor needs.
// reduced-motion: Same; it only re-renders when a control changes.
// touch: Range inputs and buttons, 44px targets.
// a11y: The canvas has the source's alt text; controls are labelled.
// status: candidate to contribute back to the skill (examples/components/backgrounds)
import { useEffect, useRef, useState, type CSSProperties } from "react";

type Props = { draw: (g: CanvasRenderingContext2D, w: number, h: number) => void; alt: string; palette: string[]; width?: number; height?: number; className?: string; style?: CSSProperties };
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

export function DitherImage({ draw, alt, palette, width = 320, height = 200, className, style }: Props) {
  const cv = useRef<HTMLCanvasElement>(null);
  const [px, setPx] = useState(3); const [mode, setMode] = useState<"bayer" | "floyd">("bayer"); const [bias, setBias] = useState(0);
  useEffect(() => {
    const c = cv.current!; const w = Math.round(width / px), h = Math.round(height / px);
    const src = document.createElement("canvas"); src.width = w; src.height = h; const sg = src.getContext("2d")!; draw(sg, w, h);
    const img = sg.getImageData(0, 0, w, h); const d = img.data; const pal = palette.map(hex);
    const lum = new Float32Array(w * h); for (let i = 0; i < w * h; i++) lum[i] = (0.2126 * d[i * 4] + 0.7152 * d[i * 4 + 1] + 0.0722 * d[i * 4 + 2]) / 255 + bias / 100;
    const n = pal.length - 1;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = y * w + x; let v = lum[i]; let q: number;
      if (mode === "bayer") { q = Math.min(n, Math.max(0, Math.floor(v * n + BAYER[(y % 4) * 4 + (x % 4)]))); }
      else { q = Math.min(n, Math.max(0, Math.round(v * n))); const err = v - q / n; if (x + 1 < w) lum[i + 1] += (err * 7) / 16; if (y + 1 < h) { if (x > 0) lum[i + w - 1] += (err * 3) / 16; lum[i + w] += (err * 5) / 16; if (x + 1 < w) lum[i + w + 1] += err / 16; } }
      const [r, g, b] = pal[q]; d[i * 4] = r; d[i * 4 + 1] = g; d[i * 4 + 2] = b; d[i * 4 + 3] = 255; void v;
    }
    sg.putImageData(img, 0, 0); c.width = width; c.height = height; const cg = c.getContext("2d")!; cg.imageSmoothingEnabled = false; cg.drawImage(src, 0, 0, width, height);
  }, [px, mode, bias, draw, palette, width, height]);
  return (
    <div className={`di ${className ?? ""}`} style={style}>
      <canvas ref={cv} role="img" aria-label={alt} style={{ width: "100%", height: "auto", imageRendering: "pixelated" }} />
      <div className="di-ctrl">
        <label>Pixel size <b>{px}</b><input type="range" min={1} max={8} value={px} onChange={(e) => setPx(+e.target.value)} /></label>
        <label>Exposure <b>{bias > 0 ? "+" : ""}{bias}</b><input type="range" min={-30} max={30} value={bias} onChange={(e) => setBias(+e.target.value)} /></label>
        <div role="group" aria-label="Dither method"><button type="button" aria-pressed={mode === "bayer"} onClick={() => setMode("bayer")}>Bayer 4×4</button><button type="button" aria-pressed={mode === "floyd"} onClick={() => setMode("floyd")}>Floyd–Steinberg</button></div>
      </div>
    </div>
  );
}

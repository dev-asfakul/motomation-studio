#!/usr/bin/env node
// Extracts the outlines of the word MOTOMATION from each exhibit's display face (Google Fonts, OFL),
// so the Home lineup can morph real glyph paths from one typeface into the next. Writes content/wordmarks.json.
import fs from "node:fs";
import path from "node:path";
import opentype from "opentype.js";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const WORD = "MOTOMATION";
const SPECS = [
  ["BUREAU", "Anybody", "wdth,wght@150,800"],
  ["A", "Instrument Serif", "wght@400"], ["B", "Syne", "wght@800"], ["C", "Gloock", "wght@400"], ["D", "Schibsted Grotesk", "wght@800"],
  ["E", "Unbounded", "wght@800"], ["F", "Libre Caslon Display", "wght@400"], ["G", "Silkscreen", "wght@400"], ["H", "Tilt Warp", "wght@400"],
  ["I", "Sora", "wght@300"], ["J", "Big Shoulders Display", "wght@900"], ["K", "Rubik Mono One", "wght@400"], ["L", "Epilogue", "ital,wght@1,900"],
  ["M", "Young Serif", "wght@400"], ["N", "Archivo", "wdth,wght@125,900"], ["O", "Azeret Mono", "wght@500"], ["P", "Caveat", "wght@600"],
  ["Q", "Fraunces", "wght@600"], ["R", "Climate Crisis", "wght@400"], ["S", "Cormorant Garamond", "wght@300"], ["T", "Bodoni Moda", "wght@700"],
];
const cache = path.join(ROOT, ".cache", "fonts"); fs.mkdirSync(cache, { recursive: true });

async function ttf(family, axes) {
  const file = path.join(cache, `${family.replace(/\s/g, "_")}-${axes.replace(/[^\w]/g, "_")}.ttf`);
  if (fs.existsSync(file)) return fs.readFileSync(file);
  const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:${axes}`, { headers: { "User-Agent": "Mozilla/4.0" } })).text();
  const urls = [...css.matchAll(/url\((https:[^)]+\.ttf)\)/g)].map((m) => m[1]);
  if (!urls.length) throw new Error(`no ttf for ${family}: ${css.slice(0, 200)}`);
  const buf = Buffer.from(await (await fetch(urls[urls.length - 1])).arrayBuffer());
  fs.writeFileSync(file, buf); return buf;
}
const r = (n) => Math.round(n * 10) / 10;
function pathD(p) {
  return p.commands.map((c) => {
    if (c.type === "M" || c.type === "L") return `${c.type}${r(c.x)} ${r(c.y)}`;
    if (c.type === "Q") return `Q${r(c.x1)} ${r(c.y1)} ${r(c.x)} ${r(c.y)}`;
    if (c.type === "C") return `C${r(c.x1)} ${r(c.y1)} ${r(c.x2)} ${r(c.y2)} ${r(c.x)} ${r(c.y)}`;
    return "Z";
  }).join("");
}
const out = {};
for (const [id, family, axes] of SPECS) {
  const buf = await ttf(family, axes);
  const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
  const size = 100; const scale = size / font.unitsPerEm;
  let x = 0; const glyphs = [];
  const gs = [...WORD].map((ch) => font.charToGlyph(ch));
  gs.forEach((g, i) => {
    const p = g.getPath(x, 0, size);
    glyphs.push({ ch: WORD[i], x: r(x), d: pathD(p) });
    x += g.advanceWidth * scale;
    if (i < gs.length - 1) { try { x += font.getKerningValue(g, gs[i + 1]) * scale; } catch { /* no kern table */ } }
  });
  const capH = (font.tables.os2?.sCapHeight || font.ascender * 0.7) * scale;
  out[id] = { family, axes, width: r(x), capHeight: r(capH), glyphs };
  console.log(`${id.padEnd(6)} ${family.padEnd(24)} width ${r(x)} cap ${r(capH)}`);
}
fs.writeFileSync(path.join(ROOT, "content", "wordmarks.json"), JSON.stringify(out));
console.log("wrote content/wordmarks.json", (fs.statSync(path.join(ROOT, "content", "wordmarks.json")).size / 1024).toFixed(1), "KB");

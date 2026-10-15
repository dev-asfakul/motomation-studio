#!/usr/bin/env node
// Reads the @motomation-component header of every original component and writes content/originals.json,
// which the Lab lists as contribution candidates. Fails if a header field is missing.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
const DIR = "src/components/originals";
const NEED = ["id", "name", "family", "tier", "deps", "what", "use-when", "avoid-when", "reduced-motion", "touch", "a11y", "status"];
const out = []; const bad = [];
for (const f of readdirSync(DIR).filter((x) => x.endsWith(".tsx")).sort()) {
  const src = readFileSync(`${DIR}/${f}`, "utf8");
  if (!src.includes("@motomation-component")) { bad.push(`${f}: no header`); continue; }
  const h = {}; for (const m of src.matchAll(/^\/\/ ([a-z0-9-]+): (.+)$/gm)) if (NEED.includes(m[1]) && !(m[1] in h)) h[m[1]] = m[2].trim();
  const miss = NEED.filter((k) => !h[k]); if (miss.length) bad.push(`${f}: missing ${miss.join(", ")}`);
  out.push({ ...h, file: `${DIR}/${f}`, lines: src.split("\n").length });
}
writeFileSync("content/originals.json", JSON.stringify(out, null, 1));
console.log(`originals: ${out.length} components${bad.length ? `, ${bad.length} problems:\n  ` + bad.join("\n  ") : ", every header complete"}`);
if (bad.length) process.exit(1);

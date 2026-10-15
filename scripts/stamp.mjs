#!/usr/bin/env node
// Writes the skill's stamp comment into each gated page of out/ (called by postbuild):
//   <!-- motomation · archetype: … · signature: … · tier: … · critique: … · gate: … -->
// The line is copied from the gate's own JSON report (docs/gate/<page>.json), never typed, so `gate.mjs --verify` can
// re-scan the page and check it. The gate hashes the page without stamp comments, so the stamp does not change the id.
import fs from "node:fs"; import path from "node:path";
const T = JSON.parse(fs.readFileSync("content/gate-targets.json", "utf8")); let n = 0;
for (const [r, t] of Object.entries(T)) {
  const name = r === "/" ? "home" : r.replace(/^\/|\/$/g, "").replace(/\//g, "-"); const rep = `docs/gate/${name}.json`; const file = path.join("out", r, "index.html");
  if (!fs.existsSync(rep) || !fs.existsSync(file)) continue; const j = JSON.parse(fs.readFileSync(rep, "utf8")); if (!j.stamp || !j.critique) continue;
  const line = `<!-- motomation · archetype: ${t.archetype} · signature: ${t.signature} · tier: ${t.tier} · critique: ${j.critique} · ${j.stamp} -->`;
  const html = fs.readFileSync(file, "utf8").replace(/<!--[^>]*?motomation ·[\s\S]*?-->/g, "");
  fs.writeFileSync(file, html.replace("<head>", `<head>${line}`)); n++;
}
console.log(`stamp: ${n} pages stamped from their gate reports`);

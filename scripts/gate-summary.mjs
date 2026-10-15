#!/usr/bin/env node
// docs/gate/*.json (full gate reports) → content/gate-results.json (route → pass, stamp, counts, date) and
// docs/gate/SUMMARY.md. The exhibit shells print their own line from this file at build time.
//   --strict: exit 1 if any scanned page fails or could not be verified (CI)
import fs from "node:fs";
const rows = {}; let bad = 0;
for (const f of fs.readdirSync("docs/gate").filter((f) => f.endsWith(".json")).sort()) {
  const j = JSON.parse(fs.readFileSync(`docs/gate/${f}`, "utf8")); const name = f.replace(/\.json$/, "");
  const route = name === "home" ? "/" : "/" + name.replace(/^exhibits-/, "exhibits/") + "/";
  const date = (j.generated || fs.statSync(`docs/gate/${f}`).mtime.toISOString()).slice(0, 10);
  if (j.verified === false && !j.stamp) { rows[route] = { pass: false, verified: false, stamp: `not verified: ${String(j.reason).split("(")[0].trim()}`, counts: {}, date }; bad++; continue; }
  rows[route] = { pass: !!j.pass, verified: j.verified !== false, stamp: j.stamp, counts: j.counts, date };
  if (!j.pass) bad++;
}
fs.writeFileSync("content/gate-results.json", JSON.stringify(rows, null, 1) + "\n");
const md = ["| Page | Result | Stamp |", "| --- | --- | --- |", ...Object.entries(rows).map(([r, v]) => `| \`${r}\` | ${!v.verified ? "not verified" : v.pass ? "pass" : "fail"} | \`${v.stamp}\` |`)].join("\n");
fs.writeFileSync("docs/gate/SUMMARY.md", `# Delivery gate results\n\nFrom \`scripts/gate.mjs\` (gate/4, skill v2.6.0), light footprint, run against the static export served with production headers.\n\n${md}\n`);
console.log(md); if (process.argv.includes("--strict") && bad) process.exit(1);

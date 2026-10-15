#!/usr/bin/env node
// Coverage rule check. Every component, signature, tier, archetype, Thinking Sequence step, command and install path
// in content/repo.json must appear on the built site as a data-ev="kind:id" attribute. Reads out/**/*.html, writes
// coverage.json (what appears where, plus anything missing) and exits 1 if anything is missing.
import fs from "node:fs";
import path from "node:path";
const repo = JSON.parse(fs.readFileSync("content/repo.json", "utf8"));
const want = {
  component: repo.components.map((c) => c.id), signature: repo.signatures.map((s) => s.id), tier: repo.tiers.map((t) => String(t.tier)),
  archetype: repo.archetypes.map((a) => a.id), step: repo.steps.map((s) => String(s.n)), command: repo.commands.map((c) => c.cmd.slice(1)),
  install: repo.install.map((_, i) => String(i + 1)),
};
const pages = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (f.endsWith(".html")) pages.push(p); } })("out");
const where = {};
for (const p of pages) {
  const html = fs.readFileSync(p, "utf8"); const route = "/" + path.relative("out", p).replace(/index\.html$/, "").replace(/\.html$/, "/");
  for (const m of html.matchAll(/data-ev="([a-z]+):([^"]+)"/g)) { const k = `${m[1]}:${m[2]}`; (where[k] ||= new Set()).add(route); }
}
const report = { generated: new Date().toISOString(), pages: pages.length, kinds: {}, missing: [] };
for (const [kind, ids] of Object.entries(want)) {
  const found = ids.filter((id) => where[`${kind}:${id}`]);
  report.kinds[kind] = { total: ids.length, found: found.length, items: Object.fromEntries(ids.map((id) => [id, [...(where[`${kind}:${id}`] ?? [])].sort()])) };
  ids.filter((id) => !where[`${kind}:${id}`]).forEach((id) => report.missing.push(`${kind}:${id}`));
}
fs.writeFileSync("coverage.json", JSON.stringify(report, null, 1));
const line = Object.entries(report.kinds).map(([k, v]) => `${k} ${v.found}/${v.total}`).join(" · ");
console.log(`coverage: ${line}${report.missing.length ? `\nMISSING: ${report.missing.join(", ")}` : " · nothing missing"}`);
process.exit(report.missing.length ? 1 : 0);

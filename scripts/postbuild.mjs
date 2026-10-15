#!/usr/bin/env node
// After next build: the legacy noModule polyfill <script> Next writes into <head> has no defer, so it is reported as
// render-blocking even though modern browsers skip it. Add defer to it; nothing else in the HTML is touched.
// Also writes out/_headers (the same headers as vercel.json) for hosts that read a _headers file.
import fs from "node:fs"; import path from "node:path";
let n = 0;
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (f.endsWith(".html")) {
  const h = fs.readFileSync(p, "utf8"); const o = h.replace(/<script src="([^"]+)" noModule="">/g, '<script src="$1" noModule="" defer="">'); if (o !== h) { fs.writeFileSync(p, o); n++; } } } })("out");
const v = JSON.parse(fs.readFileSync("vercel.json", "utf8"));
fs.writeFileSync("out/_headers", "/*\n" + v.headers[0].headers.map((h) => `  ${h.key}: ${h.value}`).join("\n") + "\n");
console.log(`postbuild: defer added in ${n} pages · out/_headers written`);

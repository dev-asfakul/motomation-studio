#!/usr/bin/env node
// Runs the skill's delivery gate (scripts/gate.mjs from the skill checkout) against the built site, one route at a time,
// with the static server sending production headers. Writes docs/gate/<name>.json and prints the stamp.
//   GATE=path/to/gate.mjs node scripts/gate-run.mjs /route/ [/route/ …]        (env TIMEOUT seconds, default 1500)
//   node scripts/gate-run.mjs --verify /route/ …   re-scan and check the stamp postbuild wrote into out/<route>/index.html
// Archetype, signature and tier per route come from content/gate-targets.json, so the critique scores S and M.
// SERVE_ROOT points the server at a frozen copy of out/, so a rebuild can never change a page mid-scan.
import { spawn } from "node:child_process"; import fs from "node:fs"; import path from "node:path"; import { start } from "./serve.mjs";
const GATE = process.env.GATE || "../skill-src/skills/asfakulsiam-motomation-design/scripts/gate.mjs";
const T = JSON.parse(fs.readFileSync("content/gate-targets.json", "utf8"));
const args = process.argv.slice(2); const verify = args[0] === "--verify"; const routes = verify ? args.slice(1) : args;
const root = process.env.SERVE_ROOT || "out";
const srv = await start(4190); fs.mkdirSync("docs/gate", { recursive: true });
const run = (a, log) => new Promise((res) => { const out = fs.openSync(log, "w"); const c = spawn("node", [GATE, ...a], { stdio: ["ignore", out, out] }); c.on("exit", (status) => res(status)); });
for (const r of routes) {
  const name = r === "/" ? "home" : r.replace(/^\/|\/$/g, "").replace(/\//g, "-"); const t = T[r] || {};
  const meta = [...(t.tier ? ["--tier", String(t.tier)] : []), ...(t.archetype ? ["--archetype", t.archetype] : []), ...(t.signature ? ["--signature", t.signature] : []), ...(t.page ? ["--page", t.page] : [])];
  const url = `http://localhost:4190${r}`; const t0 = Date.now();
  const a = verify ? ["--verify", path.join(root, r, "index.html"), "--url", url, "--timeout", process.env.TIMEOUT || "1500", "--light", ...meta]
    : [url, "--json", "--out", `docs/gate/${name}.json`, "--timeout", process.env.TIMEOUT || "1500", "--light", ...meta];
  const status = await run(a, `docs/gate/${name}${verify ? ".verify" : ""}.log`);
  let line;
  if (verify) { const log = fs.readFileSync(`docs/gate/${name}.verify.log`, "utf8"); line = (log.match(/STAMP (VERIFIED|REJECTED)[^\n]*/) || log.match(/not verified[^\n]*/i) || ["no verdict"])[0]; }
  else { try { const j = JSON.parse(fs.readFileSync(`docs/gate/${name}.json`, "utf8")); line = j.stamp || j.reason; } catch { line = "no report"; } }
  console.log(`${r}  exit ${status}  ${Math.round((Date.now() - t0) / 1000)}s  ${line}`);
}
srv.close();

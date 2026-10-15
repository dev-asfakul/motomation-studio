#!/usr/bin/env node
// Runs the skill's delivery gate (scripts/gate.mjs from the vendored skill checkout) against the built site, one route at
// a time, with the static server sending production headers. Writes docs/gate/<name>.json and prints the stamp.
//   GATE=path/to/gate.mjs node scripts/gate-run.mjs /route/ [/route/ …]   (env TIMEOUT seconds, default 1500)
import { spawn } from "node:child_process"; import fs from "node:fs"; import { start } from "./serve.mjs";
const GATE = process.env.GATE || "../skill-src/skills/asfakulsiam-motomation-design/scripts/gate.mjs";
const srv = await start(4190); fs.mkdirSync("docs/gate", { recursive: true });
for (const r of process.argv.slice(2)) {
  const name = r === "/" ? "home" : r.replace(/^\/|\/$/g, "").replace(/\//g, "-");
  const t0 = Date.now();
  const p = await new Promise((res) => { const c = spawn("node", [GATE, `http://localhost:4190${r}`, "--json", "--out", `docs/gate/${name}.json`, "--timeout", process.env.TIMEOUT || "1500", "--light", ...(r === "/" ? ["--page", "home"] : [])], { stdio: ["ignore", "ignore", "inherit"] }); c.on("exit", (status) => res({ status })); }); // async: the server lives in this process
  let stamp = "no report"; try { const j = JSON.parse(fs.readFileSync(`docs/gate/${name}.json`, "utf8")); stamp = j.stamp || j.reason; } catch {}
  console.log(`${r}  exit ${p.status}  ${Math.round((Date.now() - t0) / 1000)}s  ${stamp}`);
}
srv.close();

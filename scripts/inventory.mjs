#!/usr/bin/env node
// Content inventory: reads a checkout of asfakulsiam/asfakulsiam-motomation-design and writes content/repo.json.
// Every word and number on the site is read from that file. Nothing is typed by hand except where a field says
// "source" and points at the exact file the value was transcribed from.
//
//   SKILL_SRC=../skill-src node scripts/inventory.mjs
//
// Without a checkout (CI, Vercel) it keeps the committed content/repo.json and exits 0.
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const SRC = path.resolve(process.env.SKILL_SRC || path.join(ROOT, "..", "skill-src"));
const OUT = path.join(ROOT, "content", "repo.json");
const SK = path.join(SRC, "skills", "asfakulsiam-motomation-design");

if (!fs.existsSync(SK)) {
  console.log(`inventory: no skill checkout at ${SRC}; keeping committed ${path.relative(ROOT, OUT)}`);
  process.exit(0);
}

const read = (p) => fs.readFileSync(p, "utf8").replace(/\r/g, "");
const rel = (p) => path.relative(SRC, p).split(path.sep).join("/");

// ---------- CSV ----------
function parseCSV(text) {
  const lines = text.split("\n").filter((l) => l.trim() && !l.startsWith("#"));
  const rows = [];
  for (const line of lines) {
    const out = []; let cur = ""; let q = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (q) { if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; } else if (ch === '"') q = false; else cur += ch; }
      else if (ch === '"') q = true; else if (ch === ",") { out.push(cur); cur = ""; } else cur += ch;
    }
    out.push(cur); rows.push(out);
  }
  const [head, ...body] = rows;
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h.trim(), (r[i] ?? "").trim()])));
}
const csv = (name) => parseCSV(read(path.join(SK, "data", `${name}.csv`)));

// ---------- files ----------
function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith(".git")) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p)); else out.push(p);
  }
  return out;
}
function firstHeading(p) {
  if (!/\.(md|mjs|ts|tsx|csv|html)$/.test(p)) return "";
  const t = read(p).split("\n");
  const h = t.find((l) => /^#\s/.test(l));
  if (h) return h.replace(/^#\s+/, "").trim();
  const c = t.find((l) => /^\/\/\s/.test(l));
  return c ? c.replace(/^\/\/\s+/, "").trim().slice(0, 140) : "";
}
const SKILL_FOLDERS = ["thinking", "invention", "structures", "principles", "motion", "signatures", "styles", "categories", "craft", "gates", "commands", "adapters", "data", "examples", "references", "scripts", "templates"];
const folders = SKILL_FOLDERS.map((f) => {
  const dir = path.join(SK, f);
  const files = walk(dir).sort();
  return {
    id: f,
    path: rel(dir),
    count: files.length,
    lines: files.reduce((n, p) => n + read(p).split("\n").length, 0),
    files: files.slice(0, 400).map((p) => ({ path: rel(p), name: path.basename(p), heading: firstHeading(p), lines: read(p).split("\n").length })),
  };
});
const allFiles = walk(SRC).filter((p) => !p.includes(`${path.sep}.git${path.sep}`));
const topLevel = fs.readdirSync(SRC, { withFileTypes: true }).filter((e) => !e.name.startsWith(".git")).map((e) => ({ name: e.name, dir: e.isDirectory(), count: e.isDirectory() ? walk(path.join(SRC, e.name)).length : 1 }));

// ---------- SKILL.md ----------
const skillMd = read(path.join(SK, "SKILL.md"));
const version = read(path.join(SK, "VERSION")).trim();
const laws = [...skillMd.matchAll(/^(\d)\. \*\*(.+?)\*\*\s*(.*)$/gm)].slice(0, 5).map((m) => ({ n: +m[1], title: m[2], text: m[3] }));
const tierRows = [...skillMd.matchAll(/^\| (\d) \| (?:\*\*)?([A-Za-z]+)(?:\*\*)? \| (.+?) \| (.+?) \|$/gm)].map((m) => ({ tier: +m[1], name: m[2], tools: m[3], when: m[4] }));
const flowBlock = skillMd.match(/## Default flow[\s\S]*?```\n([\s\S]*?)```/)[1];
const flow = flowBlock.split("\n").filter((l) => /^\d\./.test(l)).map((l) => {
  const m = l.match(/^(\d)\.\s+(.+?)\s{2,}(.+?)\s{2,}→\s*(.*)$/) || l.match(/^(\d)\.\s+(.+?)\s{2,}(.*)$/);
  return { n: +m[1], name: m[2].trim(), file: (m[3] || "").trim(), output: (m[4] || "").trim() };
});
const planBlock = skillMd.match(/```\nMOTOMATION PLAN\n([\s\S]*?)```/)[1].split("\n").filter(Boolean).map((l) => { const [k, ...v] = l.split(":"); return { key: k.trim(), hint: v.join(":").trim() }; });
const bans = skillMd.match(/## Hard bans[\s\S]*?\n\n([\s\S]*?)\n---/)[1].split("\n").filter((l) => l.startsWith("- ")).map((l) => l.slice(2).replace(/<!--.*?-->/g, ""));
const houseStyle = skillMd.match(/## House style defaults[\s\S]*?\n\n([\s\S]*?)\n---/)[1].split("\n").filter((l) => l.startsWith("- ")).map((l) => l.slice(2));
const scriptExamples = skillMd.match(/```bash\n(node scripts\/collide[\s\S]*?)```/)[1].split("\n").filter(Boolean).map((l) => { const [cmd, note] = l.split("#"); return { cmd: cmd.trim(), note: (note || "").trim() }; });

// ---------- thinking sequence ----------
const seq = read(path.join(SK, "thinking", "sequence.md"));
const steps = [...seq.matchAll(/^## (\d)\. (.+)$\n+([\s\S]*?)(?=^## )/gm)].map((m) => ({ n: +m[1], name: m[2].trim(), body: m[3].trim().split("\n\n")[0].replace(/\n/g, " ") }));
const summarySteps = [...skillMd.matchAll(/^(\d)\. \*\*(Stack|Tension|Concept|Archetype \+ Mutation|Forced Collision|Signature Move|Anti-Sameness Check|Restraint Gate)\*\*: (.+)$/gm)].map((m) => ({ n: +m[1], name: m[2], text: m[3] }));

// ---------- commands ----------
const cmdMd = read(path.join(SK, "commands", "overview.md"));
const commands = [];
for (const m of cmdMd.matchAll(/^### `(\/[a-z-]+)(?: ([^`]*))?`\n([\s\S]*?)(?=^### |^---|^## )/gm)) {
  const body = m[3];
  const what = (body.match(/\*\*What:\*\*\s*(.+)/) || [])[1] || body.trim().split("\n")[0];
  const when = (body.match(/\*\*When:\*\*\s*(.+)/) || [])[1] || "";
  const output = (body.match(/\*\*Output:\*\*\s*(.+)/) || [])[1] || "";
  const section = cmdMd.slice(0, m.index).match(/^## (\w+)/gm)?.pop()?.replace("## ", "") || "";
  commands.push({ cmd: m[1], arg: m[2] || "", group: section, what: what.trim(), when: when.trim(), output: output.trim() });
}
for (const m of cmdMd.matchAll(/^\| `(\/[a-z-]+)` \| (.+?) \|$/gm)) commands.push({ cmd: m[1], arg: "", group: "Meta", what: m[2].trim(), when: "", output: "" });
const flags = [...cmdMd.matchAll(/^\| `(--[a-z-]+)`(?: `(--[a-z-]+)` `(--[a-z-]+)`)? \| (.+?) \| (.+?) \|$/gm)].map((m) => ({ flag: [m[1], m[2], m[3]].filter(Boolean).join(" "), values: m[4], effect: m[5] }));
const sequences = [...cmdMd.matchAll(/^- (.+?): (`.+)$/gm)].map((m) => ({ name: m[1], chain: m[2].replace(/`/g, "") }));

// ---------- delivery gate ----------
const gateMd = read(path.join(SK, "gates", "delivery-gate.md"));
const scan = [...gateMd.matchAll(/^(\d+)\. (.+)$/gm)].map((m) => ({ n: +m[1], q: m[2].replace(/<!--.*?-->/g, "") })).filter((x, i, a) => a.findIndex((y) => y.n === x.n) === i && x.n <= 40);
const scanGroups = [];
{ let g = ""; for (const l of gateMd.split("## Part 2")[1].split("## Part 3")[0].split("\n")) { const h = l.match(/^\*\*(\w+)\*\*/); if (h) g = h[1]; const n = l.match(/^(\d+)\./); if (n) scanGroups.push({ n: +n[1], group: g }); } }
scan.forEach((s) => (s.group = scanGroups.find((g) => g.n === s.n)?.group || ""));
const gateChecks = [...gateMd.matchAll(/^\| `([a-z]+)` \| \*\*(.+?)\*\*(.*?) \| (.+?) \|$/gm)].map((m) => ({ code: m[1], name: m[2], fails: m[4].slice(0, 220) }));
const critiqueAxes = [...gateMd.matchAll(/^\| \*\*(\w)\*\*(\w+) \| (.+?) \| (.+?) \|$/gm)].map((m) => ({ axis: m[1], name: m[1] + m[2], q: m[3], five: m[4] }));

// ---------- dials ----------
const dialsMd = read(path.join(SK, "principles", "dials.md"));
const dials = [...dialsMd.matchAll(/^\| \*\*(ENERGY|RHYTHM|MOTION)\*\* \| (.+?) \| (.+?) \| (.+?) \| (.+?) \|$/gm)].map((m) => ({ dial: m[1], one: m[2], two: m[3], three: m[4], controls: m[5] }));
const dialExamples = [...dialsMd.matchAll(/^- (.+?): ENERGY (\d) · RHYTHM (\d) · MOTION (\d)$/gm)].map((m) => ({ name: m[1], energy: +m[2], rhythm: +m[3], motion: +m[4] }));

// ---------- styles ----------
const styles = csv("styles").map((s) => ({ ...s, body: read(path.join(SK, s.file)) }));

// ---------- signatures (with one-line + file) ----------
const signatures = csv("signatures");

// ---------- NOT-FOR, ABOUT, ACKNOWLEDGEMENTS, CONTRIBUTING ----------
const notFor = read(path.join(SRC, "NOT-FOR.md")).split("\n").filter((l) => l.startsWith("- ")).map((l) => { const m = l.match(/^- \*\*(.+?)\*\*\s*(.*)$/); return { rule: m[1], text: m[2] }; });
const aboutMd = read(path.join(SRC, "ABOUT.md"));
const about = [...aboutMd.matchAll(/^## (.+)\n\n([\s\S]*?)(?=\n## |\nNext:|$)/gm)].map((m) => ({ title: m[1], body: m[2].trim() }));
const ackMd = read(path.join(SRC, "ACKNOWLEDGEMENTS.md"));
const ackRows = [...ackMd.matchAll(/^\| \[(.+?)\]\((.+?)\) \| (.+?) \|(?: (.+?) \|)?$/gm)].map((m) => ({ name: m[1], url: m[2], what: m[3], where: m[4] || "" }));
const contrib = read(path.join(SRC, "CONTRIBUTING.md"));
const contribRules = [...contrib.matchAll(/^\d\. \*\*(.+?)\*\*\s*(.+)$/gm)].map((m) => ({ rule: m[1], text: m[2] }));
const goodFirst = contrib.split("## Good first contributions")[1]?.split("\n").filter((l) => l.startsWith("- ")).map((l) => l.slice(2)) || [];

// ---------- install paths (README) ----------
const readme = read(path.join(SRC, "README.md"));
const install = [
  { id: "project", agent: "Coding agents (this project)", cmd: "npx skills add asfakulsiam/asfakulsiam-motomation-design" },
  { id: "global", agent: "Coding agents (all your projects)", cmd: "npx skills add asfakulsiam/asfakulsiam-motomation-design -g" },
  { id: "agents", agent: "Specific agents", cmd: "npx skills add asfakulsiam/asfakulsiam-motomation-design -a claude-code -a cursor" },
  { id: "plugin-market", agent: "Claude Code plugin, step 1", cmd: "/plugin marketplace add asfakulsiam/asfakulsiam-motomation-design" },
  { id: "plugin-install", agent: "Claude Code plugin, step 2", cmd: "/plugin install asfakulsiam-motomation-design@asfakulsiam-motomation-design" },
  { id: "gemini", agent: "Gemini CLI extension", cmd: "gemini extensions install https://github.com/asfakulsiam/asfakulsiam-motomation-design" },
  { id: "dist", agent: "Chat and app builders", cmd: "dist/motomation-design.md" },
  { id: "lite", agent: "Small context windows", cmd: "dist/motomation-lite.md" },
  { id: "shadcn", agent: "One component (shadcn registry)", cmd: "npx shadcn@latest add https://raw.githubusercontent.com/asfakulsiam/asfakulsiam-motomation-design/main/registry/<id>.json" },
  { id: "update", agent: "Update", cmd: "npx skills update asfakulsiam-motomation-design" },
  { id: "gate-deps", agent: "Delivery Gate browser (once per project)", cmd: "npm i -D playwright && npx playwright install chromium" },
].map((x) => ({ ...x, verified: readme.includes(x.cmd.replace("<id>", "<id>")) }));
const chatTools = [...readme.split("### Chat and app builders")[1].split("**Small context?**")[0].matchAll(/^\| \*\*(.+?)\*\* \| (.+?) \|$/gm)].map((m) => ({ tool: m[1], where: m[2] }));
const agentsLine = (readme.match(/including \*\*(.+?)\*\*/) || [])[1] || "";
const liteTokens = (readme.match(/<!-- lite-tokens -->(.+?)<!--/) || [])[1] || "";

// ---------- evals ----------
const ev = path.join(SRC, "evals", "results");
const v3 = JSON.parse(read(path.join(ev, "2026-10-12-benchmark-v3", "summary.json")));
const v3pairs = [];
for (const [brief, b] of Object.entries(v3.briefs)) {
  for (const p of b.pairs || []) {
    const a = b.pair?.[0] || "baseline"; const s = b.pair?.[1] || "skill";
    v3pairs.push({ brief, seed: p.seed, a, b: s, aGated: p[a]?.gated, bGated: p[s]?.gated, aRaw: p[a]?.raw, bRaw: p[s]?.raw, aGates: p[a]?.gates || [], bGates: p[s]?.gates || [] });
  }
}
const readmeTable = [...readme.split("### Benchmark v3")[1].split("| Brief (mean gated")[0].matchAll(/^\| (.+?) \| \*{0,2}(\d+–\d+–\d+)\*{0,2} \| (.+?) \| (.+?) \|$/gm)].map((m) => ({ against: m[1].replace(/`/g, ""), wlt: m[2], gated: m[3], raw: m[4] }));
const briefTable = [...readme.matchAll(/^\| (0\d .+?) \| (.+? → .+?) \| (.+? → .+?) \| (.+? → .+?) \|$/gm)].map((m) => ({ brief: m[1], baseline: m[2], gated: m[3], matched: m[4] }));
const findings = readme.split("What v3 found, including where the skill lost:")[1].split("\n").filter((l) => l.startsWith("- ")).map((l) => l.slice(2).replace(/\*\*/g, ""));
const v5state = read(path.join(ev, "benchmark-v5", "STATE.md"));
const v5 = [...v5state.matchAll(/^\| (\d) \| (.+?) \| (.+?) \| (.+?) \| (.+?) \| (.+?) \|$/gm)].map((m) => ({ n: +m[1], tier: m[2], brief: m[3], status: m[4].replace(/[✅⬜]\s*/u, ""), agent: m[5], committed: m[6] }));
const v5summ = fs.readdirSync(path.join(ev, "benchmark-v5")).filter((d) => d.startsWith("tier-")).map((d) => {
  const t = read(path.join(ev, "benchmark-v5", d, "summary.md"));
  const g = (k) => (t.match(new RegExp(`^${k}:\\s+(.+)$`, "m")) || [])[1] || "";
  return { id: d, brief: g("Brief"), tier: g("Tier"), gate: g("Gate"), judge: g("Judge"), source: `evals/results/benchmark-v5/${d}/summary.md` };
});
const v1 = read(path.join(ev, "2026-10-11-benchmark.md"));
const v1line = (v1.match(/\*\*Result in one line:\*\* (.+)/) || [])[1] || "";
const v1rows = [...v1.matchAll(/^\| (.+? · brief \d+) \| (.+?) → \*\*(.+?)\*\* \| (.+?) → \*\*(.+?)\*\* \| (.+?) \| (.+?) \|$/gm)].map((m) => ({ brief: m[1], baseRaw: m[2], baseGated: m[3], skillRaw: m[4], skillGated: m[5], delta: m[6], failures: m[7] }));
const v2 = read(path.join(ev, "2026-10-11-benchmark-v2.md"));
const v2line = (v2.match(/\*\*(30 runs, 15 pairs.+?)\*\*(.+)/) || []);
const v4 = read(path.join(ev, "2026-10-12-benchmark-v4.md"));
const v4status = (v4.match(/\*\*Status: (.+?)\*\*/) || [])[1] || "";
const v4pairs = [...v4.matchAll(/^\| (matched vs skill.+?|baseline vs skill.+?) \| \*\*(\d+)\*\* \| (\d+) \| (\d+) \|$/gm)].map((m) => ({ comparison: m[1], built: +m[2], measured: +m[3], judged: +m[4] }));
const motion = read(path.join(ev, "2026-10-12-benchmark-v3-motion.md"));
const motionRows = [...motion.split("## Result")[1].split("**Mixed")[0].matchAll(/^\| (.+?) \| (.+?) \| (.+?) \|$/gm)].filter((m) => !m[1].startsWith("-") && m[1].trim()).map((m) => ({ metric: m[1].trim(), baseline: m[2].replace(/\*\*/g, "").trim(), skill: m[3].replace(/\*\*/g, "").trim() }));
const motionAxes = [...motion.matchAll(/^\| (Motion concept|Choreography|Mobile motion|Reduced-motion fallback|Motion craft) \| (.+?) \| (.+?) \|/gm)].map((m) => ({ axis: m[1], baseline: m[2], skill: m[3] }));
const codex = read(path.join(ev, "2026-10-12-benchmark-v3-codex.md"));
const codexRows = [...codex.split("## Result")[1].split("**The skill")[0].matchAll(/^\| (.+?) \| (.+?) \| (.+?) \|$/gm)].filter((m) => m[1].trim() && !m[1].startsWith("-")).map((m) => ({ metric: m[1].trim(), baseline: m[2].replace(/\*\*/g, ""), skill: m[3].replace(/\*\*/g, "") }));
const effort = [...read(path.join(ev, "2026-10-12-benchmark-v3.md")).matchAll(/^\| (Baseline \(no skill\)|Baseline \+ gate|Skill|Matched-effort baseline) \| 15 \| (.+?) \| (.+?) \| (.+?) \| (.+?) \|$/gm)].map((m) => ({ arm: m[1], turns: m[2], time: m[3], gateClean: m[4], hardFail: m[5] }));
const variety = read(path.join(ev, "2026-10-11-variety.md")).split("## Findings")[1].split("## A.")[0].split("\n").filter((l) => l.startsWith("- ")).map((l) => l.slice(2).replace(/\*\*/g, ""));

// ---------- examples (counts) ----------
const exDir = path.join(SK, "examples");
const examples = fs.readdirSync(exDir, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => ({ id: e.name, count: walk(path.join(exDir, e.name)).length }));

let commit = "";
try { commit = execSync("git rev-parse HEAD", { cwd: SRC }).toString().trim(); } catch {}

const fontsTbl = csv("fonts");
const scripts = [...new Set(fontsTbl.flatMap((f) => f.scripts.split(/\s+/).filter((s) => /^[a-z]+$/.test(s))))];
const coverage = scripts.map((s) => ({ script: s, fonts: fontsTbl.filter((f) => f.scripts.split(/\s+/).includes(s)).map((f) => f.name) }));

const repo = {
  meta: {
    name: "asfakulsiam-motomation-design", title: "Motomation Design", version, license: "MIT",
    url: "https://github.com/asfakulsiam/asfakulsiam-motomation-design", pages: "https://asfakulsiam.github.io/asfakulsiam-motomation-design/",
    commit, inventoried: new Date().toISOString().slice(0, 10), totalFiles: allFiles.length,
    description: (skillMd.match(/^description: (.+)$/m) || [])[1],
    job: (skillMd.match(/This skill has one job: \*\*(.+?)\*\*/) || [])[1],
  },
  author: { login: "asfakulsiam", name: "Asfakul Islam", bio: "Building Tomorrows Web Today with MERN Magic!", location: "Dhaka, Bangladesh", blog: "https://portfolio-siam-25.vercel.app/", url: "https://github.com/asfakulsiam", source: "GitHub REST API users/asfakulsiam, read " + new Date().toISOString().slice(0, 10) },
  laws, tiers: tierRows, flow, plan: planBlock, bans, houseStyle, scriptExamples,
  steps, summarySteps, commands, flags, sequences,
  scan, gateChecks, critiqueAxes, dials, dialExamples,
  folders, topLevel, examples,
  components: csv("components"), signatures, archetypes: csv("archetypes"), mutations: csv("mutations"), collisions: csv("collisions"),
  palettes: csv("palettes"), fonts: fontsTbl, scriptCoverage: coverage, styles, categories: csv("categories"), motion: csv("motion"), kinetics: csv("kinetics"), imagery: csv("imagery"), rules: csv("rules"),
  notFor, about, acknowledgements: ackRows, contributing: { rules: contribRules, goodFirst },
  install, chatTools, agentsLine, liteTokens,
  evals: {
    v1: { line: v1line, rows: v1rows, source: "evals/results/2026-10-11-benchmark.md" },
    v2: { line: (v2line[1] || "") + (v2line[2] || ""), source: "evals/results/2026-10-11-benchmark-v2.md" },
    v3: { headline: readmeTable, briefs: briefTable, findings, pairs: v3pairs, effort, source: "evals/results/2026-10-12-benchmark-v3.md + summary.json" },
    v3motion: { rows: motionRows, axes: motionAxes, source: "evals/results/2026-10-12-benchmark-v3-motion.md" },
    v3codex: { rows: codexRows, source: "evals/results/2026-10-12-benchmark-v3-codex.md" },
    v4: { status: v4status, pairs: v4pairs, caveat: "builds only, not scored", source: "evals/results/2026-10-12-benchmark-v4.md" },
    v5: { state: v5, summaries: v5summ, source: "evals/results/benchmark-v5/STATE.md" },
    variety: { findings: variety, source: "evals/results/2026-10-11-variety.md" },
  },
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(repo, null, 1));
const n = (k) => (Array.isArray(repo[k]) ? repo[k].length : 0);
console.log(`inventory: ${path.relative(ROOT, OUT)} · commit ${commit.slice(0, 7)} · v${version} · files ${allFiles.length} · components ${n("components")} · signatures ${n("signatures")} · archetypes ${n("archetypes")} · tiers ${n("tiers")} · steps ${n("steps")} · commands ${n("commands")} · install ${n("install")} · scan ${n("scan")} · palettes ${n("palettes")} · fonts ${n("fonts")}`);

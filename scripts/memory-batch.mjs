// Runs the skill's memory check (and logs the run) for a list of exhibit slugs, appending to docs/memory-checks.txt.
import { readFileSync, appendFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
const src = readFileSync("src/content/exhibits.ts", "utf8");
const MEM = "../skill-src/skills/asfakulsiam-motomation-design/scripts/memory.mjs";
for (const slug of process.argv.slice(2)) {
  const i = src.indexOf(`slug: "${slug}"`); const block = src.slice(i, src.indexOf("\n  },", i));
  const g = (re) => (block.match(re) || [])[1];
  const args = ["--page", `exhibit-${slug}`, "--archetype", g(/archetype: "([^"]+)"/), "--signature", g(/signature: "([^"]+)"/), "--fonts", `${g(/display: "([^"]+)"/)}/${g(/text: "([^"]+)"/)}`, "--palette", g(/palette: \{ name: "([^"]+)"/), "--tier", g(/tier: (\d)/), "--project", "."];
  let out = "";
  for (const cmd of ["check", "log"]) { try { out += execFileSync("node", [MEM, cmd, ...args], { encoding: "utf8" }); } catch (e) { out += (e.stdout || "") + (e.stderr || ""); } }
  appendFileSync("docs/memory-checks.txt", `\n=== exhibit ${slug} ===\n${out}`); console.log(slug, out.includes("✗") ? "COLLISION" : "fresh");
}

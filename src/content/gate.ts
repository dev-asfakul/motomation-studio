// Delivery gate results per page, written by scripts/gate-summary.mjs from docs/gate/*.json (real browser scans).
import fs from "node:fs";
import path from "node:path";
import type { GateSummary } from "@/components/exhibit/ExhibitShell";
export function gateFor(route: string): GateSummary {
  try {
    const all = JSON.parse(fs.readFileSync(path.join(process.cwd(), "content/gate-results.json"), "utf8")) as Record<string, GateSummary>;
    return all[route] ?? null;
  } catch { return null; }
}

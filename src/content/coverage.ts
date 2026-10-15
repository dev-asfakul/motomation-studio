// Coverage rule: every component, signature, tier, archetype, Thinking Sequence step, command and install path
// appears somewhere on the site. This map says where. scripts/coverage.mjs checks it against the built HTML
// (data-ev attributes) and writes coverage.json; CI fails if anything is missing.
import { repo } from "./repo";
import { EXHIBITS } from "./exhibits";

export type Kind = "component" | "signature" | "tier" | "archetype" | "step" | "command" | "install";
export const KINDS: { kind: Kind; label: string; total: number }[] = [
  { kind: "component", label: "Components", total: repo.components.length },
  { kind: "signature", label: "Signatures", total: repo.signatures.length },
  { kind: "tier", label: "Tiers", total: repo.tiers.length },
  { kind: "archetype", label: "Archetypes", total: repo.archetypes.length },
  { kind: "step", label: "Thinking steps", total: repo.steps.length },
  { kind: "command", label: "Commands", total: repo.commands.length },
  { kind: "install", label: "Install paths", total: repo.install.length },
];
export const ev = (kind: Kind, id: string | number) => `${kind}:${id}`;

export function where(): Record<string, string[]> {
  const w: Record<string, string[]> = {};
  const add = (k: string, page: string) => { (w[k] ||= []).includes(page) || w[k].push(page); };
  repo.components.forEach((c) => add(ev("component", c.id), "/lab/"));
  repo.signatures.forEach((s) => add(ev("signature", s.id), "/autopsy/"));
  repo.tiers.forEach((t) => add(ev("tier", t.tier), "/autopsy/"));
  repo.archetypes.forEach((a) => add(ev("archetype", a.id), "/board/"));
  repo.steps.forEach((s) => add(ev("step", s.n), "/method/"));
  repo.commands.forEach((c) => add(ev("command", c.cmd.slice(1)), "/autopsy/"));
  repo.install.forEach((_, i) => add(ev("install", i + 1), "/locker/"));
  EXHIBITS.forEach((e) => {
    const p = `/exhibits/${e.slug}/`;
    add(ev("archetype", e.archetype), p);
    if (repo.signatures.some((s) => s.id === e.signature)) add(ev("signature", e.signature), p);
    add(ev("tier", e.tier), p);
    e.components.forEach((c) => add(ev("component", c), p));
    e.commands.forEach((c) => add(ev("command", c.slice(1)), p));
  });
  return w;
}

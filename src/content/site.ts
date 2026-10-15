import { EXHIBITS, type Swap } from "./exhibits";
import { repo } from "./repo";
import type { SearchItem } from "@/components/bureau/CommandPalette";

export const PAGES: { href: string; name: string; note: string; swap: Swap }[] = [
  { href: "/", name: "Case Opening", note: "Room 01 · the lineup", swap: "film-burn" },
  { href: "/board/", name: "Evidence Board", note: "Room 02 · red string", swap: "tape-peel" },
  { href: "/autopsy/", name: "Autopsy", note: "Room 03 · the repo opened", swap: "scan-line" },
  { href: "/method/", name: "Method", note: "Room 04 · interrogation", swap: "redaction" },
  { href: "/lab/", name: "Lab", note: "Room 05 · 68 specimens", swap: "polaroid" },
  { href: "/receipts/", name: "Receipts", note: "Room 06 · benchmarks", swap: "shutter" },
  { href: "/locker/", name: "Locker", note: "Room 07 · install procedure", swap: "tape-peel" },
  { href: "/dossier/", name: "Dossier", note: "Room 08 · author, licence, ruled out", swap: "redaction" },
  { href: "/credits/", name: "Credits", note: "Room 09 · chain of custody", swap: "dust-brush" },
];

export function searchIndex(): SearchItem[] {
  const s: SearchItem[] = [];
  PAGES.forEach((p) => s.push({ kind: "Room", title: p.name, note: p.note, href: p.href }));
  EXHIBITS.forEach((e) => s.push({ kind: `Exhibit ${e.letter}`, title: `${e.style}: ${e.title}`, note: `${e.archetype} · ${e.signature} · Tier ${e.tier}`, href: `/exhibits/${e.slug}/` }));
  repo.components.forEach((c) => s.push({ kind: "Component", title: c.name, note: `${c.family} · Tier ${c.tier} · ${c.what}`, href: `/lab/#c-${c.id}` }));
  repo.signatures.forEach((g) => s.push({ kind: "Signature", title: g.name, note: `${g.family} · ${g.one_line}`, href: `/autopsy/#sig-${g.id}` }));
  repo.commands.forEach((c) => s.push({ kind: "Command", title: c.cmd, note: c.what, href: `/autopsy/#cmd-${c.cmd.slice(1)}` }));
  repo.install.forEach((x, i) => s.push({ kind: "Install", title: x.agent, note: x.cmd, href: `/locker/#p-${i + 1}` }));
  repo.archetypes.forEach((a) => s.push({ kind: "Archetype", title: a.name, note: a.shape, href: `/board/#arch-${a.id}` }));
  repo.tiers.forEach((t) => s.push({ kind: "Tier", title: `Tier ${t.tier} · ${t.name}`, note: t.when, href: `/autopsy/#tier-${t.tier}` }));
  repo.steps.forEach((t) => s.push({ kind: "Step", title: `${t.n}. ${t.name}`, note: "Thinking Sequence", href: `/method/#step-${t.n}` }));
  return s;
}

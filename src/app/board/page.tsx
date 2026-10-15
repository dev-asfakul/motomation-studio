import type { Metadata } from "next";
import "../rooms.css";
import "@/components/rooms/board.css";
import { RoomHead } from "@/components/rooms/RoomHead";
import { Board, type BoardCard } from "@/components/rooms/Board";
import { Witness } from "@/components/bureau/EvidenceLog";
import { EXHIBITS } from "@/content/exhibits";
import { repo } from "@/content/repo";
import { FAMILIES } from "@/content/families";
import { ev } from "@/content/coverage";

export const metadata: Metadata = { title: "Evidence board", description: "All twenty exhibits pinned to one board, strung to their motion tier and the component families they borrow from. Filter by style, tier or family.", alternates: { canonical: "/board/" } };

export default function Page() {
  const fam = Object.fromEntries(repo.components.map((c) => [c.id, c.family]));
  const arch = Object.fromEntries(repo.archetypes.map((a) => [a.id, a.name.replace(/^The /, "")]));
  const cards: BoardCard[] = EXHIBITS.map((e) => ({
    letter: e.letter, slug: e.slug, style: e.style, title: e.title, verdict: e.verdict, archetype: e.archetype, archetypeName: arch[e.archetype] ?? e.archetype,
    tier: e.tier, families: [...new Set(e.components.map((c) => fam[c]).filter(Boolean))], components: e.components,
    ground: e.palette.ground, ink: e.palette.ink, accent: e.palette.accent, surface: e.palette.surface,
  }));
  const families = FAMILIES.map((f) => ({ ...f, count: repo.components.filter((c) => c.family === f.id).length }));
  const tiers = repo.tiers.map((t) => ({ tier: Number(t.tier), name: t.name }));
  const used = new Set(EXHIBITS.map((e) => e.archetype));
  return (
    <div className="room">
      <Witness ids={EXHIBITS.map((e) => ev("archetype", e.archetype))} />
      <RoomHead fit={6} compact n="02" room="Evidence board" title={<>Follow the <em>red string</em></>}
        lede={`Twenty exhibits, ${tiers.length} tier pins, ${families.length} component families. Every string is a real dependency: the tier an exhibit runs at and the families of the skill components it borrows.`}
        aside={`Each exhibit uses a different one of the skill's ${repo.archetypes.length} layout archetypes. ${used.size} of ${repo.archetypes.length} are pinned here; none repeats.`}
        uv="nobody ever asked the string what it thinks. It holds the whole case together and gets no credit." />
      <Board cards={cards} tiers={tiers} families={families} />
      <section className="sec" aria-labelledby="arch-h">
        <p className="label">Structures on file</p>
        <h2 id="arch-h" className="sec-h">The {repo.archetypes.length} archetypes, and who used each</h2>
        <ul className="cards">
          {repo.archetypes.map((a) => { const e = EXHIBITS.find((x) => x.archetype === a.id); return (
            <li key={a.id} id={`arch-${a.id}`} className="card anchor" data-ev={ev("archetype", a.id)}>
              <div className="card-k"><h3>{a.name}</h3>{e && <a className="marker" href={`/exhibits/${e.slug}/`} aria-label={`Exhibit ${e.letter}`}>{e.letter}</a>}</div>
              <p>{a.shape[0].toUpperCase() + a.shape.slice(1)}.</p>
              <p className="muted">Best for {a.best_for}. Signature potential: {a.signature_potential}.</p>
            </li>); })}
        </ul>
      </section>
    </div>
  );
}

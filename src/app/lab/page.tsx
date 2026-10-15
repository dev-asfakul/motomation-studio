import type { Metadata } from "next";
import "../rooms.css";
import "@/components/rooms/autopsy.css";
import "@/components/rooms/lab.css";
import { RoomHead } from "@/components/rooms/RoomHead";
import { LabRoom, type LabComp, type MorphEx } from "@/components/rooms/LabRoom";
import { Witness } from "@/components/bureau/EvidenceLog";
import { repo } from "@/content/repo";
import { EXHIBITS } from "@/content/exhibits";
import { FAMILIES } from "@/content/families";
import { ev } from "@/content/coverage";
import originals from "@content/originals.json";

export const metadata: Metadata = { title: "Lab", description: "All 68 Motomation components running live, three dials that retune the room, a bench that blends two exhibits and measures the result, and 41 new components filed as contribution candidates.", alternates: { canonical: "/lab/" } };

type Orig = { id: string; name: string; family: string; tier: string; deps: string; what: string; "use-when": string; "avoid-when": string; "reduced-motion": string; touch: string; a11y: string; status: string; file: string; lines: number };

export default function Page() {
  const comps: LabComp[] = repo.components.map((c) => ({ id: c.id, name: c.name, family: c.family, tier: c.tier, what: c.what, use_when: c.use_when, avoid_when: c.avoid_when, reduced_motion: c.reduced_motion, file: c.file,
    usedIn: EXHIBITS.filter((e) => e.components.includes(c.id)).map((e) => ({ letter: e.letter, slug: e.slug })) }));
  const ex: MorphEx[] = EXHIBITS.map((e) => ({ letter: e.letter, slug: e.slug, style: e.style, title: e.title, display: e.fonts.display, text: e.fonts.text, ground: e.palette.ground, ink: e.palette.ink, accent: e.palette.accent, muted: e.palette.muted }));
  const orig = originals as Orig[];
  const home = (id: string) => EXHIBITS.find((e) => e.originals.includes(id));
  const famT = Object.fromEntries(FAMILIES.map((f) => [f.id, f.title]));
  const used = new Set(EXHIBITS.flatMap((e) => e.components));
  return (
    <div className="room">
      <Witness ids={repo.components.map((c) => ev("component", c.id))} />
      <RoomHead fit={10} compact n="05" room="Lab" title={<>{repo.components.length} specimens, <em>all alive</em></>}
        lede={`Every component the skill ships, running here, in ${FAMILIES.length} families. ${used.size} of them were also taken apart and rebuilt inside an exhibit. Then ${orig.length} new ones, filed as candidates to contribute back.`}
        aside="The dials retune this room and are remembered for the rest of the case. Motion 1 is a real Tier 1: every specimen switches to the reduced-motion version its author wrote."
        uv="no specimen was harmed. Two were mildly embarrassed by their own tier numbers." />
      <LabRoom comps={comps} families={FAMILIES} exhibits={ex} />
      <section className="sec" aria-labelledby="orig-h" id="originals">
        <p className="label">New on file · {orig.length} originals</p>
        <h2 id="orig-h" className="sec-h">Built for this case, offered back</h2>
        <p className="sec-lede">One strict TypeScript React file each, with the header the skill asks of every component: tier, when to use it, when it becomes slop, the reduced-motion version, touch and accessibility. Each runs inside the exhibit that needed it.</p>
        <ul className="cards orig-cards">{orig.map((o) => { const e = home(o.id); return (
          <li key={o.id} id={`o-${o.id}`} className="card anchor">
            <div className="card-k"><h3>{o.name}</h3><span className="label">{famT[o.family] ?? o.family} · T{o.tier}</span></div>
            <p>{o.what}</p>
            <details className="lab-notes"><summary className="label">Header</summary>
              <dl><div><dt>Use when</dt><dd>{o["use-when"]}</dd></div><div><dt>Avoid when</dt><dd>{o["avoid-when"]}</dd></div><div><dt>Reduced motion</dt><dd>{o["reduced-motion"]}</dd></div><div><dt>Touch</dt><dd>{o.touch}</dd></div><div><dt>Accessibility</dt><dd>{o.a11y}</dd></div><div><dt>Depends on</dt><dd><code>{o.deps}</code></dd></div></dl>
              <p className="mono" style={{ fontSize: 12 }}><a href={`https://github.com/dev-asfakul/motomation-studio/blob/main/${o.file}`}>{o.file}</a> · {o.lines} lines</p>
            </details>
            <p className="label">{e ? <>Working in <a href={`/exhibits/${e.slug}/`}>exhibit {e.letter}</a></> : <>Working in the Bureau frame: the case number</>}</p>
          </li>); })}</ul>
      </section>
    </div>
  );
}

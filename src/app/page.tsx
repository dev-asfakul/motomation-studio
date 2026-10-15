import "@/components/home/home.css";
import { Lineup, type Suspect } from "@/components/home/Lineup";
import { Witness } from "@/components/bureau/EvidenceLog";
import { EXHIBITS, BY_LETTER, LINEUP } from "@/content/exhibits";
import { repo } from "@/content/repo";
import { ev } from "@/content/coverage";
import marks from "@content/wordmarks.json";

type Mark = { width: number; capHeight: number; glyphs: { d: string }[] };

export default function Home() {
  const b = (marks as unknown as Record<string, Mark>).BUREAU;
  const suspects: Suspect[] = LINEUP.map((l) => {
    const e = BY_LETTER[l];
    return { letter: e.letter, slug: e.slug, style: e.style, title: e.title, display: e.fonts.display, palette: e.palette.name, ground: e.palette.ground, ink: e.palette.ink, accent: e.palette.accent, verdict: e.verdict };
  });
  const counts = [
    { n: repo.components.length, what: "components, each a working specimen in the Lab", href: "/lab/" },
    { n: repo.signatures.length, what: "signature moves, catalogued in the Autopsy", href: "/autopsy/#signatures" },
    { n: repo.tiers.length, what: "motion tiers, and a rule to pick the lowest that delivers", href: "/autopsy/#tiers" },
    { n: repo.archetypes.length, what: "layout archetypes, one per exhibit, none repeated", href: "/board/" },
  ];
  return (
    <div className="home">
      <Witness ids={[ev("tier", 5), ev("archetype", "gallery-wall")]} />
      <section className="cover" aria-labelledby="cover-h">
        <div className="cover-top"><span className="tag">Case file · opened</span><span className="label">{repo.meta.name} v{repo.meta.version}</span></div>
        <svg className="cover-mark" viewBox={`-6 ${-b.capHeight - 6} ${b.width + 12} ${b.capHeight + 12}`} role="img" aria-label="MOTOMATION">
          {b.glyphs.map((g, i) => <path key={i} d={g.d} fill="currentColor" />)}
        </svg>
        <h1 id="cover-h">Taste can&rsquo;t be proven in words. So we put the repo <em>on the table</em>.</h1>
        <div className="cover-file">
          <dl>
            <div><dt>Subject</dt><dd>Motomation Design, an agent skill whose job is that {repo.meta.job.replace(/\.$/, "")}.</dd></div>
            <div><dt>On file</dt><dd>{repo.meta.totalFiles.toLocaleString("en-US")} files, read at commit <code>{repo.meta.commit.slice(0, 7)}</code></dd></div>
            <div><dt>Exhibits</dt><dd>20 styles, lettered A to T</dd></div>
            <div><dt>Investigator</dt><dd>You. Press U for the UV torch.</dd></div>
          </dl>
          <p className="uv-note">UV: the first line is a dare. The rest of the site is the evidence.</p>
        </div>
        <p className="cover-hint label"><span className="marker">01</span> Scroll to run the lineup</p>
      </section>

      <Lineup suspects={suspects} />

      <section className="landing" aria-labelledby="landing-h">
        <h2 id="landing-h">Pin it to the board.</h2>
        <p className="landing-lede">Every number below is counted from the repo, not typed. Follow a string to the room where that evidence is laid out, or open the board and see how the twenty exhibits connect.</p>
        <ul className="counts">
          {counts.map((c) => (
            <li key={c.href}><b>{c.n}</b><a href={c.href}>{c.what}</a></li>
          ))}
        </ul>
        <div className="landing-cta">
          <a className="btn" href="/board/">Open the evidence board</a>
          <a className="btn ghost" href={`/exhibits/${EXHIBITS[0].slug}/`}>Start with exhibit A</a>
        </div>
      </section>

      <section className="charges" aria-labelledby="charges-h">
        <p className="label">Charge sheet · the skill&rsquo;s {repo.laws.length} laws</p>
        <h2 id="charges-h" className="display" style={{ fontSize: "var(--step-3)", margin: "10px 0 28px" }}>What the skill is accused of</h2>
        <ol>
          {repo.laws.map((l) => (
            <li key={l.n}><span className="marker">{l.n}</span><h3>{l.title}</h3><p>{l.text}</p></li>
          ))}
        </ol>
      </section>

      <section className="filed" aria-labelledby="filed-h">
        <div className="wrap"><p className="label">Filed exhibits</p><h2 id="filed-h" className="display" style={{ fontSize: "var(--step-3)", margin: "10px 0 28px" }}>A to T, as filed</h2></div>
        <ol>
          {EXHIBITS.map((e) => (
            <li key={e.letter}><a href={`/exhibits/${e.slug}/`}>
              <span className="marker">{e.letter}</span>
              <span className="f-style">{e.style}</span>
              <span className="f-title">{e.title}. {e.verdict}</span>
              <span className="f-ix label">Tier {e.tier}</span>
            </a></li>
          ))}
        </ol>
      </section>
    </div>
  );
}

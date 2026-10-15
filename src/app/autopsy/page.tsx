import type { Metadata } from "next";
import "../rooms.css";
import "@/components/rooms/autopsy.css";
import { RoomHead } from "@/components/rooms/RoomHead";
import { TreeNav, CollisionEngine, DialsDemo, ContrastProbe } from "@/components/rooms/AutopsyKit";
import { Md, dash } from "@/components/rooms/Md";
import { Witness } from "@/components/bureau/EvidenceLog";
import { repo } from "@/content/repo";
import { EXHIBITS } from "@/content/exhibits";
import { ev } from "@/content/coverage";
import { ratio, fmt } from "@/lib/contrast";

export const metadata: Metadata = { title: "Autopsy", description: "The Motomation Design repo opened folder by folder: Thinking Sequence, collision engine, five tiers, 22 signatures, dials, the gate and every command.", alternates: { canonical: "/autopsy/" } };

const GH = "https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/main/";
const short = (p: string) => p.replace("skills/asfakulsiam-motomation-design/", "");

function Folder({ id, title, children, lede }: { id: string; title: string; lede: React.ReactNode; children: React.ReactNode }) {
  const f = repo.folders.find((x) => x.id === id)!;
  return (
    <section id={`f-${id}`} className="sec folder anchor" aria-labelledby={`fh-${id}`}>
      <p className="label">Lab report · <code>{short(f.path)}/</code> · {f.count} files · {f.lines.toLocaleString("en-US")} lines</p>
      <h2 id={`fh-${id}`} className="sec-h">{title}</h2>
      <p className="sec-lede">{lede}</p>
      {children}
      <details className="files">
        <summary className="label">Files in this folder ({f.files.length})</summary>
        <ul>{f.files.map((x) => <li key={x.path}><a href={GH + x.path}><code>{x.name}</code></a> <span className="muted">{x.heading} · {x.lines} lines</span></li>)}</ul>
      </details>
    </section>
  );
}

export default function Page() {
  const folders = repo.folders.map((f) => ({ id: f.id, name: f.id, count: f.count }));
  const sigUsers = (id: string) => EXHIBITS.filter((e) => e.signature === id || e.components.includes(id));
  const sigFam = [...new Set(repo.signatures.map((s) => s.family))];
  const cmdGroups = [...new Set(repo.commands.map((c) => c.group))];
  const scripts = repo.scriptCoverage;
  const ids = [...repo.signatures.map((s) => ev("signature", s.id)), ...repo.tiers.map((t) => ev("tier", t.tier)), ...repo.commands.map((c) => ev("command", c.cmd.slice(1)))];
  return (
    <div className="room">
      <Witness ids={ids} />
      <RoomHead fit={6} n="03" room="Autopsy" title={<>The repo, <em>opened</em></>}
        lede={`${repo.folders.length} folders, read file by file. Each gets a lab report and, where the folder does something, a live demo that does it in front of you.`}
        aside={<>Read from <a href={repo.meta.url}>{repo.meta.name}</a> v{repo.meta.version} at <code>{repo.meta.commit.slice(0, 7)}</code>. {repo.meta.totalFiles.toLocaleString("en-US")} files in the repo; the skill itself lives in <code>skills/asfakulsiam-motomation-design/</code>.</>}
        uv="the coroner's note says cause of death: a hero with three equal feature cards." />
      <div className="report">
        <aside className="report-nav"><TreeNav folders={folders} /></aside>
        <div className="report-body">

          <Folder id="thinking" title="The Thinking Sequence" lede={<>Before any UI code, the skill reads the room and runs {repo.steps.length} steps. The <a href="/method/">Method</a> room runs them on this site, live.</>}>
            <ol className="steps">{repo.flow.map((s) => (
              <li key={s.n} data-ev={ev("step", s.n)}><span className="marker">{s.n}</span><div><h3>{s.name}</h3><p className="muted"><a href={GH + "skills/asfakulsiam-motomation-design/" + s.file}><code>{s.file}</code></a> · output: {s.output}</p></div></li>))}</ol>
          </Folder>

          <Folder id="invention" title="The collision engine" lede={<>Mad Artist Mode starts a design from a random constraint instead of the most likely one. This is a port of <code>scripts/collide.mjs</code>: same generator, same draw order, drawn from the repo&rsquo;s {repo.collisions.length} collisions, {repo.mutations.length} mutations, {repo.archetypes.length} archetypes and {repo.kinetics.length} kinetics.</>}>
            <CollisionEngine archetypes={repo.archetypes} mutations={repo.mutations} collisions={repo.collisions} kinetics={repo.kinetics} signatures={repo.signatures} />
            <h3 className="sec-h3">The {repo.mutations.length} mutations</h3>
            <ul className="cards">{repo.mutations.map((m) => <li key={m.id} className="card"><h3>{m.name}</h3><p>{m.operator}.</p><p className="muted">For example: {m.example}.</p></li>)}</ul>
          </Folder>

          <Folder id="structures" title="Twenty page archetypes" lede={<>A page shape is chosen, not defaulted to. All {repo.archetypes.length} are pinned on the <a href="/board/#arch-h">evidence board</a>, one per exhibit.</>}>
            <ul className="chips">{repo.archetypes.map((a) => <li key={a.id}><a className="chip" href={`/board/#arch-${a.id}`}>{a.name.replace(/^The /, "")}</a></li>)}</ul>
          </Folder>

          <Folder id="principles" title="Laws, house style and the dials" lede={<>Five laws, a house style and three dials that set how loud, how varied and how animated a page is.</>}>
            <ol className="laws">{repo.laws.map((l) => <li key={l.n}><span className="marker">{l.n}</span><div><h3>{l.title}</h3><p><Md s={l.text} /></p></div></li>)}</ol>
            <h3 className="sec-h3">House style</h3>
            <ul className="prose ticks">{repo.houseStyle.map((h, i) => <li key={i}><Md s={h} /></li>)}</ul>
            <h3 className="sec-h3">The dials, live</h3>
            <DialsDemo dials={repo.dials} examples={repo.dialExamples} />
            <h3 className="sec-h3">Banned on sight</h3>
            <ul className="prose ticks bans">{repo.bans.map((b, i) => <li key={i}><Md s={b} /></li>)}</ul>
          </Folder>

          <Folder id="motion" title="Five tiers, and the lowest that delivers" lede={<>Every page picks the lowest tier that delivers the idea. {repo.motion.length} motion recipes sit in <code>data/motion.csv</code>; UI feedback never runs longer than {repo.rules.find((r) => r.key === "ui_feedback_max_ms")?.value ?? "250"}ms.</>}>
            <ol id="tiers" className="tiers anchor">{repo.tiers.map((t) => { const used = EXHIBITS.filter((e) => e.tier === Number(t.tier)); return (
              <li key={t.tier} id={`tier-${t.tier}`} className="anchor tier" data-ev={ev("tier", t.tier)}>
                <span className="tier-n">{t.tier}</span>
                <div><h3>{t.name}</h3><p><Md s={t.tools} /></p><p className="muted">When: <Md s={t.when} /></p>
                  <p className="label" style={{ marginTop: 8 }}>{used.length ? <>Exhibits at this tier: {used.map((e, i) => <span key={e.letter}>{i ? ", " : ""}<a href={`/exhibits/${e.slug}/`}>{e.letter}</a></span>)}</> : "No exhibit needed it alone; every exhibit's idea needed at least Tier 2"}</p></div>
              </li>); })}</ol>
            <h3 className="sec-h3">The motion register</h3>
            <div className="reg-wrap" tabIndex={0} role="region" aria-label="Motion recipes">
              <table className="reg"><caption>data/motion.csv · {repo.motion.length} rows</caption>
                <thead><tr><th>Recipe</th><th className="num">Tier</th><th>Trigger</th><th>Technique</th><th className="num">Duration</th><th>Reduced motion</th></tr></thead>
                <tbody>{repo.motion.map((m) => <tr key={m.id}><td>{m.name}</td><td className="num">{m.tier}</td><td>{m.trigger}</td><td>{m.technique}</td><td className="num">{m.duration}</td><td>{dash(m.reduced_fallback)}</td></tr>)}</tbody>
              </table>
            </div>
          </Folder>

          <Folder id="signatures" title="Twenty-two signature moves" lede={<>The one detail a visitor remembers. Each exhibit bends one; the Lab shows the ones that ship as components.</>}>
            <div id="signatures" className="anchor" />
            {sigFam.map((fam) => (
              <div key={fam}>
                <h3 className="sec-h3">{fam[0].toUpperCase() + fam.slice(1)}</h3>
                <ul className="cards">{repo.signatures.filter((s) => s.family === fam).map((s) => { const u = sigUsers(s.id); return (
                  <li key={s.id} id={`sig-${s.id}`} className="card anchor" data-ev={ev("signature", s.id)}>
                    <div className="card-k"><h3>{s.name}</h3><span className="label">T{s.tier}</span></div>
                    <p>{s.one_line[0].toUpperCase() + s.one_line.slice(1)}.</p>
                    <p className="muted">Good for {s.good_for}. <a href={GH + "skills/asfakulsiam-motomation-design/" + s.file}><code>{s.file}</code></a></p>
                    {u.length > 0 && <p className="label">In exhibit {u.map((e, i) => <span key={e.letter}>{i ? ", " : ""}<a href={`/exhibits/${e.slug}/`}>{e.letter}</a></span>)}</p>}
                  </li>); })}</ul>
              </div>
            ))}
          </Folder>

          <Folder id="styles" title="Ten styles on file, sixteen added" lede={<>The skill ships {repo.styles.length} style files. The brief asked for twenty styles; the {EXHIBITS.filter((e) => e.styleSource === "extension").length} it does not have were written in the skill&rsquo;s own format, kept in <a href="https://github.com/dev-asfakul/motomation-studio/tree/main/skill-extensions"><code>skill-extensions/</code></a> and labelled as extensions wherever they appear.</>}>
            <div className="reg-wrap" tabIndex={0} role="region" aria-label="Styles">
              <table className="reg"><thead><tr><th>Style</th><th>Source</th><th>Energy</th><th>Rhythm</th><th>Motion</th><th>Type</th><th>Exhibit</th></tr></thead>
                <tbody>
                  {repo.styles.map((s) => { const e = EXHIBITS.find((x) => x.styleFile.endsWith(`/${s.id}.md`)); return <tr key={s.id}><td><a href={GH + "skills/asfakulsiam-motomation-design/" + s.file}>{s.name}</a></td><td>skill</td><td>{s.energy}</td><td>{s.rhythm}</td><td>{s.motion}</td><td>{s.type_hint}</td><td>{e ? <a href={`/exhibits/${e.slug}/`}>{e.letter}</a> : "none"}</td></tr>; })}
                  {EXHIBITS.filter((e) => e.styleSource === "extension").map((e) => <tr key={e.slug}><td><a href={`https://github.com/dev-asfakul/motomation-studio/blob/main/${e.styleFile}`}>{e.style}</a></td><td>extension</td><td>{e.dials.energy}</td><td>{e.dials.rhythm}</td><td>{e.dials.motion}</td><td>{e.fonts.display} + {e.fonts.text}</td><td><a href={`/exhibits/${e.slug}/`}>{e.letter}</a></td></tr>)}
                </tbody>
              </table>
            </div>
          </Folder>

          <Folder id="categories" title="Twelve kinds of site" lede={<>Each category sets starting dials, likely archetypes and signatures. Starting points, not answers.</>}>
            <div className="reg-wrap" tabIndex={0} role="region" aria-label="Categories">
              <table className="reg"><thead><tr><th>Category</th><th>Its job</th><th className="num">E</th><th className="num">R</th><th className="num">M</th><th>Archetypes</th></tr></thead>
                <tbody>{repo.categories.map((c) => <tr key={c.id}><td>{c.name}</td><td>{c.job}</td><td className="num">{c.energy}</td><td className="num">{c.rhythm}</td><td className="num">{c.motion}</td><td>{c.archetypes.split(" ").join(", ")}</td></tr>)}</tbody>
              </table>
            </div>
          </Folder>

          <Folder id="craft" title="Craft: the parts nobody photographs" lede={<>Accessibility, copy, mobile motion, performance, SEO, security. Plus an imagery brief per category, so a page never ships stock desks and laptops.</>}>
            <div className="reg-wrap" tabIndex={0} role="region" aria-label="Imagery direction">
              <table className="reg"><caption>data/imagery.csv · {repo.imagery.length} rows</caption><thead><tr><th>Category</th><th>Mode</th><th>Subject</th><th>Avoid</th></tr></thead>
                <tbody>{repo.imagery.map((m) => <tr key={m.id}><td>{m.id}</td><td>{m.mode}</td><td>{m.subject}</td><td>{m.avoid}</td></tr>)}</tbody></table>
            </div>
          </Folder>

          <Folder id="gates" title="The delivery gate" lede={<>Nothing ships until <code>scripts/gate.mjs</code> passes {repo.gateChecks.length} hard checks, a {repo.scan.length}-question slop scan is answered, and a critique scores {repo.critiqueAxes.length} axes. Try check c yourself.</>}>
            <ContrastProbe />
            <h3 className="sec-h3">Hard checks</h3>
            <div className="reg-wrap" tabIndex={0} role="region" aria-label="Gate checks">
              <table className="reg"><thead><tr><th>Code</th><th>Check</th><th>Fails when</th></tr></thead>
                <tbody>{repo.gateChecks.map((g) => <tr key={g.code}><td><code>{g.code}</code></td><td>{g.name}</td><td><Md s={g.fails} /></td></tr>)}</tbody></table>
            </div>
            <h3 className="sec-h3">The slop scan, {repo.scan.length} questions</h3>
            <ol className="scan">{repo.scan.map((q) => <li key={q.n}><span className="label">{q.group}</span> <Md s={q.q} /></li>)}</ol>
            <h3 className="sec-h3">Critique axes</h3>
            <ul className="cards">{repo.critiqueAxes.map((a) => <li key={a.axis} className="card"><div className="card-k"><h3>{a.name}</h3><span className="marker">{a.axis}</span></div><p>{a.q}</p><p className="muted">A 5 means: {a.five}.</p></li>)}</ul>
          </Folder>

          <Folder id="commands" title="Twenty-one commands" lede={<>Slash commands the agent understands, with {repo.flags.length} flags and {repo.sequences.length} standard sequences.</>}>
            {cmdGroups.map((g) => (
              <div key={g}><h3 className="sec-h3">{g}</h3>
                <ul className="cards">{repo.commands.filter((c) => c.group === g).map((c) => (
                  <li key={c.cmd} id={`cmd-${c.cmd.slice(1)}`} className="card anchor" data-ev={ev("command", c.cmd.slice(1))}>
                    <h3 className="mono">{c.cmd} <span className="muted" style={{ fontWeight: 400 }}>{c.arg}</span></h3>
                    <p><Md s={c.what[0].toUpperCase() + c.what.slice(1)} /></p>
                    <p className="muted">When: <Md s={c.when} /></p>
                    <p className="muted">Output: <Md s={c.output} /></p>
                  </li>))}</ul></div>
            ))}
            <h3 className="sec-h3">Flags and sequences</h3>
            <div className="reg-wrap" tabIndex={0} role="region" aria-label="Flags">
              <table className="reg"><thead><tr><th>Flag</th><th>Values</th><th>Effect</th></tr></thead>
                <tbody>{repo.flags.map((f) => <tr key={f.flag}><td><code>{f.flag}</code></td><td>{dash(f.values)}</td><td><Md s={f.effect} /></td></tr>)}</tbody></table>
            </div>
            <ul className="seqs">{repo.sequences.map((s) => <li key={s.name}><span className="label">{s.name}</span><code>{s.chain}</code></li>)}</ul>
          </Folder>

          <Folder id="adapters" title="Adapters: one per stack" lede={<>The design is decided once; the adapter says how to build it in Next.js, Astro, React with Vite, plain HTML, or a site builder. This site used <a href={GH + "skills/asfakulsiam-motomation-design/adapters/next.md"}><code>adapters/next.md</code></a>: App Router, static export.</>}>
            <ul className="cards">{repo.folders.find((f) => f.id === "adapters")!.files.map((x) => <li key={x.path} className="card"><h3><code>{x.name}</code></h3><p>{x.heading}</p></li>)}</ul>
          </Folder>

          <Folder id="data" title="The data tables" lede={<>{repo.fonts.length} fonts, {repo.palettes.length} palettes, and the tables every script reads. Fonts are listed with the scripts they cover, because a site in Bengali cannot borrow a Latin-only face.</>}>
            <h3 className="sec-h3">Multi-script coverage</h3>
            <div className="reg-wrap" tabIndex={0} role="region" aria-label="Script coverage">
              <table className="reg"><caption>fonts.csv, scripts column · {repo.fonts.length} fonts</caption><thead><tr><th>Script</th><th className="num">Fonts</th><th>Which</th></tr></thead>
                <tbody>{scripts.map((s) => <tr key={s.script}><td>{s.script}</td><td className="num">{s.fonts.length}</td><td>{s.fonts.filter((f) => !s.unconfirmed?.includes(f)).join(", ")}{s.unconfirmed?.length ? <span className="muted"> · plus {s.unconfirmed.length} Fontshare faces marked &ldquo;check the foundry&rsquo;s language list&rdquo;</span> : null}</td></tr>)}</tbody></table>
            </div>
            <h3 className="sec-h3">The {repo.palettes.length} palettes, measured</h3>
            <ul className="pals">{repo.palettes.map((p) => (
              <li key={p.name} className="pal" style={{ background: p.ground, color: p.ink }}>
                <span className="pal-sw" aria-hidden="true"><i style={{ background: p.surface }} /><i style={{ background: p.muted }} /><i style={{ background: p.accent }} /></span>
                <b>{p.name}</b><span className="pal-k">ink {fmt(ratio(p.ink, p.ground))} · muted {fmt(ratio(p.muted, p.ground))}</span>
              </li>))}</ul>
            <h3 className="sec-h3">Fonts</h3>
            <div className="reg-wrap tall" tabIndex={0} role="region" aria-label="Fonts">
              <table className="reg"><thead><tr><th>Font</th><th>Role</th><th>Licence</th><th>Axes</th><th>Scripts</th></tr></thead>
                <tbody>{repo.fonts.map((f) => <tr key={f.name}><td>{f.name}</td><td>{f.role}</td><td>{f.license}</td><td>{f.axes}</td><td>{f.scripts}</td></tr>)}</tbody></table>
            </div>
          </Folder>

          <Folder id="examples" title="Examples: the working code" lede={<>Most of the repo by line count. The {repo.components.length} components are in the <a href="/lab/">Lab</a>, running.</>}>
            <ul className="chips">{repo.examples.map((x) => <li key={x.id}><span className="chip" style={{ cursor: "default" }}>{x.id}<span className="n">{x.count}</span></span></li>)}</ul>
          </Folder>

          <Folder id="references" title="References: teardowns without code" lede={<>Award-site teardowns, written as principles. No copied code, by the repo&rsquo;s own contributing rule.</>}>
            <span />
          </Folder>

          <Folder id="scripts" title="Scripts you can run" lede={<>Real randomness, real measurement. These ran during this build; the results are in <a href="https://github.com/dev-asfakul/motomation-studio/tree/main/docs"><code>docs/</code></a>.</>}>
            <ul className="seqs">{repo.scriptExamples.map((s) => <li key={s.cmd}><code>$ {s.cmd}</code><span className="muted">{s.note}</span></li>)}</ul>
          </Folder>

          <Folder id="templates" title="Templates: the plan on paper" lede={<>Every build writes a MOTOMATION PLAN with {repo.plan.length} fields, then DESIGN.md and MOTION.md. The <a href="/method/">Method</a> room writes this site&rsquo;s plan as you scroll.</>}>
            <dl className="plan-keys">{repo.plan.map((p) => <div key={p.key}><dt className="label">{p.key}</dt><dd><code>{p.hint}</code></dd></div>)}</dl>
          </Folder>
        </div>
      </div>
    </div>
  );
}

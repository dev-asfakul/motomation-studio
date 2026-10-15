// The exhibit file: Hero → Specimen → Anatomy → Motion Lab → Skill Link → Before/After → Next exhibit.
// The shell carries structure only; type, colour, texture, cursor and motion come from the exhibit itself.
import "./exhibit.css";
import type { ReactNode, CSSProperties } from "react";
import type { Exhibit } from "@/content/exhibits";
import { nextOf, prevOf } from "@/content/exhibits";
import { repo, gh } from "@/content/repo";
import { ev } from "@/content/coverage";
import { ratio, fmt } from "@/lib/contrast";
import { FAMILY } from "@/exhibits/fonts";
import { Visit } from "./Visit";

export type GateSummary = { pass: boolean; stamp: string; counts: Record<string, number>; date: string } | null;

const LAYOUTS = ["left", "right", "center", "split"] as const;

export function ExhibitShell({ e, hero, lab, gate }: { e: Exhibit; hero: ReactNode; lab: ReactNode; gate: GateSummary }) {
  const p = e.palette;
  const comps = e.components.map((id) => repo.components.find((c) => c.id === id)).filter(Boolean) as Record<string, string>[];
  const sig = repo.signatures.find((s) => s.id === e.signature);
  const arch = repo.archetypes.find((a) => a.id === e.archetype);
  const tier = repo.tiers.find((t) => String(t.tier) === String(e.tier));
  const cmds = e.commands.map((c) => repo.commands.find((x) => x.cmd === c)).filter(Boolean) as { cmd: string; what: string }[];
  const next = nextOf(e.slug), prev = prevOf(e.slug);
  const layout = LAYOUTS["ABCDEFGHIJKLMNOPQRST".indexOf(e.letter) % 4];
  const vars = {
    "--x-ground": p.ground, "--x-surface": p.surface, "--x-ink": p.ink, "--x-muted": p.muted, "--x-accent": p.accent,
    "--x-display": FAMILY[e.fonts.display], "--x-text": FAMILY[e.fonts.text], "--x-mono": e.fonts.mono ? FAMILY[e.fonts.mono] : "var(--font-mono)",
  } as CSSProperties;
  const swatches = [
    { k: "ground", v: p.ground }, { k: "surface", v: p.surface }, { k: "ink", v: p.ink }, { k: "muted", v: p.muted }, { k: "accent", v: p.accent },
  ];
  const ids = [ev("archetype", e.archetype), ev("tier", e.tier), ...(sig ? [ev("signature", e.signature)] : []), ...e.components.map((c) => ev("component", c)), ...e.commands.map((c) => ev("command", c.slice(1)))];

  return (
    <article className={`exhibit-root x-${e.slug}`} data-layout={layout} style={vars} aria-labelledby="x-title">
      <Visit letter={e.letter} ids={ids} />
      {hero}

      <section className="x-sec x-specimen" aria-labelledby="x-spec-h">
        <header className="x-head"><span className="x-tag">Exhibit {e.letter} · 01</span><h2 id="x-spec-h">Specimen</h2></header>
        <div className="x-spec-type">
          <p className="x-aa" aria-hidden="true">Aa</p>
          <div>
            <p className="x-face"><span className="x-k">Display</span> {e.fonts.display}</p>
            <p className="x-alpha" style={{ fontFamily: "var(--x-display)" }}>ABCDEFGHIJKLM<br />NOPQRSTUVWXYZ<br />0123456789</p>
            <p className="x-face"><span className="x-k">Text</span> {e.fonts.text}{e.fonts.mono ? ` · mono ${e.fonts.mono}` : ""}</p>
            <p className="x-body">{e.hero}</p>
            {e.fonts.addendum && <p className="x-note">Proposed addition to the skill&rsquo;s font table: {e.fonts.addendum.join(", ")}. See skill-extensions/data/fonts-addendum.csv.</p>}
          </div>
        </div>
        <ul className="x-swatches" aria-label={`Palette ${p.name}`}>
          {swatches.map((s) => (
            <li key={s.k}>
              <span className="x-chip" style={{ background: s.v }} aria-hidden="true" />
              <span className="x-k">{s.k}</span> <code>{s.v}</code>
              {s.k !== "ground" && <span className="x-ratio">{fmt(ratio(s.v, p.ground))} on ground</span>}
            </li>
          ))}
        </ul>
        <p className="x-note">Palette <b>{p.name}</b>, a row of the skill&rsquo;s data/palettes.csv. Ratios measured with the WCAG formula the skill&rsquo;s contrast.mjs uses.</p>
        <ul className="x-dna" aria-label="Style DNA">{e.dna.map((d) => <li key={d}>{d}</li>)}</ul>
      </section>

      <section className="x-sec x-anatomy" aria-labelledby="x-anat-h">
        <header className="x-head"><span className="x-tag">Exhibit {e.letter} · 02</span><h2 id="x-anat-h">Anatomy</h2></header>
        <dl className="x-anat">
          {Object.entries(e.anatomy).map(([k, v]) => (<div key={k}><dt>{k}</dt><dd>{v}</dd></div>))}
          <div><dt>physics</dt><dd>{e.physics} <code>{e.ease}</code></dd></div>
          <div><dt>cursor</dt><dd>{e.cursor}</dd></div>
          <div><dt>sound</dt><dd>{e.sound} Off unless you switch sound on in the bar.</dd></div>
          <div><dt>reduced motion</dt><dd>{e.reduced}</dd></div>
        </dl>
      </section>

      <section className="x-sec x-lab" aria-labelledby="x-lab-h">
        <header className="x-head"><span className="x-tag">Exhibit {e.letter} · 03</span><h2 id="x-lab-h">Motion lab</h2></header>
        <p className="x-lede">{e.interaction}</p>
        <div className="x-lab-stage">{lab}</div>
      </section>

      <section className="x-sec x-link" aria-labelledby="x-link-h">
        <header className="x-head"><span className="x-tag">Exhibit {e.letter} · 04</span><h2 id="x-link-h">Skill link</h2></header>
        <div className="x-link-grid">
          <div className="x-card"><p className="x-k">Style file</p><p><a href={e.styleSource === "skill" ? gh(e.styleFile) : `https://github.com/dev-asfakul/motomation-studio/blob/main/${e.styleFile}`}>{e.styleFile.split("/").pop()}</a> {e.styleSource === "skill" ? "in the skill" : "written for this site in the repo's own format, proposed upstream"}</p></div>
          <div className="x-card"><p className="x-k">Archetype</p><p><b>{arch?.name ?? e.archetype}</b> mutated by <b>{e.mutation}</b>. {arch?.shape}</p></div>
          <div className="x-card"><p className="x-k">Collision</p><p>{e.collision.source}: {e.collision.property}, so {e.collision.becomes}.</p></div>
          <div className="x-card" data-ev={ev("signature", e.signature)}><p className="x-k">Signature</p><p><b>{sig?.name ?? e.signature}</b>{sig ? `: ${sig.one_line}` : ""}</p><p>{e.signatureBent}</p></div>
          <div className="x-card" data-ev={ev("tier", e.tier)}><p className="x-k">Tier</p><p><b>Tier {e.tier} · {tier?.name}</b>. {e.techniques.join(" · ")}</p></div>
          <div className="x-card"><p className="x-k">Dials</p>
            <ul className="x-dials">{(["energy", "rhythm", "motion"] as const).map((d) => (<li key={d}><span>{d}</span><span className="x-pips" aria-label={`${d} ${e.dials[d]} of 3`}>{[1, 2, 3].map((n) => <i key={n} data-on={n <= e.dials[d] ? "" : undefined} />)}</span></li>))}</ul>
          </div>
          <div className="x-card x-wide"><p className="x-k">Components</p>
            <ul className="x-chips">{comps.map((c) => <li key={c.id} data-ev={ev("component", c.id)}><a href={`/lab/#c-${c.id}`}>{c.name}</a> <span>{c.family} · T{c.tier}</span></li>)}
              {e.originals.map((o) => <li key={o} className="x-orig"><a href={`/lab/#o-${o}`}>{o.replace(/-/g, " ")}</a> <span>new, contribution candidate</span></li>)}</ul>
          </div>
          <div className="x-card x-wide"><p className="x-k">Commands</p>
            <ul className="x-cmds">{cmds.map((c) => <li key={c.cmd} data-ev={ev("command", c.cmd.slice(1))}><code>{c.cmd}</code> {c.what}</li>)}</ul>
          </div>
          <div className="x-card x-wide"><p className="x-k">Restraint gate</p>
            <ul className="x-gate"><li><b>Kept</b> {e.restraint.kept}</li><li><b>Cut</b> {e.restraint.cut}</li><li><b>Rejected</b> {e.restraint.rejected}</li></ul>
          </div>
          <div className="x-card x-wide"><p className="x-k">Delivery gate</p>
            {gate ? <p><b>{gate.pass ? "Pass" : "Fail"}</b>, scanned {gate.date}. <code>{gate.stamp}</code></p>
              : <p>Not yet scanned in a browser for this build. The CI workflow runs scripts/gate.mjs on every push; results land in docs/gate/.</p>}
          </div>
        </div>
      </section>

      <section className="x-sec x-ba" aria-labelledby="x-ba-h">
        <header className="x-head"><span className="x-tag">Exhibit {e.letter} · 05</span><h2 id="x-ba-h">Before and after</h2></header>
        <div className="x-ba-grid">
          <figure className="x-before" aria-label="Typical AI output for this brief">
            <div className="slop" aria-hidden="true">
              <div className="slop-nav"><i /><i /><i /><b /></div>
              <p className="slop-h">{e.style} made simple</p>
              <p className="slop-p">A clean, modern {e.style.toLowerCase()} layout for any project.</p>
              <div className="slop-cards"><i /><i /><i /></div>
            </div>
            <figcaption><span className="x-k">Typical output</span><ul>{e.typical.map((t) => <li key={t}>{t}</li>)}</ul></figcaption>
          </figure>
          <figure className="x-after" aria-label="This exhibit">
            <p className="x-after-word" aria-hidden="true">{e.title}</p>
            <figcaption><span className="x-k">This exhibit</span><ul>{e.ours.map((t) => <li key={t}>{t}</li>)}</ul></figcaption>
          </figure>
        </div>
      </section>

      <nav className="x-sec x-next" aria-label="More exhibits">
        <a className="x-prev" href={`/exhibits/${prev.slug}/`}><span className="x-k">Previous · Exhibit {prev.letter}</span><span className="x-next-t">{prev.style}</span></a>
        <a className="x-nextlink" href={`/exhibits/${next.slug}/`}><span className="x-k">Next exhibit · {next.letter}</span><span className="x-next-t">{next.style}: {next.title}</span></a>
      </nav>
    </article>
  );
}

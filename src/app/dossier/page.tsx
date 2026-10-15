import type { Metadata } from "next";
import "../rooms.css";
import "@/components/rooms/dossier.css";
import { RoomHead } from "@/components/rooms/RoomHead";
import { Md, MdBlock } from "@/components/rooms/Md";
import { repo } from "@/content/repo";
import { EXHIBITS } from "@/content/exhibits";
import originals from "@content/originals.json";

export const metadata: Metadata = { title: "Dossier", description: "Who made Motomation Design, what it is for and what it is not for, how to contribute, its MIT licence and the projects it acknowledges.", alternates: { canonical: "/dossier/" } };

const GH = "https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/main/";

export default function Page() {
  const a = repo.author;
  return (
    <div className="room">
      <RoomHead fit={6} n="08" room="Dossier" title={<>The person <em>behind it</em></>}
        lede="The author, the skill in its own words, the rules for contributing, the licence, the debts it acknowledges, and the cases it refuses."
        aside={<>Author details from the public GitHub profile ({a.source.replace(/^GitHub REST API /, "")}). Everything else from <code>ABOUT.md</code>, <code>CONTRIBUTING.md</code>, <code>ACKNOWLEDGEMENTS.md</code> and <code>NOT-FOR.md</code>.</>}
        uv="the subject has no criminal record. Only a commit history." />

      <section className="sec dos-subject" aria-labelledby="subj-h">
        <div className="dos-card">
          <p className="label">Subject</p>
          <h2 id="subj-h" className="dos-name">{a.name}</h2>
          <dl className="dos-dl">
            <div><dt>Handle</dt><dd><a href={a.url}>@{a.login}</a></dd></div>
            <div><dt>Based in</dt><dd>{a.location}</dd></div>
            <div><dt>In their words</dt><dd>&ldquo;{a.bio}&rdquo;</dd></div>
            <div><dt>Elsewhere</dt><dd><a href={a.blog}>{a.blog.replace(/^https?:\/\//, "").replace(/\/$/, "")}</a></dd></div>
            <div><dt>Known work</dt><dd><a href={repo.meta.url}>{repo.meta.title}</a> v{repo.meta.version}, {repo.meta.license}</dd></div>
          </dl>
        </div>
        <div className="dos-about">
          {repo.about.map((s) => (
            <article key={s.title} className="dos-sec">
              <h3>{s.title}</h3>
              <div className="prose"><MdBlock s={s.body} /></div>
            </article>
          ))}
          <p className="label"><a href={GH + "ABOUT.md"}>ABOUT.md</a></p>
        </div>
      </section>

      <section className="sec" aria-labelledby="ruled-h">
        <p className="label">NOT-FOR.md</p>
        <h2 id="ruled-h" className="sec-h">Ruled out</h2>
        <p className="sec-lede">Cases the skill declines, in its own words. A tool that says where it does not work is easier to believe where it does.</p>
        <ol className="ruled">{repo.notFor.map((n, i) => (
          <li key={i}><span className="ruled-stamp" aria-hidden="true">Ruled out</span><h3><Md s={n.rule.replace(/:$/, "")} /></h3><p><Md s={n.text[0].toUpperCase() + n.text.slice(1)} /></p></li>))}</ol>
      </section>

      <section className="sec" aria-labelledby="contrib-h">
        <p className="label">CONTRIBUTING.md</p>
        <h2 id="contrib-h" className="sec-h">How to add evidence</h2>
        <div className="dos-two">
          <ol className="contrib">{repo.contributing.rules.map((r) => <li key={r.rule}><b>{r.rule}</b> <Md s={r.text} /></li>)}</ol>
          <div>
            <h3 className="sec-h3" style={{ marginTop: 0 }}>Good first contributions</h3>
            <ul className="prose ticks">{repo.contributing.goodFirst.map((g) => <li key={g}><Md s={g} /></li>)}</ul>
            <p className="muted">This site offers <a href="/lab/#originals">{originals.length} new components and {EXHIBITS.filter((e) => e.styleSource === "extension").length} style files</a> back under the same rules.</p>
          </div>
        </div>
      </section>

      <section className="sec" aria-labelledby="lic-h">
        <p className="label">LICENSE</p>
        <h2 id="lic-h" className="sec-h">MIT, both of them</h2>
        <div className="dos-two">
          <div className="lic"><p className="mono">MIT License</p><p className="mono">{repo.meta.copyright}</p><p>The skill: free to use, copy, modify and redistribute, with the copyright notice kept. <a href={GH + "LICENSE"}>Full text</a>.</p></div>
          <div className="lic"><p className="mono">MIT License</p><p className="mono">motomation-studio</p><p>This site&rsquo;s code, including the {originals.length} original components. <a href="https://github.com/dev-asfakul/motomation-studio/blob/main/LICENSE">Full text</a>. Fonts keep their own OFL licences; see <a href="/credits/">Credits</a>.</p></div>
        </div>
      </section>

      <section className="sec" aria-labelledby="ack-h">
        <p className="label">ACKNOWLEDGEMENTS.md · {repo.acknowledgements.length} entries</p>
        <h2 id="ack-h" className="sec-h">Debts, declared</h2>
        <ul className="cards">{repo.acknowledgements.map((k) => (
          <li key={k.name} className="card"><h3><a href={k.url}>{k.name}</a></h3><p><Md s={k.what} /></p><p className="label">Where: <Md s={k.where} /></p></li>))}</ul>
      </section>
    </div>
  );
}

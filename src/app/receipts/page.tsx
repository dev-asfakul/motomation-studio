import type { Metadata } from "next";
import "../rooms.css";
import "@/components/rooms/receipts.css";
import { RoomHead } from "@/components/rooms/RoomHead";
import { Md, dash } from "@/components/rooms/Md";
import { repo } from "@/content/repo";

export const metadata: Metadata = { title: "Receipts", description: "Every Motomation Design benchmark as the repo reports it, losses included: v1 to v5, the motion-only loss, the Codex runs and the unscored v4 builds.", alternates: { canonical: "/receipts/" } };

const SRC = "https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/main/";
// "a → b": the skill's number is b. Lower than the baseline's is a loss, and is marked as one.
const dir = (s: string) => { const m = s.match(/([\d.]+)\s*→\s*([\d.]+)/); if (!m) return ""; const a = Number(m[1]), b = Number(m[2]); return b < a ? "loss" : b > a ? "win" : ""; };
const wlt = (s: string) => { const [w, l] = s.split(/[–-]/).map(Number); return l > w ? "loss" : ""; };
const num = (s: string) => Number(String(s).replace(/[^\d.-]/g, ""));

function Src({ path }: { path: string }) {
  return <p className="label rc-src">Source · {path.split(" + ").map((p, i) => <span key={p}>{i ? " + " : ""}<a href={SRC + p.trim()}>{p.trim()}</a></span>)}</p>;
}

export default function Page() {
  const e = repo.evals;
  const v3loss = e.v3.headline.filter((h) => wlt(h.wlt) === "loss" || dir(h.gated) === "loss");
  const v1loss = e.v1.rows.filter((r) => num(r.delta) < 0);
  const motionLoss = e.v3motion.axes.filter((a) => num(a.skill) < num(a.baseline));
  const losses = v1loss.length + v3loss.length + motionLoss.length;
  return (
    <div className="room">
      <RoomHead fit={6} n="06" room="Receipts" title={<>The losses <em>stay in</em></>}
        lede="Every benchmark the repo has run, copied as reported. Where the skill lost, the row is marked, not dropped. Where a run was built but never scored, it says so."
        aside={`${losses} losing rows on this page: ${v1loss.length} in v1, ${v3loss.length} in the v3 headline, ${motionLoss.length} motion axes. Numbers are the repo's, to the decimal; nothing here was re-scored.`}
        uv="the investigator was tempted to round 64.4 up. The investigator was not allowed to." />

      <section className="sec" aria-labelledby="v1-h">
        <p className="label">Benchmark v1 · 5 briefs</p>
        <h2 id="v1-h" className="sec-h">The first run, release gate not met</h2>
        <p className="sec-lede"><Md s={`The repo's own summary: ${e.v1.line}`} /></p>
        <div className="reg-wrap" tabIndex={0} role="region" aria-label="Benchmark v1">
          <table className="reg"><thead><tr><th>Brief</th><th className="num">Baseline raw</th><th className="num">Baseline gated</th><th className="num">Skill raw</th><th className="num">Skill gated</th><th className="num">Delta</th><th>Hard-gate failures</th></tr></thead>
            <tbody>{e.v1.rows.map((r) => <tr key={r.brief} className={num(r.delta) < 0 ? "row-loss" : ""}><td>{r.brief}{num(r.delta) < 0 && <span className="lost">Lost</span>}</td><td className="num">{r.baseRaw}</td><td className="num">{r.baseGated}</td><td className="num">{r.skillRaw}</td><td className="num">{r.skillGated}</td><td className={`num ${num(r.delta) < 0 ? "loss" : "win"}`}>{r.delta}</td><td>{dash(r.failures)}</td></tr>)}</tbody></table>
        </div>
        <Src path={e.v1.source} />
      </section>

      <section className="sec" aria-labelledby="v2-h">
        <p className="label">Benchmark v2 · 30 runs</p>
        <h2 id="v2-h" className="sec-h">Fifteen to nothing, then questioned</h2>
        <blockquote className="rc-quote"><Md s={e.v2.line} /></blockquote>
        <p className="muted">v3 was built to test this result. It found that effort and the gate explain part of it; see below.</p>
        <Src path={e.v2.source} />
      </section>

      <section className="sec" aria-labelledby="v3-h">
        <p className="label">Benchmark v3 · the hard one</p>
        <h2 id="v3-h" className="sec-h">Against six arms, and where it lost</h2>
        <div className="reg-wrap" tabIndex={0} role="region" aria-label="Benchmark v3 headline">
          <table className="reg"><thead><tr><th>Skill against</th><th>Won–lost–tied</th><th>Gated mean, theirs → skill</th><th>Raw mean, theirs → skill</th></tr></thead>
            <tbody>{e.v3.headline.map((h) => { const l = wlt(h.wlt) === "loss" || dir(h.gated) === "loss"; return <tr key={h.against} className={l ? "row-loss" : ""}><td>{h.against}{l && <span className="lost">Lost</span>}</td><td className={wlt(h.wlt)}>{h.wlt}</td><td className={dir(h.gated)}>{dash(h.gated)}</td><td className={dir(h.raw)}>{dash(h.raw)}</td></tr>; })}</tbody></table>
        </div>
        <h3 className="sec-h3">What v3 found, in the repo&rsquo;s words</h3>
        <ol className="rc-findings">{e.v3.findings.map((f, i) => <li key={i}><Md s={f} /></li>)}</ol>
        <h3 className="sec-h3">Per brief, gated mean, theirs → skill</h3>
        <div className="reg-wrap" tabIndex={0} role="region" aria-label="Benchmark v3 per brief">
          <table className="reg"><thead><tr><th>Brief</th><th>vs baseline</th><th>vs baseline + gate</th><th>vs matched effort</th></tr></thead>
            <tbody>{e.v3.briefs.map((b) => <tr key={b.brief}><td>{b.brief}</td><td className={dir(b.baseline)}>{b.baseline}</td><td className={dir(b.gated)}>{b.gated}</td><td className={dir(b.matched)}>{b.matched}</td></tr>)}</tbody></table>
        </div>
        <h3 className="sec-h3">Effort: turns and time per arm</h3>
        <div className="reg-wrap" tabIndex={0} role="region" aria-label="Effort per arm">
          <table className="reg"><thead><tr><th>Arm</th><th>Turns (min / median / mean / max)</th><th className="num">Mean time</th><th>Gate clean</th><th>Hard-gate fail</th></tr></thead>
            <tbody>{e.v3.effort.map((x) => <tr key={x.arm}><td>{x.arm}</td><td className="mono">{x.turns}</td><td className="num">{x.time}</td><td>{x.gateClean}</td><td>{x.hardFail}</td></tr>)}</tbody></table>
        </div>
        <Src path={e.v3.source} />
      </section>

      <section className="sec" aria-labelledby="v3m-h">
        <p className="label">v3 · Tier 4 motion</p>
        <h2 id="v3m-h" className="sec-h">On motion alone, the skill lost</h2>
        <div className="rc-two">
          <div className="reg-wrap" tabIndex={0} role="region" aria-label="Tier 4 motion results">
            <table className="reg"><thead><tr><th>Metric</th><th className="num">Baseline</th><th className="num">Skill</th></tr></thead>
              <tbody>{e.v3motion.rows.map((r) => <tr key={r.metric}><td>{r.metric}</td><td className="num">{r.baseline}</td><td className="num">{r.skill}</td></tr>)}</tbody></table>
          </div>
          <div className="reg-wrap" tabIndex={0} role="region" aria-label="Motion axes">
            <table className="reg"><caption>Motion axes, 1 to 5</caption><thead><tr><th>Axis</th><th className="num">Baseline</th><th className="num">Skill</th></tr></thead>
              <tbody>{e.v3motion.axes.map((a) => { const l = num(a.skill) < num(a.baseline); return <tr key={a.axis} className={l ? "row-loss" : ""}><td>{a.axis}{l && <span className="lost">Lost</span>}</td><td className="num">{a.baseline}</td><td className={`num ${l ? "loss" : "win"}`}>{a.skill}</td></tr>; })}</tbody></table>
          </div>
        </div>
        <p className="sec-lede" style={{ marginTop: 20 }}>This site took the lesson. Every exhibit has a designed reduced-motion version, and only four of the twenty exhibits (C, E, O and S) reach for WebGL, each with a still poster when it is off.</p>
        <Src path={e.v3motion.source} />
      </section>

      <section className="sec" aria-labelledby="cx-h">
        <p className="label">v3 · another agent</p>
        <h2 id="cx-h" className="sec-h">In Codex, nearly a draw</h2>
        <div className="reg-wrap" tabIndex={0} role="region" aria-label="Codex results">
          <table className="reg"><thead><tr><th>Metric</th><th className="num">Baseline</th><th className="num">Skill</th></tr></thead>
            <tbody>{e.v3codex.rows.map((r) => <tr key={r.metric}><td>{r.metric}</td><td className="num">{r.baseline}</td><td className="num">{r.skill}</td></tr>)}</tbody></table>
        </div>
        <Src path={e.v3codex.source} />
      </section>

      <section className="sec rc-sealed" aria-labelledby="v4-h">
        <p className="label">Benchmark v4</p>
        <h2 id="v4-h" className="sec-h">Built, <span className="rc-stamp">not scored</span></h2>
        <p className="sec-lede">Status in the repo: {e.v4.status} The caveat, verbatim: &ldquo;{e.v4.caveat}&rdquo;. No number from v4 appears anywhere on this site.</p>
        <div className="reg-wrap" tabIndex={0} role="region" aria-label="Benchmark v4">
          <table className="reg"><thead><tr><th>Comparison</th><th className="num">Built</th><th className="num">Measured</th><th className="num">Judged</th></tr></thead>
            <tbody>{e.v4.pairs.map((p) => <tr key={p.comparison}><td>{p.comparison}</td><td className="num">{p.built}</td><td className="num">{p.measured}</td><td className="num">{p.judged}</td></tr>)}</tbody></table>
        </div>
        <Src path={e.v4.source} />
      </section>

      <section className="sec" aria-labelledby="v5-h">
        <p className="label">Benchmark v5 · one brief per tier</p>
        <h2 id="v5-h" className="sec-h">Three tiers done, two not started</h2>
        <div className="reg-wrap" tabIndex={0} role="region" aria-label="Benchmark v5 state">
          <table className="reg"><thead><tr><th className="num">#</th><th>Tier</th><th>Brief</th><th>Status</th><th>Committed</th></tr></thead>
            <tbody>{e.v5.state.map((s) => <tr key={s.n} className={s.status !== "done" ? "row-open" : ""}><td className="num">{s.n}</td><td>{dash(s.tier)}</td><td>{s.brief}</td><td>{s.status}</td><td>{dash(s.committed)}</td></tr>)}</tbody></table>
        </div>
        <ul className="cards" style={{ marginTop: 20 }}>{e.v5.summaries.map((s) => (
          <li key={s.id} className="card"><h3>{dash(s.tier)}</h3><p>{s.brief}</p><p className="muted"><b>Gate:</b> {s.gate}</p><p className="muted"><b>Judges:</b> {s.judge}</p><p className="label"><a href={SRC + s.source}>{s.source.split("/").slice(-2).join("/")}</a></p></li>))}</ul>
        <Src path={e.v5.source} />
      </section>

      <section className="sec" aria-labelledby="var-h">
        <p className="label">Variety study</p>
        <h2 id="var-h" className="sec-h">Does it make the same page twice?</h2>
        <ol className="rc-findings">{e.variety.findings.map((f, i) => <li key={i}><Md s={f} /></li>)}</ol>
        <Src path={e.variety.source} />
      </section>
    </div>
  );
}

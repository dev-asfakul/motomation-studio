import type { Metadata } from "next";
import "../rooms.css";
import { RoomHead } from "@/components/rooms/RoomHead";
import { repo } from "@/content/repo";
import { BUREAU_FONTS, fontRows, LIBS } from "@/content/credits";

export const metadata: Metadata = { title: "Credits", description: "Chain of custody for the Motomation case file: every typeface and its licence, every library, the skill code it vendors, and how the images and sounds were made.", alternates: { canonical: "/credits/" } };

export default function Page() {
  const fonts = fontRows();
  return (
    <div className="room">
      <RoomHead fit={7} n="09" room="Credits" title={<>Chain of <em>custody</em></>}
        lede={`Where every asset came from. ${BUREAU_FONTS.length + fonts.length} typefaces, ${LIBS.length} libraries, the skill's own components, and no stock images or sound files at all.`}
        aside={<>The same list lives in the repo as <a href="https://github.com/dev-asfakul/motomation-studio/blob/main/CREDITS.md"><code>CREDITS.md</code></a>.</>}
        uv="no photograph on this site was taken. Every picture is drawn by code, which makes the code the only witness." />
      <section className="sec" aria-labelledby="cr-skill">
        <p className="label">The subject</p>
        <h2 id="cr-skill" className="sec-h">Motomation Design</h2>
        <p className="sec-lede">The {repo.components.length} components in the <a href="/lab/">Lab</a> are the skill&rsquo;s own code, vendored unchanged into <code>src/vendor/motomation/</code> from <a href={repo.meta.url}>{repo.meta.name}</a> v{repo.meta.version} at <code>{repo.meta.commit.slice(0, 7)}</code>, under its MIT licence ({repo.meta.copyright}). All text and numbers about the skill are read from the same commit by <code>scripts/inventory.mjs</code>.</p>
      </section>
      <section className="sec" aria-labelledby="cr-fonts">
        <p className="label">Typefaces · self-hosted at build by next/font, all SIL Open Font License</p>
        <h2 id="cr-fonts" className="sec-h">Type on file</h2>
        <div className="reg-wrap" tabIndex={0} role="region" aria-label="Typefaces">
          <table className="reg"><thead><tr><th>Typeface</th><th>Used for</th><th>Licence</th></tr></thead>
            <tbody>
              {BUREAU_FONTS.map((f) => <tr key={f.name}><td>{f.name}</td><td>{f.role}</td><td>OFL 1.1</td></tr>)}
              {fonts.map((f) => <tr key={f.name}><td>{f.name}</td><td>{f.used.length ? `Exhibit ${f.used.join(", ")}` : "Exhibit display or label"}</td><td>OFL 1.1</td></tr>)}
            </tbody></table>
        </div>
      </section>
      <section className="sec" aria-labelledby="cr-libs">
        <p className="label">Libraries</p>
        <h2 id="cr-libs" className="sec-h">Code by others</h2>
        <div className="reg-wrap" tabIndex={0} role="region" aria-label="Libraries">
          <table className="reg"><thead><tr><th>Library</th><th>Used for</th><th>Licence</th></tr></thead>
            <tbody>{LIBS.map((l) => <tr key={l.name}><td><a href={l.url}>{l.name}</a></td><td>{l.what}</td><td>{l.license}</td></tr>)}</tbody></table>
        </div>
      </section>
      <section className="sec" aria-labelledby="cr-made">
        <p className="label">Made here</p>
        <h2 id="cr-made" className="sec-h">Images and sound</h2>
        <ul className="cards">
          <li className="card"><h3>Images</h3><p>Every picture is SVG, canvas or a shader written for this site: the board prints, the engraved plates, the halftones, the sprites. Nothing is licensed because nothing was borrowed.</p></li>
          <li className="card"><h3>Sound</h3><p>Off until you say yes. Every tick, seal and snip is synthesised live with the Web Audio API; there are no audio files.</p></li>
          <li className="card"><h3>Wordmark</h3><p>MOTOMATION is set from the real glyph outlines of each exhibit&rsquo;s typeface, read at build time, so the Lineup morphs letters, not pictures of letters.</p></li>
        </ul>
      </section>
    </div>
  );
}

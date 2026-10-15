import type { Metadata } from "next";
import "../rooms.css";
import "@/components/rooms/locker.css";
import { RoomHead } from "@/components/rooms/RoomHead";
import { SealCopy, BagCount } from "@/components/rooms/SealCopy";
import { Md } from "@/components/rooms/Md";
import { Witness } from "@/components/bureau/EvidenceLog";
import { repo } from "@/content/repo";
import { ev } from "@/content/coverage";

export const metadata: Metadata = { title: "Locker", description: "Every way to install Motomation Design as numbered procedures: skills CLI, Claude Code plugin, Gemini CLI extension, single files and the shadcn registry.", alternates: { canonical: "/locker/" } };

const GH = "https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/main/";
const RAW = "https://raw.githubusercontent.com/asfakulsiam/asfakulsiam-motomation-design/main/";
// One line of procedure per path, paraphrased from the repo README's Install section.
const NOTE: Record<string, React.ReactNode> = {
  project: <>Run in the project folder. Works with the agents the open <a href="https://github.com/vercel-labs/skills">skills</a> CLI supports, including {repo.agentsLine}.</>,
  global: <>The same skill, installed once for every project on this machine.</>,
  agents: <>Name the agents to install for; repeat <code>-a</code> for each one.</>,
  "plugin-market": <>Inside Claude Code: register the repo as a plugin marketplace first.</>,
  "plugin-install": <>Then install the plugin from it.</>,
  gemini: <>Installs the skill as a Gemini CLI extension straight from the repository.</>,
  dist: <>For tools that cannot run <code>npx</code>. Download the single file and put it where the tool keeps instructions; see the table below. Without a shell, the skill uses the data tables at the end of the file instead of its scripts.</>,
  lite: <>When the instructions box is small: {repo.liteTokens}, with the five laws, the flow, the tiers, the bans and the Thinking Sequence.</>,
  shadcn: <>Adds one component to a shadcn project. Replace <code>&lt;id&gt;</code> with a component id from the <a href="/lab/">Lab</a>, such as <code>split-flap</code>.</>,
  update: <>Pulls the latest version of an installed skill.</>,
  "gate-deps": <>The Delivery Gate needs a headless browser. Once per project; every other script has no dependencies.</>,
};

export default function Page() {
  const files = (c: string) => c.startsWith("dist/");
  return (
    <div className="room">
      <Witness ids={repo.install.map((_, i) => ev("install", i + 1))} />
      <RoomHead fit={4} n="07" room="Locker" title={<>Take it <em>home</em></>}
        lede={`${repo.install.length} ways in, as numbered procedures. Copy a command and it goes into an evidence bag, sealed and timed, so you can see what you have already taken.`}
        aside={<>Every path below is marked verified in the repo&rsquo;s inventory. Sealed bags are kept on this device only.</>}
        uv="the locker has no lock. It is a design skill, not a bank." />
      <section className="sec" aria-labelledby="proc-h">
        <div className="locker-top"><div><p className="label">Procedures</p><h2 id="proc-h" className="sec-h">Install, step by step</h2></div><BagCount total={repo.install.length} /></div>
        <ol className="procs">
          {repo.install.map((x, i) => (
            <li key={x.id} id={`p-${i + 1}`} className="proc anchor" data-ev={ev("install", i + 1)}>
              <span className="proc-n">{String(i + 1).padStart(2, "0")}</span>
              <div className="proc-body">
                <h3>{x.agent}{x.verified && <span className="label proc-v">Verified</span>}</h3>
                <p>{NOTE[x.id]}</p>
                <SealCopy id={x.id} n={i + 1} text={files(x.cmd) ? RAW + x.cmd : x.cmd} label={files(x.cmd) ? "Copy the link and seal" : "Copy and seal"} />
                {files(x.cmd) && <p className="proc-file"><a href={GH + x.cmd}>Read <code>{x.cmd}</code> on GitHub</a></p>}
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section className="sec" aria-labelledby="chat-h">
        <p className="label">For chat tools · procedures 07 and 08</p>
        <h2 id="chat-h" className="sec-h">Where the single file goes</h2>
        <div className="reg-wrap" tabIndex={0} role="region" aria-label="Chat tools">
          <table className="reg"><thead><tr><th>Tool</th><th>Where to put it</th></tr></thead>
            <tbody>{repo.chatTools.map((c) => <tr key={c.tool}><td><b>{c.tool}</b></td><td><Md s={c.where} /></td></tr>)}</tbody></table>
        </div>
      </section>
    </div>
  );
}

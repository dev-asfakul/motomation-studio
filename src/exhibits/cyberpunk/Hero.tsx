"use client";
import "./x.css";
import { StakeoutTerminal, type Command } from "@/components/originals/stakeout-terminal";
import { RainGlass } from "@/components/originals/rain-glass";
import { Glitch } from "@/vendor/motomation/components/text/glitch";
import { ScrambleOnHover } from "@/vendor/motomation/components/text/scramble-on-hover";
import type { Exhibit } from "@/content/exhibits";
import { repo } from "@/content/repo-client";

export const COMMANDS: Command[] = [
  { name: "help", run: () => "commands: ls evidence · signatures · tier <1-5> · install · commands · whoami · clear" },
  { name: "ls evidence", run: () => repo.folders.map((f) => `${f.id.padEnd(12)} ${String(f.count).padStart(3)} files`).join("\n") },
  { name: "signatures", run: () => `${repo.sigNames.length} on file:\n` + repo.sigNames.join(" · ") },
  { name: "tier", run: (a) => { const t = repo.tierNames.find((x) => String(x.tier) === a.trim()); return t ? `TIER ${t.tier} · ${t.name.toUpperCase()}\nwhen: ${t.when}` : "usage: tier <1-5>"; } },
  { name: "install", run: () => repo.install.map((x, i) => `${i + 1}. ${x.agent}\n   ${x.cmd}`).join("\n") },
  { name: "commands", run: () => `${repo.cmdNames.length} commands: ${repo.cmdNames.join(" ")}` },
  { name: "whoami", run: () => "investigator. clearance: visitor. evidence logged on this device only." },
];

export default function Hero({ e }: { e: Exhibit }) {
  return (
    <header className="x-hero j-hero" aria-labelledby="x-title">
      <div className="j-rain" aria-hidden="true"><RainGlass neon={["#E84E0E", "#2bd4e0", "#e02bb5"]} /></div>
      <div className="j-scan" aria-hidden="true" />
      <div className="j-hud" aria-hidden="true"><span>REC ● 23:14:07</span><span>CAM 04 · ALLEY</span><span>SUBJECT: MOTOMATION v{repo.version}</span></div>
      <p className="x-hero-meta"><b>Exhibit {e.letter}</b><span>{e.style}</span><span>Tier {e.tier}</span></p>
      <h1 id="x-title" className="j-title"><Glitch as="span" text="The Neon" colors={["#E84E0E", "#2bd4e0"]} /> <span>Stakeout</span></h1>
      <div className="j-grid">
        <StakeoutTerminal className="j-term" commands={COMMANDS} suggest={["help", "ls evidence", "tier 5", "install"]}
          banner={["MOTOMATION FIELD UNIT // boot ok", `inventory loaded: ${repo.components} components, ${repo.signatures} signatures, ${repo.tiers} tiers`, "type help, or press a suggestion below"]} />
        <nav className="j-links" aria-label="Leads">
          <p className="x-k">Leads</p>
          <ScrambleOnHover as="a" href="/autopsy/#signatures" text="Signatures, all 22" />
          <ScrambleOnHover as="a" href="/locker/" text="Every install path" />
          <ScrambleOnHover as="a" href="/receipts/" text="The benchmarks" />
        </nav>
      </div>
    </header>
  );
}

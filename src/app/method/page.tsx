import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import "../rooms.css";
import "@/components/rooms/method.css";
import { RoomHead } from "@/components/rooms/RoomHead";
import { MethodFilm, type MStep, type PlanLine } from "@/components/rooms/MethodFilm";
import { Witness } from "@/components/bureau/EvidenceLog";
import { repo } from "@/content/repo";
import { EXHIBITS } from "@/content/exhibits";
import { ev } from "@/content/coverage";

export const metadata: Metadata = { title: "Method", description: "The Thinking Sequence run on this site: eight steps from stack to Restraint Gate, writing the real MOTOMATION PLAN for this case file as you scroll.", alternates: { canonical: "/method/" } };

// The plan is read from DESIGN.md, the file the build actually follows, so this page cannot drift from it.
function readPlan(): PlanLine[] {
  const md = readFileSync(join(process.cwd(), "DESIGN.md"), "utf8");
  const block = md.split("```")[1] ?? "";
  return block.split("\n").map((l) => l.match(/^(\w[\w ]*?)\s*:\s(.+)$/)).filter(Boolean).map((m) => ({ key: m![1].trim(), value: m![2].trim() }));
}
function memoryStats() {
  try {
    const txt = readFileSync(join(process.cwd(), "docs/memory-checks.txt"), "utf8");
    const log = JSON.parse(readFileSync(join(process.cwd(), ".motomation/log.json"), "utf8"));
    return { runs: log.runs.length as number, flags: (txt.match(/✗/g) ?? []).length, structural: (txt.match(/structural overlap/g) ?? []).length, passes: (txt.match(/✓/g) ?? []).length };
  } catch { return null; }
}

export default function Page() {
  const plan = readPlan();
  const m = memoryStats();
  const first = (s: string) => s.replace(/\*\*|`/g, "").split(/(?<=[a-z)]\.)\s/)[0].replace(/:\s*1\.$/, ".");
  const S = (n: number) => repo.steps.find((s) => s.n === n)!;
  const tierCounts = [2, 3, 4, 5].map((t) => `${EXHIBITS.filter((e) => e.tier === t).length} at Tier ${t}`).join(", ");
  const steps: MStep[] = [
    { n: 0, name: S(0).name, body: first(S(0).body), ask: "What is this being built in, and who said so?",
      answer: ["The brief named it: Next.js App Router, TypeScript, Tailwind, exported as static files. The skill's Next adapter applies: motion lives in client islands, GSAP is registered once.", "One constraint followed from it: the Bureau, the frame around every room, must never reload. So the frame sits in the root layout and only the room inside it changes."],
      writes: ["Stack"], ev: ev("step", 0) },
    { n: 1, name: S(1).name, body: first(S(1).body), ask: "Where is the conflict in this brief?",
      answer: ["A design skill has to prove it has taste, and taste is the one thing that cannot be proven by describing it. Every claim on a skill's homepage is a claim the reader has to take on trust.", "So the site may not claim. It may only show."],
      writes: ["Tension"], ev: ev("step", 1) },
    { n: 2, name: S(2).name, body: first(S(2).body), ask: "Say the idea in one sentence a client would repeat.",
      answer: ["Put the repo on the table and examine it. The site is a case file; every folder, number and component is evidence; the visitor is the investigator.", "It resolves the tension because evidence does not ask to be believed. It asks to be checked."],
      writes: ["Concept"], ev: ev("step", 2) },
    { n: 3, name: S(3).name, body: first(S(3).body), ask: "What shape does the page take, and what breaks it out of the usual one?",
      answer: [`An evidence board: the Gallery Wall archetype, mutated into second person, so the visitor pins, collects and tags. Each exhibit then takes a different archetype from the other ${repo.archetypes.length - 1}; none repeats.`],
      writes: ["Archetype"], ev: ev("step", 3) },
    { n: 4, name: S(4).name, body: first(S(4).body), ask: "What did you steal, and from where?",
      answer: ["From a forensic lab: evidence tags, numbered markers, chain of custody, a UV torch that shows what is written in invisible ink. The UV torch is real; press U anywhere.", "Each exhibit drew its own collision from the engine with a fixed seed, so the draw can be checked, not just believed."],
      writes: ["Collision"], ev: ev("step", 4) },
    { n: 5, name: S(5).name, body: first(S(5).body), ask: "What will people describe to a friend?",
      answer: ["The Lineup: the word MOTOMATION steps up to a height wall and becomes each exhibit's typeface in turn, morphing its real glyph outlines as you scroll.", `That one move is Tier 5. Everything else stays as low as it can: ${tierCounts}, none at Tier 1 alone.`],
      writes: ["Signature", "Dials"], ev: ev("step", 5) },
    { n: 6, name: S(6).name, body: first(S(6).body), ask: "Is this the page every AI would have made?",
      answer: [m ? `Every exhibit was checked against project memory before it was built: ${m.runs} runs logged, ${m.passes} checks fresh, ${m.flags} flagged, ${m.structural} of them structural. Each flag is answered in DECISIONS.md with a reason, or the plan changed.` : "Every exhibit was checked against project memory before it was built. The results are in docs/memory-checks.txt.",
        "The obvious version was rejected first: a docs site with a component grid, which the skill's own Pages site already is."],
      writes: ["Not doing"], ev: ev("step", 6) },
    { n: 7, name: S(7).name, body: first(S(7).body), ask: "What stays, and what did it cost?",
      answer: ["One display face with a width axis, one text face that disappears, one mono for labels. One accent, evidence red, used where something matters. Everything else on the frame is ink and dark.", "The house style won over a service style: a design skill's own site is a brand site, and type is the image. Each exhibit then breaks these rules inside its own walls, on purpose."],
      writes: ["Type mode", "Type", "Palette"], ev: ev("step", 7) },
  ];
  return (
    <div className="room">
      <Witness ids={repo.steps.map((s) => ev("step", s.n))} />
      <RoomHead fit={13} n="04" room="Method" title={<>The <em>interrogation</em></>}
        lede={`${repo.steps.length} steps the skill runs before any UI code, asked of this very site. Scroll, and the plan on the right writes itself from the answers.`}
        aside={<>The plan is read from this site&rsquo;s <a href="https://github.com/dev-asfakul/motomation-studio/blob/main/DESIGN.md"><code>DESIGN.md</code></a> at build time. The steps are quoted from <code>thinking/sequence.md</code>.</>}
        uv="the suspect answered every question in under a sentence. Suspiciously well prepared." />
      <MethodFilm steps={steps} plan={plan} />
      <section className="sec" aria-labelledby="filed-h">
        <p className="label">As filed</p>
        <h2 id="filed-h" className="sec-h">The plan, in full</h2>
        <pre className="plan-pre" tabIndex={0}>{"MOTOMATION PLAN\n" + plan.map((p) => `${p.key.padEnd(11)} : ${p.value}`).join("\n")}</pre>
        <div className="landing-cta" style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a className="btn" href="/autopsy/#f-thinking">Read the sequence in the repo</a>
          <a className="btn ghost" href="/board/">See where it led</a>
        </div>
      </section>
    </div>
  );
}

# MOTOMATION · the case file

The official site of [Motomation Design](https://github.com/asfakulsiam/asfakulsiam-motomation-design), the agent skill by Asfakul Islam that makes coding agents design like a person with taste instead of a template. The skill was used to build the site, and the site is about the skill.

The site is a forensic case file. You play the investigator. The repo is the evidence: its 20 styles are Exhibits A to T, its 68 components run live in the Lab, and its benchmarks sit in Receipts, losses included. Every word and number about the skill is read from the repo at commit `8dea1dd` (v2.6.0) by `scripts/inventory.mjs` into `content/repo.json`. Nothing about the skill is typed by hand.

- Live preview: see [Deploy](#deploy)
- Skill: [asfakulsiam/asfakulsiam-motomation-design](https://github.com/asfakulsiam/asfakulsiam-motomation-design)

![Home, the cover](docs/screens/final/home-0-1440.png)

| | | |
| --- | --- | --- |
| ![Evidence board](docs/screens/final/board-0-1440.png) | ![Exhibit J, Cyberpunk](docs/screens/final/exhibits-cyberpunk-0-1440.png) | ![Exhibit L, Retro](docs/screens/final/exhibits-retro-0.3-1440.png) |
| ![Method](docs/screens/final/method-0.3-1440.png) | ![Lab](docs/screens/final/lab-0.02-1440.png) | ![Exhibit S, Aurora](docs/screens/final/exhibits-aurora-0-1440.png) |
| ![Home on a phone](docs/screens/final/home-0-390.png) | ![Exhibit Q on a phone](docs/screens/final/exhibits-bohemian-0-390.png) | ![404 on a phone](docs/screens/final/nope-0-390.png) |

## What is on file

| Room | What it holds |
| --- | --- |
| `/` | The cover and the lineup: MOTOMATION morphs through all 20 exhibits' real glyph outlines (Tier 5). Reduced motion gets a photo sheet. |
| `/board/` | All 20 exhibits strung to their tier and component families. Filter, zoom, pan; a table carries the same facts. |
| `/exhibits/[slug]/` ×20 | One style each, built with the skill's own method: archetype, collision, signature, palette, type, restraint gate. |
| `/autopsy/` | The repo opened folder by folder, with the collision engine (same seed, same draw as `collide.mjs`) and a contrast probe. |
| `/method/` | The Thinking Sequence, run on this site, writing the real MOTOMATION PLAN as you scroll. |
| `/lab/` | All 68 components live, three dials that retune the room, a palette bench, and 41 new components filed as candidates. |
| `/receipts/` | Every benchmark exactly as reported, including the motion-only loss and the v4 builds that were never scored. |
| `/locker/` | Every install path as a numbered procedure you can copy and seal. |
| `/dossier/` | Who made it, who it is for, the licence. |
| `/credits/` | Chain of custody: every typeface, library and asset. |
| `/verdict/` | Hidden. Opens when all 20 exhibits are in your tray; draws a PNG poster from your seed. |

The Bureau, the frame around every room, never reloads: case number, evidence tray A to T, UV torch (press U), ⌘K search over the whole case, and sound that stays off unless you say yes.

## Coverage

`scripts/coverage.mjs` runs after every build and fails it if anything in the inventory is missing from the built HTML. Current result, from `coverage.json`:

components 68/68 · signatures 22/22 · tiers 5/5 · archetypes 20/20 · Thinking Sequence steps 8/8 (Step 0 plus 1 to 7) · commands 21/21 · install paths 11/11

## Install

```bash
git clone https://github.com/dev-asfakul/motomation-studio && cd motomation-studio
npm ci
npm run build        # static export to out/, then postbuild and the coverage check
npm start            # serves out/ on http://localhost:3000 with the production headers
```

`content/repo.json` is committed, so the build works without the skill checkout. To refresh it from the skill, clone the skill next to this folder as `../skill-src` (or set `SKILL_SRC`) and run `npm run inventory`.

Checks:

```bash
npm run qa           # layout QA: every route at 320, 375, 390, 768, 1440, 1920 (docs/qa.json)
GATE=../skill-src/skills/asfakulsiam-motomation-design/scripts/gate.mjs node scripts/gate-run.mjs / /exhibits/cyberpunk/
node scripts/gate-summary.mjs   # docs/gate/*.json → content/gate-results.json and docs/gate/SUMMARY.md
```

## Stack

Next.js 16 (App Router, static export) · React 19 · TypeScript 5.9 strict · Tailwind CSS 4 · GSAP 3 (ScrollTrigger, MorphSVG) · Lenis · Three.js (four scenes: C, E, O, S, lazy, with designed posters) · Web Audio (every sound synthesised) · Playwright for screenshots, QA and the gate.

The 68 skill components are vendored unchanged in `src/vendor/motomation/`. The 41 new components in `src/components/originals/` each carry the skill's header format and are listed in `content/originals.json`. Styles the skill does not have are written in its own format in `skill-extensions/styles/` (16 files) and proposed upstream, never passed off as the skill's.

Decisions, one line of why each: [DECISIONS.md](DECISIONS.md). Design plan: [DESIGN.md](DESIGN.md). Motion: [MOTION.md](MOTION.md).

## Credits

Typefaces are SIL Open Font License, self-hosted at build time. There is no stock photography, illustration or audio: images are SVG, canvas or shaders written for this site, and sound is synthesised. The full list, with licences, is in [CREDITS.md](CREDITS.md) and on `/credits/`. Motomation Design is © 2026 asfakulsiam, MIT.

## Gate results

Every number below comes from the skill's own gate (`scripts/gate.mjs`, gate/4, skill v2.6.0 at `8dea1dd`). The gate ran with `--light` on a 2-CPU sandbox against the exact build that is deployed. Each stamp is written into the page's `<head>` and was checked again with `--verify` against a fresh scan.

| Page | Gate | --verify | Stamp | Critique |
| --- | --- | --- | --- | --- |
| `/` | pass | verified | `gate: c0 o0 w0 rm0 a0 n0 q0 k0 · rules: C0 S0 P0 K0 · gate/4 · ecadb920c6 · skipped 5/191@768` | `C5[restraint:kept] H5[375:0] S5[last5:archetype-new,signature-new,fp19] R5[cuts:3,anim:3] M5[t5:pins1/2,webgl0/1,js22/250KB,rm0] V5[entrance-repeats:0] Q5[prog:Δ87.8%,smooth:sandbox,rm:flow] A5[focus:40/40,tgt:0f36w,zoom:0,reflow:0,fc:0,trap:0]` |
| `/exhibits/surreal/` | pass | verified | `gate: c0 o0 w0 rm0 a0 n0 q0 k0 · rules: C0 S0 P0 K0 · gate/4 · cab378136e · skipped 10/167@375` | `C5[restraint:kept] H5[375:0] S5[last5:archetype-new,signature-new,fp46] R5[cuts:3,anim:3] M5[t4:pins1/2,webgl1/1,js21/250KB,rm0] V5[entrance-repeats:0] Q5[prog:Δ8.4%,smooth:sandbox,rm:flow] A5[focus:40/40,tgt:0f20w,zoom:0,reflow:0,fc:0,trap:0]` |
| `/exhibits/cyberpunk/` | pass | verified | `gate: c0 o0 w0 rm0 a0 n0 q0 k0 · rules: C0 S0 P0 K0 · gate/4 · 0a4fb99fe3 · skipped 4/256@768` | `C5[restraint:kept] H4[375:1] S5[last5:archetype-new,signature-new,fp25] R5[cuts:3,anim:3] M5[t2:pins0/2,webgl0/1,js21/80KB,rm0] V5[entrance-repeats:0] Q5[prog:n/a,smooth:n/a,rm:n/a] A5[focus:40/40,tgt:0f31w,zoom:0,reflow:0,fc:0,trap:0]` |
| `/exhibits/retro/` | pass | verified | `gate: c0 o0 w0 rm0 a0 n0 q0 k0 · rules: C0 S0 P0 K0 · gate/4 · 6be6f10571 · skipped 46/211@768` | `C5[restraint:kept] H5[375:0] S3[last5:archetype-new,signature-new,fp81] R5[cuts:3,anim:3] M5[t5:pins2/2,webgl0/1,js21/250KB,rm0] V5[entrance-repeats:0] Q5[prog:Δ2.5%,smooth:sandbox,rm:flow] A5[focus:40/40,tgt:0f21w,zoom:0,reflow:0,fc:0,trap:0]` |
| `/exhibits/futuristic/` | pass | verified | `gate: c0 o0 w0 rm0 a0 n0 q0 k0 · rules: C0 S0 P0 K0 · gate/4 · afe5f16b08 · skipped 6/174@375` | `C5[restraint:kept] H5[375:0] S4[last5:archetype-new,signature-new,fp67] R5[cuts:3,anim:3] M5[t4:pins0/2,webgl0/1,js21/250KB,rm0] V5[entrance-repeats:0] Q5[prog:n/a,smooth:n/a,rm:n/a] A5[focus:40/40,tgt:0f31w,zoom:0,reflow:0,fc:0,trap:0]` |
| `/exhibits/aurora/` | pass | verified | `gate: c0 o0 w0 rm0 a0 n0 q0 k0 · rules: C0 S0 P0 K0 · gate/4 · 7c3effbd45 · skipped 5/180@768` | `C5[restraint:kept] H5[375:0] S1[last5:archetype-reused,signature-reused,fp100] R5[cuts:3,anim:3] M5[t4:pins1/2,webgl0/1,js21/250KB,rm0] V5[entrance-repeats:0] Q5[prog:Δ18.1%,smooth:sandbox,rm:flow] A5[focus:40/40,tgt:0f21w,zoom:0,reflow:0,fc:0,trap:0]` |
| `/exhibits/victorian/` | fail | verified | `gate: c0 o0 w0 rm0 a0 n0 q0 k0 · rules: C0 S0 P1 K0 · gate/4 · 1f23319e97 · skipped 7/169@768` | `C5[restraint:kept] H5[375:0] S1[last5:archetype-new,signature-new,fp100] R5[cuts:3,anim:3] M5[t2:pins0/2,webgl0/1,js21/80KB,rm0] V5[entrance-repeats:0] Q5[prog:n/a,smooth:n/a,rm:n/a] A5[focus:40/40,tgt:0f20w,zoom:0,reflow:0,fc:0,trap:0]` |

What these results do not claim:

- **Smoothness.** It is not judged on this machine (`smooth:sandbox`). Every other axis was measured.
- **Coverage.** The gate skipped up to 22% of text nodes on Exhibit L at 768, inside the pinned reel. That is under the gate's coverage limit, but those nodes are unverified.
- **Exhibit T fails perf-03.** The skill's DarkroomDevelop hardcodes `loading="lazy"` on a data-URI plate, so there is no network fetch. The vendor file is kept identical to the skill, and an upstream `loading` prop is proposed. See [DECISIONS.md](DECISIONS.md).
- **The S axis** (memory) is low on L, S and T. It compares each exhibit with the other exhibits logged in this same build, not with earlier work. See [docs/reviews](docs/reviews/README.md).
- **LCP, CLS and INP** come from the Lighthouse job in CI. They were not measured here.
- **Gate coverage.** Only the seven pages above were gated. Layout QA (`scripts/qa.mjs`, [docs/qa.json](docs/qa.json)) covers all 31 routes at 320, 375, 390, 768, 1440 and 1920: 186 checks, 0 failing. Under reduced motion it covers all 31 routes at 390 and 1440 ([docs/qa-rm.json](docs/qa-rm.json)), 0 failing.

Reviews (/critique, /audit, /overdrive) for each gated page: [docs/reviews/README.md](docs/reviews/README.md).

## Deploy

Preview, the exact verified build: [MOTOMATION · the case file](https://www.perplexity.ai/computer/a/motomation-the-case-file-732kZIiESxiCt_kyxfZVcg).

Vercel was connected, but the deploy did not run. The CLI token authenticates as `dev-asfakul`, but its default scope is the team `dev-choice`, and the CLI answers "Not authorized: Trying to access resource under scope \"dev-choice\"". The personal scope is refused ("You cannot set your Personal Account as the scope"). The site is a plain static export (`out/`) with `vercel.json` headers, so `vercel deploy --prod` from the repo root works once the token can reach that team.

## Licence

MIT. See [LICENSE](LICENSE).

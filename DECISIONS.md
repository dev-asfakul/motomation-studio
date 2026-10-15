# DECISIONS.md

One line of why per call. Newest at the bottom.

## M1 · repo, inventory, shape
- Repo created as `dev-asfakul/motomation-studio` (the connected GitHub account), public, MIT, `main`. The skill author is `asfakulsiam`; this site credits them throughout.
- Skill installed with `npx skills add asfakulsiam/asfakulsiam-motomation-design` (first path in the brief; it worked) → `.agents/skills/`.
- Inventory is generated, not typed: `scripts/inventory.mjs` reads a checkout of the skill at commit `8dea1dd` (v2.6.0) and writes `content/repo.json`. CI and Vercel keep the committed file when no checkout exists.
- The brief says "25-point AI-default scan"; the skill now ships 29 points (Copy group added). The site shows and runs all 29, because the repo is the source of truth.
- The brief says "7-step Thinking Sequence"; the repo has Step 0 (Stack) plus steps 1–7. `/method` interrogates all eight and labels Step 0 as the pre-question.
- Stack: Next.js 16 App Router + React 19 + TypeScript 5.9 (strict). TypeScript 7 is out but Next's type plugin targets 5.x; stability wins.
- Three.js directly, not React Three Fiber: four small scenes (C, E, O, S) don't need a reconciler, and it saves ~40 KB gzipped per scene.
- Collision draws: `collide.mjs --count 20 --spread --seed 2026` gave 20 archetypes, 20 signature seeds, 20 worlds, 12 mutations (pool exhausted after 12, repeats reported by the script). Archetypes kept their drawn mutation; signatures and collisions were re-paired across draws by fit (draws are fuel, not a menu). Two mutations were swapped between A (room) and F (broadsheet): A needs reverse-reveal, the brief's "page starts crowded and scroll subtracts it".
- Two signatures were left over from 22: width-sprint went to the Bureau wordmark (Anybody has a width axis), horizontal-reel to Autopsy's tier strip.
- Fonts not in `data/fonts.csv` are proposed as an addendum (`skill-extensions/data/fonts-addendum.csv`), not passed off as the skill's: Silkscreen (G, pixel), Caveat (P, handwritten).
- No stock photography anywhere. Every image is SVG, canvas or shader. Licence risk zero, and it keeps AI-default scan item 12 clean.
- Palette accents flagged `large-only` in the CSV (A, B, F, H, M, P) are restricted to ≥ 24px or non-text. Measured: `docs/contrast.txt`.
- The Home lineup morphs real glyph outlines extracted from the 20 OFL font files (`scripts/wordmarks.mjs`) with MorphSVG, instead of cross-fading text: it is the only honest way to make one word "become" twenty typefaces.
- Palette changes in the lineup are hard cuts at the beat midpoint. A cross-fade between a dark and a light palette passes through grey-on-grey (1:1), the exact pinned-scene contrast failure the skill's own v3 benchmark caught.

## M2 · Bureau and Home
- The Bureau intercepts every internal link click (capture phase) and runs the evidence swap before `router.push`, so plain `<a>` tags work everywhere and the frame never reloads. Modified clicks, new tabs and downloads pass straight through.
- Smooth scroll is Lenis driving ScrollTrigger; it is not created at all under reduced motion.
- Lineup glyph groups use GSAP `svgOrigin: "0 0"`; `transformOrigin` resolves per element bbox on SVG and slid each glyph out of the word.
- Lineup mobile choreography is MOTO / MATION on two rows with a 700vh chapter (1000vh desktop); the suspect card hides the verdict line on phones.
- The lineup position counter is `role="timer"` with `aria-live="off"`: it is a timecode, and the gate's numbers check treats it as live rather than "corrected".
- `content/wordmarks.json` (124 KB) loads as its own chunk after first paint; the cover mark is inlined from the single Bureau entry only.

## M3 · Exhibits A–E
- Exhibit typefaces are loaded through one `src/exhibits/fonts.ts` with `preload: false`: an exhibit page carries @font-face rules for all 39 faces but downloads only the ones it renders.
- "Big Shoulders Display" is now published on Google Fonts as "Big Shoulders" (opsz axis); Exhibit J uses that family.
- A shared `useGL` harness (`src/lib/gl.ts`) is the only way Tier 4 scenes start: lazy `import("three")` near the viewport, DPR cap, paused off screen and in hidden tabs, poster on low-end (deviceMemory < 4, < 4 cores, Save-Data, 2G), no WebGL, or reduced motion.
- Exhibit originals are generic components in `src/components/originals/` (header format from the skill); exhibit folders only pass content in.
- Count-ups only run on a visitor's press (Exhibit D "Recount"), never on scroll: the gate's numbers check fails any value that is shown and later corrected.
- Before/After "typical output" mock carries no button label and no marketing line the copy rules would flag; its copy is deliberately bland, not banned.

## M4 · Exhibits F–J
- F: redaction bars are buttons with `aria-pressed`, so the hidden words are always in the accessibility tree; only the bar is decoration. Only one word of the headline is redacted, so the display line still reads at a glance.
- F: the reflow photo is a real float re-inserted between paragraphs (no absolute positioning), with Move up / Move down / Swap side buttons as the non-drag path.
- G: the sprite map runs on a 10 fps `setInterval` (stepped, not rAF) and maps eight real repo folders with their real file counts; every item also exists as a text list.
- G: the title uses non-breaking hyphens and per-line `nowrap` after the first screenshot showed "8-" / "BIT" splitting.
- H: squash and stretch keep area constant (`scale(1/s, s)`); one shared SVG lighting filter textures every clay surface, softened after the slab read as carpet.
- I: three glass slides maximum, each about 340×210, to cap backdrop-filter area; the heat field simulates at 72×44 and the browser upscales and blurs it.
- J: the terminal answers from the inventory (folders, signatures, tiers, install paths, commands), never canned text; rain is 2D canvas with DPR capped at 1.5.
- Memory check for A–J (docs/memory-checks.txt, via scripts/memory-batch.mjs): tier repeats are flagged on most runs; accepted, because the brief fixes "lowest tier that delivers" and twenty exhibits share five tiers. Exhibit B's archetype flag is against the Home run, which was logged before Home's archetype was settled as the board. J and E share the "product" layout fingerprint; accepted because their heroes (working terminal vs draggable windows), type, palette and motion physics differ on every visible axis.

## M5 · Exhibits K–O
- K: Ben-Day dots are computed on canvas from drawn sources (magnifier, thumbprint, the M, a case folder), never filtered photographs; the vendor Halftone sits beside it in the lab so the two jobs are visible.
- K: speech bubbles keep the whole line in the DOM (sr-only) and type a visual copy, so screen readers hear it once.
- L: Tier 5 uses one paused GSAP master timeline whose progress is set from the sticky section; the tape deck drives the same scroll position through Lenis, so deck and scroll can never disagree. Storyboard, timing sheet, frame budget and the reduced-motion storyboard are in docs/storyboards/retro.md.
- L: no video file. The reel is DOM, SVG and a 12 fps grain tile, a fraction of the weight of footage, and every frame stays real text.
- M: the receipt lists the gate's nine checks as REQUIRED, not PASS: the site does not claim a pass it has not measured.
- M: ransom letters are drawn from ten faces the site already loads for other exhibits, so the note costs no new font files.
- N: the vendor Letter Relay renders its own h1 and fixed header, which would fight the Bureau bar; the signature is bent in place instead (the chosen feature's letters travel into the caption), and the vendor component is shown on /lab.
- N: Archivo is loaded with its `wdth` axis so witness labels can run at 62% and the title at 125% from one family.
- O: the hologram is the only WebGL scene on its page, starts only near the viewport, and falls back to a designed SVG poster of the same layers (the sandbox's 2-core machine always gets the poster, which is what the screenshots show).
- Memory check K–O appended to docs/memory-checks.txt.

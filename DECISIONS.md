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

## M6 · Exhibits P–T
- P: the notebook's freehand layer sits under the copy (the copy has pointer-events none), so the whole page is drawable without stealing links; strokes are saved on this device only and the controls say so.
- P: the red pen accent (#C2562F) fails 4.5:1 on paper, so text uses a darker red (#A8461F, 5.16:1) and the brighter red stays on lines and borders.
- Q: tarot faces are inventory facts; the deck lists every face in a details element, so nothing is hidden behind chance. Plants were cut back to the bottom quarter after the first screenshot showed leaves under the controls.
- R: stencils mask spray with a Path2D hit test instead of a second compositing canvas: one canvas, no per-frame mask pass.
- S: one fragment shader on a full-screen quad, DPR capped at 1.5; the hour drives a CSS gradient poster when WebGL is off. The title keeps "3 AM" together with a no-break space.
- T: the curtains part when the hero enters and close when it leaves; engravings are SVG hatching patterns, not raster textures.
- Memory check P–T: tier repeats again accepted. Two structural flags: P matches L (both "scroll" signatures on a sequence layout) and T matches R on layout, signature type and tier. Accepted: P is a still notebook page with a drawing layer while L is a scrubbed Tier 5 film; T is a centred gallery of framed plates while R is a paintable wall. The fingerprint does not see palette, type, texture or interaction, which differ completely.
- Style extensions: 16 style files in `skill-extensions/styles/` in the skill's own format, plus default dials, archetypes, section order, signature menu and must-haves; Silkscreen and Caveat (missing from the skill's fonts.csv) are in `skill-extensions/data/fonts-addendum.csv`.

## M7 · The rooms
- Board: plain wheel scrolls the page and ⌘/Ctrl + wheel zooms, so the board never traps the visitor; one finger on a phone pans sideways and leaves vertical scroll to the page. The same filters drive a table below the board, which is the accessible reading of it.
- Board: dimmed cards stay legible (grayscale at 42% opacity is decoration; the table carries the facts). Tier 1 shows 0 exhibits and says why instead of hiding the chip.
- Archetypes are laid out on the Board (where the structures live); the search index points there, not to the Autopsy.
- Autopsy: one long report with a scrollspy tree, not a click-to-reveal panel, so every anchor (#sig-, #tier-, #cmd-) exists in the HTML and search links land.
- Collision engine: ported from scripts/collide.mjs with the same PRNG and draw order. Checked: seed 42, one draw gives The Diptych · Shift the tempo · subway map · Ink Fill, the same as the CLI.
- Inventory fixes found while building: fonts.csv notes like "(check the foundry's language list)" were being read as scripts named "the" and "language"; the v3 findings list ran on into the sequences block. Both parsers fixed; Fontshare faces are shown as unconfirmed for Latin rather than dropped.
- Method: the plan is read from DESIGN.md at build time, so the page and the file cannot drift. Steps are not dimmed (dimmed text fails AA); the active step gets an accent rule instead.
- Lab: Motion 1 overrides matchMedia for the vendor components so each renders its author's reduced-motion version: a real Tier 1, not a CSS pause. The override is installed during render (before the re-keyed specimens mount) and removed when the Lab unmounts.
- Lab: demos mount only within 500px of the viewport and unmount when they leave, so the 68 specimens never run together.
- Lab morph: colour interpolates, type does not (families can't be blended honestly). The raw blend is measured at every step and the text swaps to the best-reading candidate when the blend drops under 4.5:1, which is shown.
- Locker: the two single-file editions copy their raw URL, so all 11 procedures can be sealed.
- Repo text with em dashes is shown with commas (copy rule), and a lone dash in a table reads "none".
- Verdict: unlock reads the evidence tray; the poster seed is kept per device so the poster is stable until you ask for a new one.

## M8 · QA, gate, deploy
- The skill's gate runs here, slowly: 2 CPUs, light footprint, 3.5 to 13 minutes a page. It runs one page at a time against a frozen copy of out/ served with the production headers (`scripts/gate-run.mjs`), because rebuilding out/ mid-scan poisons the result.
- Smoothness is not judged on this machine (the gate itself says "sandbox: 2 CPUs"); every other axis is measured. Reported as such, never as a pass.
- Security headers live in vercel.json; `scripts/serve.mjs` sends the same set locally and postbuild writes out/_headers for hosts that read one. The CSP allows 'unsafe-inline' scripts because Next's static export bootstraps inline; nothing loads from another origin.
- Next's legacy noModule polyfill script gets `defer` in postbuild: modern browsers skip it, but without defer it reads as render-blocking.
- Inline links in running text get 4px vertical padding so every target is 24px tall without changing line layout.
- Display titles are sized from their longest word (`fit` on RoomHead: 90 / (letters × 1.04) vw), measured against the gate's word check, so no display word breaks or overflows at 320.
- The sound slip joins the page flow under the bar at narrow or short viewports (≤ 760 wide or ≤ 560 tall, i.e. 200% zoom), so it never covers a control.
- Home lineup rail moved to the top right under the counter: at the bottom right the sound slip covered it, which the gate caught as 12 unfocusable links.
- Evidence markers: the tag shape's point is drawn below the text box, not clipped out of it, so the number always sits on solid tape (the clipped corners read as dark-on-dark).
- The case clock is aria-hidden: it is decoration that changes every second, and the case number itself is read separately.
- Exhibit J: the outlined word keeps its stroke but now has a real neon fill (10.3:1), so it reads without relying on the stroke.
- Exhibit L: short viewports get the reel sheet instead of the pin, the same rule the skill's own HorizontalReel uses; the Lab reel's container is minmax(0, 1fr) so the strip has somewhere to travel (it was stuck at 0px).
- Split-layout exhibit heads are no longer sticky: a sticky block that never changes reads as a frozen scene to the gate's progression check, and it gained nothing.
- Palette swatches align to the top of their cell; a stretched row was widening the ground chip through aspect-ratio.
- Layout QA (`scripts/qa.mjs`) covers every route at 320 to 1920 for scroll width, escaping elements and display words broken mid-word, because the gate's own overflow check only runs on the pages it scans.

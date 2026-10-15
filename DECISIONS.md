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

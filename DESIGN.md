# DESIGN.md: Motomation Studio (Case File: MOTOMATION)

> How it looks. Written by `/shape`, read by every later command. Overrides the house defaults where stated.

## MOTOMATION PLAN

```
MOTOMATION PLAN
Stack       : Next.js App Router + TypeScript + Tailwind, static export (named in the brief) → adapters/next.md
Tension     : taste can't be proven in words, yet a design skill has to prove it has taste
Concept     : put the repo on the table and examine it: the site is a forensic case file and every file is evidence
Archetype   : the evidence board (gallery-wall frame) mutated by second-person: the visitor is the investigator
Collision   : forensic lab → evidence tags, chain of custody, UV reveal; each exhibit draws its own (collide.mjs --count 20 --seed 2026)
Signature   : The Lineup: the word MOTOMATION morphs its real glyph outlines through all 20 exhibit typefaces as you scroll
Dials       : ENERGY 2 · RHYTHM 3 · MOTION 3 → Tier 5 for the Home lineup and Exhibit L, Tier 2–4 elsewhere
Type mode   : HOUSE STYLE (a design skill's own site is a brand site; type is the image)
Type        : Anybody (width axis; it carries the width-sprint and the lineup) / Inter Tight text / Fragment Mono labels
Palette     : Darkroom (#0E0D0B · #F2EEE6 · accent #E0442B evidence red), from data/palettes.csv
Not doing   : a docs site with a component grid (the skill's own Pages site already is one); a gradient hero; a fake terminal
```

## Stack
- **Stack:** Next.js 16 App Router, React 19, TypeScript (strict), Tailwind v4 for the Bureau, plain CSS per exhibit
- **Source:** named in the brief
- **Reason:** multi-page with a persistent frame that never reloads (the Bureau), code-split per exhibit, static export to Vercel
- **Adapter:** `adapters/next.md` (client islands for motion, `output: "export"`, GSAP registered once in `src/lib/gsap.ts`)

## Concept
- **Tension:** taste can't be proven in words.
- **Concept sentence:** the repo is on the table; examine the evidence.
- **Archetype + mutation:** the Bureau is an evidence board (gallery-wall) in second person: the visitor collects evidence A–T, leaves tags and fingerprints.
- **Collision:** forensic lab: evidence tags, numbered markers, chain of custody, UV, redaction, lab reports.
- **Signature move:** The Lineup (Home): real glyph-outline morph of MOTOMATION through 20 typefaces against a lineup height wall.
- **Dials:** ENERGY 2 · RHYTHM 3 · MOTION 3 → Tier 5 (one chapter on Home, and Exhibit L), Tier 2 elsewhere, Tier 4 only for C, E, O, S.
- **Rejected:** a component-grid docs homepage; a "hero + 3 features" landing; WebGL on every page (the skill's own v3 failure); gore or real cases.

## Two layers
1. **The Bureau** (constant): house style. Darkroom palette, Anybody display with a live width axis, Fragment Mono labels, a 12-column grid with numbered markers, one accent (evidence red) at the moment that matters. Always present: case number with time-on-file, evidence tray A–T (localStorage), UV torch (U), ⌘K search, sound (off, asked once), Index.
2. **The Exhibits** (20): each takes over the viewport with its own type, palette, grid, texture, motion physics, cursor and sound. The Bureau bar stays as a slim dark slab so control is always one click away.

## Typography (Bureau)
Type mode: HOUSE STYLE, because this is a brand site for a design skill whose first law is "type is chosen first".

| Role | Family | Weight/axes | Size token | Notes |
|---|---|---|---|---|
| Display | Anybody | 800, wdth 110–150 | `--step-4/5` | the width axis is the signature in the bar (width-sprint) |
| Heading | Anybody | 800, wdth 120 | `--step-2/3` | |
| Body | Inter Tight | 400 | `--step-0` | text face on purpose; never display (banned as display) |
| Mono / labels | Fragment Mono | 400 | `--step--1` | evidence tags, case numbers, timecodes |

## Colour (Bureau)
| Token | Value | Contrast vs ground | Use |
|---|---|---|---|
| `--ground` | #0E0D0B | — | page |
| `--ink` | #F2EEE6 | 16.78:1 (measured) | text |
| `--muted` | #A8A196 | 7.58:1 | labels, captions |
| `--accent` | #E0442B | 4.65:1 | evidence red: the active marker, the CTA hover, the string |
| `--tape` | #F2C230 | #111 on tape 11.27:1 | evidence tags only |
| `--uv` | #B9A6FF | 9.21:1 | UV annotations only (the torch is the reason) |

All exhibit palettes are rows of `data/palettes.csv`; measured pairs are in `docs/contrast.txt`. Accents marked `large-only` in the CSV (A, B, F, H, M, P) are used only at ≥ 24px or as non-text.

## Layout
- Grid: 12 columns, gutter `clamp(16px, 2.4vw, 32px)`, numbered markers in the margin.
- Bar: 52px fixed slab. Footer: the evidence log, rooms, chain of custody.
- Mobile (390×844) is its own composition: the lineup stacks MOTO / MATION on two rows, the board becomes a swipeable list plus a pan canvas, exhibits recompose (not shrink).

## Exhibits (each a double exposure: style + archetype + signature + fonts + palette)
| Ex | Style | Title | Archetype + mutation | Collision | Signature | Tier | Dials E·R·M | Display / text | Palette | Swap |
|---|---|---|---|---|---|---|---|---|---|---|
| A | Minimalism | The Empty Room | room + reverse-reveal | metronome | ink-fill | 2 | 1·1·2 | Instrument Serif / Instrument Sans | Bone & Graphite | dust-brush |
| B | Maximalism | The Overstuffed Evidence Room | gallery-wall + second-person | museum label | sticker-scatter | 2 | 3·3·2 | Syne / Space Mono | Citrus Brutal | tape-peel |
| C | Surreal | The Dream Witness | stage + invert-axis | kaleidoscope | aperture | 4 | 3·2·3 | Gloock / Newsreader | Lagoon | polaroid |
| D | Swiss | The Grid Reconstruction | catalogue + single-object | scoreboard | line-curtain | 2 | 2·1·2 | Schibsted Grotesk / Schibsted Grotesk | Swiss Red | scan-line |
| E | Y2K | The Burned CD | workbench + single-object | boarding pass | neighbour-moves | 4 | 3·2·3 | Unbounded / Onest | Arctic Lab | shutter |
| F | Editorial | The Front Page | broadsheet + swap-material | darkroom tray | remembered-list | 2 | 2·2·1 | Libre Caslon Display / Newsreader | Paper & Vermilion | redaction |
| G | Pixel art | The 8-Bit Crime Scene | atlas + swap-material | elevator panel | pixel-wake | 2 | 2·2·2 | Silkscreen / Martian Mono | Bauhaus Blackboard | scan-line |
| H | Clay | The Plasticine Lineup | shelf + ui-is-content | tailor's measuring tape | hold-to-commit | 2 | 2·2·2 | Tilt Warp / Figtree | Clay & Moss | polaroid |
| I | Glassmorphism | The Specimen Slides | specimen + print-rule | thermal camera | lens | 3 | 2·2·2 | Sora / DM Sans | Night Lagoon | polaroid |
| J | Cyberpunk | The Neon Stakeout | console + scale-abuse | weather radar | decode | 2 | 3·2·2 | Big Shoulders Display / JetBrains Mono | Wet Concrete | scan-line |
| K | Pop art | The Halftone Dossier | lookbook + print-rule | ticket stub | proximity-weight | 2 | 3·3·2 | Rubik Mono One / Work Sans | Bauhaus Primaries | shutter |
| L | Retro | The Case Tape Archive | film-reel + invert-axis | film leader | timecode-rail | 5 | 2·3·3 | Epilogue / IBM Plex Mono | Safelight | film-burn |
| M | Collage | The Ransom Note | letter + constraint | receipt printer | brand-selection | 2 | 3·3·1 | Young Serif / Crimson Pro | Concrete & Signal | tape-peel |
| N | Vector art | The Composite Sketch | diptych + scale-abuse | origami | letter-relay | 3 | 2·2·2 | Archivo / Archivo | Ultramarine Press | dust-brush |
| O | Futuristic | The Holographic Reconstruction | field-guide + wrong-room | railway departure board | stacked-deck | 4 | 3·2·3 | Azeret Mono / Geist | Arctic Lab Dark | scan-line |
| P | Handwritten | The Detective's Notebook | timeline + remove-expected | library card catalogue | thread | 2 | 2·2·2 | Caveat / Literata | Sun-Bleached | dust-brush |
| Q | Bohemian | The Greenhouse Reading | index + tempo-shift | herbarium | considerate-magnet | 2 | 2·2·2 | Fraunces / Spectral | Saffron Market | polaroid |
| R | Graffiti | The Wall | manifesto + second-person | rickshaw art | velocity-skew | 2 | 3·2·2 | Climate Crisis / Familjen Grotesk | Vermilion After Hours | tape-peel |
| S | Aurora | The 3 AM Alibi | ledger + constraint | lighthouse | seismograph-line | 4 | 1·1·3 | Cormorant Garamond / Hanken Grotesk | Monsoon Night | film-burn |
| T | Victorian | The Gaslight Archive | poster + tempo-shift | stamp and postmark | darkroom-develop | 2 | 2·2·2 | Bodoni Moda / EB Garamond | Night Brass | redaction |


Uniqueness, checked: 20 archetypes (each once), 20 signatures (each once; width-sprint is the Bureau's, horizontal-reel lives on Autopsy), 20 display faces, 20 palettes. `memory.mjs check` output per batch: `docs/memory-checks.txt`.

## Imagery
- Source: none required. Every image is made: SVG, canvas, shaders, procedural textures. No stock photography (it would fail AI-default scan item 12).
- `[NEEDS ASSET]` list: none.

## Restraint Gate record
- Concept survived: yes
- Cut: a cork-board texture behind the Bureau — fails Q1 and Q2 (the red string carries the board; cork is the cliché)
- Cut: a loading screen with a fingerprint scan before every page — fails Q1 and Q2 (it delays the case and says nothing new)
- Cut: a custom cursor on Bureau pages — fails Q1 and Q2 (exhibits own the cursor; the Bureau stays plain so the contrast reads)
- Kept: the UV torch — fails Q1, passes Q2: the concept is a forensic examination and the hidden annotations are content
- Kept: sound — fails Q1, passes Q2: an evidence room has a room tone; it is off by default and asked once
- Rejected animation: auto-cycling the lineup on load — fails question 1 (scroll is the investigator's hand; it should not play itself)
- Rejected animation: parallax on Bureau headings — fails question 2 (it tells the visitor nothing)
- Rejected animation: a looping glitch on the wordmark — fails question 4 (never stops, costs frames)

Per-exhibit Restraint Gate entries are in `src/content/exhibits.ts` (`restraint`) and rendered on each exhibit's Skill Link section.

# MOTION.md: Motomation Studio

> How it moves. Timecodes are fractions of each chapter's scroll and match the timeline positions in code
> (`src/components/home/Lineup.tsx`, `src/exhibits/retro/`).

## Motion principles for this project
- **Tier:** 5 for one chapter on Home (The Lineup) and for Exhibit L. Tier 4 only for C, E, O, S (spatial, material or lit). Tier 2 is the working default; Tier 1 for all UI feedback.
- **Personality (Bureau):** weight. Confident ease-out, nothing bounces in the frame. Exhibits bring their own physics.
- **Ease tokens used:** `--ease-out` (UI), `--ease-out-strong` (reveals, swap reveal), `--ease-in-out` (swap cover), `none` inside scrubbed timelines.
- **What never moves:** body copy, the evidence tray positions, the case number (it counts, it does not animate), anything in a reduced-motion session.

## Global
| Element | Behaviour | Tier | Duration/ease | Reduced motion |
|---|---|---|---|---|
| Smooth scroll | Lenis, lerp 0.12, drives ScrollTrigger | 2 | — | off: native scroll |
| Bureau wordmark | width-sprint: wdth 110 → 150 with scroll velocity, relaxes on stop | 2 | per frame, 0.35 lerp | fixed at wdth 110 |
| Evidence swap | cover 420ms `--ease-in-out`, navigate, reveal 460ms `--ease-out-strong`; 7 variants matched to the destination | 3 | 420 / 460ms | instant route change, no cover |
| Buttons, toggles | press scale 0.97, colour 150–180ms | 1 | ≤ 250ms (rules.csv) | colour only |
| UV torch | radial light follows the pointer; annotations appear | 1 | per pointer move | a flat dim violet wash, annotations still appear |
| Evidence tray | cell fills red when an exhibit is logged | 1 | 200ms | instant |

### Evidence swap variants (destination → variant)
| Destination | Variant | What it says |
|---|---|---|
| Home | film-burn | the reel starts again |
| Board, Locker | tape-peel | crossing the tape into a sealed area |
| Autopsy, D, G, J, O | scan-line | a scan passes over the specimen |
| Method, Dossier, F, T | redaction | the file is redacted, then opened |
| Lab, C, H, I, Q | polaroid | a print develops |
| Receipts, E, K | shutter | an evidence photo is taken |
| Credits, A, N, P | dust-brush | dust is brushed away from where you clicked |
| L, S | film-burn | the tape/sky burns in |
| B, M, R | tape-peel | |

## Timing sheet: Home

### Chapter 1: Case Opening · 100vh desktop / 100svh mobile · still · technique A (DOM/SVG)
| Beat | Range | Element | Action | Ease | Overlap | Camera | Reduced motion |
|---|---|---|---|---|---|---|---|
| 01 | @0 · 0ms | case cover | static on load (no entrance: LCP is text) | — | — | — | same |
| 02 | 0–100% | cover type | drifts up 8vh as chapter 2 pins | none | — | truck up | static |

### Chapter 2: The Lineup · 20 beats · 1000vh desktop / 700vh mobile · dense · technique A (MorphSVG on real glyph paths)
Each beat is 1/20 of the chapter. Inside a beat: 0–55% morph, 55–100% hold (the screenshot test frame).

| Beat | Range | Element | Action | Ease | Overlap | Camera | Reduced motion |
|---|---|---|---|---|---|---|---|
| 01 | 0–5% | wordmark (Bureau → J) | 10 glyph paths morph from Anybody to Big Shoulders Display; palette snaps at 2.75% | none | hold 45% | push in 4% | contact sheet card J |
| 02 | 5–10% | J → A | Big Shoulders → Instrument Serif, Wet Concrete → Bone & Graphite | none | hold 45% | — | card A |
| 03–20 | 10–100% | A → B → T → G → S → D → R → I → M → L → F → E → P → O → K → C → H → Q → N | same grammar; lineup height wall and suspect label update on each hold | none | hold 45% each | pull out on 20 | cards in lineup order |
| rail | 0–100% | timecode rail | counts 01/20 → 20/20 with the beat; label flips (split-flap) | steps | with | — | static index |

Rhythm: chapter 2 is dense; chapter 1 and 3 are the breath around it. Palette changes are hard cuts at the beat midpoint, never cross-fades, so text never sits on a half-mixed background (the contrast failure the skill's v3 benchmark caught).

### Chapter 3: Landing on the board · 120vh · still · technique A
| Beat | Range | Element | Action | Ease | Overlap | Camera | Reduced motion |
|---|---|---|---|---|---|---|---|
| 01 | 0–40% | wordmark (N → Bureau) | morphs home to Anybody and scales to 40% | none | — | pull out | static |
| 02 | 30–80% | red strings | four strings draw from the mark to the evidence counts (68 / 22 / 5 / 20) | none | over −10% | — | drawn |
| 03 | 70–100% | CTA | "Open the evidence board" settles | — | after | — | visible |

## Chapters (Motomation)
### Chapter: The Lineup · length: 1000% viewport desktop, 700% mobile · technique: A
| Scene | Timecode | Shot / visual | Type on screen | Camera move | Transition out |
|---|---|---|---|---|---|
| 01 | 0.00–0.25 | J A B T G: dark → light → loud → gaslight → pixel | MOTOMATION in each face, suspect card | slow push | hard palette cut |
| 02 | 0.25–0.50 | S D R I M: aurora → grid → wall → glass → ransom | same | hold | hard cut |
| 03 | 0.50–0.75 | L F E P O: tape → newsprint → chrome → ink → hologram | same | hold | hard cut |
| 04 | 0.75–1.00 | K C H Q N: halftone → dream → clay → greenhouse → vector | same | pull out to the board | morph to Bureau |

**Frame budget:** 10 SVG paths, one transform on the group, one background colour per beat. No canvas, no WebGL, no image sequence. Target 60fps at 4× CPU throttle; measured in the gate's `q` smoothness check.
**Static fallback frames:** the reduced-motion storyboard below.
**Assets:** `content/wordmarks.json` (glyph outlines extracted from the 20 OFL fonts by `scripts/wordmarks.mjs`), loaded as its own chunk after first paint.

### Designed reduced-motion storyboard (Home)
Not the same page with motion off: a different composition.
| Frame | What the visitor sees |
|---|---|
| R1 | The case cover, identical text, no drift |
| R2 | **The lineup photo sheet:** a 4 × 5 contact sheet (2 × 10 on phones), each cell the wordmark set in that exhibit's face and palette, with a height wall and a suspect card (letter, style, typeface, palette). Every cell is a link to its exhibit |
| R3 | The board landing with all four red strings already drawn and the counts printed |

## Signature move
- **Name:** The Lineup
- **Trigger:** scroll position through chapter 2 (scrubbed, `scrub: 0.6`), also keyboard: the page scrolls normally, nothing is hijacked
- **Off-switch (touch / reduced motion):** touch keeps the scrub with a shorter chapter and the two-row wordmark; reduced motion swaps to the contact sheet (R2)

## Exhibit physics (one line each; full entries in `src/content/exhibits.ts`)
A one slow ease · B heavy drag with lag · C floating, reversible gravity · D linear snap to grid units · E springs with overshoot · F paper weight · G stepped 10fps · H squash, stretch, sag · I viscous glide · J 60ms jitter · K impact then still · L tape inertia (Tier 5) · M paper, lands off · N clean vector morph · O weightless orbit · P uneven hand · Q wind sway · R gravity drips · S drift · T heavy unfurl.

## Tier budget per page
| Page | Tier | Pins | WebGL | Notes |
|---|---|---|---|---|
| Home | 5 | 1 | 0 | one pinned chapter |
| Board | 2 | 0 | 0 | pan/zoom canvas, SVG strings |
| Exhibit C, E, O, S | 4 | ≤ 1 | 1 | lazy-mounted near the viewport, paused off-screen, DPR ≤ 1.75, poster on low-end |
| Exhibit L | 5 | 1 | 0 | DOM/SVG scroll film |
| Other exhibits | 2–3 | ≤ 1 | 0 | |
| Autopsy, Method, Lab, Receipts, Locker, Dossier | 1–3 | ≤ 1 | 0 | Lab mounts each specimen only when near the viewport |
| Verdict | 2 | 0 | 0 | canvas 2D poster, PNG export |

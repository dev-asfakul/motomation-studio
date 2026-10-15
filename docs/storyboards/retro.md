# Exhibit L · The Case Tape Archive · Tier 5 storyboard

Technique A (one GSAP master timeline, `paused`, progress set from the sticky section's scroll progress). Section height 720vh desktop, 560vh phone. One timeline unit per chapter; four chapters.

## Storyboard

| Unit | Frame | What the visitor sees | What it says |
| --- | --- | --- | --- |
| 0.00–0.26 | Leader | Academy leader 5 → 2 in the 4:3 gate, wedge sweeping, sprockets running on the left | A reel is starting; scroll is the projector |
| 0.24–0.38 | Burn | A warm film-burn bloom covers the cut | Chapter cut |
| 0.28–0.40 | Title card | "Reel n" and the chapter title slide in from the left and stop | Chapter name |
| 0.36–0.96 | Strip | The chapter's items (steps, tiers, signatures, install command) travel right to left as a strip | The evidence in that reel |
| 0.97 | Out | Chapter fades to the next leader (last chapter holds) | |

Chapters: Reel 1 The Brief (the 8 Thinking Sequence steps), Reel 2 The Tiers (5 tiers), Reel 3 The Signatures (first 8 of 22), Reel 4 The Verdict (the project install command).

## Timing sheet

| Element | Property | Range (units) | Ease |
| --- | --- | --- | --- |
| `.l-film` | background-position-y 0 → −4000px | 0–4 | none (scrubbed) |
| `.l-leader` | autoAlpha 1 → 0 | n+0.26, 0.04 | none |
| `.l-burn` | autoAlpha 0 → 0.9, scale 0.6 → 2.2; then autoAlpha → 0 | n+0.24, 0.08; n+0.32, 0.06 | none |
| `.l-card` | xPercent −12 → 0, autoAlpha 0 → 1 | n+0.28, 0.12 | power2.out |
| `.l-strip` | xPercent 30 → −40 (−70 phone) | n+0.36, 0.60 | none |
| Tape deck | play 1 s/s, ff/rew ±6 s/s across a 4:12 tape | continuous | none |
| Tracking band | only while the deck is in ff or rew | 0.4 s steps(4) | steps |

## Frame budget

- Animated properties: transform, opacity, background-position on one 28px strip. No layout, no filter animation.
- One sticky layer; grain is a 160px tile at 12 fps (CSS steps), not a full-screen canvas per frame.
- The leader is a single SVG path rewritten at most once per frame from React state, only while its chapter's leader is on screen.
- Target 60 fps at 1440×900 on integrated graphics; phones keep the same timeline with a narrower strip.

## Reduced motion storyboard

The section loses its 720vh height and sticky stage. The four chapters become four still frames stacked in order: a still leader showing 5, 4, 3, 2, beside the title card and the full item list. The deck's rewind and fast-forward jump to the previous or next chapter; play and pause still work as a scroll of the page. No grain animation, no burn, no tracking band.

# Reviews: /critique, /audit, /overdrive

Pages: Home, C (surreal), J (cyberpunk), L (retro), O (futuristic), S (aurora), T (victorian).
Every score below comes from `scripts/gate.mjs` (gate/4, skill v2.6.0 at `8dea1dd`). The trace in brackets is the check that produced it. None of the scores were typed by hand.
The scans ran on a frozen copy of `out/`, in the light footprint, on a 2-CPU sandbox, so smoothness was not judged (`smooth:sandbox`).

Score sources: `docs/gate/<page>.json` · logs `docs/gate/<page>.log` · verify logs `docs/gate/<page>.verify.log` · layout QA `docs/qa.json`.

## How the S axis behaves here

S (memory) compares a page with the last five runs in `.motomation/log.json`. During planning, all 20 exhibits were logged into that file one after another (see `docs/memory-checks.txt`). That means the S score for an exhibit measures how close it sits to the exhibits logged right before it in this same build. It does not compare against earlier projects.

- **S (aurora), S1:** the log still holds its own entry, `ledger/seismograph-line` at index 19, and the gate drops only the very last entry. So the page is scored against itself (fp100).
- **T (victorian), S1, fp100:** the gate drops its own last entry. The five entries before it carry no section lists, so the fingerprints collapse to near-identical records.
- **L (retro), S3, fp81:** the same effect, at lower strength.

Uniqueness was checked where it actually matters. The 20 exhibits use 20 different archetypes and 20 different signatures, and `docs/memory-checks.txt` records the planning checks. /overdrive does not "fix" S by editing the log, because that would only be gaming the score.

---

## CRITIQUE · Home `/`
```
Scores     C 5 · H 5 · S 5 · R 5 · M 5 · V 5      (+ Q 5 · A 5)
Trace      C5[restraint:kept] H5[375:0] S5[last5:archetype-new,signature-new,fp19] R5[cuts:3,anim:3]
           M5[t5:pins1/2,webgl0/1,js22/250KB,rm0] V5[entrance-repeats:0] Q5[prog:Δ87.8%,smooth:sandbox,rm:flow]
           A5[focus:40/40,tgt:0f36w,zoom:0,reflow:0,fc:0,trap:0]
Verdict    The Lineup does the arguing: one wordmark, 20 real typefaces, so the claim is shown before it is said.

Top 3 problems
1. The Lineup morph needs the 20 exhibit display faces. Over a cold, slow connection the first scroll frames
   show fallback outlines — where: src/components/home/Lineup.tsx — why: the signature reads as broken for a
   moment. Fix: preload the first 3 faces in order and hold the morph at frame 0 until each face resolves.
2. 5 of 191 text elements were skipped at 768 (inside the pinned lineup) — where: gate coverage — why: those
   nodes are unverified. Fix: expose the pinned captions to the gate at rest (they are mid-transform at scan time).
3. Smoothness is unmeasured on this sandbox — why: Q5 rests on progression and reduced motion only.
   Fix: let CI (4+ CPUs) record smoothness in the Lighthouse job.

AI-default scan    0 failed (rules C0 · copy rules pass)
Restraint Gate     UV torch — Q1 storytelling pass · Q2 pass → kept; case clock — Q1 feedback pass → kept
Motion             passes; the one pin (lineup) is under the Tier 5 budget of 2
Choreography       measured by the gate as Q5 (prog Δ87.8%, rm:flow)
Accessibility      0 contrast fails, focus 40/40, 0 target fails, zoom 0, reflow 0
Performance        JS 22 KB / 250 KB tier budget (gate); LCP/CLS/INP: CI Lighthouse, not measured in sandbox
Keep               The Lineup · the case-number bar · the evidence tray
Next command       none (every axis ≥4)
```

## CRITIQUE · C `/exhibits/surreal/`
```
Scores     C 5 · H 5 · S 5 · R 5 · M 5 · V 5      (+ Q 5 · A 5)
Trace      S5[last5:archetype-new,signature-new,fp46] M5[t4:pins1/2,webgl1/1,js21/250KB,rm0] Q5[prog:Δ8.4%,…]
Verdict    The aperture keyhole works as a stage: the page opens the way the style asks to be looked at.
Top 3 problems
1. The melt-type shader is the heaviest item on the page — where: src/components/originals/melt-type-shader.tsx
   via src/lib/gl.ts — why: low-end phones pay for it. Fix: pass cap 1 under 600px wide (the harness caps DPR at
   1.75; three loads lazily and pauses off screen already).
2. 10 of 167 text elements were skipped at 375 — why: those nodes are unverified. Fix: pause the aperture at rest
   for the scan.
3. The keyhole progression is only Δ8.4%. It passes, but the move is quiet. Fix: none needed; this is the restraint working.
AI-default scan    0 failed
Accessibility      0 fails · focus 40/40
Performance        JS 21 KB / 250 KB; WebGL 1/1 allowed
Keep               keyhole aperture · melting display type · the stair
Next command       none
```

## CRITIQUE · J `/exhibits/cyberpunk/`
```
Scores     C 5 · H 4 · S 5 · R 5 · M 5 · V 5      (+ Q 5 · A 5)
Trace      H4[375:1] (words.hier.focalTies 2), M5[t2:pins0/2,webgl0/1,js21/80KB,rm0]
Verdict    A console that decodes the repo. The terminal is the page, not decoration on it.
Top 3 problems
1. Two elements tie for the largest size on the first 375 screen ("THE NEON" and "STAKEOUT" lines) —
   where: src/exhibits/cyberpunk/Hero.tsx — why: the eye has no single entry point. Fix: set the cyan line to
   1.08× the first line, or render the h1 as one sized element.
2. Tier 2 JS budget 80 KB: at 21 KB it is fine, but any new terminal command must stay inside it.
3. Progression n/a (no pins): correct for Tier 2.
AI-default scan    0 failed
Keep               the decode signature · the real terminal commands · the cyan Stakeout fill
Next command       /type hero (fix the focal tie); /overdrive stops here because H is 4
```

## CRITIQUE · L `/exhibits/retro/`
```
Scores     C 5 · H 5 · S 3 · R 5 · M 5 · V 5      (+ Q 5 · A 5)
Trace      S3[last5:archetype-new,signature-new,fp81] M5[t5:pins2/2,…] Q5[prog:Δ2.5%,…]
Verdict    The film-reel leader countdown and timecode rail give the page a real clock to scroll against.
Top 3 problems
1. 46 of 211 text elements (22%) were skipped at 768 inside the pinned reel — why: the largest unverified share
   of any page. It is still under the gate's coverage limit. Fix: give the reel frames a static rest state at
   768 so the scanner can read them.
2. S3 comes from the memory log (see the top of this file), not from a reused archetype or signature.
3. Both Tier 5 pins are used: no room for another pinned scene.
Keep               leader countdown · timecode rail · the film grain held at reduced motion
Next command       none from design; /overdrive did not act on S (it comes from the log)
```

## CRITIQUE · O `/exhibits/futuristic/`
```
Scores     C 5 · H 5 · S 4 · R 5 · M 5 · V 5      (+ Q 5 · A 5)
Trace      S4[…fp67] M5[t4:pins0/2,webgl0/1,js21/250KB,rm0]
Verdict    A field guide drawn as a hologram; the stacked deck makes the 9 categories feel like layers of one object.
Top 3 problems
1. Six text nodes were skipped at 375. Fix: none needed (3%).
2. No pin or WebGL is used at Tier 4. That is a fair choice, but the hologram is all CSS and could carry a slow parallax.
3. Past steps are no longer dimmed, so the progress cue now rests on the rail alone. Fix: thicken the active rail tick.
Keep               the stacked deck · the hologram ring · the category rail
Next command       none
```

## CRITIQUE · S `/exhibits/aurora/`
```
Scores     C 5 · H 5 · S 1 · R 5 · M 5 · V 5      (+ Q 5 · A 5)
Trace      S1[last5:archetype-reused,signature-reused,fp100] (self-comparison, see top) Q5[prog:Δ18.1%,…]
Verdict    A ledger kept by night light: the seismograph line records the alibi hour by hour.
Top 3 problems
1. S1 is the gate comparing the page with its own log entry. Fix: none to the design. The log is left as the
   real record of the build.
2. Short viewports fall back to a flat layout (≤560 tall). That is correct, but the line loses its pin there.
3. The aurora gradient has to stay below the AA contrast floor for body text. That holds today, so keep it.
Keep               seismograph line · the ledger rows · the 00:00 clock
Next command       none from design
```

## CRITIQUE · T `/exhibits/victorian/`
```
Scores     C 5 · H 5 · S 1 · R 5 · M 5 · V 5      (+ Q 5 · A 5)
Trace      S1[last5:archetype-new,signature-new,fp100] · rules P1 (perf-03)
Verdict    Gaslight plates that develop as you read: the darkroom signature is the style's own photography.
Top 3 problems
1. Gate rule perf-03: "the largest first-screen image is lazy-loaded". That image is Plate III, 409×519 at 1440,
   which is 1px taller than plates I and II. The skill's DarkroomDevelop component hardcodes loading="lazy", and
   the plates are data-URI SVGs, so nothing is fetched over the network. Fix (upstream): add a `loading` prop to
   DarkroomDevelop. The vendor file stays identical to the skill. Plate I is already an eager plain img.
2. S1 comes from the memory log (see the top of this file).
3. The engraved plates are SVG line art: they read as engravings, but not yet as photographs.
Keep               the darkroom develop · the gaslight palette · the engraved display type
Next command       upstream issue for the DarkroomDevelop `loading` prop
```

---

## /audit (pass/fail per item)

| Item | Home | C | J | L | O | S | T |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Contrast (gate c) | pass | pass | pass | pass | pass | pass | pass |
| Overflow 375–1920 (gate o, qa.mjs) | pass | pass | pass | pass | pass | pass | pass |
| Mid-word breaks (gate w) | pass | pass | pass | pass | pass | pass | pass |
| Reduced motion (gate rm) | pass | pass | pass | pass | pass | pass | pass |
| Accessible names (gate a) | pass | pass | pass | pass | pass | pass | pass |
| Number flipping (gate n) | pass | pass | pass | pass | pass | pass | pass |
| Motion quality (gate q) | pass | pass | pass | pass | pass | pass | pass |
| Keyboard, focus, targets, zoom (gate k) | pass | pass | pass | pass | pass | pass | pass |
| Copy rules (C) | pass | pass | pass | pass | pass | pass | pass |
| SEO (S) | pass | pass | pass | pass | pass | pass | pass |
| Performance rules (P) | pass | pass | pass | pass | pass | pass | **fail: perf-03** (vendor lazy img) |
| Security headers (K) | pass | pass | pass | pass | pass | pass | pass |
| LCP / CLS / INP | CI | CI | CI | CI | CI | CI | CI |

LCP, CLS and INP are measured by the Lighthouse job in `.github/workflows/ci.yml`. They were not measured in this sandbox.

## /overdrive

The loop runs: score, fix the lowest axis, score again, for up to 3 rounds, and stops when every axis is ≥4.

- **Round 1** (before the fixes in commit b915d9c):
  - The lowest axes were A and K on Home, J, O and S (focus visibility, target size, zoom) and H on J.
  - Fixes: inset focus rings, 28px range inputs, padded link targets, solid o-core, no dimmed past steps, sound toasts in flow.
- **Round 2** (the scores above):
  - Home, C and O have every axis ≥4. They stop.
  - J has every axis ≥4 (H4). It stops, and the focal tie is listed as the next /type step.
  - L, S and T are below 4 only on S. That axis measures the build log, not the page (see the top of this file), so changing a page would not move it. The loop stops there, and the stop is recorded here instead of claiming a pass.

# Style: Pixel art

> **Standards vs style:** this style may override house-style defaults (canvas, type scale, grid, accent); it never overrides the universal standards in `principles/restraint.md`.
> **Extension:** written for motomation-studio because the skill (v2.6.0) has no `pixel-art.md`. Same format as `styles/minimal.md`, plus the fields the build brief asked for. Candidate to contribute back.

**Essence:** whole pixels, whole frames: stepped motion and a limited palette.
**Use when:** games, retro computing, playful tools, kids' learning, anything explorable.
**Avoid when:** luxury, editorial long reads, dense data tables.

- **Type:** one pixel face at integer sizes, one plain mono for long text.
- **Colour:** 4–8 colour palette; dithering instead of gradients.
- **Layout:** an atlas or tile map; UI in boxes with hard shadows.
- **Motion:** Tier 2. Stepped motion at 8–12 fps, never eased tweens.
- **Default dials:** Energy 3 · Rhythm 2 · Motion 2
- **Archetypes that suit it:** atlas, console, shelf
- **Section order:** title screen · the map · inventory · credits
- **Signature menu:** Pixel Wake, Decode, Stacked Deck
- **Must-haves:** image-rendering: pixelated on every scaled bitmap; text never set in the pixel face below 12px
- **Pitfall:** smooth easing on pixel objects; blurry scaled sprites.

**Shown in:** `src/exhibits/pixel-art/` on [/exhibits/pixel-art/](https://github.com/dev-asfakul/motomation-studio/tree/main/src/exhibits/pixel-art).

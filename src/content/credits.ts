// Chain of custody for every asset on the site. CREDITS.md is generated from this file by scripts/credits.mjs.
import { FAMILY } from "@/exhibits/fonts";
import { EXHIBITS } from "./exhibits";

export const BUREAU_FONTS = [
  { name: "Anybody", role: "Bureau display (width axis)" },
  { name: "Inter Tight", role: "Bureau text" },
  { name: "Fragment Mono", role: "Bureau labels" },
];
export const fontRows = () => Object.keys(FAMILY).map((name) => ({
  name, used: EXHIBITS.filter((e) => [e.fonts.display, e.fonts.text, e.fonts.mono].includes(name)).map((e) => e.letter),
}));
export const LIBS = [
  { name: "Next.js", what: "framework, static export", license: "MIT", url: "https://github.com/vercel/next.js" },
  { name: "React", what: "UI", license: "MIT", url: "https://github.com/facebook/react" },
  { name: "GSAP + @gsap/react", what: "timelines, ScrollTrigger", license: "GSAP Standard no-charge licence", url: "https://gsap.com/standard-license" },
  { name: "Lenis", what: "smooth scroll", license: "MIT", url: "https://github.com/darkroomengineering/lenis" },
  { name: "three.js", what: "WebGL in exhibits C, E, O, S", license: "MIT", url: "https://github.com/mrdoob/three.js" },
  { name: "Tailwind CSS", what: "Bureau utilities", license: "MIT", url: "https://github.com/tailwindlabs/tailwindcss" },
  { name: "opentype.js", what: "build time only: reads glyph outlines for the Lineup", license: "MIT", url: "https://github.com/opentypejs/opentype.js" },
  { name: "Playwright", what: "build time only: screenshots and the delivery gate", license: "Apache-2.0", url: "https://github.com/microsoft/playwright" },
];

"use client";
// Register GSAP plugins once and re-export. Pattern from the skill's examples/lib/gsap.ts,
// extended with Flip and MorphSVG (free in the public gsap package since 3.13, per the skill's FAQ).
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, Flip, MorphSVGPlugin, useGSAP);

/** Shared matchMedia conditions used by every scene. */
export const MQ = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 768px)",
  mobile: "(max-width: 767px)",
  finePointer: "(hover: hover) and (pointer: fine)",
} as const;

export { gsap, ScrollTrigger, SplitText, Flip, MorphSVGPlugin, useGSAP };

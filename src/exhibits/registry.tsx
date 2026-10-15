// Exhibit modules, one code-split chunk per exhibit. Missing entries render the designed "Sealed" state.
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { Exhibit } from "@/content/exhibits";

type Mod = { Hero: ComponentType<{ e: Exhibit }>; Lab: ComponentType<{ e: Exhibit }> };
export const REGISTRY: Record<string, Mod> = {
  minimalism: { Hero: dynamic(() => import("./minimalism/Hero")), Lab: dynamic(() => import("./minimalism/Lab")) },
  maximalism: { Hero: dynamic(() => import("./maximalism/Hero")), Lab: dynamic(() => import("./maximalism/Lab")) },
  surreal: { Hero: dynamic(() => import("./surreal/Hero")), Lab: dynamic(() => import("./surreal/Lab")) },
  swiss: { Hero: dynamic(() => import("./swiss/Hero")), Lab: dynamic(() => import("./swiss/Lab")) },
  y2k: { Hero: dynamic(() => import("./y2k/Hero")), Lab: dynamic(() => import("./y2k/Lab")) },
  editorial: { Hero: dynamic(() => import("./editorial/Hero")), Lab: dynamic(() => import("./editorial/Lab")) },
  "pixel-art": { Hero: dynamic(() => import("./pixel-art/Hero")), Lab: dynamic(() => import("./pixel-art/Lab")) },
  clay: { Hero: dynamic(() => import("./clay/Hero")), Lab: dynamic(() => import("./clay/Lab")) },
  glassmorphism: { Hero: dynamic(() => import("./glassmorphism/Hero")), Lab: dynamic(() => import("./glassmorphism/Lab")) },
  cyberpunk: { Hero: dynamic(() => import("./cyberpunk/Hero")), Lab: dynamic(() => import("./cyberpunk/Lab")) },
  "pop-art": { Hero: dynamic(() => import("./pop-art/Hero")), Lab: dynamic(() => import("./pop-art/Lab")) },
  retro: { Hero: dynamic(() => import("./retro/Hero")), Lab: dynamic(() => import("./retro/Lab")) },
  collage: { Hero: dynamic(() => import("./collage/Hero")), Lab: dynamic(() => import("./collage/Lab")) },
  "vector-art": { Hero: dynamic(() => import("./vector-art/Hero")), Lab: dynamic(() => import("./vector-art/Lab")) },
  futuristic: { Hero: dynamic(() => import("./futuristic/Hero")), Lab: dynamic(() => import("./futuristic/Lab")) },
  handwritten: { Hero: dynamic(() => import("./handwritten/Hero")), Lab: dynamic(() => import("./handwritten/Lab")) },
  bohemian: { Hero: dynamic(() => import("./bohemian/Hero")), Lab: dynamic(() => import("./bohemian/Lab")) },
  graffiti: { Hero: dynamic(() => import("./graffiti/Hero")), Lab: dynamic(() => import("./graffiti/Lab")) },
  aurora: { Hero: dynamic(() => import("./aurora/Hero")), Lab: dynamic(() => import("./aurora/Lab")) },
  victorian: { Hero: dynamic(() => import("./victorian/Hero")), Lab: dynamic(() => import("./victorian/Lab")) },
};

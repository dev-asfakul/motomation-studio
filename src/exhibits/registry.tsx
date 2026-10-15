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
};

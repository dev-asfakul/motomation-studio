"use client";
import { VelocityMarquee } from "@/vendor/motomation/components/scroll/velocity-marquee";
import { ContourLines } from "@/vendor/motomation/components/backgrounds/contour-lines";
import type { Exhibit } from "@/content/exhibits";
export default function Lab({ e }: { e: Exhibit }) {
  void e;
  return (
    <div className="r-lab">
      <div className="r-strip"><VelocityMarquee items={["RUN THE GATE", "ONE SIGNATURE PER PAGE", "LOWEST TIER THAT DELIVERS", "NO STOCK PHOTOS", "REAL COPY ONLY"]} separator="  ✕  " speed={60} maxSkew={14} /></div>
      <div className="r-contour"><ContourLines lines={16} seed={11} color="rgba(242,239,232,0.28)" seconds={40} /><p>Contour lines as wall texture: the map of a wall that has been painted many times.</p></div>
    </div>
  );
}

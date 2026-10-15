"use client";
import { Aurora } from "@/vendor/motomation/components/backgrounds/aurora";
import { Meteors } from "@/vendor/motomation/components/backgrounds/meteors";
import { ParticleField } from "@/vendor/motomation/components/backgrounds/particle-field";
import type { Exhibit } from "@/content/exhibits";
export default function Lab({ e }: { e: Exhibit }) {
  void e;
  return (
    <div className="s-lab">
      {[
        { k: "Aurora (vendor)", n: "The skill's CSS aurora, for when WebGL is too much: same mood, no shader.", el: <Aurora sky="#10130E" low="#299371" high="#6b54b8" speed={0.6} /> },
        { k: "Meteors (vendor)", n: "Six streaks at a fixed angle. Used once, at 03:00, never on a loop.", el: <Meteors count={6} angle={28} color="#EDF0EB" sky="#10130E" /> },
        { k: "Particle field (vendor)", n: "A low dust field, capped at 900 points here.", el: <ParticleField count={900} color="#A6B39E" ground="#10130E" speed={0.4} /> },
      ].map((x) => (
        <figure key={x.k} className="s-plate"><div className="s-plate-art">{x.el}</div><figcaption><b>{x.k}</b>{x.n}</figcaption></figure>
      ))}
    </div>
  );
}

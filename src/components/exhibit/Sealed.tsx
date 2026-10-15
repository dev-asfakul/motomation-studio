// "Sealed, under analysis": the designed state for an exhibit that did not reach the bar for this release.
import type { Exhibit } from "@/content/exhibits";
import { nextOf } from "@/content/exhibits";
export function Sealed({ e }: { e: Exhibit }) {
  const n = nextOf(e.slug);
  return (
    <section className="page wrap" style={{ minHeight: "100svh", display: "grid", alignContent: "center", gap: 24, background: "repeating-linear-gradient(-45deg, #0e0d0b 0 40px, #141310 40px 80px)" }} aria-labelledby="sealed-h">
      <span className="tag">Sealed · under analysis</span>
      <h1 id="sealed-h" className="display" style={{ fontSize: "var(--step-4)" }}>Exhibit {e.letter}: {e.style}</h1>
      <p className="prose" style={{ fontSize: "var(--step-1)" }}>{e.title}. This exhibit is still with the lab. It stays sealed until it is as good as the others, rather than shipping a weaker one.</p>
      <p className="prose" style={{ color: "var(--muted)" }}>Planned: {e.hero}</p>
      <p><a className="btn" href={`/exhibits/${n.slug}/`}>Exhibit {n.letter}: {n.style}</a></p>
    </section>
  );
}

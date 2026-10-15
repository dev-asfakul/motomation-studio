import "./rooms.css";
import { caseNo } from "@/content/repo";

export default function NotFound() {
  return (
    <div className="room">
      <section className="nf" aria-labelledby="nf-h">
        <span className="nf-tape" aria-hidden="true" />
        <p className="label"><span className="tag">Error 404</span> {caseNo}</p>
        <h1 id="nf-h" className="room-title" style={{ fontSize: "min(var(--step-4), 11.6vw)" }}>Evidence <em>not found</em></h1>
        <p className="room-lede">Nothing is filed at this address. It may have been moved, mistyped, or never existed, which is also a kind of evidence.</p>
        <p className="uv-note">UV: someone was here. They left nothing but a broken link.</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a className="btn" href="/board/">Back to the evidence board</a>
          <a className="btn ghost" href="/">Return to the case opening</a>
        </div>
        <p className="label">Or press ⌘K and search the case.</p>
        <span className="nf-tape" aria-hidden="true" style={{ transform: "rotate(1.5deg)" }} />
      </section>
    </div>
  );
}

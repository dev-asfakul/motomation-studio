import { KINDS } from "@/content/coverage";
import { repo, caseNo } from "@/content/repo";
import { EvidenceLog } from "./EvidenceLog";

export function BureauFooter() {
  return (
    <footer className="bureau-foot" aria-labelledby="foot-h">
      <div className="foot-a">
        <h2 id="foot-h" className="label" style={{ marginBottom: 14 }}>Evidence log</h2>
        <EvidenceLog kinds={KINDS} />
      </div>
      <div className="foot-b">
        <p className="label" style={{ marginBottom: 10 }}>Rooms</p>
        <ul>
          <li><a href="/board/">Evidence board</a></li><li><a href="/autopsy/">Autopsy</a></li><li><a href="/method/">Method</a></li>
          <li><a href="/lab/">Lab</a></li><li><a href="/receipts/">Receipts</a></li><li><a href="/locker/">Locker</a></li>
          <li><a href="/dossier/">Dossier</a></li><li><a href="/credits/">Credits</a></li>
        </ul>
      </div>
      <div className="foot-c">
        <p className="label" style={{ marginBottom: 10 }}>Chain of custody</p>
        <p className="footnote" style={{ margin: 0 }}>
          Every word and number here was read from <a href={repo.meta.url}>{repo.meta.name}</a> v{repo.meta.version} at commit <code>{repo.meta.commit.slice(0, 7)}</code>, inventoried {repo.meta.inventoried}. {caseNo}. Site code MIT, on <a href="https://github.com/dev-asfakul/motomation-studio">GitHub</a>.
        </p>
        <p className="uv-note" style={{ marginTop: 10 }}>UV: the investigator's own fingerprints are on this footer. So are yours.</p>
      </div>
    </footer>
  );
}

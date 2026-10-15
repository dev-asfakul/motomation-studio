// Inline markdown from the repo's own text: **bold**, *italic* (rendered as plain emphasis, no italics), `code`, [link](url).
// Nothing else. The site's copy rule bans em dashes, so dashes in repo text are shown as commas (a lone dash means "none").
import { Fragment } from "react";
export const dash = (t: string) => (t.trim() === "—" ? "none" : t.replace(/\s+—\s+/g, ", ").replace(/—/g, ", "));
export function Md({ s: raw }: { s: string }) {
  const s = dash(raw);
  const out: React.ReactNode[] = []; let i = 0; const re = /\*\*(.+?)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)|\*([^*]+)\*/g; let m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    if (m.index > i) out.push(s.slice(i, m.index));
    if (m[1]) out.push(<b key={m.index}>{m[1]}</b>);
    else if (m[2]) out.push(<code key={m.index}>{m[2]}</code>);
    else if (m[3]) out.push(<a key={m.index} href={m[4].startsWith("http") ? m[4] : `https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/main/${m[4].replace(/^\.\//, "")}`}>{m[3]}</a>);
    else if (m[5]) out.push(<b key={m.index} style={{ fontWeight: 600 }}>{m[5]}</b>);
    i = m.index + m[0].length;
  }
  if (i < s.length) out.push(s.slice(i));
  return <Fragment>{out}</Fragment>;
}

// Block markdown: paragraphs, "- " lists and "1. " lists. Enough for ABOUT.md sections.
export function MdBlock({ s }: { s: string }) {
  const blocks: { t: "p" | "ul" | "ol"; items: string[] }[] = [];
  for (const raw of s.split("\n")) {
    const l = raw.trim(); if (!l) { blocks.push({ t: "p", items: [] }); continue; }
    const ul = l.match(/^[-*]\s+(.*)/), ol = l.match(/^\d+\.\s+(.*)/);
    const t = ul ? "ul" : ol ? "ol" : "p"; const text = ul?.[1] ?? ol?.[1] ?? l;
    const last = blocks[blocks.length - 1];
    if (last && last.t === t && (t !== "p" || last.items.length)) last.items.push(text); else blocks.push({ t, items: [text] });
  }
  return <>{blocks.filter((b) => b.items.length).map((b, i) => b.t === "p" ? <p key={i}><Md s={b.items.join(" ")} /></p>
    : b.t === "ul" ? <ul key={i}>{b.items.map((x, j) => <li key={j}><Md s={x} /></li>)}</ul>
    : <ol key={i}>{b.items.map((x, j) => <li key={j}><Md s={x} /></li>)}</ol>)}</>;
}

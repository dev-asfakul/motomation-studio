"use client";
// @motomation-component
// id: stakeout-terminal
// name: Stakeout Terminal
// family: ui
// tier: 2
// deps: react
// what: A real, typeable terminal. Commands are answered from data you pass in (not canned text), each answer resolving from glyph noise left to right. History with the up arrow, tab completion, clear.
// use-when: Developer tools, CLIs, cyberpunk or hacker-flavoured pages where trying commands is the fastest way to learn the product.
// avoid-when: Slop as a fake terminal that types itself and cannot be used, or with commands that lie about the product.
// reduced-motion: Answers appear instantly, no decode.
// touch: The input is a normal text field; suggested commands are buttons.
// a11y: The output is a log region (role="log", polite); the input is labelled; suggestions are buttons.
// status: candidate to contribute back to the skill (examples/components/ui)
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "@/lib/motion";
import { sfx } from "@/lib/sound";

export type Command = { name: string; run: (args: string) => string };
type Props = { commands: Command[]; banner: string[]; prompt?: string; suggest?: string[]; className?: string; style?: CSSProperties };
const NOISE = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&/<>{}[]";

function Resolve({ text, instant }: { text: string; instant: boolean }) {
  const [out, setOut] = useState(instant ? text : "");
  useEffect(() => {
    if (instant) { setOut(text); return; } let i = 0; const n = text.length; const id = setInterval(() => {
      i += Math.max(2, Math.ceil(n / 30)); const done = text.slice(0, i);
      const rest = Array.from({ length: Math.min(6, n - i) }, (_, k) => (text[i + k] === "\n" || text[i + k] === " " ? text[i + k] : NOISE[(Math.random() * NOISE.length) | 0])).join("");
      setOut(done + rest); if (i >= n) { setOut(text); clearInterval(id); }
    }, 24); return () => clearInterval(id);
  }, [text, instant]);
  return <>{out}</>;
}

export function StakeoutTerminal({ commands, banner, prompt = "$", suggest = [], className, style }: Props) {
  const reduce = useReducedMotion();
  const [log, setLog] = useState<{ cmd?: string; out: string }[]>(banner.map((b) => ({ out: b })));
  const [val, setVal] = useState(""); const [hist, setHist] = useState<string[]>([]); const [hi, setHi] = useState(-1);
  const body = useRef<HTMLDivElement>(null); const input = useRef<HTMLInputElement>(null);
  useEffect(() => { body.current?.scrollTo({ top: body.current.scrollHeight }); }, [log]);
  const run = (raw: string) => {
    const line = raw.trim(); if (!line) return; sfx("tick", 0.03);
    if (line === "clear") { setLog([]); setVal(""); return; }
    const [name, ...rest] = line.split(/\s+/);
    const c = commands.find((x) => x.name === name) ?? commands.find((x) => line.startsWith(x.name));
    const out = c ? c.run(c.name.includes(" ") ? line.slice(c.name.length).trim() : rest.join(" ")) : `command not found: ${name}. Type help.`;
    setLog((l) => [...l.slice(-40), { cmd: line, out }]); setHist((h) => [...h, line]); setHi(-1); setVal("");
  };
  const key = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") run(val);
    if (e.key === "ArrowUp") { e.preventDefault(); const i = hi < 0 ? hist.length - 1 : Math.max(0, hi - 1); if (hist[i]) { setHi(i); setVal(hist[i]); } }
    if (e.key === "Tab") { const m = commands.map((c) => c.name).find((n) => n.startsWith(val) && val); if (m) { e.preventDefault(); setVal(m); } }
  };
  return (
    <div className={`st ${className ?? ""}`} style={style} onClick={() => input.current?.focus()}>
      <div className="st-bar" aria-hidden="true"><i /><i /><i /><span>stakeout.sh · session 0451</span></div>
      <div ref={body} className="st-body" role="log" aria-live="polite" aria-label="Terminal output">
        {log.map((l, i) => (<div key={i} className="st-line">{l.cmd && <p className="st-cmd"><span>{prompt}</span> {l.cmd}</p>}<pre><Resolve text={l.out} instant={reduce || !l.cmd} /></pre></div>))}
      </div>
      <label className="st-in"><span aria-hidden="true">{prompt}</span><span className="sr-only">Command</span>
        <input ref={input} value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={key} spellCheck={false} autoCapitalize="off" autoComplete="off" placeholder="type help" /></label>
      {suggest.length > 0 && <div className="st-sug" role="group" aria-label="Try a command">{suggest.map((s) => <button key={s} type="button" onClick={(e) => { e.stopPropagation(); run(s); }}>{s}</button>)}</div>}
    </div>
  );
}

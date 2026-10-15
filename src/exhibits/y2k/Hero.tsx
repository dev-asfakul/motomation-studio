"use client";
import "./x.css";
import { useEffect, useRef } from "react";
import { ChromeBlob } from "@/components/originals/chrome-blob";
import { SpringWindows } from "@/components/originals/spring-window";
import { NeighbourMoves } from "@/vendor/motomation/components/type/neighbour-moves";
import { ClickSpark } from "@/vendor/motomation/components/micro/click-spark";
import { useReducedMotion, useFinePointer } from "@/lib/motion";
import type { Exhibit } from "@/content/exhibits";
import { repo } from "@/content/repo-client";

function Sparkles() {
  // four-point sparkle trail: a pool of 10 nodes recycled along the pointer path
  const root = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion(); const fine = useFinePointer();
  useEffect(() => {
    if (reduce || !fine) return; const el = root.current!.parentElement!; let i = 0, last = 0;
    const nodes = Array.from(root.current!.children) as HTMLElement[];
    const mv = (e: PointerEvent) => {
      if (e.timeStamp - last < 28) return; last = e.timeStamp; const r = el.getBoundingClientRect(); const n = nodes[i++ % nodes.length];
      n.style.left = `${e.clientX - r.left}px`; n.style.top = `${e.clientY - r.top}px`; n.getAnimations().forEach((a) => a.cancel());
      n.animate([{ opacity: 1, transform: "translate(-50%,-50%) scale(1) rotate(0deg)" }, { opacity: 0, transform: "translate(-50%,-50%) scale(0.3) rotate(90deg)" }], { duration: 600, easing: "cubic-bezier(0.22,1,0.36,1)" });
    };
    el.addEventListener("pointermove", mv); return () => el.removeEventListener("pointermove", mv);
  }, [reduce, fine]);
  return <div ref={root} className="e-sparks" aria-hidden="true">{Array.from({ length: 10 }, (_, i) => <i key={i} />)}</div>;
}

export default function Hero({ e }: { e: Exhibit }) {
  return (
    <header className="x-hero e-hero" aria-labelledby="x-title">
      <Sparkles />
      <p className="x-hero-meta"><b>Exhibit {e.letter}</b><span>{e.style}</span><span>Tier {e.tier}</span><span>Desktop recovered, 1999</span></p>
      <h1 id="x-title" className="e-title"><span className="sr-only">Y2K: The Desktop Evidence. </span><span aria-hidden="true">The Desktop Evidence</span></h1>
      <NeighbourMoves word="MOTOMATION" className="e-word" />
      <ChromeBlob className="e-blob" tint="#1E6FD9" />
      <SpringWindows className="e-wins" windows={[
        { id: "w1", title: "evidence.txt", x: 2, y: 8, w: 260, body: <p>{repo.components} components recovered, every one still runs.</p> },
        { id: "w2", title: "tiers.ini", x: 64, y: 4, w: 240, body: <p>[motion]<br />tiers={repo.tiers}<br />rule=lowest that delivers</p> },
        { id: "w3", title: "readme_FIRST", x: 58, y: 58, w: 280, body: <p>Drag the chrome. Close a window. It pops back from the dock.</p> },
      ]} />
      <ClickSpark color="#1E6FD9" className="e-cd-wrap">
        <div className="e-cd" role="img" aria-label="A burned CD labelled MOTOMATION_FINAL_v2 in marker"><span>MOTOMATION_<br />FINAL_v2</span></div>
      </ClickSpark>
    </header>
  );
}

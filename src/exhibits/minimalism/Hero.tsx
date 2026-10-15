"use client";
import "./x.css";
import { SubtractionRoom } from "@/components/originals/subtraction-room";
import { InkFill } from "@/vendor/motomation/components/type/ink-fill";
import { ReadingRail } from "@/vendor/motomation/components/scroll/reading-rail";
import { useRef } from "react";
import type { Exhibit } from "@/content/exhibits";
import { repo } from "@/content/repo-client";

export default function Hero({ e }: { e: Exhibit }) {
  const room = useRef<HTMLDivElement>(null);
  const items = [
    `${repo.components} components`, `${repo.signatures} signature moves`, `${repo.tiers} motion tiers`, `${repo.archetypes} archetypes`,
    "a purple gradient", "a second accent colour", "three feature cards", "a testimonial carousel", "a stock photo of a laptop",
    "a glow on every button", "an emoji in the heading", "a countdown", "a newsletter box", "a grain layer",
  ];
  return (
    <header className="x-hero a-hero" aria-labelledby="x-title">
      <p className="x-hero-meta"><b>Exhibit {e.letter}</b><span>{e.style}</span><span>{e.title}</span><span>Tier {e.tier}</span></p>
      <div ref={room}>
        <SubtractionRoom items={items} last="Room." lastLabel={`${e.title}. Fourteen candidates went on the wall. The room kept one word and one brass marker.`} />
      </div>
      <ReadingRail target={room} color="var(--x-accent)" height={2} />
      <span id="x-title" className="sr-only">Exhibit {e.letter}: {e.style}, {e.title}</span>
      <div className="a-drain-wrap">
        <InkFill as="p" className="a-drain" ink="var(--x-muted)" muted="var(--x-ink)" text="Every label the skill could print was on this wall, and every one of them had a reason to stay. Read to the end and watch them drain. What stays in ink was REMOVED." />
      </div>
    </header>
  );
}

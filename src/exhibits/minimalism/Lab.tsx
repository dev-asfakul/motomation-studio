"use client";
import { CutLedger } from "@/components/originals/cut-ledger";
import type { Exhibit } from "@/content/exhibits";
export default function Lab({ e }: { e: Exhibit }) {
  void e;
  return (
    <CutLedger candidates={[
      { name: "The last word", concept: true, tells: true, why: "It is the room's one statement." },
      { name: "Brass marker", concept: true, tells: true, why: "Marks where the word was found." },
      { name: "Cut ledger", concept: true, tells: true, why: "Proves the restraint happened." },
      { name: "Grain layer", concept: false, tells: false, why: "Texture for its own sake." },
      { name: "Second accent", concept: false, tells: false, why: "Two accents means no accent." },
      { name: "Hover glow", concept: false, tells: false, why: "Decoration on every label." },
      { name: "Bounce on arrival", concept: false, tells: false, why: "Tells the visitor nothing." },
      { name: "Hairline cursor", concept: true, tells: false, why: "From the concept; quiet enough to keep." },
    ]} />
  );
}
